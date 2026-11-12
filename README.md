# Addition Studio

Open `index.html` in a modern browser, enter a OpenAI API key, confirm, and enter a student name. The file includes all application code, styles, and PDF generation; no build or runtime dependencies are required.

Get an API key at https://platform.openai.com/api-keys. OpenAI API billing is separate from a ChatGPT subscription. This app calls the OpenAI API using `gpt-4o-mini`; it does not connect to your ChatGPT chat history. Never commit or share your API key. For a public or classroom deployment, use a backend to keep the provider key off student devices.

## Behaviour

- Uses `https://api.openai.com/v1/chat/completions`, Bearer authentication, and exactly `gpt-4o-mini`. The connection gate validates both the key and a generated exercise before opening the app. The provider must still offer this model to your account; errors are shown without silently changing models.
- Ten operand ranges progress to two six-digit numbers. AI operands are validated; answers are calculated locally.
- A correct answer within one second advances one level. Otherwise, three consecutive correct answers at the same level with decreasing response times advance one level. Incorrect answers lower the level by one, with a minimum of one. This deliberately caps increases at one level. Timing starts after a question appears and excludes API latency.
- Correctly answering at level ten completes the exercise. Stop also ends the session at any point, including during a request. Highest level reached means the highest level unlocked; reports separately show the level of every submitted answer and whether level ten was completed.
- Stop/completion saves a report and requests a PDF download containing all submitted sums, answers, corrections, timings, and highest level. Saved reports can be downloaded again or deleted.

## Storage and privacy

Reports, including student names, are stored in browser localStorage on this device, not a central online system. Storage availability and persistence for `file://` URLs vary by browser. Keep PDF copies. A shared student database, accounts, cross-device access, backups, or managed retention require a backend and are not implemented by this self-contained file. Sessions in progress are not persisted.

The API key is held only in memory until reload/close. It is sent directly to OpenAI; student names and answers are not sent. Standard PDF fonts do not support all Unicode: unsupported characters in names are replaced with `?` in PDFs; original names remain in browser reports.

## CORS

The request uses `mode: 'cors'` and standard JSON/Authorization headers. These require a provider-approved preflight. A local file has a `null` origin; only OpenAI can grant permission to that origin. Client code cannot force this or safely bypass CORS. If rejected, try serving the file with `python3 -m http.server 8000` from this directory. If that origin is also rejected, a trusted server proxy is needed. Do not disable browser security or use public key-forwarding proxies.

## Tests

The browser smoke test requires Node.js, Playwright, and Chromium. With those installed, run `node tests/smoke.cjs`; use `CHROMIUM_PATH` to select Chromium (default `/usr/bin/chromium`). API responses are mocked, so no real key is needed. A live model request must be checked with your own key.
