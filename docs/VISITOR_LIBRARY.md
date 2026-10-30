# Visitor preferences and MAIC Library

The welcome screen requires a language and country of residence. Both are saved in the browser (`maic_lang`, `maic_country`). There is no IP geolocation. Visitors can later change their country from the language page; the agent directory uses the same country selection.

## Country messages

Admin → الرسائل والعروض → add a message, enter Arabic and English copy, select countries (none means global), optional UTC start/end timestamps, and activate it. Region presets expand into explicit country lists. Save the draft, review it, and publish using the existing CMS workflow. The client only displays active messages for the selected country and valid date window. This is public marketing personalization, not an access-control mechanism.

## Library

The library has Business Management, Project Management, Organizational Management, and Human Resources specializations. No books are prepopulated. Admin → مكتبة MAIC → add a book with a specialization, Arabic/English title and description, author, free/paid status, visibility, and a price/currency if paid.

- Free books require an HTTPS reading/download URL that the owner is authorized to distribute.
- Paid books show the price and an inquiry link addressed to the country-assigned agent. They do not collect payments or automatically deliver purchases. Paid book file URLs are discarded by the server validator and never exposed in the public catalog.
- New library UI labels are translated in all 29 locale packs. Administrator-authored book and campaign copy uses the supplied Arabic/English versions, consistent with the existing CMS.
- Existing CMS documents without books/messages remain supported. The new optional arrays use the same revision-controlled publish, history, export, and restore workflow.

Run targeted checks from the repository root: `node tests/visitor-library.cjs`.
