# Addition Studio — no API required

Open index.html, enter a student name, and start. All ten adaptive addition levels, timing, grading, corrections, and PDF reports run locally. No API key, subscription, external scripts, or AI service is used. Download the HTML file for offline use; the hosted website needs internet only to load initially.

Correct answers within one second advance one level. Three consecutive correct answers at the same level with decreasing times also advance one level. Incorrect answers reduce the level by one. Level ten uses six-digit operands. Answering correctly at level ten completes practice.

Stop ends practice, saves a browser report, and downloads a PDF. Reports remain on the current browser/device; clearing browser data removes them. Download PDFs for permanent copies. File-origin storage varies by browser. There is no shared student database. PDF names use standard fonts and replace unsupported characters with question marks.

Run `node tests/smoke.cjs` with Playwright and Chromium installed. CHROMIUM_PATH can override /usr/bin/chromium. Tests disable browser networking after loading and verify practice, reports, and PDFs without external requests.
