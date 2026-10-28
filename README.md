Current runtime: **Qwen 3.8 27B through Cerebras**. See [configuration and fresh verification](docs/cerebras-migration.md). Earlier provider recordings and evidence remain dated history.

# Recollect — Memory with receipts

Mission: [Memory That Knows It Might Be Wrong](https://build.doo.ooo/challenges/memory-might-be-wrong).

Live demo: https://recollect-memory.choggyacc.chatgpt.site

Public source: https://github.com/m7mdd77/recollect-memory

A memory inspector that keeps provenance, confidence, freshness and scope attached to every claim. It withholds contradictory, stale or weak memory, asks for clarification and lets the owner confirm or forget facts. This is a memory layer, not vector search with a confidence label added afterward.

## Run

Requires Node.js 24+. The local notebook server has no third-party runtime dependencies; the hosted Vinext application has its own locked dependencies in `site/`.

```powershell
npm ci
npm run check
npm run build
npm start
```

Open http://127.0.0.1:3271. The hosted version uses the same pure memory engine and real browser IndexedDB. Each visitor has their own notebook. Explicit AI controls share the entered note or question and usable scoped evidence through the host and model provider. The sample is fictional and editable.

## Try the full loop

1. Start with Maya in Cedar Studio. The supported entrance cites the client brief.
2. Add the conflicting update. The answer becomes a clarification request, even though the new source is confident and newer.
3. Confirm the courtyard memory. The old source is explicitly superseded; other people and workspaces are unchanged.
4. Advance 14 days. Expired evidence is withheld until explicitly reconfirmed.
5. Forget the workspace. Active and superseded values, source names and quotes are removed from the stored notebook. Opaque revocation receipts remain; reload does not recreate forgotten sample facts. Personal preferences remain in the Personal workspace.

The inspector, export, deterministic answer and optional model context all use the same vault. Writes commit through an IndexedDB read/write transaction with revision checks. A second tab is notified after a commit; conflicting stale-tab writes are rejected.

## Genuine AI

The public demo invokes Qwen 3.8 27B through Cerebras and an outbound worker on the operator's PC. The provider key stays on the PC. AI is available while that worker is connected; the notebook and deterministic inspector also work offline. The interface shows the actual connection state.

Paste a note and source, request a draft, inspect its exact supporting quotes, then explicitly save selected memories. Drafting alone cannot write. Ask a natural-language question: the model chooses an allowlisted field, and independent validation checks its decision, exact value and citations. Contradictory, expired, weak or forgotten values are omitted from model context. The question itself is user-supplied text and is still transmitted.

For local AI, copy `.env.example` to ignored `.env`, or reuse the existing private configuration through `node --env-file=../decision-engine/.env server.js`. To connect the public application, run `node --env-file=../decision-engine/.env pc-worker.js` after provisioning its separate service credential in the Site environment. Never commit either credential. The Site contains only the worker service credential, not the Cerebras key.

Operator-only verification commands make paid requests against fictional facts. `npm run verify:ai` records the original four local cases (1739 reported input/output tokens). `node scripts/verify-live.mjs <base-url>` exercises the complete hosted queue and worker: quoted draft without automatic writes → conflicting question → explicitly confirmed cited answer → abstention after forgetting. Local Worker verification used 2477 reported tokens; public verification used 2391. See `docs/evidence/local-live-ai.json` and `public-live-ai.json`. Unit tests use injected responses and are not provider proof.

The public host enforces 20 attempts/hour globally and 8 per anonymous session/hour. The PC independently persists a 20-attempt/hour allowance, processes one job at a time and gives each model call 25 seconds. Failed attempts count; there is no model retry, fallback, tool use or automatic memory mutation. Queue inputs are cleared after claim; results are deleted after delivery, cancellation or request expiry. Cleanup removes abandoned jobs after 90 seconds when the service next handles cleanup. Revocation or selection changes cancel the job and discard stale browser answers. The client has an estimated per-request cost limit; this is not a provider-billing guarantee.

## Limits

Confidence is a declared source score with a transparent age penalty, not calibrated probability. Conflicting fresh values cause clarification; expired contradictions do not veto fresh evidence. Subjects, workspaces and memory fields are allowlisted in this version. There is no identity verification, encrypted multi-user sync, embedding index or external action execution.

Forgetting removes content from the current notebook and derived context; it is not forensic secure erasure of browser backups, previously downloaded exports or provider logs. Facts explicitly sent to a model cannot be recalled from the provider. The notebook stays local by default, and blocked values never enter model prompts. Browser/site-storage clearing removes the notebook. Use a device you trust.

Architecture: `docs/architecture.md`. Failure evidence: `docs/failure-test.md`. Thesis: `docs/thesis.md`. Release roadmap: `docs/roadmap.md`.

Watch the [continuous public walkthrough](https://recollect-memory.choggyacc.chatgpt.site/walkthrough.mp4). It starts with an already generated draft; see `docs/failure-test.md` for capture scope. The 38-test suite and genuine local/public inference evidence are described in `docs/release.md`.

Hosted development: run `npm ci` in `site/`, prepare shared sources with `npm run build` at the repository root, then run the hosted build in `site/`. The existing applied D1 migration is tracked in `site/drizzle/`; preserve it and use new migrations for schema changes.
