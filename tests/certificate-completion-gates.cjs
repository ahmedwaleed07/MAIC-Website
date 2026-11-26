// MAIC verified completion: isolated regression tests. No production learner is touched.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const code=fs.readFileSync(path.resolve(__dirname,'../functions/api/admin/completions.js'),'utf8')
 .replace(/^import .*?;\s*$/gm,'').replace(/export async function/g,'async function');
function testContext(){
 let exam=null,existing={id:'completion-test',status:'completed',mode:'self-paced'},writes=0;
 const db={
  prepare(sql){return {bind(){return {
   async first(){
    if(sql.includes('SELECT e.agent_id'))return {agent_id:'agent',first_name:'Test',middle_name:'',last_name:'Learner',country:'US'};
    if(sql.includes('SELECT delivery_mode'))return {delivery_mode:'self-paced'};
    if(sql.includes('SELECT * FROM learning_completions'))return existing;
    if(sql.includes('SELECT t.score_percent'))return exam;
    if(sql.includes('SELECT certificate_number'))return null;
    return null;
   },
   async run(){writes++;return {meta:{changes:1}};}
  }}}
 };
 const json=(data,status=200)=>({data,status});
 const handler=new Function('json','isAdmin','validOrigin','body','catalog','randomHex',code+'\nreturn onRequestPost;')(
  json,async()=>true,()=>true,async req=>req.data,
  async()=>({courses:[{id:'digital-transformation',status:'published',mode:['self-paced'],en:'Digital Transformation'}],agents:[{id:'agent',name:'Test Agent'}]}),()=>('a'.repeat(12))
 );
 const request=(action,extra={})=>({request:{data:{action,studentId:'student-test',courseId:'digital-transformation',mode:'self-paced',confirmEvidence:true,...extra}},env:{MAIC_DB:db}});
 return {handler,request,setExam:x=>exam=x,setCompletion:x=>existing=x,writes:()=>writes};
}
test('self-paced completion verification rejects enrollment without submitted exam',async()=>{
 const x=testContext(),r=await x.handler(x.request('verify',{confirmPassCriteria:true}));
 assert.equal(r.status,409);assert.equal(r.data.error,'submitted_course_exam_required');assert.equal(x.writes(),0);
});
test('a score alone does not constitute course-specific pass verification',async()=>{
 const x=testContext();x.setExam({score_percent:100,correct_count:100,submitted_at:'2026-11-26'});
 const r=await x.handler(x.request('verify'));
 assert.equal(r.status,400);assert.equal(r.data.error,'verified_course_pass_requirements_required');assert.equal(x.writes(),0);
});
test('authorized admin can verify when exam was submitted and course criteria attested',async()=>{
 const x=testContext();x.setExam({score_percent:85,correct_count:85,submitted_at:'2026-11-26'});
 const r=await x.handler(x.request('verify',{confirmPassCriteria:true}));
 assert.equal(r.status,200);assert.deepEqual(r.data,{saved:true,status:'verified'});assert.equal(x.writes(),1);
});
test('even previously verified completion cannot issue without a source-matched exam attempt',async()=>{
 const x=testContext();x.setCompletion({id:'completion-test',status:'verified',mode:'self-paced'});
 const r=await x.handler(x.request('issue',{certificateType:'completion',confirmApprovedTemplate:true}));
 assert.equal(r.status,409);assert.equal(r.data.error,'submitted_course_exam_required');assert.equal(x.writes(),0);
});
test('certificate verification remains QR-based and signed-PDF gated',()=>{
 const lookup=fs.readFileSync(path.resolve(__dirname,'../functions/graduates/[token].js'),'utf8');
 const renderer=fs.readFileSync(path.resolve(__dirname,'../admin/certificate-renderer.js'),'utf8');
 assert.match(lookup,/verification_token=\?/);assert.match(lookup,/pdf_storage_key/);
 assert.match(renderer,/pdfQR\(qr\)/);assert.match(renderer,/files.length!==3/);
});
