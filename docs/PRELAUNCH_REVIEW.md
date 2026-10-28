# MAIC prelaunch review — 28 October 2026

The existing Cloudflare Pages review site remains the delivery target. No custom domain launch, student authentication, checkout or course access activation is introduced by this review.

## Changes

- Consolidated public navigation into Home, Courses, About, Agents, Help/FAQ, Contact, Languages and Michigan. Old course/contact routes redirect to the appropriate current page. Removed placeholder topic loops and local-only student registration from public navigation.
- Added four introductory self-paced catalog entries: project management, marketing, management and human resources. Each contains an overview, objectives, four syllabus units and prerequisites. They remain **in preparation**. Previous unrelated catalog records are archived rather than deleted.
- Course inquiries and contact actions use `info@maic-edu.org`. Country routing preserves ASAS 360° for Iraq and Unity Bridge Services LLC for the United States and international fallback.
- Search normalizes Arabic spelling and diacritics, searches bilingual and localized course content, deduplicates and ranks results, and supports arrow keys, Enter and Escape.
- Added flat SVG emblems without perspective or animated rotation. Removed requested heritage/government-sponsorship wording from the loading screen and removed the simulated nine-second loading delay.
- Consolidated the admin dashboard into five areas: Overview, Courses, Agents, Pages & Navigation, Backups & Restore. Publishing and preview each have a single global control. Removed duplicate copy/reset/publish actions, added course filtering and fixed draft-versus-published state tracking.
- Added local translation files for all 29 language choices. Includes page text, navigation, course objectives and syllabus, labels, search, alt text and accessibility labels. Country names and currency formatting use the selected locale. Arabic uses RTL layout. Proper company names, email addresses, native language names and emblem lettering remain identifiers.

## Validation

- JavaScript syntax and whitespace checks.
- 29 locales × 13 public routes: **377 render checks passed**, including strict checks for missing interface and catalog translation entries.
- Country-agent fallback and localized search checks passed for every locale.
- Public route, unique DOM ID, course count, Arabic/English search and contact-link checks passed.
- Admin tests with a mocked API passed for all five sections, editor save, dirty-state detection, one publish request, clean state after publishing and logout. These tests do not substitute for an owner-authenticated production session test.
- Browser checks exercised all 29 language buttons, Arabic search with keyboard navigation, and course detail rendering. Browser visual review covers loading screen, public catalog and dashboard.

## Before opening enrollment

Upload and review the actual lesson materials and assessments; set duration, instructor and fees; and connect the real student enrollment/access flow. Confirm that the Workspace mailbox receives mail. Translations were machine-assisted and manually spot-checked; language coverage and UI behavior were tested, but this is not certification by native-speaking editors in every language. Newly edited CMS text requires corresponding translation updates before publishing.

The existing server-side administrator session and authorization controls remain in place. Historical published CMS content is retained before the catalog migration.
