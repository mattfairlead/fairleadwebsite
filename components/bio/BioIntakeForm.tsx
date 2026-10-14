"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import HairlineFrame from "@/components/HairlineFrame";
import { ARROW } from "@/components/Btn";
import PickGroup from "@/components/bio/PickGroup";
import { AddButton, Check, ChoiceChips, EntryHead, ErrorText, fid, TextField, YearField, YesNo } from "@/components/bio/fields";
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
import { SECTIONS, SHOW, sectionOf, type FieldErrors, type RosterMember, type SectionId } from "@/lib/bio/schema";
import { bioFilename, buildBioJson, prefillFor, prepare, type BioFile } from "@/lib/bio/build";
import { JSON_BEGIN, JSON_END, renderSummary } from "@/lib/bio/email";
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
  const [code, setCode] = useState("");
  const [codeState, setCodeState] = useState<"idle" | "busy" | "wrong">("idle");
  const [sent, setSent] = useState<BioFile | null>(null);
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailCopy, setEmailCopy] = useState(true);
  const [honey, setHoney] = useState("");
  const [announce, setAnnounce] = useState("");
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
      setWelcomeBack(true);
      setStage("form");
    } else setStage("start");
  }, [gated]);

  const editing = stage === "form" || stage === "review" || stage === "failed";
  useEffect(() => {
    if (!editing) return;
    const t = setTimeout(() => writeSaved({ v: 1, draft, last_submission_id: lastId }), 500);
    return () => clearTimeout(t);
  }, [draft, lastId, editing]);

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

  const err = (path: string) => (attempted || touched[fid(path)] ? errors[path] : undefined);

  const bySection = useMemo(() => {
    const out: Record<SectionId, number> = { basics: 0, role: 0, work: 0, career: 0, education: 0, extras: 0 };
    for (const p of Object.keys(errors)) out[sectionOf(p)] += 1;
    return out;
  }, [errors]);

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

  /** Mutate one keyed repeater entry. */
  const entry = <T,>(list: (d: DraftData) => Keyed<T>[], k: string, fn: (e: Keyed<T>, d: DraftData) => void) =>
    update((d) => {
      const e = list(d).find((x) => x._k === k);
      if (e) fn(e, d);
    });

  /* ---------- focus management ---------- */

  useEffect(() => {
    if (stage !== "loading" && stage !== "form") headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  useEffect(() => {
    if (!focusFirst) return;
    const el = rootRef.current?.querySelector<HTMLElement>("[data-invalid]");
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.focus({ preventScroll: true });
    }
  }, [focusFirst]);

  function toReview() {
    if (errorCount) {
      setAttempted(true);
      setAnnounce(`${errorCount} ${errorCount === 1 ? "answer needs" : "answers need"} attention. Taking you to the first one.`);
      setFocusFirst((n) => n + 1);
      return;
    }
    setAnnounce("");
    setStage("review");
    window.scrollTo({ top: rootRef.current ? rootRef.current.getBoundingClientRect().top + window.scrollY - 120 : 0 });
  }

  function chooseMember(m: RosterMember | null) {
    setDraft((prev) => {
      if (m) return prefillFromRoster(prev, m);
      const next = structuredClone(prev);
      next.data.basics.roster_match = "not_listed";
      return next;
    });
    setStage("form");
    window.scrollTo({ top: 0 });
  }

  function startOver() {
    setDraft(emptyDraft());
    setHeadshot(null);
    setAttempted(false);
    setTouched({});
    setServerErrors({});
    setWelcomeBack(false);
    setConfirmReset(false);
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
        setStage("done");
        return;
      }
      if (res.status === 400 && json.errors) {
        setServerErrors(json.errors);
        setAttempted(true);
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
      <HairlineFrame>
        <form onSubmit={checkCode} className="flex max-w-xl flex-col gap-8 p-6 md:p-12">
          <h2 ref={headingRef} tabIndex={-1} className="h4 outline-none">
            Access code
          </h2>
          <p className="body-md text-white-60">Matt shared a short code with the link. You only need it once per tab.</p>
          <TextField path="access_code" label="Code" value={code} onChange={setCode} error={codeState === "wrong" ? "That code didn’t work." : undefined} inputProps={{ autoComplete: "off" }} />
          <button type="submit" className="btn btn-primary button self-start" disabled={!code || codeState === "busy"}>
            Continue {ARROW}
          </button>
        </form>
      </HairlineFrame>
    );
  }

  if (stage === "start") {
    return (
      <HairlineFrame>
        <div className="flex flex-col gap-8 p-6 md:p-12">
          <div className="flex flex-col gap-3">
            <h2 ref={headingRef} tabIndex={-1} className="h3 outline-none">
              Who are you?
            </h2>
            <p className="body-md max-w-2xl text-white-60">
              Pick your name and we’ll fill in what the website already says, so you only correct what’s changed.
            </p>
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-3 text-white-50">The team</legend>
            <div className="flex flex-wrap gap-2">
              {roster.map((m) => (
                <button key={m.id} type="button" className="chip button" aria-pressed={b.roster_match === m.id} onClick={() => chooseMember(m)}>
                  {m.name}
                </button>
              ))}
              <button type="button" className="chip button" aria-pressed={b.roster_match === "not_listed"} onClick={() => chooseMember(null)}>
                I’m not listed
              </button>
            </div>
          </fieldset>
        </div>
      </HairlineFrame>
    );
  }

  if (stage === "done") {
    return (
      <HairlineFrame>
        <div className="flex flex-col gap-6 p-6 md:p-12" role="status" aria-live="polite">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full text-gold"
            style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,113,0.5), 0 0 40px -10px rgba(213,179,113,0.6)" }}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path className="check-draw" d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 ref={headingRef} tabIndex={-1} className="h3 outline-none">
            Got it — Matt will send you a draft to approve.
          </h2>
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
          <p className="body-sm text-white-40">Need to change something later? Come back to this page and submit again — Matt will see it as a revision.</p>
        </div>
      </HairlineFrame>
    );
  }

  if (stage === "review" || stage === "sending" || stage === "failed") {
    const summary = renderSummary(prepared.data);
    const busy = stage === "sending";
    return (
      <div ref={rootRef} className="flex flex-col gap-8">
        <HairlineFrame>
          <div className="flex flex-col gap-8 p-6 md:p-12">
            <div className="flex flex-col gap-3">
              <h2 ref={headingRef} tabIndex={-1} className="h3 outline-none">
                {stage === "failed" ? "It didn’t send." : "Check it over."}
              </h2>
              {stage !== "failed" && (
                <p className="body-md max-w-2xl text-white-60">This is what Matt receives. Warnings won’t stop you sending; they’re notes for the draft.</p>
              )}
            </div>

            {stage === "failed" && (
              <div className="flex flex-col gap-5" role="alert">
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

            {prepared.warnings.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="label text-gold">Warnings · {prepared.warnings.length}</span>
                <ul className="flex flex-col gap-2">
                  {prepared.warnings.map((w) => (
                    <li key={w} className="body-md flex gap-3 text-white-80">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden="true" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <span className="label text-white-50">Your answers</span>
              <pre className="body-sm overflow-x-auto whitespace-pre-wrap break-words font-sans text-white-80">{summary}</pre>
            </div>
          </div>
        </HairlineFrame>

        {stage !== "failed" && (
          <div className="flex flex-col gap-6">
            <Check path="email_me_copy" label="Email me a copy" checked={emailCopy} onChange={setEmailCopy} />
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
            <div className="flex flex-wrap items-center gap-4">
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
              <button type="button" className="btn btn-ghost button" onClick={() => setStage("form")} disabled={busy}>
                Back to edit
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

  /* ---------- the form ---------- */

  const done = SECTIONS.filter((s) => bySection[s.id] === 0).length;

  const rail = (
    <nav aria-label="Sections" className="flex flex-col gap-4">
      <span className="label text-white-50 max-lg:hidden">
        {done} of {SECTIONS.length} complete
      </span>
      <ol className="relative flex gap-2 overflow-x-auto max-lg:-mx-1 max-lg:px-1 max-lg:pb-1 lg:flex-col lg:gap-1">
        {SECTIONS.map((s, i) => {
          const n = bySection[s.id];
          return (
            <li key={s.id} className="shrink-0">
              <a href={`#s-${s.id}`} className="chip button lg:w-full lg:justify-between lg:rounded-md">
                <span>
                  <span className="tabular text-white-40">{i + 1}</span> {s.title}
                </span>
                <span aria-hidden="true" className={clsx("text-xs", n === 0 ? "text-gold" : attempted ? "text-gold" : "text-white-20")}>
                  {n === 0 ? "✓" : attempted ? n : "○"}
                </span>
                <span className="sr-only">{n === 0 ? "complete" : `${n} to do`}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const sectionFrame = (id: SectionId, title: string, intro: React.ReactNode, children: React.ReactNode) => (
    <section id={`s-${id}`} aria-labelledby={`h-${id}`} className="scroll-mt-40">
      <HairlineFrame>
        <div className="flex flex-col gap-10 p-6 md:p-10">
          <div className="flex flex-col gap-2">
            <h2 id={`h-${id}`} className="h4">
              {title}
            </h2>
            {intro && <p className="body-md max-w-2xl text-white-50">{intro}</p>}
          </div>
          {children}
        </div>
      </HairlineFrame>
    </section>
  );

  const entryBox = (children: React.ReactNode) => <div className="flex flex-col gap-8 border-l border-white/10 pl-4 md:pl-6">{children}</div>;

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12"
      onBlurCapture={(e) => {
        const id = (e.target as HTMLElement).id;
        if (id && !touched[id]) setTouched((t) => ({ ...t, [id]: true }));
      }}
    >
      <div className="sticky top-[4.5rem] z-20 -mx-5 min-w-0 bg-blue-950/90 px-5 py-3 backdrop-blur max-lg:border-b max-lg:border-white/10 lg:top-28 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        {rail}
      </div>

      <div className="flex min-w-0 flex-col gap-10">
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        {welcomeBack && (
          <div className="body-md flex flex-wrap items-center gap-x-4 gap-y-2 text-white-80" role="status">
            <span>Welcome back — we kept your answers.</span>
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
              <button type="button" className="link-underline text-white-50" onClick={() => setConfirmReset(true)}>
                Start over
              </button>
            )}
          </div>
        )}

        {member?.bio_md && (
          <details className="group rounded-md bg-blue-900/40 p-5 md:p-6">
            <summary className="label cursor-pointer text-white-60 group-open:text-gold">Your current bio — copy facts from here</summary>
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
          "Basics",
          null,
          <>
            <div className="body-md flex flex-wrap items-center gap-x-3 gap-y-1 text-white-60">
              <span>
                {b.roster_match === "not_listed" ? "Not on the website roster yet." : member ? `Matched to ${member.name} on the website.` : "Not matched to the roster."}
              </span>
              <button
                type="button"
                id={fid("basics.roster_match")}
                className="link-underline text-white-50"
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
            <div className="grid gap-10 md:grid-cols-2">
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
            <div className="grid gap-10 md:grid-cols-2">
              <YearField path="basics.year_joined_fairlead" label="Year you joined Fairlead" required value={b.year_joined_fairlead} error={err("basics.year_joined_fairlead")} onChange={(v) => update((x) => (x.basics.year_joined_fairlead = v))} />
              <YearField path="basics.career_start_year" label="Year your career started" required value={b.career_start_year} error={err("basics.career_start_year")} onChange={(v) => update((x) => (x.basics.career_start_year = v))} />
            </div>
            <p className="body-sm -mt-6 text-white-40">We turn the start year into “more than N years” when the bio is written, so it never goes stale.</p>
            <div className="grid gap-10 md:grid-cols-2">
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
          "Fairlead role",
          "What you do for clients. Pick from the lists; use Other… only when nothing fits.",
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
          </>
        )}

        {/* ---------- 3. Recent Fairlead work ---------- */}
        {sectionFrame(
          "work",
          "Recent Fairlead work",
          "The last big deals and engagements you’ve worked on at Fairlead — one to three. This is the heart of the bio, so give it the most time.",
          <>
            {d.recent_engagements.map((e, i) => {
              const p = `recent_engagements.${i}`;
              const set = (fn: (x: Keyed<typeof e>) => void) => entry((x) => x.recent_engagements, e._k, fn);
              const pub = e.can_name_publicly === "yes";
              return (
                <div key={e._k}>
                  {entryBox(
                    <>
                      <EntryHead
                        title={`Engagement ${i + 1}`}
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
                      <div className="grid gap-10 md:grid-cols-2">
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
            <AddButton
              path="recent_engagements"
              error={err("recent_engagements")}
              disabled={d.recent_engagements.length >= LIMITS.engagements}
              onClick={() => update((x) => x.recent_engagements.push(newEngagement()))}
            >
              Add an engagement
            </AddButton>
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
          "Career before Fairlead",
          "Up to four roles, most recent first. Years are only used to put them in order — they’re never printed.",
          <>
            {d.prior_roles.map((pr, i) => {
              const p = `prior_roles.${i}`;
              const set = (fn: (x: Keyed<typeof pr>, dd: DraftData) => void) => entry((x) => x.prior_roles, pr._k, fn);
              return (
                <div key={pr._k}>
                  {entryBox(
                    <>
                      <EntryHead
                        title={`Role ${i + 1}`}
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
                      <div className="grid gap-10 md:grid-cols-2">
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
            <AddButton path="prior_roles" error={err("prior_roles")} disabled={d.prior_roles.length >= LIMITS.prior_roles} onClick={() => update((x) => x.prior_roles.push(newPriorRole()))}>
              Add a role
            </AddButton>
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
          "Education & credentials",
          null,
          <>
            <span className="label text-white-60">Degrees</span>
            {d.education.map((g, i) => {
              const p = `education.${i}`;
              const set = (fn: (x: Keyed<typeof g>) => void) => entry((x) => x.education, g._k, fn);
              return (
                <div key={g._k}>
                  {entryBox(
                    <>
                      <EntryHead title={`Degree ${i + 1}`} removeLabel={`Remove degree ${i + 1}`} onRemove={() => update((x) => (x.education = x.education.filter((y) => y._k !== g._k)))} />
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
                      <div className="grid gap-10 md:grid-cols-2">
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

            <span className="label text-white-60">Credentials</span>
            {d.credentials.map((c, i) => {
              const p = `credentials.${i}`;
              const set = (fn: (x: Keyed<typeof c>) => void) => entry((x) => x.credentials, c._k, fn);
              return (
                <div key={c._k}>
                  {entryBox(
                    <>
                      <EntryHead title={`Credential ${i + 1}`} removeLabel={`Remove credential ${i + 1}`} onRemove={() => update((x) => (x.credentials = x.credentials.filter((y) => y._k !== c._k)))} />
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

            <div className="flex flex-col gap-4">
              <span className="label text-white-50">Other licenses (optional)</span>
              {d.other_licenses.map((l, i) => (
                <div key={i} className="flex items-end gap-3">
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
                  <button type="button" className="chip button mb-1" aria-label={`Remove license ${i + 1}`} onClick={() => update((x) => x.other_licenses.splice(i, 1))}>
                    Remove
                  </button>
                </div>
              ))}
              <AddButton disabled={d.other_licenses.length >= LIMITS.licenses} onClick={() => update((x) => x.other_licenses.push(""))}>
                Add a license
              </AddButton>
            </div>
          </>
        )}

        {/* ---------- 6. Extras ---------- */}
        {sectionFrame(
          "extras",
          "Extras",
          "All optional.",
          <>
            <span className="label text-white-60">Boards and affiliations</span>
            {d.extras.board_and_affiliations.map((a, i) => {
              const p = `extras.board_and_affiliations.${i}`;
              const set = (fn: (x: Keyed<typeof a>) => void) => entry((x) => x.extras.board_and_affiliations, a._k, fn);
              return (
                <div key={a._k}>
                  {entryBox(
                    <>
                      <EntryHead
                        title={`Affiliation ${i + 1}`}
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

            <YesNo path="extras.has_outside_firm" legend="Do you also run your own firm or practice?" value={d.extras.has_outside_firm} onChange={(v) => update((x) => (x.extras.has_outside_firm = v))} />
            {SHOW.outsideFirm(d) && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-10 md:grid-cols-2">
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
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-2">
                  <span className="label text-white-50">Photo — JPG or PNG, up to 5 MB</span>
                  <input
                    id={fid("extras.headshot")}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="body-sm text-white-60 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-800 file:px-4 file:py-2 file:text-white-100"
                    aria-invalid={err("extras.headshot") || headshotError ? true : undefined}
                    data-invalid={err("extras.headshot") ? "" : undefined}
                    onChange={(e) => onHeadshot(e.target.files?.[0])}
                  />
                </label>
                {headshot && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={headshot.preview} alt="Your new headshot" className="h-32 w-32 rounded-full object-cover" />
                )}
                <ErrorText path="extras.headshot" error={headshotError || err("extras.headshot")} />
                {!headshot && <p className="body-sm text-white-40">Photos aren’t saved with your progress — pick it again if you come back later.</p>}
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

        <div className="flex flex-col gap-4">
          {attempted && errorCount > 0 && (
            <p className="body-md text-gold">
              {errorCount} {errorCount === 1 ? "answer needs" : "answers need"} attention — see the sections marked in the list.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="btn btn-primary button" onClick={toReview}>
              Review {ARROW}
            </button>
            <span className="body-sm text-white-40">Saved on this device as you go. Nothing is sent until you press Send on the next screen.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
