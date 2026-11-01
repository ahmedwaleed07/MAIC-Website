import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {catalog} from '../../_lib/learning.js';
const validId=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
async function parseJSON(request){
 const type=(request.headers.get('Content-Type')||'').split(';')[0];
 if(type!=='application/json')throw Error('invalid_content_type');
 if(Number(request.headers.get('Content-Length')||'0')>350000)throw Error('too_large');
 const reader=request.body?.getReader();if(!reader)throw Error('no_body');
 const chunks=[];let len=0;while(true){const {done,value}=await reader.read();if(done)break;len+=value.byteLength;if(len>350000){await reader.cancel();throw Error('too_large')}chunks.push(value)}
 const all=new Uint8Array(len);let pos=0;for(const c of chunks){all.set(c,pos);pos+=c.length}
 return JSON.parse(new TextDecoder().decode(all));
}
function normalizeQuestion(q,index,pages){
 if(!q||typeof q!=='object'||Array.isArray(q))throw Error('invalid_question_'+index);
 const txt=(s,min,max)=>typeof s==='string'&&s.trim().length>=min&&s.trim().length<=max?s.trim():null;
 const stem=txt(q.stem,30,750);
 if(!stem||!Array.isArray(q.options)||q.options.length!==4)throw Error('stem_or_four_options_'+index);
 const opts=q.options.map(v=>txt(v,2,300));
 if(opts.some(x=>!x)||new Set(opts.map(x=>x.toLocaleLowerCase('en'))).size!==4)throw Error('duplicate_options_'+index);
 const correct=q.correct;
 if(!Array.isArray(correct)||!correct.length||correct.length>4||new Set(correct).size!==correct.length||correct.some(x=>!Number.isInteger(x)||x<0||x>3))throw Error('correct_answer_'+index);
 const page=q.page;
 if(!Number.isInteger(page)||page<1||page>pages)throw Error('missing_source_page_'+index);
 const rationale=txt(q.rationale,15,1250);
 if(!rationale)throw Error('missing_explanation_'+index);
 return {stem,options:opts,mask:correct.reduce((m,i)=>m|(1<<i),0),page,rationale};
}
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const materials=(await env.MAIC_DB.prepare("SELECT m.course_id,m.title,m.pages,m.sha256,b.version,b.status,b.question_count,b.approved_at FROM learning_materials m LEFT JOIN learning_exam_active a ON a.course_id=m.course_id LEFT JOIN learning_exam_banks b ON b.course_id=a.course_id AND b.version=a.version ORDER BY m.title").all()).results;
  return json({materials,questionsRequired:100,answerOptions:4});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const d=await parseJSON(request),course=d.courseId,db=env.MAIC_DB;
  if(d.format!=='maic-mcq-v1'||!validId(course)||!Array.isArray(d.questions)||d.questions.length!==100)return json({error:'exactly_100_questions_required'},400);
  if(d.pdfFormatReviewed!==true||d.sourceReviewed!==true||d.academicQualityReviewed!==true)return json({error:'academic_and_pdf_review_required'},400);
  const reviewer=typeof d.reviewedBy==='string'?d.reviewedBy.trim():'';
  if(reviewer.length<3||reviewer.length>150)return json({error:'reviewer_required'},400);
  const m=await db.prepare('SELECT sha256,pages FROM learning_materials WHERE course_id=?').bind(course).first();
  if(!m||m.sha256!==d.sourceSha256)return json({error:'source_material_mismatch'},409);
  const doc=await catalog(db);
  if(!doc.courses.some(c=>c.id===course&&c.mode.includes('self-paced')&&c.status!=='archived'))return json({error:'course_not_self_paced'},409);
  let questions;
  try{
   questions=d.questions.map((q,i)=>normalizeQuestion(q,i+1,m.pages));
   const stems=new Set(questions.map(q=>q.stem.trim().toLocaleLowerCase('en')));
   if(stems.size!==100)throw Error('duplicate_stems');
  }catch(e){return json({error:String(e.message||e).slice(0,120)},400)}
  const version=crypto.randomUUID(),now=new Date().toISOString();
  await db.prepare("INSERT INTO learning_exam_banks(course_id,version,source_sha256,status,question_count,created_at) VALUES(?,?,?,'draft',0,?)").bind(course,version,m.sha256,now).run();
  try{
   for(let n=0;n<100;n+=12){
    const chunk=questions.slice(n,n+12);
    await db.batch(chunk.map((q,j)=>db.prepare('INSERT INTO learning_exam_questions(course_id,version,ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(course,version,n+j+1,q.stem,...q.options,q.mask,q.page,q.rationale)));
   }
   const count=await db.prepare('SELECT COUNT(*) AS n FROM learning_exam_questions WHERE course_id=? AND version=?').bind(course,version).first();
   if(count?.n!==100)return json({error:'incomplete_bank_saved_as_draft'},503);
   await db.batch([
    db.prepare("UPDATE learning_exam_banks SET status='approved',question_count=100,approved_by=?,approved_at=? WHERE course_id=? AND version=? AND status='draft'").bind(reviewer,now,course,version),
    db.prepare("INSERT INTO learning_exam_active(course_id,version,activated_at) VALUES(?,?,?) ON CONFLICT(course_id) DO UPDATE SET version=excluded.version,activated_at=excluded.activated_at").bind(course,version,now)
   ]);
   return json({published:true,courseId:course,version,questionCount:100});
  }catch{return json({error:'upload_incomplete_check_draft'},503)}
 }catch(e){return json({error:['too_large','invalid_content_type'].includes(String(e.message))?e.message:'invalid_or_unavailable'},400)}
}
