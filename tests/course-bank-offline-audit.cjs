const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {audit,score}=require('../tools/audit_course_bank.cjs');
function sample(i){return {stem:'In case '+i+' a project manager must decide which process to verify before authorizing this academic scenario?',options:['Check the observable evidence','Ignore the documented risk','Compare relevant outcomes','Skip any legal approval'],correct:[0,2],page:(i%11)+2,rationale:'Evidence-based controls and outcomes are essential to this synthetic example.'}}
test('MAIC bank audit accepts a structurally complete 100-MCQ draft while recording review warnings',()=>{
 const bank={format:'maic-mcq-v1',courseId:'project-management',sourceSha256:'a'.repeat(64),academicReviewed:false,releaseBlocked:true,questions:Array.from({length:100},(_,i)=>sample(i+1))};
 const result=audit(bank);
 assert.equal(result.errors.length,0);
 assert.equal(result.summary.questions,100);
 assert.equal(result.summary.answerCount['2'],100);
 assert.ok(result.warnings.some(x=>x.includes('not independently academically approved')));
 assert.ok(result.summary.nearSimilarStems.length>12);
});
test('MAIC bank audit rejects absent questions, malformed answer masks and duplicate options',()=>{
 const bank={format:'maic-mcq-v1',courseId:'project-management',sourceSha256:'a'.repeat(64),questions:[{stem:'Short?',options:['same','same','different','other'],correct:[4,4],page:0,rationale:''}]};
 const result=audit(bank);
 assert.ok(result.errors.some(x=>x.includes('Exactly 100')));
 assert.ok(result.errors.some(x=>x.includes('duplicate options')));
 assert.ok(result.errors.some(x=>x.includes('invalid multi-select')));
 assert.ok(result.errors.some(x=>x.includes('invalid page')));
});
test('similarity metric flags almost identical stems and does not flag unrelated scenarios',()=>{
 assert.ok(score('The same employee approval bottleneck affects this process','The same employee approval bottleneck affects these processes')>=0.85);
 assert.ok(score('Customer value includes waiting and rework','Strategic tradeoffs require choosing a target market')<0.85);
});
