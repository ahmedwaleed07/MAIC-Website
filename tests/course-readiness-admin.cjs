const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('readiness report denies unauthenticated access',async()=>{
 const {onRequestGet}=await import(pathToFileURL(path.join(root,'functions/api/admin/course-readiness.js')).href);
 const res=await onRequestGet({request:new Request('https://maic-edu.org/api/admin/course-readiness'),env:{}});
 assert.equal(res.status,401);
 assert.equal((await res.json()).error,'unauthorized');
});

test('course readiness calculates state from D1 rather than assuming draft is release-ready',()=>{
 const api=read('functions/api/admin/course-readiness.js');
 assert.match(api,/learning_materials/);
 assert.match(api,/learning_material_revisions/);
 assert.match(api,/learning_exam_active/);
 assert.match(api,/learning_exam_item_reviews/);
 assert.match(api,/learning_exam_private_candidates/);
 assert.match(api,/reviewed_questions===100/);
 assert.match(api,/active\.source_sha256===material\.sha256/);
 assert.match(api,/active\.open_blockers===0/);
 assert.doesNotMatch(api,/active\.open_blockers===0&&!privateCandidate/);
 assert.match(api,/isAdmin\(request,env\)/);
 assert.doesNotMatch(api,/questions_json/);
});

test('owner view separates published and preparing course counts and never reveals exam keys',()=>{
 const html=read('admin/course-readiness.html');
 const js=read('admin/course-readiness.js');
 const nav=read('admin/index.html');
 assert.match(js,/counts\.published/);
 assert.match(js,/counts\.preparing/);
 assert.match(js,/\/api\/admin\/course-readiness/);
 assert.match(nav,/course-readiness.html/);
 assert.doesNotMatch(js,/correct_mask|option_a|option_b|option_c|option_d/);
 assert.match(html,/تقرير مباشر من قاعدة بيانات الأكاديمية/);
 assert.match(read('functions/api/admin/course-readiness.js'),/reviewBankVersion:reviewDraft/);
 assert.match(js,/\/admin\/exam-banks\.html\?course=/);
 assert.match(js,/reviewedDraftQuestions/);
 assert.match(js,/draftOpenBlockers/);
});
