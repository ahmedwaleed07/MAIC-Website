'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const get=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');

test('public exam catalog only exposes metadata, never private bank contents',()=>{
 const s=get('functions/api/exams/catalog.js');
 assert.match(s,/SELECT course_id FROM learning_exam_banks/);
 assert.match(s,/question_count=100/);
 assert.match(s,/return \{courseId:c\.id,titleEn:c\.en,titleAr:c\.ar,questionCount:100,access\}/);
 assert.doesNotMatch(s,/SELECT[^\n]*(stem|option_a|correct_mask|rationale)/);
 assert.match(s,/session\(request,env\)/);
 assert.match(s,/e\.status='active'/);
 assert.match(s,/b\.status='approved'/);
 assert.match(s,/m\.sha256=b\.source_sha256/);
 assert.match(s,/s\.confirmed_reviewed_at IS NOT NULL/);
});

test('learner exam authorization remains server-side and academic approval is mandatory',()=>{
 const s=get('functions/api/learner/exam.js');
 assert.match(s,/allowed\(db,student\.id,course\)/);
 assert.match(s,/b\.status='approved'/);
 assert.match(s,/b\.source_sha256/);
 assert.match(s,/chosen\.source_sha256===m\.sha256/);
 assert.match(s,/x\.studied/);
 assert.match(s,/state:'pending'/);
 assert.match(s,/SELECT ordinal,stem,option_a,option_b,option_c,option_d/);
 assert.doesNotMatch(s,/SELECT\s+.*correct_mask.*FROM learning_exam_questions WHERE course_id=\?/);
});

test('main site lists all titles and portal never links to a locked exam',()=>{
 const main=get('app.js'),portal=get('learner/portal.js');
 assert.match(main,/exams:renderExamCatalog/);
 assert.match(main,/maicExamCatalog\.map/);
 assert.match(main,/\.\/learner\/exam\.html\?course=/);
 assert.match(portal,/function renderExamAction\(c\)/);
 assert.match(portal,/access==='available'\|\|access==='study_required'/);
 assert.match(portal,/exam-locked/);
 assert.match(portal,/\$\{renderExamAction\(c\)\}/);
 assert.match(portal,/\/api\/exams\/catalog/);
});

test('agent confirmation and independent MAIC activation remain mandatory',()=>{
 const s=get('functions/api/admin/learners.js');
 assert.match(s,/d\.agentConfirmed!==true/);
 assert.match(s,/d\.identityVerified!==true/);
 assert.match(s,/d\.agentId!==agent\.id/);
 assert.match(s,/d\.confirmationRef\.trim\(\)\.length<3/);
 assert.match(s,/learning_audit/);
});
