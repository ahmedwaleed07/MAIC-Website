# Technical library expansion

The library contains ten specialties. The six technical specialties are cybersecurity, AI, cloud computing, advanced programming, cryptography and telecommunications. Each has twelve free full-PDF resources, including explicitly titled technical guidebooks where relevant. Existing management books remain intact.

Catalog metadata is in `data/library-books.json`. Public reading buttons link to the author or publisher's PDF; MAIC does not host or sell these files. Publisher/source links remain available on every card. Localized catalog titles do not change the language of the original PDF, which is shown separately.

Original cover URLs are used only when found on a primary source. Missing or failed images fall back to the MAIC red leather book with gold lettering. Unknown years/publishers and missing verified author biographies are identified rather than invented. Draft versions are marked in titles.

The same category allowlist is available to visitors, the administrator editor and server validation. New specialty names have translations in all29 locale packs. Publication and import support up to1MiB; the server counts UTF-8 bytes. Existing content revision checks remain unchanged.

Validation: `node tests/visitor-library.cjs` and `node tests/technical-library.cjs`.
