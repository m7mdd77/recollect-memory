# Recollect — Memory with receipts

Mission: [Memory That Knows It Might Be Wrong](https://build.doo.ooo/challenges/memory-might-be-wrong).

Live demo: https://recollect-memory.choggyacc.chatgpt.site

Public source: https://github.com/m7mdd77/recollect-memory

A memory inspector that keeps provenance, confidence, freshness and scope attached to every claim. It withholds contradictory, stale or weak memory, asks for clarification and lets the owner confirm or forget facts. This is a memory layer, not vector search with a confidence label added afterward.

## Run

Requires Node.js 24+. No third-party runtime dependencies.

```powershell
npm ci
npm run check
npm run build
npm start
```

Open http://127.0.0.1:3271. The hosted version uses the same pure memory engine and real browser IndexedDB. Each visitor has their own notebook; memory is not uploaded to the public host. The sample is fictional and editable.

## Try the full loop

1. Start with Maya in Cedar Studio. The supported entrance cites the client brief.
2. Add the conflicting update. The answer becomes a clarification request, even though the new source is confident and newer.
3. Confirm the courtyard memory. The old source is explicitly superseded; other people and workspaces are unchanged.
4. Advance 14 days. Expired evidence is withheld until explicitly reconfirmed.
5. Forget the workspace. Active and superseded values, source names and quotes are removed from the stored notebook. Opaque revocation receipts remain; reload does not recreate forgotten sample facts. Personal preferences remain in the Personal workspace.

The inspector, export, deterministic answer and optional model context all use the same vault. Writes commit through an IndexedDB read/write transaction with revision checks. A second tab is notified after a commit; conflicting stale-tab writes are rejected.

## Genuine DeepSeek

The local server can invoke DeepSeek v4 Flash through the genuine supported Claude Code client. Copy `.env.example` to ignored `.env`, or reuse the existing private configuration through `node --env-file=../decision-engine/.env server.js`. Never copy credentials into the website. The explicit Ask DeepSeek control is available only in the configured local build and shares only currently usable facts. The public demo remains functional without an AI backend or an awake PC.

`npm run verify:ai` is operator-only and makes four paid requests against fictional sample facts. October 15 verification used 1739 reported input/output tokens: supported → answer; conflicting → clarify; expired → abstain; revoked → abstain. See `docs/evidence/genuine-ai.json`. This is historical provider proof, not live inference in the hosted demo. Unit tests use injected client responses and are not provider proof.

The server allows at most 20 attempts/hour in a persistent local SQLite allowance, one outstanding request, a 25-second deadline and bounded output. Failed calls count; there is no automatic model retry, fallback, tool use or memory mutation. The model's value, decision and citation IDs are independently checked against retrieval policy. Revocation or selection changes discard outstanding browser answers. The client has an estimated per-request cost limit; this is not a provider-billing guarantee.

## Limits

Confidence is a declared source score with a transparent age penalty, not calibrated probability. Conflicting fresh values cause clarification; expired contradictions do not veto fresh evidence. Subjects, workspaces and memory fields are allowlisted in this version. There is no identity verification, encrypted multi-user sync, embedding index or external action execution.

Forgetting removes content from the current notebook and derived context; it is not forensic secure erasure of browser backups, previously downloaded exports or provider logs. Facts explicitly sent to a model cannot be recalled from the provider. The notebook stays local by default, and blocked values never enter model prompts. Browser/site-storage clearing removes the notebook. Use a device you trust.

Architecture: `docs/architecture.md`. Failure evidence: `docs/failure-test.md`. Thesis: `docs/thesis.md`. Release roadmap: `docs/roadmap.md`.
