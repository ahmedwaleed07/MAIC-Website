'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cryptoNode = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const materialUrl = pathToFileURL(path.join(root,'functions/api/learner/material.js')).href;
const studyUrl = pathToFileURL(path.join(root,'functions/api/learner/study.js')).href;
const examUrl = pathToFileURL(path.join(root,'functions/api/learner/exam.js')).href;

class SQLiteD1Statement {
  constructor(statement){this.statement=statement;this.params=[];}
  bind(...params){this.params=params;return this;}
  async first(){return this.statement.get(...this.params)||null;}
  async all(){return {results:this.statement.all(...this.params)};}
  async run(){const result=this.statement.run(...this.params);return {meta:{changes:result.changes}};}
}
class SQLiteD1 {
  constructor(sqlite){this.sqlite=sqlite;}
  prepare(sql){return new SQLiteD1Statement(this.sqlite.prepare(sql));}
  async batch(statements){
    this.sqlite.exec('BEGIN IMMEDIATE');
    try{
      const results=[];
      for(const s of statements){
        const r=s.statement.run(...s.params);
        results.push({meta:{changes:r.changes}});
      }
      this.sqlite.exec('COMMIT');
      return results;
    }catch(error){this.sqlite.exec('ROLLBACK');throw error;}
  }
}
function fixture(){
  const sqlite=new DatabaseSync(':memory:');
  sqlite.exec('PRAGMA foreign_keys=ON');
  for(const name of ['0002_learner_materials.sql','0005_enrollment_modes.sql','0006_self_paced_exam.sql']){
    sqlite.exec(fs.readFileSync(path.join(root,'migrations',name),'utf8'));
  }
  sqlite.exec('CREATE TABLE cms_documents(id TEXT PRIMARY KEY, content TEXT NOT NULL)');
  const course='project-management', student='test-student-001',sessionToken='ab'.repeat(32);
  const doc={courses:[{id:course,en:'Project Management Foundations',ar:'أساسيات إدارة المشاريع',mode:['self-paced'],status:'preparing'}],agents:[]};
  sqlite.prepare("INSERT INTO cms_documents(id,content) VALUES('published',?)").run(JSON.stringify(doc));
  sqlite.prepare('INSERT INTO learning_students(id,email,first_name,last_name,dob,country,phone,education,password_salt,password_hash,enabled) VALUES(?,?,?,?,?,?,?,?,?,?,1)').run(student,'sample@example.invalid','Test','Learner','2000-01-01','IQ','+9647000000000','Bachelor','00','00');
  sqlite.prepare("INSERT INTO learning_enrollments(student_id,course_id,status,agent_id,confirmation_ref,activated_at,updated_at) VALUES(?,?,'active','test-agent','TEST-NONPROD','2026-11-02','2026-11-02')").run(student,course);
  sqlite.prepare("INSERT INTO learning_enrollment_modes(student_id,course_id,delivery_mode) VALUES(?,?,'self-paced')").run(student,course);
  const tokenHash=cryptoNode.createHash('sha256').update(sessionToken).digest('hex');
  sqlite.prepare('INSERT INTO learning_sessions(token_hash,student_id,expires_at) VALUES(?,?,?)').run(tokenHash,student,Math.floor(Date.now()/1000)+3600);
  const pdf=Buffer.from('%PDF-1.7\n% MAIC synthetic nonproduction material\n'+('Example educational text for integration testing only.\n'.repeat(50))+'%%EOF\n');
  const hash=cryptoNode.createHash('sha256').update(pdf).digest('hex');
  sqlite.prepare('INSERT INTO learning_materials(course_id,version,title,language,pages,bytes,sha256,chunk_count,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(course,'test-pdf-v1','Project Management Foundations','en',12,pdf.length,hash,1,'2026-11-02');
  sqlite.prepare('INSERT INTO learning_material_chunks(course_id,version,part,payload) VALUES(?,?,?,?)').run(course,'test-pdf-v1',0,pdf.toString('base64'));
  const env={MAIC_DB:new SQLiteD1(sqlite)};
  const headers={'Cookie':'__Host-maic_learner='+sessionToken};
  return {sqlite,env,course,student,pdf,hash,headers};
}
async function invoke(handler,fx,pathSuffix,method='GET',data,extraHeaders={}){
  const headers={...fx.headers,...extraHeaders};
  if(method==='POST'){headers['Origin']=headers['Origin']||'https://www.maic-edu.org';headers['Content-Type']='application/json';}
  const request=new Request('https://www.maic-edu.org'+pathSuffix,{method,headers,body:data?JSON.stringify(data):undefined});
  const response=await handler({request,env:fx.env});
  const value=response.headers.get('content-type')?.includes('application/json')?await response.json():await response.arrayBuffer();
  return {status:response.status,value};
}
test('ISOLATED student journey: PDF access, study, 100 MCQs, one-way navigation and final-only score',async()=>{
 const fx=fixture();
 const material=await import(materialUrl);
 const study=await import(studyUrl);
 const exam=await import(examUrl);
 try{
  let r=await invoke(exam.onRequestGet,fx,'/api/learner/exam?course='+fx.course);
  assert.equal(r.status,200);assert.equal(r.value.state,'pending');
  // Seed a test-only bank; it is never an academic examination or a production data insertion.
  const version='INMEMORY-100-ITEMS';
  fx.sqlite.prepare("INSERT INTO learning_exam_banks(course_id,version,source_sha256,status,question_count,approved_by,approved_at) VALUES(?,?,?,'approved',100,'INTEGRATION_TEST','2026-11-02')").run(fx.course,version,fx.hash);
  const row=fx.sqlite.prepare('INSERT INTO learning_exam_questions(course_id,version,ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
  for(let i=1;i<=100;i++)row.run(fx.course,version,i,'Synthetic sample question '+i+' — select both A and C.','Alpha','Beta','Gamma','Delta',5,(i%12)+1,'Synthetic rationale; testing code only.');
  fx.sqlite.prepare('INSERT INTO learning_exam_active(course_id,version,activated_at) VALUES(?,?,?)').run(fx.course,version,'2026-11-02');
  r=await invoke(exam.onRequestGet,fx,'/api/learner/exam?course='+fx.course);
  assert.equal(r.value.state,'study_required');
  r=await invoke(study.onRequestPost,fx,'/api/learner/study','POST',{action:'confirm-reviewed',course:fx.course,confirmed:true});
  assert.equal(r.status,409);assert.equal(r.value.error,'open_material_first');
  r=await invoke(material.onRequest,fx,'/api/learner/material?course='+fx.course);
  assert.equal(r.status,200);assert.deepEqual(Buffer.from(r.value),fx.pdf);
  r=await invoke(study.onRequestGet,fx,'/api/learner/study?course='+fx.course);
  assert.equal(r.value.opened,true);assert.equal(r.value.reviewed,false);
  r=await invoke(study.onRequestPost,fx,'/api/learner/study','POST',{action:'confirm-reviewed',course:fx.course,confirmed:true});
  assert.equal(r.status,200);assert.equal(r.value.reviewed,true);
  r=await invoke(exam.onRequestGet,fx,'/api/learner/exam?course='+fx.course);
  assert.equal(r.value.state,'ready');
  r=await invoke(exam.onRequestPost,fx,'/api/learner/exam','POST',{action:'start',course:fx.course});
  assert.equal(r.value.state,'in_progress');assert.equal(r.value.current,1);
  assert.equal(r.value.question.options.length,4);
  assert.equal('correct_mask' in r.value.question,false);
  assert.equal('rationale' in r.value.question,false);
  r=await invoke(exam.onRequestPost,fx,'/api/learner/exam','POST',{action:'next',course:fx.course,ordinal:1,selections:[0,2]});
  assert.equal(r.status,200);assert.equal(r.value.current,2);assert.equal('score' in r.value,false);
  r=await invoke(exam.onRequestPost,fx,'/api/learner/exam','POST',{action:'next',course:fx.course,ordinal:1,selections:[0,2]});
  assert.equal(r.status,409);assert.equal(r.value.error,'already_advanced');
  r=await invoke(exam.onRequestGet,fx,'/api/learner/exam?course='+fx.course);
  assert.equal(r.value.current,2);
  // 70 right answers (questions 1–70), 30 wrong answers (71–100).
  for(let n=2;n<=100;n++){
    r=await invoke(exam.onRequestPost,fx,'/api/learner/exam','POST',{action:'next',course:fx.course,ordinal:n,selections:n<=70?[0,2]:[1]});
    assert.equal(r.status,200,'response '+n+' '+JSON.stringify(r.value));
    if(n<100){assert.equal(r.value.state,'in_progress');assert.equal(r.value.current,n+1);assert.equal('score' in r.value,false);}
  }
  assert.equal(r.value.state,'submitted');assert.equal(r.value.correct,70);assert.equal(r.value.score,70);
  r=await invoke(exam.onRequestGet,fx,'/api/learner/exam?course='+fx.course);
  assert.equal(r.value.state,'submitted');assert.equal(r.value.correct,70);
  r=await invoke(exam.onRequestPost,fx,'/api/learner/exam','POST',{action:'next',course:fx.course,ordinal:100,selections:[0,2]});
  assert.equal(r.status,409);
  assert.equal(fx.sqlite.prepare('SELECT COUNT(*) AS n FROM learning_exam_answers').get().n,100);
  fx.sqlite.prepare("UPDATE learning_enrollments SET status='revoked' WHERE student_id=? AND course_id=?").run(fx.student,fx.course);
  r=await invoke(exam.onRequestGet,fx,'/api/learner/exam?course='+fx.course);
  assert.equal(r.status,403);
 }finally{fx.sqlite.close();}
});
test('synthetic learner is denied without auth, and cannot POST from cross-origin',async()=>{
 const fx=fixture();
 const exam=await import(examUrl);
 try{
  let r=await invoke(exam.onRequestGet,{...fx,headers:{}},'/api/learner/exam?course='+fx.course);
  assert.equal(r.status,401);
  r=await invoke(exam.onRequestPost,fx,'/api/learner/exam','POST',{action:'start',course:fx.course},{Origin:'https://evil.example'});
  assert.equal(r.status,403);
 }finally{fx.sqlite.close();}
});
