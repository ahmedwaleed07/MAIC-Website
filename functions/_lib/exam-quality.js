// Pure, bounded academic-quality heuristic; not a substitute for human review.
// Detect high-overlap question stems even when a copied opening has been reworded.
function normalizeStem(text){
 return String(text).normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
}
function trigrams(text){
 const s=normalizeStem(text);
 const set=new Set();
 for(let i=0;i<=s.length-3;i++)set.add(s.slice(i,i+3));
 return set;
}
export function countNearDuplicateQuestionPairs(stems,threshold=0.85,stopAfter=12){
 if(!Array.isArray(stems)||stems.length>100||stems.some(s=>typeof s!=='string'))throw new Error('invalid_stems');
 const sets=stems.map(trigrams);
 let near=0;
 for(let i=0;i<sets.length;i++){
  for(let j=i+1;j<sets.length;j++){
   const left=sets[i],right=sets[j];
   const total=left.size+right.size;
   if(!total||2*Math.min(left.size,right.size)/total<threshold)continue;
   let shared=0;
   const smaller=left.size<right.size?left:right,larger=left.size<right.size?right:left;
   for(const gram of smaller){if(larger.has(gram))shared++;}
   if(2*shared/total>=threshold && ++near>stopAfter)return near;
  }
 }
 return near;
}
