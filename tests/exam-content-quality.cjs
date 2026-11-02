const test=require('node:test'),assert=require('node:assert/strict');
const path=require('node:path'),{pathToFileURL}=require('node:url');
test('question similarity detector catches rephrased duplicates without changing learner UI',async()=>{
 const {countNearDuplicateQuestionPairs}=await import(pathToFileURL(path.resolve(__dirname,'../functions/_lib/exam-quality.js')).href);
 const weak=Array.from({length:32},(_,i)=>'A program director reviews the weekly project status report in week '+(i+1)+' and chooses the right improvement approach for the current schedule.');
 assert.ok(countNearDuplicateQuestionPairs(weak,0.85,12)>12);
 const varied=[
 'Identify which stakeholder should authorize the change when a project sponsor and vendor disagree over acceptance criteria.',
 'Which risks arise when actual customer lead time is measured from one team handoff instead of from initial request to confirmed delivery?',
 'Evaluate how training effectiveness differs from measuring the raw number of workshops completed during a six week period.',
 'A procurement manager finds multiple bidders whose quotations omit lifecycle support; how should the purchasing decision be documented?'
 ];
 assert.equal(countNearDuplicateQuestionPairs(varied,0.85,12),0);
 assert.throws(()=>countNearDuplicateQuestionPairs(new Array(101).fill('x')),/invalid_stems/);
});
