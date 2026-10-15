Recollect turns notes into reviewable memories and answers questions from evidence it can still trust. Each claim has a source, exact quote, declared confidence, freshness, workspace and person. DeepSeek proposes claims; only the user can save them. Contradictions request clarification. Expired, weak and forgotten values are withheld from model context.

Try Maya / Cedar Studio: draft a delivery note, review its quote and save. Ask where the courier should go. Confirm a conflicting entrance explicitly, then ask again for a cited answer. Forget the workspace and ask again: DeepSeek abstains. Personal preferences remain separate. The receipt retains no remembered values or sources.

Real storage uses browser IndexedDB with transactional revision checks. Explicit AI requests pass through a transient Worker/D1 queue to DeepSeek v4 Flash on an authenticated PC worker. The provider key stays on the PC; live AI needs that PC awake. The notebook remains usable offline. Previously transmitted prompts, old exports and backups cannot be recalled.

AI tools: OpenAI Codex for implementation/review; genuine DeepSeek v4 Flash for extraction and natural question routing. Four public end-to-end calls passed (2391 reported input/output tokens), alongside local verification and 38 tests. This is live inference, with bounded quotas and independent quote/citation validation. Confidence is declared support with age decay, not calibrated probability.

Video: https://recollect-memory.choggyacc.chatgpt.site/walkthrough.mp4
Architecture: https://github.com/m7mdd77/recollect-memory/blob/main/docs/architecture.md
Failure: https://github.com/m7mdd77/recollect-memory/blob/main/docs/failure-test.md
Thesis: https://github.com/m7mdd77/recollect-memory/blob/main/docs/thesis.md
