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


// More important than superficial stem rewriting: detect recurring answer sets.
// Reusing 3+ unchanged distractors across many items can make answers predictable.
export function countOverlappingOptionPairs(questions,minOverlap=3,stopAfter=12){
 if(!Array.isArray(questions)||questions.length>100||questions.some(q=>!q||!Array.isArray(q.options)||q.options.length!==4))throw new Error('invalid_options');
 const sets=questions.map(q=>new Set(q.options.map(normalizeStem)));
 let pairs=0;
 for(let i=0;i<sets.length;i++){
  for(let j=i+1;j<sets.length;j++){
   let shared=0;
   for(const option of sets[i])if(sets[j].has(option))shared++;
   if(shared>=minOverlap&&++pairs>stopAfter)return pairs;
  }
 }
 return pairs;
}


// Check answer-cue leakage in machine-structured MCQs. A high count means the
// questions are solvable from stylistic red flags instead of the course content.
// This is a minimum release gate, not a replacement for independent academic review.
export function checkTemplateDraftCues(questions){
 if(!Array.isArray(questions)||questions.length>100||
    questions.some(q=>!q||typeof q.stem!=='string'||!Array.isArray(q.options)||q.options.length!==4))
   throw new Error('invalid_questions');
 const cue=/^(?:assume that|substitute a favorable|treat the (?:decision|observation|listed)|use the (?:observation|shortcut|absence)|choose the desired|claim that|ignore (?:whether|remaining)|allow the final|prefer the common|conclude that)\b/i;
 let draftingDisclaimers=0,flaggedItemCount=0,stronglyCueDominatedItems=0;
 for(const q of questions){
  if(/this is an ai-assisted draft/i.test(String(q.rationale||'')))draftingDisclaimers++;
  const n=q.options.filter(o=>cue.test(String(o))).length;
  if(n>=1)flaggedItemCount++;
  if(n>=2)stronglyCueDominatedItems++;
 }
 return {draftingDisclaimers,flaggedItemCount,stronglyCueDominatedItems,canApprove:draftingDisclaimers===0&&stronglyCueDominatedItems<=12};
}


// Catch a systematic cue where the only correct option is consistently the longest.
// This checks answer positioning/length only; correctness remains for an independent reviewer.
export function checkAnswerLengthBias(questions){
 if(!Array.isArray(questions)||questions.length>100)throw new Error('invalid_questions');
 let singleAnswerCount=0,correctIsUniquelyLongest=0;
 for(const q of questions){
  const options=q?.options||[q?.option_a,q?.option_b,q?.option_c,q?.option_d];
  if(!Array.isArray(options)||options.length!==4||options.some(x=>typeof x!=='string'))throw new Error('invalid_options');
  const mask=Number.isInteger(q.correct_mask)?q.correct_mask:Number.isInteger(q.mask)?q.mask:
   Array.isArray(q.correct)?q.correct.reduce((m,i)=>m|(1<<i),0):null;
  if(![1,2,4,8].includes(mask))continue;
  singleAnswerCount++;
  const correctIndex=Math.log2(mask),correctLength=options[correctIndex].trim().length;
  if(options.every((opt,i)=>i===correctIndex||correctLength>opt.trim().length))correctIsUniquelyLongest++;
 }
 const correctLongestRate=singleAnswerCount?Math.round(1000*correctIsUniquelyLongest/singleAnswerCount)/10:0;
 // 55% is considerably above the ~25% neutral baseline for four options;
 // require a meaningful sample before automatically blocking an approval.
 return {singleAnswerCount,correctIsUniquelyLongest,correctLongestRate,
  canApprove:singleAnswerCount<20||correctLongestRate<=55};
}
