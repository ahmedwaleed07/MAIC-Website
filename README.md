# Michigan Academy of Innovation and Creativity (MAIC)

## Live pre-launch preview

https://maic-website.pages.dev

Deployed independently on Cloudflare Pages from the `main` branch of `ahmedwaleed07/MAIC-Website`. This is a preview, **not** the official launch. Authentication and enrollment are demonstrative; Unity Bridge Services LLC is configured as the United States agent and worldwide fallback, while Iraq is assigned to ASAS 360° within the project's authorization plan. Full native-language translations and legally verified agent publication remain subject to review. `robots.txt` blocks indexing until launch approval.

Independent, responsive website prototype with midnight-navy and antique-gold MAIC identity. This repository contains the actual source code for the prototype, not a screenshot.

## Preview locally

Open `index.html` in a browser or serve it from the repository root:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. No framework, build step, dependencies or API keys are required.

## Features in this prototype

- Owner-approved MAIC crest artwork without new logo generation
- Michigan-themed illustrative backdrop and translucent navy overlays
- Desktop/mobile menus and Cambridge-inspired navigation organization, adapted to MAIC (no Cambridge affiliation)
- 29 language and regional options, Arabic first, with site-navigation translations; full professional translation of all content is **not** complete
- American-English default copy, stable left-to-right element placement when switching to Arabic
- Michigan city clock and optional live weather from Open-Meteo (only when internet is available)
- Search/navigation among site sections and country entries; agent-routing preview: US and countries without active local agent → Unity Bridge Services LLC; configured Iraq assignment → ASAS 360°
- Local demonstration-only account state (not a secure authentication service)
- Course directory: Self-Paced Online, Live Group Classes, One-to-One Private Classes. Course topics remain **in preparation**.
- Enrollment-flow preview with country-assigned agent, agent-exclusive payment instruction, and MAIC-only course activation. No enrollment records or payments are processed.
- Accessibility features and reduced-motion handling

## Not ready for a public production launch

Real authentication, a MAIC-specific enrollment database and administration/agent access control, real educational program information, signed/verified agent appointments, full translations and localized copy QA, privacy/terms, claims validation, and backend infrastructure are required. See [Enrollment Policy](docs/ENROLLMENT_POLICY.md). No exam-provider affiliation or official accreditation is implied by the UI.

## Deployment

Static files. Netlify: publish repository root with no build command. Cloudflare Pages: same. GitHub Pages: enable Pages on the `main` branch and the root folder in repository settings. Do not assume a public site URL is active before deployment is confirmed.

## Assets

- `assets/maic-official-crest.png`: carefully prepared cropped version of the user-supplied approved official MAIC artwork; artwork itself unchanged
- `assets/michigan-heritage-montage.webp`: project-specific illustrative montage, not a geographically accurate photograph

## Agent directory record specification

`countryCode`, `officialName`, `contactPerson`, `logoOrPhoto`, `email`, optional `website`, `telephone`, `address`, `verified`, `publishedAt`.

No private data, credentials or real agent records are stored in the repository.
