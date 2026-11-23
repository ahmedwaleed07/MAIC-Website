const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('only authenticated MAIC owner may download academic manuscripts',async()=>{
 const {onRequestGet}=await import(pathToFileURL(path.join(root,'functions/api/admin/manuscripts.js')).href);
 const request=new Request('https://maic-edu.org/api/admin/manuscripts?course=sustainable-cities');
 const res=await onRequestGet({request,env:{}});
 assert.equal(res.status,401);
 const code=read('functions/api/admin/manuscripts.js');
 assert.match(code,/isAdmin\(request,env\)/);
 assert.match(code,/Content-Disposition/);
 assert.match(code,/Cache-Control/);
 assert.match(code,/admin_only/);
 assert.doesNotMatch(code,/export async function onRequestPost/);
});

test('no complete course source documents remain in public repository',()=>{
 const names=fs.readdirSync(path.join(root,'data/course-manuscripts'));
 assert.deepEqual(names.filter(n=>n.endsWith('.md')),['README.md']);
 assert.match(read('data/course-manuscripts/README.md'),/learning_material_private_manuscripts/);
});

test('existing student PDFs remain in controlled learning system, not public manuscript route',()=>{
 const code=read('functions/api/learner/material.js');
 assert.match(code,/learning_materials|learning_material_chunks/);
 const page=read('admin/manuscripts.html');
 assert.match(page,/النسخ الأصلية الخاصة/);
});
