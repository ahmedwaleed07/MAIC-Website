'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const get=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const exists=p=>fs.existsSync(path.resolve(__dirname,'..',p));

test('all exam-bank catalog data stays off public site and public API',()=>{
 const main=get('app.js'),html=get('index.html');
 assert.equal(exists('functions/api/exams/catalog.js'),false);
 assert.equal(exists('exam-catalog-copy.js'),false);
 assert.equal(exists('exam-catalog.css'),false);
 assert.doesNotMatch(main,/exams:renderExamCatalog|renderExamCatalog|maicExamCatalog|\/api\/exams\/catalog/);
 assert.doesNotMatch(main,/NAV=\[[^\]]*['"]exams['"]/);
 assert.doesNotMatch(html,/exam-catalog/);
 assert.match(main,/exams:'courses'/); // Old bookmarked route returns to public courses.
 assert.match(main,/advisor:renderAcademicAdvisor/);
});

test('a logged-out visitor cannot query private learner exam access',async()=>{
 const source=get('functions/api/learner/exam-access.js');
 const factory=new Function('json','session',source.replace(/^import[^\n]*\n/m,'')+'\nreturn onRequestGet;');
 const handler=factory((data,status=200)=>({data,status}),async()=>null);
 const r=await handler({request:{headers:new Map()},env:{MAIC_DB:{}}});
 assert.equal(r.status,401);
 assert.deepEqual(r.data,{error:'login_required'});
});

test('only the authenticated learner receives their own eligible course IDs',async()=>{
 const source=get('functions/api/learner/exam-access.js');
 const calls=[];
 const db={prepare(sql){calls.push({type:'sql',sql});return {bind(id){calls.push({type:'bind',id});return {async all(){return {results:[{course_id:'project-management'}]}}}}}}};
 const factory=new Function('json','session',source.replace(/^import[^\n]*\n/m,'')+'\nreturn onRequestGet;');
 const handler=factory((data,status=200)=>({data,status}),async()=>({id:'student-test-id'}));
 const r=await handler({request:{},env:{MAIC_DB:db}});
 assert.equal(r.status,200);
 assert.deepEqual(r.data,{courses:['project-management']});
 assert.equal(calls.find(x=>x.type==='bind')?.id,'student-test-id');
 const sql=calls.find(x=>x.type==='sql')?.sql||'';
 assert.match(sql,/e\.status='active'/);
 assert.match(sql,/b\.status='approved'/);
 assert.match(sql,/b\.question_count=100/);
 assert.match(sql,/m\.sha256=b\.source_sha256/);
 assert.match(sql,/s\.confirmed_reviewed_at IS NOT NULL/);
 assert.match(sql,/COALESCE\(mode\.delivery_mode,'self-paced'\)='self-paced'/);
 assert.doesNotMatch(sql,/SELECT\s+\*/i);
 assert.doesNotMatch(sql,/q\.stem|correct_mask|option_[abcd]|question_count\s+AS/i);
});

test('the student sees Take the Exam only for their own currently enabled course',()=>{
 const portal=get('learner/portal.js'),html=get('learner/index.html');
 assert.match(portal,/function renderExamAction\(c\)/);
 assert.match(portal,/if\(!enabledExamCourses\.has\(c\.id\)\)return ''/);
 assert.match(portal,/Take the Exam/);
 assert.match(portal,/\$\{renderExamAction\(c\)\}/);
 assert.match(portal,/\/api\/learner\/exam-access/);
 assert.doesNotMatch(portal,/\/api\/exams\/catalog|Course Examinations|examText\(|examCopy\(/);
 assert.doesNotMatch(html,/exam-catalog/);
});

test('learner exam endpoints enforce enrollment and source-matched approved banks',()=>{
 const s=get('functions/api/learner/exam.js');
 assert.match(s,/allowed\(db,student\.id,course\)/);
 assert.match(s,/b\.status='approved'/);
 assert.match(s,/chosen\.source_sha256===m\.sha256/);
 assert.match(s,/x\.studied/);
 assert.match(s,/state:'pending'/);
 assert.match(s,/SELECT ordinal,stem,option_a,option_b,option_c,option_d/);
 assert.doesNotMatch(s,/SELECT\s+.*correct_mask.*FROM learning_exam_questions WHERE course_id=\?/);
});

test('agent verification and separate MAIC course activation remain mandatory',()=>{
 const s=get('functions/api/admin/learners.js');
 assert.match(s,/d\.agentConfirmed!==true/);
 assert.match(s,/d\.identityVerified!==true/);
 assert.match(s,/d\.agentId!==agent\.id/);
 assert.match(s,/d\.confirmationRef\.trim\(\)\.length<3/);
 assert.match(s,/learning_audit/);
});

test('agent contacts have readable mobile padding, including all four rows',()=>{
 const css=get('enrollment.css');
 assert.match(css,/\.maic-agent-card \.agent-contact-list>div\{[^}]*padding:17px 26px 18px/);
 assert.match(css,/@media\(max-width:720px\)\{\.maic-agent-card \.agent-contact-list>div\{padding:16px 20px 18px/);
 assert.match(css,/\.maic-agent-card \.agent-contact-list dd\{[^}]*overflow-wrap:anywhere/);
 assert.match(css,/\.maic-agent-card \.agent-contact-list dt\{[^}]*#cfdae3/);
});
