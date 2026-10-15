# Public release — October 15, 2026

Demo: https://recollect-memory.choggyacc.chatgpt.site
Source: https://github.com/m7mdd77/recollect-memory
Walkthrough: https://recollect-memory.choggyacc.chatgpt.site/walkthrough.mp4

Sites version 3 deployed successfully from hosted source `e3438af06d65d2968cb8c2e6400bf564cf491309`. Deployment: `appgdep_6ad116fd8a3c819195b3a1c38d56dfa4`. The public application now uses genuine DeepSeek extraction and natural questions through Worker/D1 and an outbound PC worker. The provider key stays on the PC. Live AI requires that PC awake and connected; browser-local notebook controls remain usable without it.

All 38 tests, TypeScript checking and the production build passed. Actual local Worker and public Worker runs each verified quoted draft, conflicting question, confirmed cited answer and abstention after forgetting. Public calls used 2391 reported input/output tokens; local calls used 2477. These are individual verification totals, not all project usage or billing estimates. See evidence/public-live-ai.json and evidence/local-live-ai.json.

Actual Chrome interaction also verified save after review, live clarification, a cited east-entrance answer, live abstention after forgetting, persistence after reload and preservation of the Personal preference. See evidence/live-browser.json. The continuous recording is 90.95 seconds, H264, fully decoded successfully, without cuts or audio. It starts with an already generated draft; the final abstention was below fold in the recording and is separately verified in the browser. Video transcoding only regularizes frame timing.

The final deployment archive contains 66 files, includes the walkthrough, and passed exact active-credential and private-runtime-path scans. The public GitHub payload was scanned separately. The Site stores only a worker service credential; a temporary earlier service credential was removed and rotated before this live release. The AgentRouter key was never included in that source.

Entry notes (1774 characters), a thesis under 300 words, architecture and failure evidence are prepared. No Recollect competition entry has been submitted.
