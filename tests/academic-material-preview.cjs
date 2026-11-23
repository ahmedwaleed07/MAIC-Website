const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('an unauthenticated visitor cannot request a source PDF or its headers',async()=>{
 const {onRequest}=await import(pathToFileURL(path.join(root,'functions/api/admin/material-preview.js')).href);
 for(const method of ['GET','HEAD']){
  const response=await onRequest({request:new Request('https://maic-edu.org/api/admin/material-preview?course=ui-ux-design',{method}),env:{}});
  assert.equal(response.status,401);
 }
});

test('owner preview is read-only, bound to a PDF hash, and has no shared cache',async()=>{
 const [{onRequest},{createSession}]=await Promise.all([
  import(pathToFileURL(path.join(root,'functions/api/admin/material-preview.js')).href),
  import(pathToFileURL(path.join(root,'functions/_lib/cms.js')).href)
 ]);
 const bytes=Buffer.from('%PDF-1.7\n'+('Academic review fixture, not a student course PDF. '.repeat(30))+'\n%%EOF');
 const calls=[];
 const meta={course_id:'ui-ux-design',version:'test-version',sha256:'a'.repeat(64),bytes:bytes.length,chunk_count:1,pages:12};
 const db={prepare(sql){
  calls.push(sql);
  return {bind(...params){
   return {
    first:async()=>meta,
    all:async()=>({results:[{part:0,payload:bytes.toString('base64')}]})
   };
  }};
 }};
 const env={MAIC_SESSION_SECRET:'exam-preview-ci-secret-1234567890123456789',MAIC_DB:db};
 const token=await createSession(env);
 const url='https://maic-edu.org/api/admin/material-preview?course=ui-ux-design&sha='+meta.sha256;
 const request=(method='GET',extras={})=>new Request(url,{method,headers:{Cookie:'__Host-maic_admin='+token,...extras}});
 const head=await onRequest({request:request('HEAD'),env});
 assert.equal(head.status,200);
 assert.equal(head.headers.get('Content-Type'),'application/pdf');
 assert.match(head.headers.get('Cache-Control'),/no-store/);
 assert.equal(head.headers.get('Content-Length'),String(bytes.length));
 assert.equal(calls.length,1,'HEAD should not retrieve chunks');
 const full=await onRequest({request:request(),env});
 assert.equal(full.status,200);
 assert.equal(Buffer.compare(Buffer.from(await full.arrayBuffer()),bytes),0);
 const partial=await onRequest({request:request('GET',{Range:'bytes=0-7'}),env});
 assert.equal(partial.status,206);
 assert.equal(Buffer.from(await partial.arrayBuffer()).toString(),'%PDF-1.7');
 const wrong=await onRequest({request:new Request(url.replace(meta.sha256,'b'.repeat(64)),{headers:{Cookie:'__Host-maic_admin='+token}}),env});
 assert.equal(wrong.status,409);
 assert.ok(calls.every(sql=>!sql.includes('learning_material_study')),'admin preview must not record a student as having studied the PDF');
});

test('reviewer UI supports exact PDF reference and ten questions per screen',()=>{
 const client=read('admin/exam-banks.js');
 assert.match(client,/\/api\/admin\/material-preview\?course=/);
 assert.match(client,/data\.bank\.source_sha256/);
 assert.match(client,/pageSize=10/);
 assert.match(client,/showPage\(\)/);
 assert.match(client,/questionBlocks\[i\]\.hidden/);
 assert.match(client,/review-item/);
 assert.match(client,/resolve-issue/);
 assert.match(client,/new URLSearchParams\(window\.location\.search\)/);
 assert.match(client,/await openDraft\(course,version\)/);
});
