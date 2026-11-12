# Validation results

Validated 2026-11-12 using Node.js 24, Playwright, and system Chromium.

`node tests/smoke.cjs` — PASS

Covered: API connection gate; requested endpoint/model/authorization; omission of student names from prompts; ten-level progression and completion; six-digit final operands; PDF download; report persistence after reload; wrong-answer corrections; manual stop; slower improving-answer promotion; incorrect-answer demotion; steady timing staying at the same level; rejection of out-of-range AI operands; no browser JavaScript errors.

`pdfinfo /tmp/addition-smoke.pdf` — PASS: valid PDF 1.4, one page.

`pdftotext /tmp/addition-smoke.pdf -` — confirmed student, all ten answered sums, timing, highest level 10/10, score 10/10, and completion status.

API responses were mocked. No real API key was available, so live authentication, current gpt-4o-mini availability, and OpenAI CORS acceptance are unverified. Managed Chromium blocks file navigation by administrator policy; browser workflow tests used a temporary loopback HTTP server instead. This does not verify file-origin CORS or file-origin storage behaviour. Reports are saved locally in the browser, not to a shared backend.

## OpenAI migration validation

Switched the endpoint to https://api.openai.com/v1/chat/completions and model to gpt-4o-mini. Updated the browser test to assert the OpenAI endpoint/model and to verify a rejected key leaves the app locked, then permits retry with a valid key. Full mocked workflow rerun: PASS. Live OpenAI requests remain unverified without a user API key.
