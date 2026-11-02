const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const cryptoNode=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const {pathToFileURL}=require('node:url');

const root=path.resolve(__dirname,'..');
class Statement{
 constructor(prepared){this.prepared=prepared;this.args=[]}
 bind(...values){this.args=values;return this}
 async first(){return this.prepared.get(...this.args)||null}
 async all(){return {results:this.prepared.all(...this.args)}}
 async run(){const r=this.prepared.run(...this.args);return {meta:{changes:r.changes}}}
}
class D1{
 constructor(sqlite){this.sqlite=sqlite}
 prepare(sql){return new Statement(this.sqlite.prepare(sql))}
 async batch(commands){
  this.sqlite.exec('BEGIN IMMEDIATE');
  try{
   const results=[];
   for(const cmd of commands){const r=cmd.prepared.run(...cmd.args);results.push({meta:{changes:r.changes}})}
   this.sqlite.exec('COMMIT');return results;
  }catch(e){this.sqlite.exec('ROLLBACK');throw e}
 }
}
async function fixture(){
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec('PRAGMA foreign_keys=ON');
 for(const f of ['0002_learner_materials.sql','0006_self_paced_exam.sql','0008_exam_two_stage_review.sql']){
  sqlite.exec(fs.readFileSync(path.join(root,'migrations',f),'utf8'));
 }
 sqlite.exec('CREATE TABLE cms_documents(id TEXT PRIMARY KEY, content TEXT NOT NULL)');
 sqlite.prepare("INSERT INTO cms_documents VALUES('published',?)").run(JSON.stringify({courses:[{id:'project-management',en:'Project Management',ar:'إدارة المشاريع',status:'preparing',mode:['self-paced']}],agents:[]}));
 sqlite.prepare('INSERT INTO learning_materials(course_id,version,title,language,pages,bytes,sha256,chunk_count,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run('project-management','v1','Project Management','en',12,200000,'a'.repeat(64),1,'2026-11-02');
 const env={MAIC_DB:new D1(sqlite),MAIC_SESSION_SECRET:'local-integration-secret-with-no-production-use'};
 const {createSession}=await import(pathToFileURL(path.join(root,'functions/_lib/cms.js')).href);
 const cookie='__Host-maic_admin='+await createSession(env);
 const {onRequestPost,onRequestGet}=await import(pathToFileURL(path.join(root,'functions/api/admin/exam-banks.js')).href);
 return {sqlite,env,cookie,onRequestPost,onRequestGet};
}
async function call(fx,method,data,search='',override={}){
 const headers={Cookie:fx.cookie,Origin:'https://www.maic-edu.org','Content-Type':'application/json',...override};
 const request=new Request('https://www.maic-edu.org/api/admin/exam-banks'+search,{method,headers,body:method==='POST'?JSON.stringify(data):undefined});
 const r=await (method==='POST'?fx.onRequestPost:fx.onRequestGet)({request,env:fx.env});
 return {status:r.status,body:await r.json()};
}
function question(i){
 const unique=cryptoNode.createHash('sha256').update('independent-test-question-'+i).digest('hex').slice(0,40);
 return {stem:unique+' How should an academic reviewer distinguish this project process and its outcome?',options:['Result based on documented evidence in case '+i,'Unsupported absolute guarantee for case '+i,'Verified decision point in case '+i,'Unrelated variable for case '+i],correct:[0,2],page:i%12+1,rationale:'This is a strictly synthetic training fixture, not a real exam answer.'};
}
test('drafting 100 source-verified questions cannot activate exam without a different reviewer',async()=>{
 const fx=await fixture();
 try{
  let response=await call(fx,'GET',null,'',{Cookie:''});assert.equal(response.status,401);
  response=await call(fx,'POST',{action:'stage'},'',{Origin:'https://hostile.example'});assert.equal(response.status,403);
  response=await call(fx,'POST',{action:'stage',courseId:'project-management',format:'maic-mcq-v1',sourceSha256:'a'.repeat(64),preparedBy:'First Academic',questions:Array.from({length:100},(_,i)=>question(i+1))});
  assert.equal(response.status,200,JSON.stringify(response.body));assert.equal(response.body.staged,true);assert.equal(response.body.approved,false);
  const version=response.body.version;
  assert.equal(fx.sqlite.prepare("SELECT COUNT(*) AS n FROM learning_exam_active").get().n,0);
  assert.equal(fx.sqlite.prepare("SELECT status FROM learning_exam_banks WHERE version=?").get(version).status,'draft');
  assert.equal(fx.sqlite.prepare("SELECT COUNT(*) AS n FROM learning_exam_questions WHERE version=?").get(version).n,100);
  response=await call(fx,'GET',null,'?course=project-management&version='+encodeURIComponent(version));
  assert.equal(response.status,200);assert.equal(response.body.sourceMatch,true);assert.equal(response.body.questions.length,100);
  assert.deepEqual(response.body.questions[0].correct,[0,2]);
  const approval={action:'approve',courseId:'project-management',version,reviewedBy:'First Academic',reviewNotes:'All one hundred sample questions and answers were reviewed for the technical fixture.',pdfFormatReviewed:true,sourceReviewed:true,academicQualityReviewed:true};
  response=await call(fx,'POST',approval);assert.equal(response.status,409);assert.equal(response.body.error,'independent_reviewer_required');
  response=await call(fx,'POST',{...approval,reviewedBy:'Second Academic',sourceReviewed:false});assert.equal(response.status,409);
  assert.equal(fx.sqlite.prepare('SELECT COUNT(*) AS n FROM learning_exam_active').get().n,0);
  response=await call(fx,'POST',{...approval,reviewedBy:'Second Academic'});
  assert.equal(response.status,200,JSON.stringify(response.body));assert.equal(response.body.approved,true);
  assert.equal(fx.sqlite.prepare('SELECT COUNT(*) AS n FROM learning_exam_active').get().n,1);
  assert.equal(fx.sqlite.prepare('SELECT status,approved_by FROM learning_exam_banks WHERE version=?').get(version).approved_by,'Second Academic');
  response=await call(fx,'POST',{...approval,reviewedBy:'Third Academic'});assert.equal(response.status,409);
  response=await call(fx,'POST',{action:'withdraw',courseId:'project-management'});
  assert.equal(response.status,200);assert.equal(fx.sqlite.prepare('SELECT COUNT(*) AS n FROM learning_exam_active').get().n,0);
 }finally{fx.sqlite.close()}
});
test('academic approval rejects source drift after draft upload',async()=>{
 const fx=await fixture();
 try{
  let r=await call(fx,'POST',{action:'stage',courseId:'project-management',format:'maic-mcq-v1',sourceSha256:'a'.repeat(64),preparedBy:'Preparer One',questions:Array.from({length:100},(_,i)=>question(i+1))});
  assert.equal(r.status,200);const version=r.body.version;
  fx.sqlite.prepare('UPDATE learning_materials SET sha256=? WHERE course_id=?').run('b'.repeat(64),'project-management');
  r=await call(fx,'POST',{action:'approve',courseId:'project-management',version,reviewedBy:'Independent Two',reviewNotes:'Reviewed all 100 questions and the source PDF, with a second academic reading.',pdfFormatReviewed:true,sourceReviewed:true,academicQualityReviewed:true});
  assert.equal(r.status,409);assert.equal(r.body.error,'source_material_mismatch');
  assert.equal(fx.sqlite.prepare('SELECT COUNT(*) AS n FROM learning_exam_active').get().n,0);
 }finally{fx.sqlite.close()}
});
