# MAIC academic source manuscripts: restricted storage

The complete original manuscript files for the 34 new MAIC course manuals were moved into MAIC's Cloudflare D1 table `learning_material_private_manuscripts` on 23 November 2026. Verification confirmed **34 complete manuscripts**, each with **12 sections**, and a matching source Git blob SHA against the original confidential examination draft.

The manuscripts are no longer meant to be distributed through public GitHub or Cloudflare Pages static assets. They remain accessible to authenticated academy owners at `/admin/manuscripts.html`; their PDF versions are recorded in `learning_materials` and accessed by authorized MAIC learner services.

**Historical Git commits still include earlier content.** Deleting tracked files from the current branch does not erase the historical public exposure. Do not claim that source text was never public.

To revise a course, download the source from the authenticated admin route, edit and academically review the revised material, render a new PDF using the local MAIC academic PDF tool, and upload it with the correct review/signoff and source hash. Do not re-add manuscripts or answer keys to public source control.

A CI policy at `tools/check_no_public_manuscripts.py` rejects reintroduced source books.
