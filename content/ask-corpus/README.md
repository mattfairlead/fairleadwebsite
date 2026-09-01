# Ask Fairlead corpus (Phase 2)

Generated RAG corpus for the "Ask Fairlead" command bar (§6 of the redesign
plan): site content + the engagement summary + Perspectives, chunked and
indexed (Supabase pgvector or a flat JSON index — the corpus is tiny).

Rebuilt on content change via `/api/revalidate`. Nothing ships here in
Phase 1 — the trigger and `/api/ask` are stubbed behind
`NEXT_PUBLIC_ASK_ENABLED=false`.
