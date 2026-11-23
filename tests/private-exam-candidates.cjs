const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('private candidate API is auth-gated and read-only',async()=>{
 const api=read('functions/api/admin/exam-candidates.js');
 assert.match(api,/isAdmin\(request,env\)/);
 assert.match(api,/Cache-Control|import \{json,isAdmin\}/);
 assert.match(api,/learning_exam_private_candidates/);
 assert.match(api,/unreviewed_exposed_draft/);
 assert.doesNotMatch(api,/export async function onRequestPost/);
 const {onRequestGet}=await import(pathToFileURL(path.join(root,'functions/api/admin/exam-candidates.js')).href);
 const res=await onRequestGet({request:new Request('https://maic-edu.org/api/admin/exam-candidates?course=x'),env:{}});
 assert.equal(res.status,401);
});

test('private candidate read UI discloses release blockers and uses no public key URLs',()=>{
 const html=read('admin/exam-candidates.html');
 const js=read('admin/exam-candidates.js');
 assert.match(html,/مفاتيح هذه المسودات ظهرت سابقاً/);
 assert.match(js,/\/api\/admin\/exam-candidates/);
 assert.doesNotMatch(js,/\/data\/exam-drafts\//);
});

test('public project must not contain 100-item question drafts with answer keys',()=>{
 const directory=path.join(root,'data/exam-drafts');
 const names=fs.readdirSync(directory);
 assert.equal(names.filter(x=>x.endsWith('-100mcq.json')).length,0);
 assert.ok(names.includes('README.md'));
 const migration=read('migrations/0012_private_exam_candidate_staging.sql');
 assert.match(migration,/academic_status TEXT NOT NULL DEFAULT 'unreviewed'/);
});
