"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Portrait from "@/components/Portrait";
import { ARROW } from "@/components/Btn";
import PickGroup from "@/components/bio/PickGroup";
import ReviewSummary from "@/components/bio/ReviewSummary";
import { AddButton, Check, CheckGlyph, ChoiceChips, Cluster, EntryHead, ErrorText, fid, LeaveForMatt, TextField, Validity, YearField, YesNo } from "@/components/bio/fields";
import {
  AFFILIATION_ROLES,
  AFFILIATION_TYPES,
  CAN_NAME,
  CLIENT_TYPES,
  CONCURRENT_ROLE_TYPES,
  CREDENTIAL_STATUS,
  DEGREES,
  DESIGNATIONS,
  EMPLOYERS,
  ENGAGEMENT_ROLES,
  ENGAGEMENT_STATUS,
  FOCUS_AREA_GROUPS,
  FOCUS_AREAS,
  HEADSHOT_CHOICES,
  HONORS,
  INSTITUTIONS,
  LANGUAGES,
  LEADERSHIP_MODES,
  LIMITS,
  PRONOUNS,
  SEATS,
  SECTORS,
  SERVICE_LINES,
  SUPPORTING_AREAS,
  TITLES,
} from "@/lib/bio/options";
import { canonicalEmployer, canonicalInstitution, cleanText, employerDescriptor, normEmail, normLabel, normLinkedIn, normName } from "@/lib/bio/normalize";
import { isBlankEngagement, isBlankPriorRole, SECTIONS, SHOW, sectionOf, type FieldErrors, type OpenQuestionField, type RosterMember, type SectionId } from "@/lib/bio/schema";
import { bioFilename, buildBioJson, prefillFor, prepare, type BioFile } from "@/lib/bio/build";
import { JSON_BEGIN, JSON_END } from "@/lib/bio/email";
import {
  disclosureTemplate,
  emptyDraft,
  newAffiliation,
  newCredential,
  newDegree,
  newEngagement,
  newPriorRole,
  prefillFromRoster,
  readSaved,
  toData,
  writeSaved,
  type Draft,
  type DraftData,
  type Keyed,
} from "@/lib/bio/draft";

/**
 * /bio — the team bio intake (PRD_BIO_INTAKE). Facts, not prose, in a
 * fixed structure; each submission is mailed to Matt as a self-contained
 * JSON file that carries its own generation instructions.
 *
 * Stages: gate (only with BIO_ACCESS_CODE) → start ("Who are you?") →
 * form (six sections, any order) → review → sent | failed. Answers save to
 * localStorage on every change, so a closed tab or a dropped call loses
 * nothing. No modals, no toasts (§5.9 of the redesign plan).
 */

type Stage = "loading" | "gate" | "start" | "form" | "review" | "sending" | "done" | "failed";
type Headshot = { type: "image/jpeg" | "image/png"; content: string; preview: string };

const MATT = "mfaria@fairleadadvisors.com";
const CODE_KEY = "fairlead.bio-intake.code";

const EXAMPLES = {
  value: "…model, value and refinance their plans, and stand in as CFO when they need one",
  descriptor: "a PE-backed oil field services company with $300M in revenue",
  did: "Led sale of a 42 MW hydro platform to a strategic buyer",
  result: "Sold for 9.5× EBITDA in five months",
  employerDescriptor: "a $1.5 billion district energy company",
  highlight: "Raised $10 billion in debt and equity, including Minnesota’s largest IPO",
  earlier: "Began in public accounting with a focus on audit and tax",
  personal: "Avid runner; 11 marathons including Boston 2015",
};

/** Per-step header: minutes (they add up to the promised 15–20). */
const STEP_MINUTES: Record<SectionId, number> = { basics: 2, role: 3, work: 6, career: 4, education: 2, extras: 2 };
const isSection = (v: unknown): v is SectionId => SECTIONS.some((s) => s.id === v);

const sentence = (v: string) => cleanText(v, { sentence: true });
const plain = (v: string) => cleanText(v);
const one = (v: string) => (v ? [v] : []);

