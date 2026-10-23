# Michigan Academy of Innovation and Creativity (MAIC)

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
- Search/navigation among site sections, 249 country entries, authorized-agent page showing **no invented agents**
- Local demonstration-only account state (not a secure authentication service)
- Accessibility features and reduced-motion handling

## Not ready for a public production launch

Real authentication, real educational program information, legally approved agent records, full translations and localized copy QA, privacy/terms, claims validation, and backend infrastructure are required. No exam-provider affiliation or official accreditation is implied by the UI.

## Deployment

Static files. Netlify: publish repository root with no build command. Cloudflare Pages: same. GitHub Pages: enable Pages on the `main` branch and the root folder in repository settings. Do not assume a public site URL is active before deployment is confirmed.

## Assets

- `assets/maic-official-crest.png`: carefully prepared cropped version of the user-supplied approved official MAIC artwork; artwork itself unchanged
- `assets/michigan-heritage-montage.webp`: project-specific illustrative montage, not a geographically accurate photograph

## Agent directory record specification

`countryCode`, `officialName`, `contactPerson`, `logoOrPhoto`, `email`, optional `website`, `telephone`, `address`, `verified`, `publishedAt`.

No private data, credentials or real agent records are stored in the repository.
