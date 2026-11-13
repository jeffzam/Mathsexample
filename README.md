# Addition Studio — no API required

Open index.html, enter a student name, and start. All ten adaptive addition levels, timing, grading, corrections, and PDF reports run locally. No API key, subscription, external scripts, or AI service is used. Download the HTML file for offline use; the hosted website needs internet only to load initially.

Every correct answer advances one level regardless of response time. Mistakes keep the student at the same level with a correction and another exercise. Timing is recorded for reporting only. Levels progress through 1 + 1; 1 + 8 or 9; 10–19; 20–49; 50–99; three-digit; four-digit; lower five-digit; upper five-digit; and six-digit operands. Answering correctly at level ten completes practice.

Stop ends practice, saves a browser report, and downloads a PDF. Reports remain on the current browser/device; clearing browser data removes them. Download PDFs for permanent copies. File-origin storage varies by browser. There is no shared student database. PDF names use standard fonts and replace unsupported characters with question marks.

Run `node tests/smoke.cjs` with Playwright and Chromium installed. CHROMIUM_PATH can override /usr/bin/chromium. Tests disable browser networking after loading and verify practice, reports, and PDFs without external requests.
