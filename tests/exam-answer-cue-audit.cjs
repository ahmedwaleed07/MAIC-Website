const test=require('node:test'),assert=require('node:assert/strict');
const path=require('node:path'),{pathToFileURL}=require('node:url');
test('MAIC refuses template-marked answer banks until substantive editing',async()=>{
 const {checkTemplateDraftCues}=await import(pathToFileURL(path.resolve(__dirname,'../functions/_lib/exam-quality.js')).href);
 const q=(i,rationale,options)=>({stem:'A realistic academic question '+i+' about the specific project framework',options,rationale});
 const templated=Array.from({length:100},(_,i)=>q(i,'This is an AI-assisted draft; independent review required.',[
  'An evidence-supported response unique to case '+i,
  'Assume that all risks are solved by the chosen result',
  'Ignore remaining uncertainties and skip the review',
  'A second evidence-supported response '+i]));
 const observed=checkTemplateDraftCues(templated);
 assert.equal(observed.draftingDisclaimers,100);
 assert.equal(observed.stronglyCueDominatedItems,100);
 assert.equal(observed.canApprove,false);
 const cleaned=Array.from({length:100},(_,i)=>q(i,'Specific source-verified rationale supported by individual facts '+i,[
  'Identify the approved objective and impacted stakeholder '+i,
  'Compare time and resource tradeoffs in the case '+i,
  'Confirm evidence of the current operational constraint '+i,
  'Obtain documented acceptance against the agreed criterion '+i]));
 const safe=checkTemplateDraftCues(cleaned);
 assert.equal(safe.draftingDisclaimers,0);
 assert.equal(safe.stronglyCueDominatedItems,0);
 assert.equal(safe.canApprove,true);
});
test('Approval endpoint must request rationale and reject cue-dominated drafts',()=>{
 const fs=require('node:fs');
 const src=fs.readFileSync(path.resolve(__dirname,'../functions/api/admin/exam-banks.js'),'utf8');
 assert.match(src,/checkTemplateDraftCues/);
 assert.match(src,/draftingCues\.canApprove/);
 assert.match(src,/SELECT ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale/);
});


test('MAIC blocks excessive longest-correct-answer patterns while allowing balanced answer lengths',async()=>{
 const {checkAnswerLengthBias}=await import(pathToFileURL(path.resolve(__dirname,'../functions/_lib/exam-quality.js')).href);
 const options=[
  'Evaluate the authenticated source, consent, effective dates, scope and event context before deciding on an obligation.',
  'Use the last reported signing date.',
  'Use the earlier training summary.',
  'Use the agreement short title.'
 ];
 const biased=Array.from({length:100},(_,i)=>({options,correct_mask:1}));
 const flagged=checkAnswerLengthBias(biased);
 assert.equal(flagged.singleAnswerCount,100);
 assert.equal(flagged.correctIsUniquelyLongest,100);
 assert.equal(flagged.canApprove,false);
 const mixed=Array.from({length:100},(_,i)=>({options,mask:1<<(i%4)}));
 const ok=checkAnswerLengthBias(mixed);
 assert.equal(ok.correctIsUniquelyLongest,25);
 assert.equal(ok.correctLongestRate,25);
 assert.equal(ok.canApprove,true);
 assert.equal(checkAnswerLengthBias([{options,correct:[0,2]}]).singleAnswerCount,0);
 assert.throws(()=>checkAnswerLengthBias(new Array(101).fill({options,mask:1})),/invalid_questions/);
});
