const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const url=pathToFileURL(path.resolve(__dirname,'../functions/_lib/exam-item-review.js')).href;
test('per-question signoff fingerprints invalidate automatically after any source, key, or option change',async()=>{
 const {fingerprintExamItem,countVerifiedItemReviews,reviewInputValid}=await import(url);
 const q={ordinal:1,stem:'The source-based project acceptance question',option_a:'Verify agreed acceptance criteria',option_b:'Skip acceptance evidence',option_c:'Record the receiving owner',option_d:'Treat the final handover as optional',correct_mask:5,source_page:9,rationale:'Page 9 requires evidence, ownership, and technical as well as receiving-team handover.'};
 const hash=await fingerprintExamItem(q);
 const row={ordinal:1,verdict:'approved',reviewed_by:'Independent Reviewer',review_notes:'I checked the source page, full answer key and each alternative.',source_confirmed:1,key_confirmed:1,distractors_confirmed:1,item_sha256:hash};
 let status=await countVerifiedItemReviews([q],[row],'Independent Reviewer');
 assert.equal(status.approved,1);
 status=await countVerifiedItemReviews([{...q,correct_mask:1}],[row],'Independent Reviewer');
 assert.equal(status.approved,0);
 status=await countVerifiedItemReviews([{...q,option_b:'Another distractor'}],[row],'Independent Reviewer');
 assert.equal(status.approved,0);
 status=await countVerifiedItemReviews([{...q,rationale:'A different explanation'}],[row],'Independent Reviewer');
 assert.equal(status.approved,0);
 assert.equal(reviewInputValid({ordinal:1,verdict:'approved',reviewNotes:'The required individual explanation of the evidence.',reviewedBy:'Independent Reviewer',sourceConfirmed:true,keyConfirmed:true,distractorsConfirmed:false}),false);
 assert.equal(reviewInputValid({ordinal:1,verdict:'revise',reviewNotes:'The question needs a clearer and narrower case.',reviewedBy:'Independent Reviewer'}),true);
});
