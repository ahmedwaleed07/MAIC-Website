// MAIC private academic-review utilities. Never expose correct masks to learner APIs.
export async function fingerprintExamItem(q){
 const content=JSON.stringify([
  q.stem,q.option_a,q.option_b,q.option_c,q.option_d,
  Number(q.correct_mask),Number(q.source_page),q.rationale
 ]);
 const bytes=new TextEncoder().encode(content);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export function reviewInputValid(d){
 return Number.isInteger(d.ordinal)&&d.ordinal>=1&&d.ordinal<=100&&
 ['approved','revise'].includes(d.verdict)&&
 typeof d.reviewNotes==='string'&&d.reviewNotes.trim().length>=25&&d.reviewNotes.trim().length<=2000&&
 typeof d.reviewedBy==='string'&&d.reviewedBy.trim().length>=3&&d.reviewedBy.trim().length<=150&&
 (d.verdict!=='approved'||d.sourceConfirmed===true&&d.keyConfirmed===true&&d.distractorsConfirmed===true);
}
export async function countVerifiedItemReviews(items,reviews,reviewer){
 const byNumber=new Map(reviews.map(r=>[r.ordinal,r]));
 let approved=0,requiresRevision=0;
 for(const item of items){
  const r=byNumber.get(item.ordinal);
  if(!r)continue;
  if(r.verdict==='revise'){requiresRevision++;continue;}
  if(r.verdict!=='approved'||r.reviewed_by?.trim().toLocaleLowerCase('en')!==reviewer.trim().toLocaleLowerCase('en')||
    !r.source_confirmed||!r.key_confirmed||!r.distractors_confirmed)continue;
  if(r.item_sha256===await fingerprintExamItem(item))approved++;
 }
 return {approved,requiresRevision,remaining:Math.max(0,100-approved)};
}
