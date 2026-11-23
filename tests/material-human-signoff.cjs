const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('independent material signoff is not a public API',async()=>{
 const m=await import(pathToFileURL(path.join(root,'functions/api/admin/material-signoff.js')).href);
 const req=new Request('https://maic-edu.org/api/admin/material-signoff');
 const result=await m.onRequestGet({request:req,env:{}});
 assert.equal(result.status,401);
 const post=await m.onRequestPost({request:new Request('https://maic-edu.org/api/admin/material-signoff',{method:'POST'}),env:{}});
 assert.equal(post.status,403);
});

test('real reviewer and owner attestation required for the exact PDF hash',()=>{
 const api=read('functions/api/admin/material-signoff.js');
 assert.match(api,/personOK/);
 assert.match(api,/openai\|codex\|chatgpt/);
 assert.match(api,/ownerAttestation!==true/);
 assert.match(api,/m\.sha256/);
 assert.match(api,/academic_signoffs/);
 assert.match(api,/isAdmin\(request,env\)/);
 assert.match(api,/validOrigin\(request\)/);
 const schema=read('migrations/0013_independent_material_academic_signoff.sql');
 assert.match(schema,/PRIMARY KEY\(course_id,source_sha256\)/);
 assert.match(schema,/reviewer_review_date/);
});

test('new catalog release demands human material signoff and no unresolved exam blocker',()=>{
 const code=read('functions/api/admin/content.js');
 assert.match(code,/learning_material_academic_signoffs/);
 assert.match(code,/human_academic_signoff/);
 assert.match(code,/independent_human_pdf_signoff/);
 assert.match(code,/learning_exam_quality_issues/);
 assert.match(code,/qi\.resolved_at IS NULL/);
 const report=read('functions/api/admin/course-readiness.js');
 assert.match(report,/material\.academic_pdf_signoff/);
 assert.match(report,/material\.technical_pdf_review/);
});