function move<T>(list: T[], i: number, by: number): T[] {
  const j = i + by;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Resize to 1200px on the long edge in the browser (§5.6). */
async function resizeImage(file: File): Promise<Headshot> {
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Couldn’t read that image."));
      i.src = url;
    });
    const scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL(type, 0.88);
    return { type, content: dataUrl.split(",")[1] ?? "", preview: dataUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function BioIntakeForm({
  roster,
  companies,
  gated,
}: {
  roster: RosterMember[];
  companies: string[];
  gated: boolean;
}) {
  const [stage, setStage] = useState<Stage>("loading");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [lastId, setLastId] = useState<string | null>(null);
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<string, true>>({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [focusFirst, setFocusFirst] = useState(0);
  const [headshot, setHeadshot] = useState<Headshot | null>(null);
  const [headshotError, setHeadshotError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [code, setCode] = useState("");
  const [codeState, setCodeState] = useState<"idle" | "busy" | "wrong">("idle");
  const [sent, setSent] = useState<BioFile | null>(null);
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailCopy, setEmailCopy] = useState(true);
  const [honey, setHoney] = useState("");
  const [announce, setAnnounce] = useState("");
  const [step, setStep] = useState<SectionId>("basics");
  const [seen, setSeen] = useState<Partial<Record<SectionId, true>>>({});
  const [tried, setTried] = useState<Partial<Record<SectionId, true>>>({});
  const [shake, setShake] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [filter, setFilter] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /* ---------- load + autosave (§5.3) ---------- */

  useEffect(() => {
    const saved = readSaved();
    setLastId(saved.last_submission_id);
    let stored = "";
    try {
      stored = window.sessionStorage.getItem(CODE_KEY) ?? "";
    } catch {}
    setCode(stored);
    if (gated && !stored) return setStage("gate");
    if (saved.draft) {
      setDraft(saved.draft);
      if (isSection(saved.step)) setStep(saved.step);
      setWelcomeBack(true);
      setStage("form");
    } else setStage("start");
  }, [gated]);

  const editing = stage === "form" || stage === "review" || stage === "failed";
  useEffect(() => {
    if (!editing) return;
    setSaveState((s) => (s === "idle" ? s : "saving"));
    const t = setTimeout(() => {
      writeSaved({ v: 1, draft, last_submission_id: lastId, step });
      setSaveState("saved");
    }, 500);
    return () => clearTimeout(t);
  }, [draft, lastId, editing, step]);

  /* ---------- state helpers ---------- */

  const update = useCallback((fn: (d: DraftData, dr: Draft) => void) => {
    setServerErrors({});
    setDraft((prev) => {
      const next: Draft = structuredClone(prev);
      fn(next.data, next);
      const reg = next.data.registration;
      if (reg.is_registered_rep && next.disclosure_auto) reg.regulatory_disclosure = disclosureTemplate(next.data.basics, reg.broker_dealer_name);
      return next;
    });
  }, []);

  const member = useMemo(() => roster.find((r) => r.id === draft.data.basics.roster_match) ?? null, [roster, draft.data.basics.roster_match]);
  const headshotAttached = draft.data.extras.headshot_choice === "upload" ? !!headshot : undefined;
  const prepared = useMemo(() => prepare(toData(draft), { roster: member, headshotAttached }), [draft, member, headshotAttached]);
  const errors = useMemo(() => ({ ...prepared.errors, ...serverErrors }), [prepared.errors, serverErrors]);
  const errorCount = Object.keys(errors).length;

  // An error shows once its field was left, its step was left, or Review was tried.
  const err = (path: string) => (attempted || touched[fid(path)] || seen[sectionOf(path)] ? errors[path] : undefined);

  const bySection = useMemo(() => {
    const out: Record<SectionId, number> = { basics: 0, role: 0, work: 0, career: 0, education: 0, extras: 0 };
    for (const p of Object.keys(errors)) out[sectionOf(p)] += 1;
    return out;
  }, [errors]);

  // "Essentials done": how much of what blocks sending is already answered.
  const baseline = useMemo(() => Object.keys(prepare(toData(emptyDraft())).errors).length, []);
  const progress = errorCount === 0 ? 100 : Math.max(0, Math.round(100 * (1 - errorCount / Math.max(baseline, errorCount))));

  /** Props for a PickGroup bound to one field (+ its *_custom). */
  const pick = (o: { path: string; skey: string; values: string[]; custom: string[]; set: (d: DraftData, v: string[], c: string[]) => void }) => ({
    path: o.path,
    values: o.values,
    custom: o.custom,
    stash: draft.stash[o.skey],
    error: err(o.path),
    customError: err(`${o.path}_custom`),
    onChange: (v: string[], c: string[], s?: string[]) =>
      update((d, dr) => {
        o.set(d, v, c);
        if (s !== undefined) dr.stash[o.skey] = s;
      }),
  });

  /** An open question's note, or null while the question is answered normally. */
  const openNote = (field: OpenQuestionField): string | null => draft.data.open_questions.find((q) => q.field === field)?.note ?? null;
  const setOpen = (field: OpenQuestionField, note: string | null) =>
    update((x) => {
      x.open_questions = x.open_questions.filter((q) => q.field !== field);
      if (note != null) x.open_questions.push({ field, note });
    });

  /** Mutate one keyed repeater entry. */
  const entry = <T,>(list: (d: DraftData) => Keyed<T>[], k: string, fn: (e: Keyed<T>, d: DraftData) => void) =>
    update((d) => {
      const e = list(d).find((x) => x._k === k);
      if (e) fn(e, d);
    });

  /* ---------- focus management ---------- */

  useEffect(() => {
    // The start screen focuses its name box instead (autoFocus).
    if (stage === "start") document.getElementById(fid("roster_filter"))?.focus({ preventScroll: true });
    else if (stage !== "loading" && stage !== "form") headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  useEffect(() => {
    if (!focusFirst) return;
    // Next frame: after the new step's heading has taken focus, so this wins.
    const raf = requestAnimationFrame(() => {
      const el = rootRef.current?.querySelector<HTMLElement>("[data-invalid]");
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        el.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [focusFirst]);

  const scrollToForm = () =>
    window.scrollTo({ top: rootRef.current ? Math.max(0, rootRef.current.getBoundingClientRect().top + window.scrollY - 120) : 0 });

  // A new step: bring its top into view and put focus on its heading.
  useEffect(() => {
    if (stage !== "form" || leaving) return;
    document.getElementById(`h-${step}`)?.focus({ preventScroll: true });
    document.querySelector(`[data-rail="${step}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [step, stage, leaving]);

  /** Move to another step (or to Review). Steps can be done in any order; only Review checks everything. */
  function go(to: SectionId | "review") {
    setSeen((v) => ({ ...v, [step]: true }));
    if (to === "review") {
      const blocked = SECTIONS.find((sec) => bySection[sec.id] > 0);
      if (blocked) {
        setAttempted(true);
        setTried((v) => ({ ...v, [blocked.id]: true }));
        setAnnounce(`${errorCount} ${errorCount === 1 ? "answer needs" : "answers need"} attention. Taking you to the first one.`);
        setStep(blocked.id);
        setStage("form");
        setFocusFirst((n) => n + 1);
        return;
      }
      setAnnounce("");
      setStage("review");
      scrollToForm();
      return;
    }
    if (to === step && stage === "form") return;
    if (stage !== "form") {
      setStep(to);
      setStage("form");
      scrollToForm();
      return;
    }
    setLeaving(true);
    window.setTimeout(() => {
      setStep(to);
      setLeaving(false);
      scrollToForm();
    }, 140);
  }

  /**
   * Next. Unlike the rail and Back (free to use), Next checks the current
   * step first: anything missing is highlighted, listed under the buttons
   * and the first one takes focus — nobody finds out at Review.
   */
  function advance() {
    const left = bySection[step];
    if (left > 0) {
      setSeen((v) => ({ ...v, [step]: true }));
      setTried((v) => ({ ...v, [step]: true }));
      setShake((n) => n + 1);
      setAnnounce(`${left} ${left === 1 ? "answer is" : "answers are"} still needed on this step. Taking you to the first one.`);
      setFocusFirst((n) => n + 1);
      return;
    }
    setAnnounce("");
    go(nextStep ? nextStep.id : "review");
  }

  /** Scroll to and focus the control for one data path (the "still needed" list). */
  function focusPath(path: string) {
    const el = document.getElementById(fid(path));
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.focus({ preventScroll: true });
  }

  function chooseMember(m: RosterMember | null) {
    setDraft((prev) => {
      if (m) return prefillFromRoster(prev, m);
      const next = structuredClone(prev);
      next.data.basics.roster_match = "not_listed";
      return next;
    });
    setStage("form");
    scrollToForm();
  }

  function startOver() {
    setDraft(emptyDraft());
    setHeadshot(null);
    setAttempted(false);
    setTouched({});
    setServerErrors({});
    setWelcomeBack(false);
    setConfirmReset(false);
    setStep("basics");
    setSeen({});
    setTried({});
    setFilter("");
    setSaveState("idle");
    writeSaved({ v: 1, draft: null, last_submission_id: lastId });
    setStage("start");
    window.scrollTo({ top: 0 });
  }

  /* ---------- submit + fallbacks (§4.6–4.7, §5.4) ---------- */

  const localFile = (): BioFile =>
    buildBioJson(prepared.data, {
      submission_id: `local-${Date.now().toString(36)}`,
      submitted_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      revision_of: lastId,
      source: "download",
      hub_team_member_id: member ? Number(member.id) : null,
      prefill: member ? prefillFor(member) : null,
      headshot_attached: false,
    });

  async function submit() {
    if (stage === "sending") return;
    setStage("sending");
    setFailure("");
    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: honey,
          access_code: code,
          data: toData(draft),
          revision_of: lastId,
          email_me_copy: emailCopy,
          headshot: draft.data.extras.headshot_choice === "upload" && headshot ? { type: headshot.type, content: headshot.content } : undefined,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; submission_id?: string; file?: BioFile; errors?: FieldErrors; error?: string };
      if (res.ok && json.ok) {
        const id = json.submission_id ?? null;
        setSent(json.file ?? null);
        setLastId(id);
        writeSaved({ v: 1, draft: null, last_submission_id: id });
        setDraft(emptyDraft());
        setHeadshot(null);
        setAttempted(false);
        setTouched({});
        setSeen({});
        setTried({});
        setStep("basics");
        setStage("done");
        return;
      }
      if (res.status === 400 && json.errors) {
        setServerErrors(json.errors);
        setAttempted(true);
        const first = Object.keys(json.errors)[0];
        if (first) setStep(sectionOf(first));
        setStage("form");
        setAnnounce("A few answers need another look.");
        setFocusFirst((n) => n + 1);
        return;
      }
      if (res.status === 401) {
        try {
          window.sessionStorage.removeItem(CODE_KEY);
        } catch {}
        setCodeState("wrong");
        setStage("gate");
        return;
      }
      setFailure(json.error || `The server answered ${res.status}.`);
      setStage("failed");
    } catch {
      setFailure("The connection dropped before it reached us.");
      setStage("failed");
    }
  }

  async function checkCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeState("busy");
    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check_code: true, access_code: code }),
      });
      if (!res.ok) return setCodeState("wrong");
      try {
        window.sessionStorage.setItem(CODE_KEY, code);
      } catch {}
      setCodeState("idle");
      const saved = readSaved();
      if (saved.draft) {
        setDraft(saved.draft);
        if (isSection(saved.step)) setStep(saved.step);
        setWelcomeBack(true);
        setStage("form");
      } else setStage(draft.data.basics.roster_match ? "review" : "start");
    } catch {
      setCodeState("wrong");
    }
  }

  async function onHeadshot(file: File | undefined) {
    setHeadshotError("");
    if (!file) return setHeadshot(null);
    if (!["image/jpeg", "image/png"].includes(file.type)) return setHeadshotError("Use a JPG or PNG.");
    if (file.size > 5 * 1024 * 1024) return setHeadshotError("That file is over 5 MB.");
    try {
      setHeadshot(await resizeImage(file));
    } catch (e) {
      setHeadshotError(e instanceof Error ? e.message : "Couldn’t read that image.");
    }
  }

  /* ==========================================================================
     Render
     ========================================================================== */

  const d = draft.data;
  const b = d.basics;
  const r = d.fairlead_role;

  if (stage === "loading") return <div className="min-h-[40vh]" aria-busy="true" />;

  if (stage === "gate") {
    return (
      <div className="bio">
        <div className="bio-panel bio-step-in max-w-xl">
          <form onSubmit={checkCode} className="flex flex-col gap-8 p-6 md:p-10">
            <div className="flex flex-col gap-3">
              <span className="label flex items-center gap-3 text-white-50">
                <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
                Private link
              </span>
              <h2 ref={headingRef} tabIndex={-1} className="bio-heading h4 outline-none">
                Access code
              </h2>
              <p className="body-md text-white-60">Matt shared a short code with the link. You only need it once per tab.</p>
            </div>
            <TextField path="access_code" label="Code" value={code} onChange={setCode} error={codeState === "wrong" ? "That code didn’t work." : undefined} inputProps={{ autoComplete: "off", autoFocus: true }} />
            <button type="submit" className="btn btn-primary button self-start" disabled={!code || codeState === "busy"}>
              Continue {ARROW}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (stage === "start") {
    const q = filter.trim().toLowerCase();
    const matches = q ? roster.filter((m) => m.name.toLowerCase().split(/\s+/).some((w) => w.startsWith(q)) || m.name.toLowerCase().includes(q)) : roster;
    return (
      <div className="bio">
        <div className="bio-panel bio-step-in">
          <div className="flex flex-col gap-10 p-4 sm:p-8 md:p-12 max-sm:gap-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
              <div className="flex flex-col gap-3">
                <span className="label flex items-center gap-3 text-white-50">
                  <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
                  Let’s start
                </span>
                <h2 ref={headingRef} tabIndex={-1} className="bio-heading h3 outline-none">
                  Who are you?
                </h2>
                <p className="body-lg max-w-2xl text-white-60">
                  Find your name and we’ll fill in what the website already says — you only fix what’s changed.
                </p>
              </div>
              <TextField
                path="roster_filter"
                label="Find your name"
                value={filter}
                onChange={setFilter}
                inputProps={{
                  placeholder: "Start typing…",
                  autoComplete: "off",
                  autoFocus: true,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && matches.length === 1) chooseMember(matches[0]);
                  },
                }}
              />
            </div>
            <fieldset className="flex flex-col gap-4">
              <legend className="sr-only">The team</legend>
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
                {matches.map((m, i) => (
                  <li key={m.id} className="bio-rise min-w-0" style={{ animationDelay: `${Math.min(i * 30, 280)}ms` }}>
                    <button type="button" className="bio-person group min-w-0" aria-pressed={b.roster_match === m.id} onClick={() => chooseMember(m)}>
                      <Portrait name={m.name} src={m.photo_url ?? null} size="sm" />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="body-md truncate text-white-100">{m.name}</span>
                        <span className="body-sm truncate text-white-50">{m.title}</span>
                      </span>
                      <span className="row-arrow ml-auto shrink-0" aria-hidden="true">
                        {ARROW}
                      </span>
                    </button>
                  </li>
                ))}
                <li className="bio-rise min-w-0" style={{ animationDelay: `${Math.min(matches.length * 30, 280)}ms` }}>
                  <button type="button" className="bio-person bio-person-dashed group" aria-pressed={b.roster_match === "not_listed"} onClick={() => chooseMember(null)}>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-white-60" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="body-md text-white-100">I’m not listed</span>
                      <span className="body-sm text-white-50">Start fresh</span>
                    </span>
                  </button>
                </li>
              </ul>
              {q && matches.length === 0 && (
                <p className="body-sm text-white-50">No one by that name on the website yet — choose “I’m not listed” and you’ll start fresh.</p>
              )}
              {matches.length === 1 && q && (
                <p className="body-sm flex items-center gap-2 text-white-40">
                  Press <kbd className="bio-kbd">Enter</kbd> to continue as {matches[0].name}.
                </p>
              )}
            </fieldset>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    const who = sent ? sent.data.basics.preferred_name || sent.data.basics.first_name : "";
    const next = [
      ["Matt drafts your bio", "In the house format, length and tone — from your facts only."],
      ["You approve it", "He sends you the draft. Change anything that’s not right."],
      ["It goes live", "On the website’s team page and the engagement deck."],
    ];
    return (
      <div className="bio">
        <div className="bio-panel bio-step-in">
          <div className="flex flex-col gap-10 p-4 sm:p-8 md:p-12 max-sm:gap-8" role="status" aria-live="polite">
            <div className="flex flex-col gap-6">
              <span className="bio-pop relative flex h-16 w-16 items-center justify-center rounded-full bg-gold text-blue-950" style={{ boxShadow: "0 12px 40px -8px rgba(213,179,113,0.7)" }} aria-hidden="true">
                <span className="bio-burst" />
                <span className="bio-burst" style={{ animationDelay: "0.25s" }} />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path className="check-draw" d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 ref={headingRef} tabIndex={-1} className="bio-heading h3 outline-none">
                {who ? `Thanks, ${who} — that’s done.` : "Got it — that’s done."}
              </h2>
              <p className="body-lg max-w-2xl text-white-60">Matt has your answers. Nothing is published until you approve the draft.</p>
            </div>
            <ol className="grid gap-3 md:grid-cols-3">
              {next.map(([t, d], i) => (
                <li key={t} className="bio-rise bio-note flex flex-col gap-3 p-5" style={{ animationDelay: `${300 + i * 80}ms` }}>
                  <span className="tabular flex h-7 w-7 items-center justify-center rounded-full text-xs text-gold ring-1 ring-gold/50">{i + 1}</span>
                  <span className="body-lg text-white-100">{t}</span>
                  <span className="body-sm text-white-50">{d}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center gap-4">
              {sent && (
                <button type="button" className="btn btn-secondary button" onClick={() => download(bioFilename(sent), JSON.stringify(sent, null, 2))}>
                  Download a copy (JSON)
                </button>
              )}
              <button type="button" className="link-underline body-sm text-white-50" onClick={startOver}>
                Submit another
              </button>
            </div>
            <p className="body-sm text-white-40">Something to change later? Come back here and submit again — Matt will see it as a revision.</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "review" || stage === "sending" || stage === "failed") {
    const busy = stage === "sending";
    return (
      <div ref={rootRef} className="bio flex flex-col gap-8">
        <div className="bio-panel bio-step-in">
          <div className="flex flex-col gap-8 p-4 sm:p-8 md:p-12">
            <div className="flex flex-col gap-3">
              <span className="label flex items-center gap-3 text-white-50">
                <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
                {stage === "failed" ? "Not sent" : "Review"}
              </span>
              <h2 ref={headingRef} tabIndex={-1} className="bio-heading h3 outline-none">
                {stage === "failed" ? "It didn’t send — your answers are safe." : `Looking good${b.preferred_name || b.first_name ? `, ${b.preferred_name || b.first_name}` : ""}.`}
              </h2>
              {stage !== "failed" && (
                <p className="body-lg max-w-2xl text-white-60">
                  Here’s everything Matt will get.{" "}
                  {prepared.warnings.length > 0
                    ? `${prepared.warnings.length} ${prepared.warnings.length === 1 ? "note" : "notes"} below could make the bio stronger — optional, they won’t stop you sending.`
                    : "Nothing missing. Send it when you’re happy."}
                </p>
              )}
            </div>

            {stage === "failed" && (
              <div className="bio-note bio-note-gold flex flex-col gap-5 p-5 md:p-6" role="alert">
                <p className="body-lg text-white-80">
                  {failure} Everything you entered is still here. Try again, or get it to Matt another way:
                </p>
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-primary button" onClick={submit}>
                    Retry
                  </button>
                  <button type="button" className="btn btn-secondary button" onClick={() => {
                    const f = localFile();
                    download(bioFilename(f), JSON.stringify(f, null, 2));
                  }}>
                    Download JSON
                  </button>
                  <a
                    className="btn btn-ghost button"
                    href={(() => {
                      const f = localFile();
                      const body = `My bio intake — the website couldn’t send it.\n\n${JSON_BEGIN}\n${JSON.stringify(f)}\n${JSON_END}`;
                      return `mailto:${MATT}?subject=${encodeURIComponent(`Bio intake — ${b.first_name} ${b.last_name}`)}&body=${encodeURIComponent(body)}`;
                    })()}
                  >
                    Email it instead
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(JSON.stringify(localFile(), null, 2));
                        setCopied(true);
                      } catch {}
                    }}
                  >
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <p className="body-sm text-white-40">
                  If your email app cuts the message short, attach the downloaded file instead and send it to {MATT}.
                </p>
              </div>
            )}

            <ReviewSummary data={prepared.data} warnings={prepared.warnings} onEdit={(id) => go(id)} />
          </div>
        </div>

        {stage !== "failed" && (
          <div className="flex flex-col gap-6">
            <div className="max-w-md">
              <Check path="email_me_copy" label="Email me a copy" checked={emailCopy} onChange={setEmailCopy} />
            </div>
            {/* Honeypot — hidden from people and assistive tech. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-3 max-sm:flex-col-reverse max-sm:items-stretch">
              <button type="button" className="btn btn-ghost button max-sm:min-h-12" onClick={() => go(SECTIONS[SECTIONS.length - 1].id)} disabled={busy}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary button" onClick={submit} disabled={busy}>
                {busy ? (
                  <>
                    <span className="spin inline-block h-4 w-4 rounded-full border border-current border-t-transparent" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    Send to Matt {ARROW}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {stage === "failed" && (
          <button type="button" className="link-underline body-sm self-start text-white-50" onClick={() => setStage("form")}>
            Back to edit
          </button>
        )}
      </div>
    );
  }

  /* ---------- the form: one step at a time ---------- */

  const stepIndex = SECTIONS.findIndex((x) => x.id === step);
  const prevStep = SECTIONS[stepIndex - 1];
  const nextStep = SECTIONS[stepIndex + 1];
  const firstName = b.preferred_name || b.first_name;
  const doneCount = SECTIONS.filter((x) => bySection[x.id] === 0).length;

  // Progress ring: r = 30 → circumference ≈ 188.5
  const RING = 2 * Math.PI * 30;
  const ring = (
    <div className="flex items-center gap-4">
      <div
        className={clsx("bio-ring", progress === 100 && "is-done")}
        role="progressbar"
        aria-label="Essentials answered"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <svg viewBox="0 0 72 72" width="72" height="72" aria-hidden="true">
          <circle className="bio-ring-track" cx="36" cy="36" r="30" fill="none" strokeWidth="3" />
          <circle className="bio-ring-fill" cx="36" cy="36" r="30" fill="none" strokeWidth="3" strokeDasharray={RING} strokeDashoffset={RING * (1 - Math.max(progress, 1.5) / 100)} />
        </svg>
        <span className="bio-ring-num tabular" aria-hidden="true">
          {progress === 100 ? <CheckGlyph size={22} stroke={3} className="bio-pop" /> : `${progress}%`}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="label text-white-50">{progress === 100 ? "Ready to send" : "Essentials"}</span>
        <span className="body-sm text-white-40">
          {doneCount} of {SECTIONS.length} steps done
        </span>
      </div>
    </div>
  );

  const rail = (
    <nav aria-label="Steps" className="flex flex-col gap-5 max-lg:gap-3">
      <div className="max-lg:hidden">{ring}</div>
      <div className="bio-bar lg:hidden" role="progressbar" aria-label="Essentials answered" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="bio-bar-fill" style={{ width: `${Math.max(progress, 2)}%` }} />
      </div>
      <ol className="bio-rail">
        {SECTIONS.map((sec, i) => {
          const n = bySection[sec.id];
          const current = sec.id === step;
          const complete = n === 0;
          return (
            <li key={sec.id} className="min-w-0">
              <button type="button" data-rail={sec.id} onClick={() => go(sec.id)} aria-current={current ? "step" : undefined} className="bio-step button">
                <span className={clsx("bio-step-dot tabular", complete && "is-done")} aria-hidden="true">
                  {complete ? <CheckGlyph key="c" size={12} stroke={3} className="bio-pop" /> : i + 1}
                </span>
                <span className="bio-step-title whitespace-nowrap max-lg:sr-only">{sec.title}</span>
                {!complete && (attempted || seen[sec.id]) && (
                  <span className="bio-step-count tabular max-lg:hidden" aria-hidden="true">
                    {n} left
                  </span>
                )}
                <span className="sr-only">{complete ? ", done" : `, ${n} still to answer`}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="body-sm flex items-baseline justify-between gap-3 lg:hidden" aria-hidden="true">
        <span className="min-w-0 truncate text-white-80">
          <span className="text-white-40">Step {stepIndex + 1} of {SECTIONS.length} · </span>
          {SECTIONS[stepIndex].title}
        </span>
        <span className={clsx("tabular shrink-0", progress === 100 ? "text-gold" : "text-white-40")}>{progress === 100 ? "Ready to send" : `${progress}%`}</span>
      </div>
      <p className="body-sm text-white-40 max-lg:hidden">Each step checks itself before you move on. Jump back any time.</p>
    </nav>
  );

  const savedLabel =
    saveState === "saved" ? (
      <span key="saved" className="bio-saved inline-flex items-center gap-1.5 text-white-40">
        <CheckGlyph size={12} />
        Saved on this device
      </span>
    ) : saveState === "saving" ? (
      <span className="text-white-40">Saving…</span>
    ) : null;

  const stepCopy: Record<SectionId, { title: string; intro: React.ReactNode }> = {
    basics: {
      title: firstName ? `Hi, ${firstName}. First, the basics.` : "First, the basics.",
      intro: member
        ? "We’ve filled in what the website says. Fix anything that’s off and fill the gaps. Not sure about something? Every required question has a “leave it for Matt” link."
        : "Who you are and how the bio should refer to you. Not sure about something? Every required question has a “leave it for Matt” link.",
    },
    role: { title: "What you do at Fairlead", intro: "Mostly tapping, not typing. Pick from the lists; use Other… only when nothing fits." },
    work: {
      title: "Your recent Fairlead work",
      intro: "The last big deals and engagements you’ve worked on — one to three. This is the heart of the bio, so it’s worth the extra minute.",
    },
    career: { title: "Before Fairlead", intro: "Up to four roles, most recent first. Years only put them in order — they’re never printed." },
    education: { title: "Education & credentials", intro: "Degrees, designations and licenses. Only active credentials go after your name." },
    extras: { title: "A few extras", intro: "All optional — skip anything that doesn’t apply, then review." },
  };

  const sectionFrame = (id: SectionId, children: React.ReactNode) => {
    if (id !== step) return null;
    const left = bySection[id];
    const refused = !!tried[id] && left > 0;
    const needed = refused ? Object.entries(errors).filter(([path]) => sectionOf(path) === id) : [];
    return (
      <section id={`s-${id}`} aria-labelledby={`h-${id}`} className={clsx("flex flex-col gap-6", leaving ? "bio-step-out" : "bio-step-in")}>
        <div className="bio-panel">
          <div className="flex flex-col gap-10 p-4 sm:p-8 md:p-12 max-sm:gap-8">
            <div className="flex flex-col gap-3">
              <span className="label flex items-center gap-3 text-white-50">
                <span className="inline-block h-px w-8 bg-gold" aria-hidden="true" />
                Step {stepIndex + 1} of {SECTIONS.length} · about {STEP_MINUTES[id]} min
              </span>
              <h2 id={`h-${id}`} tabIndex={-1} className="bio-heading h3 outline-none">
                {stepCopy[id].title}
              </h2>
              <p className="body-lg max-w-2xl text-white-60">{stepCopy[id].intro}</p>
            </div>
            <div className="flex flex-col gap-8">{children}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-1">
          <p className="body-sm min-h-6" aria-live="polite">
            {left === 0 ? (
              <span key="done" className="bio-pop inline-flex items-center gap-2 text-gold">
                <CheckGlyph size={14} />
                {id === "extras" ? "All set — review whenever you’re ready." : "This step is done."}
              </span>
            ) : refused ? (
              <span key="refused" className="bio-saved inline-flex items-center gap-2 text-gold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M12 7.5v5.5M12 16.25v.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {left === 1 ? "One answer is still needed before you move on." : `${left} answers are still needed before you move on.`}
              </span>
            ) : (
              <span className="text-white-40">
                {left} {left === 1 ? "answer" : "answers"} still needed on this step.
              </span>
            )}
          </p>
          {refused && (
            <div className="bio-note bio-note-gold bio-rise flex flex-col gap-3 p-4">
              <span className="label text-gold">Still needed</span>
              <ul className="flex flex-col gap-1.5">
                {needed.map(([path, msg]) => (
                  <li key={path} className="body-sm flex gap-3 text-white-80">
                    <span className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden="true" />
                    <button type="button" className="link-underline text-left" onClick={() => focusPath(path)}>
                      {msg}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 max-sm:flex-col max-sm:items-stretch">
            <button type="button" className="btn btn-ghost button max-sm:order-2 max-sm:min-h-12" onClick={() => (prevStep ? go(prevStep.id) : setStage("start"))}>
              ← Back
            </button>
            <button key={shake} type="button" className={clsx("btn btn-primary button max-sm:order-1", shake > 0 && refused && "bio-shake")} onClick={advance}>
              {nextStep ? `Next: ${nextStep.title}` : "Review my answers"} {ARROW}
            </button>
            <span className="body-sm ml-auto flex items-center gap-4 max-sm:order-3 max-sm:ml-0 max-sm:w-full max-sm:justify-center">
              {savedLabel}
              <span className="flex items-center gap-1 text-white-40 max-lg:hidden">
                <kbd className="bio-kbd">⌘</kbd>
                <kbd className="bio-kbd">Enter</kbd> next step
              </span>
            </span>
          </div>
        </div>
      </section>
    );
  };

  const entryBox = (children: React.ReactNode) => <div className="bio-entry flex flex-col gap-6 p-3.5 sm:p-6">{children}</div>;

  return (
    <Validity.Provider value={errors}>
    <div
      ref={rootRef}
      className="bio grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 [&_*]:scroll-mt-44 lg:[&_*]:scroll-mt-28"
      onBlurCapture={(e) => {
        const id = (e.target as HTMLElement).id;
        if (id && !touched[id]) setTouched((t) => ({ ...t, [id]: true }));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          advance();
        }
      }}
    >
      <div className="sticky top-[4.5rem] z-20 -mx-5 min-w-0 bg-blue-950/85 px-5 py-3 backdrop-blur-xl backdrop-saturate-150 max-lg:border-b max-lg:border-white/10 lg:top-28 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        {rail}
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        {welcomeBack && (
          <div className="bio-rise bio-note body-md flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-white-80" role="status">
            <span className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold" aria-hidden="true">
                <CheckGlyph size={12} stroke={3} />
              </span>
              Welcome back{firstName ? `, ${firstName}` : ""} — your answers are right where you left them.
            </span>
            {confirmReset ? (
              <span className="flex items-center gap-3">
                <span className="text-white-50">Clear everything?</span>
                <button type="button" className="link-underline text-gold" onClick={startOver}>
                  Yes, start over
                </button>
                <button type="button" className="link-underline text-white-50" onClick={() => setConfirmReset(false)}>
                  Keep my answers
                </button>
              </span>
            ) : (
              <button type="button" className="link-underline ml-auto text-white-50" onClick={() => setConfirmReset(true)}>
                Start over
              </button>
            )}
          </div>
        )}

        {member?.bio_md && (
          <details className="bio-note group px-5 py-4 md:px-6">
            <summary className="label flex cursor-pointer list-none items-center justify-between gap-4 text-white-60 transition-colors group-open:text-gold [&::-webkit-details-marker]:hidden">
              Your current bio — copy facts from here
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 transition-transform duration-300 group-open:rotate-180" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </summary>
            <div className="body-md mt-4 flex max-h-[50vh] flex-col gap-3 overflow-y-auto text-white-60">
              {member.bio_md.split(/\n{2,}/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        )}

        {/* ---------- 1. Basics ---------- */}
        {sectionFrame(
          "basics",
          <>
            <div className="bio-note flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
              {member && <Portrait name={member.name} src={member.photo_url ?? null} size="sm" className="!h-10 !w-10" />}
              <span className="body-md flex min-w-0 flex-1 flex-col text-white-80">
                <span>{b.roster_match === "not_listed" ? "Not on the website yet" : member ? member.name : "Not matched to the roster"}</span>
                <span className="body-sm text-white-40">{b.roster_match === "not_listed" ? "Starting fresh" : member ? "Matched on the website" : "Pick yourself to prefill"}</span>
              </span>
              <button
                type="button"
                id={fid("basics.roster_match")}
                className="bio-chip button"
                data-invalid={err("basics.roster_match") ? "" : undefined}
                onClick={() => setStage("start")}
              >
                Change
              </button>
              <ErrorText path="basics.roster_match" error={err("basics.roster_match")} />
            </div>
            {SHOW.isNewHire(b) && (
              <YesNo path="basics.is_new_hire" legend="Did you join Fairlead in the last few months?" value={b.is_new_hire} onChange={(v) => update((x) => (x.basics.is_new_hire = v))} />
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <TextField path="basics.first_name" label="First name" required value={b.first_name} chars={LIMITS.name} normalize={normName} error={err("basics.first_name")} onChange={(v) => update((x) => (x.basics.first_name = v))} inputProps={{ autoComplete: "given-name" }} />
              <TextField path="basics.last_name" label="Last name" required value={b.last_name} chars={LIMITS.name} normalize={normName} error={err("basics.last_name")} onChange={(v) => update((x) => (x.basics.last_name = v))} inputProps={{ autoComplete: "family-name" }} />
            </div>
            <TextField
              path="basics.preferred_name"
              label="Preferred name"
              example={`Used after the first mention, e.g. “Charlie”. Defaults to ${b.first_name || "your first name"}.`}
              value={b.preferred_name}
              chars={LIMITS.name}
              normalize={normName}
              error={err("basics.preferred_name")}
              onChange={(v) => update((x) => (x.basics.preferred_name = v))}
            />
            <ChoiceChips
              path="basics.pronoun"
              legend="How should the bio refer to you?"
              hint="Bios are third person — we ask rather than guess"
              options={PRONOUNS}
              value={b.pronoun}
              error={err("basics.pronoun")}
              onChange={(v) => update((x) => (x.basics.pronoun = v))}
            />
            <TextField
              path="basics.email"
              label="Email"
              required
              value={b.email}
              normalize={normEmail}
              error={err("basics.email")}
              onChange={(v) => update((x) => (x.basics.email = v))}
              inputProps={{ type: "email", inputMode: "email", autoComplete: "email" }}
            />
            <PickGroup
              legend="Title at Fairlead"
              options={TITLES}
              {...pick({
                path: "basics.title",
                skey: "basics.title",
                values: one(b.title),
                custom: one(b.title_custom),
                set: (x, v, c) => {
                  x.basics.title = v[0] ?? "";
                  x.basics.title_custom = c[0] ?? "";
                },
              })}
            />
            {SHOW.titleSpecialization(b) && (
              <TextField
                path="basics.title_specialization"
                label="Specialization (after your title)"
                example="e.g. Structured Finance & Risk"
                value={b.title_specialization}
                chars={LIMITS.title_specialization}
                normalize={normLabel}
                error={err("basics.title_specialization")}
                onChange={(v) => update((x) => (x.basics.title_specialization = v))}
              />
            )}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <YearField path="basics.year_joined_fairlead" label="Year you joined Fairlead" required value={b.year_joined_fairlead} error={err("basics.year_joined_fairlead")} onChange={(v) => update((x) => (x.basics.year_joined_fairlead = v))} />
              <YearField path="basics.career_start_year" label="Year your career started" required value={b.career_start_year} error={err("basics.career_start_year")} onChange={(v) => update((x) => (x.basics.career_start_year = v))} />
            </div>
            <p className="body-sm -mt-4 px-1 text-white-40">We turn the start year into “more than N years” when the bio is written, so it never goes stale. A best guess is fine.</p>
            <div className="-mt-4 flex flex-col gap-3">
              <LeaveForMatt path="basics.year_joined_fairlead" prompt="Not sure when you joined? Leave it for Matt" value={openNote("basics.year_joined_fairlead")} onChange={(v) => setOpen("basics.year_joined_fairlead", v)} example="e.g. “Started on projects in 2019, formally in 2020”" />
              <LeaveForMatt path="basics.career_start_year" prompt="Not sure when your career started? Leave it for Matt" value={openNote("basics.career_start_year")} onChange={(v) => setOpen("basics.career_start_year", v)} example="e.g. “First finance job was around 1998”" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField path="basics.location" label="City" example="e.g. Houston" value={b.location} chars={LIMITS.short} normalize={sentence} error={err("basics.location")} onChange={(v) => update((x) => (x.basics.location = v))} inputProps={{ autoComplete: "address-level2" }} />
              <TextField
                path="basics.linkedin_url"
                label="LinkedIn"
                example="linkedin.com/in/…"
                value={b.linkedin_url}
                normalize={normLinkedIn}
                error={err("basics.linkedin_url")}
                onChange={(v) => update((x) => (x.basics.linkedin_url = v))}
                inputProps={{ type: "url", inputMode: "url" }}
              />
            </div>
          </>
        )}

        {/* ---------- 2. Fairlead role ---------- */}
        {sectionFrame(
          "role",
          <>
            <PickGroup
              legend="Service lines"
              multiple
              min={1}
              max={LIMITS.service_lines}
              options={SERVICE_LINES}
              {...pick({
                path: "fairlead_role.service_lines",
                skey: "service_lines",
                values: r.service_lines,
                custom: r.service_lines_custom,
                set: (x, v, c) => {
                  x.fairlead_role.service_lines = v;
                  x.fairlead_role.service_lines_custom = c;
                },
              })}
            />
            <LeaveForMatt path="fairlead_role.service_lines" prompt="None of these fit? Leave it for Matt" value={openNote("fairlead_role.service_lines")} onChange={(v) => setOpen("fairlead_role.service_lines", v)} example="e.g. “I run the back office rather than client work”" />
            {SHOW.supportingAreas(r) && (
              <PickGroup
                legend="Supporting services"
                multiple
                min={1}
                max={LIMITS.supporting_areas}
                options={SUPPORTING_AREAS}
                {...pick({
                  path: "fairlead_role.supporting_areas",
                  skey: "supporting_areas",
                  values: r.supporting_areas,
                  custom: r.supporting_areas_custom,
                  set: (x, v, c) => {
                    x.fairlead_role.supporting_areas = v;
                    x.fairlead_role.supporting_areas_custom = c;
                  },
                })}
              />
            )}
            {SHOW.leadershipMode(r) && (
              <ChoiceChips
                path="fairlead_role.leadership_mode"
                legend="Interim or fractional?"
                options={LEADERSHIP_MODES}
                value={r.leadership_mode}
                allowClear
                error={err("fairlead_role.leadership_mode")}
                onChange={(v) => update((x) => (x.fairlead_role.leadership_mode = v || null))}
              />
            )}
            <PickGroup
              legend="Seats you step into"
              hint={SHOW.leadershipMode(r) ? "Worth filling in for interim work" : undefined}
              multiple
              max={LIMITS.seats}
              options={SEATS}
              {...pick({
                path: "fairlead_role.seats",
                skey: "seats",
                values: r.seats,
                custom: r.seats_custom,
                set: (x, v, c) => {
                  x.fairlead_role.seats = v;
                  x.fairlead_role.seats_custom = c;
                },
              })}
            />
            <div className="flex flex-col gap-2">
              <PickGroup
                legend="Focus areas"
                hint="These become your card line on the deck and website"
                multiple
                min={LIMITS.focus_min}
                max={LIMITS.focus_max}
                options={FOCUS_AREAS}
                groups={FOCUS_AREA_GROUPS}
                {...pick({
                  path: "fairlead_role.focus_areas",
                  skey: "focus_areas",
                  values: r.focus_areas,
                  custom: r.focus_areas_custom,
                  set: (x, v, c) => {
                    x.fairlead_role.focus_areas = v;
                    x.fairlead_role.focus_areas_custom = c;
                  },
                })}
              />
              {member?.specialty && <p className="body-sm text-white-40">On the website today: {member.specialty}</p>}
              <LeaveForMatt path="fairlead_role.focus_areas" prompt="Can’t find three that fit? Leave it for Matt" value={openNote("fairlead_role.focus_areas")} onChange={(v) => setOpen("fairlead_role.focus_areas", v)} example="e.g. “Mostly scheduling, onboarding and vendor management”" />
            </div>
            <PickGroup
              legend="Sectors"
              multiple
              max={LIMITS.sectors}
              options={SECTORS}
              {...pick({
                path: "fairlead_role.sectors",
                skey: "sectors",
                values: r.sectors,
                custom: r.sectors_custom,
                set: (x, v, c) => {
                  x.fairlead_role.sectors = v;
                  x.fairlead_role.sectors_custom = c;
                },
              })}
            />
            <PickGroup
              legend="Clients you work for"
              multiple
              options={CLIENT_TYPES}
              {...pick({
                path: "fairlead_role.client_types",
                skey: "client_types",
                values: r.client_types,
                custom: r.client_types_custom,
                set: (x, v, c) => {
                  x.fairlead_role.client_types = v;
                  x.fairlead_role.client_types_custom = c;
                },
              })}
            />
            <TextField
              path="fairlead_role.value_statement"
              label="Finish the sentence: “I help portfolio companies…”"
              textarea
              required
              words={LIMITS.value_statement_words}
              example={EXAMPLES.value}
              value={r.value_statement}
              normalize={sentence}
              error={err("fairlead_role.value_statement")}
              onChange={(v) => update((x) => (x.fairlead_role.value_statement = v))}
            />
            <LeaveForMatt path="fairlead_role.value_statement" prompt="Hard to put into words, or doesn’t apply to your role? Leave it for Matt" value={openNote("fairlead_role.value_statement")} onChange={(v) => setOpen("fairlead_role.value_statement", v)} example="e.g. “I keep the firm running so the partners can be in the field”" />
          </>
        )}

        {/* ---------- 3. Recent Fairlead work ---------- */}
        {sectionFrame(
          "work",
          <>
            <LeaveForMatt
              variant="switch"
              path="recent_engagements"
              prompt="I don’t have a Fairlead engagement to list yet"
              hint="New, between engagements, or not client-facing? Matt will write around it. Anything worth knowing:"
              value={openNote("recent_engagements")}
              onChange={(v) => setOpen("recent_engagements", v)}
              example="e.g. “Joined in September — first engagement starts next month”"
            />
            {(openNote("recent_engagements") == null || d.recent_engagements.some((e) => !isBlankEngagement(e))) &&
            d.recent_engagements.map((e, i) => {
              const p = `recent_engagements.${i}`;
              const set = (fn: (x: Keyed<typeof e>) => void) => entry((x) => x.recent_engagements, e._k, fn);
              const pub = e.can_name_publicly === "yes";
              return (
                <div key={e._k}>
                  {entryBox(
                    <>
                      <EntryHead
                        title="Engagement" index={i}
                        removeLabel={`Remove engagement ${i + 1}`}
                        onRemove={d.recent_engagements.length > 1 ? () => update((x) => (x.recent_engagements = x.recent_engagements.filter((y) => y._k !== e._k))) : undefined}
                      />
                      <ChoiceChips path={`${p}.can_name_publicly`} legend="Can we name the client publicly?" hint="If you’re not sure, we won’t" options={CAN_NAME} value={e.can_name_publicly} error={err(`${p}.can_name_publicly`)} onChange={(v) => set((x) => (x.can_name_publicly = v))} />
                      <TextField
                        path={`${p}.company`}
                        label={pub ? "Company" : "Company — for Matt only (optional)"}
                        required={pub}
                        value={e.company}
                        chars={LIMITS.short}
                        normalize={plain}
                        error={err(`${p}.company`)}
                        onChange={(v) => set((x) => (x.company = v))}
                        inputProps={{ list: "bio-companies", autoComplete: "off" }}
                      />
                      <TextField
                        path={`${p}.descriptor`}
                        label="Describe it without the name"
                        required
                        words={LIMITS.descriptor_words}
                        example={EXAMPLES.descriptor}
                        value={e.descriptor}
                        normalize={sentence}
                        error={err(`${p}.descriptor`)}
                        onChange={(v) => set((x) => (x.descriptor = v))}
                      />
                      <ChoiceChips path={`${p}.engagement_status`} legend="Status" options={ENGAGEMENT_STATUS} value={e.engagement_status} error={err(`${p}.engagement_status`)} onChange={(v) => set((x) => (x.engagement_status = v))} />
                      <PickGroup
                        legend="Type of engagement"
                        options={SERVICE_LINES}
                        {...pick({
                          path: `${p}.engagement_type`,
                          skey: `${e._k}.engagement_type`,
                          values: one(e.engagement_type),
                          custom: one(e.engagement_type_custom),
                          set: (x, v, c) => {
                            const y = x.recent_engagements.find((z) => z._k === e._k);
                            if (y) [y.engagement_type, y.engagement_type_custom] = [v[0] ?? "", c[0] ?? ""];
                          },
                        })}
                      />
                      <PickGroup
                        legend="Your role"
                        options={ENGAGEMENT_ROLES}
                        {...pick({
                          path: `${p}.your_role`,
                          skey: `${e._k}.your_role`,
                          values: one(e.your_role),
                          custom: one(e.your_role_custom),
                          set: (x, v, c) => {
                            const y = x.recent_engagements.find((z) => z._k === e._k);
                            if (y) [y.your_role, y.your_role_custom] = [v[0] ?? "", c[0] ?? ""];
                          },
                        })}
                      />
                      <TextField
                        path={`${p}.what_you_did`}
                        label="What you did — start with a verb"
                        textarea
                        required
                        words={LIMITS.what_you_did_words}
                        example={EXAMPLES.did}
                        value={e.what_you_did}
                        normalize={sentence}
                        error={err(`${p}.what_you_did`)}
                        onChange={(v) => set((x) => (x.what_you_did = v))}
                      />
                      <div className="flex flex-col gap-4">
                        {SHOW.result(e) && (
                          <TextField
                            path={`${p}.result`}
                            label="Result — a number wherever you can ($, MW, %, multiple, timeline)"
                            words={LIMITS.result_words}
                            example={EXAMPLES.result}
                            value={e.result}
                            normalize={sentence}
                            error={err(`${p}.result`)}
                            onChange={(v) => set((x) => (x.result = v))}
                          />
                        )}
                        <Check path={`${p}.result_confidential`} label="The result is confidential" checked={e.result_confidential} onChange={(v) => set((x) => (x.result_confidential = v))} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <YearField path={`${p}.year`} label={e.engagement_status === "ongoing" ? "Year started" : "Year completed"} value={e.year} error={err(`${p}.year`)} onChange={(v) => set((x) => (x.year = v))} />
                        {SHOW.sponsor(e) && (
                          <TextField path={`${p}.sponsor`} label="Sponsor (PE fund or owner)" value={e.sponsor} chars={LIMITS.short} normalize={plain} error={err(`${p}.sponsor`)} onChange={(v) => set((x) => (x.sponsor = v))} />
                        )}
                      </div>
                      <PickGroup
                        legend="Sector"
                        options={SECTORS}
                        {...pick({
                          path: `${p}.sector`,
                          skey: `${e._k}.sector`,
                          values: one(e.sector),
                          custom: one(e.sector_custom),
                          set: (x, v, c) => {
                            const y = x.recent_engagements.find((z) => z._k === e._k);
                            if (y) [y.sector, y.sector_custom] = [v[0] ?? "", c[0] ?? ""];
                          },
                        })}
                      />
                    </>
                  )}
                </div>
              );
            })}
            {openNote("recent_engagements") == null && (
              <AddButton
                path="recent_engagements"
                error={err("recent_engagements")}
                disabled={d.recent_engagements.length >= LIMITS.engagements}
                onClick={() => update((x) => x.recent_engagements.push(newEngagement()))}
              >
                Add an engagement
              </AddButton>
            )}
            <datalist id="bio-companies">
              {companies.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </>
        )}

        {/* ---------- 4. Career ---------- */}
        {sectionFrame(
          "career",
          <>
            <LeaveForMatt
              variant="switch"
              path="prior_roles"
              prompt="No roles before Fairlead to list"
              hint="Came straight from school, or not sure what counts? Matt will sort it out. Anything worth knowing:"
              value={openNote("prior_roles")}
              onChange={(v) => setOpen("prior_roles", v)}
              example="e.g. “Internships only, at two banks”"
            />
            {(openNote("prior_roles") == null || d.prior_roles.some((p) => !isBlankPriorRole(p))) &&
            d.prior_roles.map((pr, i) => {
              const p = `prior_roles.${i}`;
              const set = (fn: (x: Keyed<typeof pr>, dd: DraftData) => void) => entry((x) => x.prior_roles, pr._k, fn);
              return (
                <div key={pr._k}>
                  {entryBox(
                    <>
                      <EntryHead
                        title="Role" index={i}
                        removeLabel={`Remove role ${i + 1}`}
                        onRemove={() => update((x) => (x.prior_roles = x.prior_roles.filter((y) => y._k !== pr._k)))}
                        onUp={i > 0 ? () => update((x) => (x.prior_roles = move(x.prior_roles, i, -1))) : undefined}
                        onDown={i < d.prior_roles.length - 1 ? () => update((x) => (x.prior_roles = move(x.prior_roles, i, 1))) : undefined}
                      />
                      <TextField
                        path={`${p}.employer`}
                        label="Employer"
                        required
                        value={pr.employer}
                        chars={LIMITS.short}
                        normalize={canonicalEmployer}
                        error={err(`${p}.employer`)}
                        onChange={(v) =>
                          set((x) => {
                            x.employer = v;
                            const std = employerDescriptor(v);
                            if (std && !x.employer_descriptor) x.employer_descriptor = std;
                          })
                        }
                        inputProps={{ list: "bio-employers", autoComplete: "off" }}
                      />
                      <TextField
                        path={`${p}.employer_descriptor`}
                        label="The employer in a phrase"
                        words={LIMITS.employer_descriptor_words}
                        example={EXAMPLES.employerDescriptor}
                        value={pr.employer_descriptor}
                        normalize={sentence}
                        error={err(`${p}.employer_descriptor`)}
                        onChange={(v) => set((x) => (x.employer_descriptor = v))}
                      />
                      <TextField
                        path={`${p}.title`}
                        label="Your title — spelled out"
                        required
                        example="“Vice President, Finance”, not “VP Fin”"
                        value={pr.title}
                        chars={LIMITS.short}
                        normalize={sentence}
                        error={err(`${p}.title`)}
                        onChange={(v) => set((x) => (x.title = v))}
                      />
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <YearField path={`${p}.start_year`} label="Start year" value={pr.start_year} error={err(`${p}.start_year`)} onChange={(v) => set((x) => (x.start_year = v))} />
                        {SHOW.endYear(pr) && <YearField path={`${p}.end_year`} label="End year" value={pr.end_year} error={err(`${p}.end_year`)} onChange={(v) => set((x) => (x.end_year = v))} />}
                      </div>
                      <Check path={`${p}.current`} label="Current role — I still do this alongside Fairlead" checked={pr.current} onChange={(v) => set((x) => (x.current = v))} />
                      {SHOW.concurrentRoleType(pr) && (
                        <div className="flex flex-col gap-3">
                          <ChoiceChips
                            path={`${p}.concurrent_role_type`}
                            legend="What kind of role is it?"
                            options={CONCURRENT_ROLE_TYPES}
                            value={pr.concurrent_role_type}
                            error={err(`${p}.concurrent_role_type`)}
                            onChange={(v) =>
                              set((x, dd) => {
                                x.concurrent_role_type = v || null;
                                if (v === "own_firm") {
                                  dd.extras.has_outside_firm = true;
                                  if (!dd.extras.outside_firm.name) dd.extras.outside_firm = { name: x.employer, descriptor: x.employer_descriptor };
                                }
                              })
                            }
                          />
                          {pr.concurrent_role_type === "own_firm" && (
                            <p className="body-sm text-white-50">This moves to Extras → your own firm. It stays out of the bio unless Matt approves it.</p>
                          )}
                          {(pr.concurrent_role_type === "board" || pr.concurrent_role_type === "teaching") && (
                            <p className="body-sm text-white-50">This will be listed with your boards and affiliations, not as a prior role.</p>
                          )}
                        </div>
                      )}
                      <TextField
                        path={`${p}.highlight`}
                        label="One highlight, with a number"
                        textarea
                        words={LIMITS.highlight_words}
                        example={EXAMPLES.highlight}
                        value={pr.highlight}
                        normalize={sentence}
                        error={err(`${p}.highlight`)}
                        onChange={(v) => set((x) => (x.highlight = v))}
                      />
                    </>
                  )}
                </div>
              );
            })}
            {openNote("prior_roles") == null && (
              <AddButton path="prior_roles" error={err("prior_roles")} disabled={d.prior_roles.length >= LIMITS.prior_roles} onClick={() => update((x) => x.prior_roles.push(newPriorRole()))}>
                Add a role
              </AddButton>
            )}
            <TextField
              path="earlier_career"
              label="Earlier career, in a sentence (optional)"
              words={LIMITS.earlier_career_words}
              example={EXAMPLES.earlier}
              value={d.earlier_career}
              normalize={sentence}
              error={err("earlier_career")}
              onChange={(v) => update((x) => (x.earlier_career = v))}
            />
            <datalist id="bio-employers">
              {EMPLOYERS.map((e) => (
                <option key={e.name} value={e.name} />
              ))}
            </datalist>
          </>
        )}

        {/* ---------- 5. Education & credentials ---------- */}
        {sectionFrame(
          "education",
          <>
            <Cluster title="Degrees" hint="Most recent first">
            {d.education.map((g, i) => {
              const p = `education.${i}`;
              const set = (fn: (x: Keyed<typeof g>) => void) => entry((x) => x.education, g._k, fn);
              return (
                <div key={g._k}>
                  {entryBox(
                    <>
                      <EntryHead title="Degree" index={i} removeLabel={`Remove degree ${i + 1}`} onRemove={() => update((x) => (x.education = x.education.filter((y) => y._k !== g._k)))} />
                      <PickGroup
                        legend="Degree"
                        options={DEGREES}
                        {...pick({
                          path: `${p}.degree`,
                          skey: `${g._k}.degree`,
                          values: one(g.degree),
                          custom: one(g.degree_custom),
                          set: (x, v, c) => {
                            const y = x.education.find((z) => z._k === g._k);
                            if (y) [y.degree, y.degree_custom] = [v[0] ?? "", c[0] ?? ""];
                          },
                        })}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField path={`${p}.field`} label="Field" example="e.g. Finance" value={g.field} chars={LIMITS.short} normalize={sentence} error={err(`${p}.field`)} onChange={(v) => set((x) => (x.field = v))} />
                        <TextField path={`${p}.concentration`} label="Concentration (optional)" value={g.concentration} chars={LIMITS.short} normalize={sentence} error={err(`${p}.concentration`)} onChange={(v) => set((x) => (x.concentration = v))} />
                      </div>
                      <TextField
                        path={`${p}.institution`}
                        label="Institution"
                        value={g.institution}
                        chars={LIMITS.short}
                        normalize={canonicalInstitution}
                        error={err(`${p}.institution`)}
                        onChange={(v) => set((x) => (x.institution = v))}
                        inputProps={{ list: "bio-institutions", autoComplete: "off" }}
                      />
                      <Check path={`${p}.in_progress`} label="In progress" checked={g.in_progress} onChange={(v) => set((x) => (x.in_progress = v))} />
                      {SHOW.honors(g) && (
                        <PickGroup
                          legend="Honors (optional)"
                          options={HONORS}
                          {...pick({
                            path: `${p}.honors`,
                            skey: `${g._k}.honors`,
                            values: one(g.honors),
                            custom: one(g.honors_custom),
                            set: (x, v, c) => {
                              const y = x.education.find((z) => z._k === g._k);
                              if (y) [y.honors, y.honors_custom] = [v[0] ?? "", c[0] ?? ""];
                            },
                          })}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
            <AddButton disabled={d.education.length >= LIMITS.education} onClick={() => update((x) => x.education.push(newDegree()))}>
              Add a degree
            </AddButton>
            <datalist id="bio-institutions">
              {INSTITUTIONS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            </Cluster>

            <Cluster title="Credentials" hint="CPA, CFA, PE, bar admissions…">
            {d.credentials.map((c, i) => {
              const p = `credentials.${i}`;
              const set = (fn: (x: Keyed<typeof c>) => void) => entry((x) => x.credentials, c._k, fn);
              return (
                <div key={c._k}>
                  {entryBox(
                    <>
                      <EntryHead title="Credential" index={i} removeLabel={`Remove credential ${i + 1}`} onRemove={() => update((x) => (x.credentials = x.credentials.filter((y) => y._k !== c._k)))} />
                      <PickGroup
                        legend="Designation"
                        options={DESIGNATIONS}
                        {...pick({
                          path: `${p}.designation`,
                          skey: `${c._k}.designation`,
                          values: one(c.designation),
                          custom: one(c.designation_custom),
                          set: (x, v, cc) => {
                            const y = x.credentials.find((z) => z._k === c._k);
                            if (y) [y.designation, y.designation_custom] = [v[0] ?? "", cc[0] ?? ""];
                          },
                        })}
                      />
                      <ChoiceChips
                        path={`${p}.status`}
                        legend="Status"
                        hint={c.status && c.status !== "active" ? "Won’t appear after your name; still useful for Matt" : undefined}
                        options={CREDENTIAL_STATUS}
                        value={c.status}
                        error={err(`${p}.status`)}
                        onChange={(v) => set((x) => (x.status = v))}
                      />
                      {SHOW.jurisdiction(c) && (
                        <TextField path={`${p}.jurisdiction`} label="Licensed in" required example="e.g. Texas" value={c.jurisdiction} chars={LIMITS.short} normalize={sentence} error={err(`${p}.jurisdiction`)} onChange={(v) => set((x) => (x.jurisdiction = v))} />
                      )}
                    </>
                  )}
                </div>
              );
            })}
            <AddButton disabled={d.credentials.length >= LIMITS.credentials} onClick={() => update((x) => x.credentials.push(newCredential()))}>
              Add a credential
            </AddButton>
            </Cluster>

            <YesNo
              path="registration.is_registered_rep"
              legend="Are you a registered representative of a broker-dealer?"
              value={d.registration.is_registered_rep}
              onChange={(v) => update((x) => (x.registration.is_registered_rep = v))}
            />
            {SHOW.registration(d) && (
              <>
                <TextField
                  path="registration.broker_dealer_name"
                  label="Broker-dealer"
                  required
                  value={d.registration.broker_dealer_name}
                  chars={LIMITS.short}
                  normalize={plain}
                  error={err("registration.broker_dealer_name")}
                  onChange={(v) => update((x) => (x.registration.broker_dealer_name = v))}
                />
                <div className="flex flex-col gap-2">
                  <TextField
                    path="registration.regulatory_disclosure"
                    label="Regulatory disclosure — reproduced word for word"
                    textarea
                    required
                    chars={LIMITS.disclosure_chars}
                    value={d.registration.regulatory_disclosure}
                    error={err("registration.regulatory_disclosure")}
                    onChange={(v) =>
                      update((x, dr) => {
                        x.registration.regulatory_disclosure = v;
                        dr.disclosure_auto = false;
                      })
                    }
                  />
                  {!draft.disclosure_auto && (
                    <button
                      type="button"
                      className="link-underline body-sm self-start text-white-50"
                      onClick={() => update((_, dr) => (dr.disclosure_auto = true))}
                    >
                      Reset to the standard wording
                    </button>
                  )}
                </div>
              </>
            )}

            <Cluster title="Other licenses" hint="Optional">
              {d.other_licenses.map((l, i) => (
                <div key={i} className="flex items-start gap-3">
                  <TextField
                    className="flex-1"
                    path={`other_licenses.${i}`}
                    label={`License ${i + 1}`}
                    example="e.g. Series 79, Series 63"
                    value={l}
                    chars={LIMITS.short}
                    normalize={sentence}
                    error={err(`other_licenses.${i}`)}
                    onChange={(v) => update((x) => (x.other_licenses[i] = v))}
                  />
                  <button type="button" className="bio-icon-btn bio-icon-btn-danger mt-4 shrink-0" aria-label={`Remove license ${i + 1}`} onClick={() => update((x) => x.other_licenses.splice(i, 1))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
              <AddButton disabled={d.other_licenses.length >= LIMITS.licenses} onClick={() => update((x) => x.other_licenses.push(""))}>
                Add a license
              </AddButton>
            </Cluster>
          </>
        )}

        {/* ---------- 6. Extras ---------- */}
        {sectionFrame(
          "extras",
          <>
            <Cluster title="Boards and affiliations" hint="Optional">
            {d.extras.board_and_affiliations.map((a, i) => {
              const p = `extras.board_and_affiliations.${i}`;
              const set = (fn: (x: Keyed<typeof a>) => void) => entry((x) => x.extras.board_and_affiliations, a._k, fn);
              return (
                <div key={a._k}>
                  {entryBox(
                    <>
                      <EntryHead
                        title="Affiliation" index={i}
                        removeLabel={`Remove affiliation ${i + 1}`}
                        onRemove={() => update((x) => (x.extras.board_and_affiliations = x.extras.board_and_affiliations.filter((y) => y._k !== a._k)))}
                      />
                      <PickGroup
                        legend="Role"
                        options={AFFILIATION_ROLES}
                        {...pick({
                          path: `${p}.role`,
                          skey: `${a._k}.role`,
                          values: one(a.role),
                          custom: one(a.role_custom),
                          set: (x, v, c) => {
                            const y = x.extras.board_and_affiliations.find((z) => z._k === a._k);
                            if (y) [y.role, y.role_custom] = [v[0] ?? "", c[0] ?? ""];
                          },
                        })}
                      />
                      <TextField path={`${p}.organization`} label="Organization" required example="e.g. TMA Houston Chapter" value={a.organization} chars={LIMITS.short} normalize={plain} error={err(`${p}.organization`)} onChange={(v) => set((x) => (x.organization = v))} />
                      <PickGroup
                        legend="Type"
                        options={AFFILIATION_TYPES}
                        {...pick({
                          path: `${p}.type`,
                          skey: `${a._k}.type`,
                          values: one(a.type),
                          custom: one(a.type_custom),
                          set: (x, v, c) => {
                            const y = x.extras.board_and_affiliations.find((z) => z._k === a._k);
                            if (y) [y.type, y.type_custom] = [v[0] ?? "", c[0] ?? ""];
                          },
                        })}
                      />
                    </>
                  )}
                </div>
              );
            })}
            <AddButton disabled={d.extras.board_and_affiliations.length >= LIMITS.affiliations} onClick={() => update((x) => x.extras.board_and_affiliations.push(newAffiliation()))}>
              Add a board or affiliation
            </AddButton>
            </Cluster>

            <YesNo path="extras.has_outside_firm" legend="Do you also run your own firm or practice?" value={d.extras.has_outside_firm} onChange={(v) => update((x) => (x.extras.has_outside_firm = v))} />
            {SHOW.outsideFirm(d) && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField path="extras.outside_firm.name" label="Firm name" required value={d.extras.outside_firm.name} chars={LIMITS.short} normalize={plain} error={err("extras.outside_firm.name")} onChange={(v) => update((x) => (x.extras.outside_firm.name = v))} />
                  <TextField
                    path="extras.outside_firm.descriptor"
                    label="The firm in a phrase"
                    required
                    words={LIMITS.employer_descriptor_words}
                    value={d.extras.outside_firm.descriptor}
                    normalize={sentence}
                    error={err("extras.outside_firm.descriptor")}
                    onChange={(v) => update((x) => (x.extras.outside_firm.descriptor = v))}
                  />
                </div>
                <p className="body-sm text-white-40">For Matt. It stays out of the bio unless he approves it.</p>
              </div>
            )}

            <PickGroup
              legend="Languages you work in"
              hint="English alone isn’t mentioned"
              multiple
              max={LIMITS.languages}
              options={LANGUAGES}
              {...pick({
                path: "extras.languages",
                skey: "languages",
                values: d.extras.languages,
                custom: d.extras.languages_custom,
                set: (x, v, c) => {
                  x.extras.languages = v;
                  x.extras.languages_custom = c;
                },
              })}
            />

            <YesNo path="extras.include_personal_line" legend="Add one personal line for the website?" value={d.extras.include_personal_line} onChange={(v) => update((x) => (x.extras.include_personal_line = v))} />
            {SHOW.personalLine(d) && (
              <TextField
                path="extras.personal_line"
                label="Personal line"
                required
                words={LIMITS.personal_line_words}
                example={EXAMPLES.personal}
                value={d.extras.personal_line}
                normalize={sentence}
                error={err("extras.personal_line")}
                onChange={(v) => update((x) => (x.extras.personal_line = v))}
              />
            )}

            <ChoiceChips
              path="extras.headshot_choice"
              legend="Headshot"
              options={HEADSHOT_CHOICES.filter((h) => h.value !== "keep" || member?.has_photo)}
              value={d.extras.headshot_choice}
              allowClear
              error={err("extras.headshot_choice")}
              onChange={(v) => update((x) => (x.extras.headshot_choice = v))}
            />
            {d.extras.headshot_choice === "upload" && (
              <div className="bio-rise flex flex-col gap-3">
                <label
                  className={clsx("bio-drop", headshot && "has-file", dragOver && "is-over")}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    onHeadshot(e.dataTransfer.files?.[0]);
                  }}
                >
                  {headshot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={headshot.preview} alt="Your new headshot" className="bio-pop h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-gold/60" />
                  ) : (
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/5 text-white-40" aria-hidden="true">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="body-md text-white-100">{headshot ? "Looks good — tap to swap it" : "Drop a photo here, or tap to choose"}</span>
                    <span className="body-sm text-white-40">JPG or PNG, up to 5 MB. We resize it in your browser.</span>
                  </span>
                  <input
                    id={fid("extras.headshot")}
                    type="file"
                    accept="image/jpeg,image/png"
                    aria-label="Photo — JPG or PNG, up to 5 MB"
                    aria-invalid={err("extras.headshot") || headshotError ? true : undefined}
                    data-invalid={err("extras.headshot") ? "" : undefined}
                    onChange={(e) => onHeadshot(e.target.files?.[0])}
                  />
                </label>
                <ErrorText path="extras.headshot" error={headshotError || err("extras.headshot")} />
                {!headshot && <p className="body-sm px-1 text-white-40">Photos aren’t saved with your progress — pick it again if you come back later.</p>}
              </div>
            )}

            <TextField
              path="extras.do_not_mention"
              label="Anything that must stay out of the bio"
              value={d.extras.do_not_mention}
              chars={LIMITS.do_not_mention_chars}
              error={err("extras.do_not_mention")}
              onChange={(v) => update((x) => (x.extras.do_not_mention = v))}
            />
            <TextField
              path="extras.notes_to_matt"
              label="Notes to Matt (not used in the bio)"
              textarea
              words={LIMITS.notes_words}
              value={d.extras.notes_to_matt}
              error={err("extras.notes_to_matt")}
              onChange={(v) => update((x) => (x.extras.notes_to_matt = v))}
            />
          </>
        )}

      </div>
    </div>
    </Validity.Provider>
  );
}
