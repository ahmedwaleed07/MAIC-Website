import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {fingerprintExamItem} from '../../_lib/exam-item-review.js';

const courseOK=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
const versionOK=x=>typeof x==='string'&&/^[\w-]{8,100}$/.test(x);
const nOK=x=>Number.isInteger(x)&&x>=1&&x<=100;
const clean=(s,min,max)=>typeof s==='string'&&s.trim().length>=min&&s.trim().length<=max?s.trim():null;
async function safeJSON(request,max=16000){
 const reader=request.body?.getReader();if(!reader)throw Error('missing_body');
 const parts=[];let total=0;
 for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>max){await reader.cancel();throw Error('payload_too_large')}parts.push(value)}
 const b=new Uint8Array(total);let offset=0;for(const p of parts){b.set(p,offset);offset+=p.length}
 return JSON.parse(new TextDecoder().decode(b));
}
function normalize(raw){
 if(!raw||typeof raw!=='object')throw Error('missing_question');
 const stem=clean(raw.stem,30,750),rationale=clean(raw.rationale,25,1250);
 const options=Array.isArray(raw.options)&&raw.options.length===4?raw.options.map(x=>clean(x,2,300)):null;
 const correct=raw.correct,page=raw.page;
 if(!stem||!rationale||!options||options.some(x=>!x)||new Set(options.map(x=>x.toLocaleLowerCase('en'))).size!==4||
    !Array.isArray(correct)||correct.length<1||correct.length>4||new Set(correct).size!==correct.length||
    correct.some(x=>!Number.isInteger(x)||x<0||x>3)||!Number.isInteger(page)||page<1||page>12)throw Error('invalid_question_data');
 return {stem,options,mask:correct.reduce((m,x)=>m|(1<<x),0),page,rationale};
}
async function lookup(db,course,version,ordinal){
 return db.prepare("SELECT q.* FROM learning_exam_questions q JOIN learning_exam_banks b ON b.course_id=q.course_id AND b.version=q.version WHERE q.course_id=? AND q.version=? AND q.ordinal=? AND b.status='draft'").bind(course,version,ordinal).first();
}
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const u=new URL(request.url),course=u.searchParams.get('course'),version=u.searchParams.get('version'),ordinal=Number(u.searchParams.get('ordinal'));
  if(!courseOK(course)||!versionOK(version)||!nOK(ordinal))return json({error:'invalid_question'},400);
  const row=await lookup(env.MAIC_DB,course,version,ordinal);if(!row)return json({error:'draft_item_not_found'},404);
  return json({course,version,ordinal,fingerprint:await fingerprintExamItem(row),
    question:{stem:row.stem,options:[row.option_a,row.option_b,row.option_c,row.option_d],correct:[0,1,2,3].filter(i=>row.correct_mask&(1<<i)),page:row.source_page,rationale:row.rationale}});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const d=await safeJSON(request),{courseId:course,version,ordinal}=d;
  if(!courseOK(course)||!versionOK(version)||!nOK(ordinal)||!(/^[a-f0-9]{64}$/.test(d.expectedHash||'')))return json({error:'invalid_question_identity'},400);
  const editor=clean(d.editor,3,150),reason=clean(d.reason,35,2000);
  if(!editor||!reason)return json({error:'editorial_reason_required'},400);
  let q;try{q=normalize(d.question)}catch(e){return json({error:e.message||'invalid_question'},400)}
  const db=env.MAIC_DB,existing=await lookup(db,course,version,ordinal);
  if(!existing)return json({error:'draft_item_not_found'},404);
  const previous=await fingerprintExamItem(existing);
  if(previous!==d.expectedHash)return json({error:'concurrent_item_change_refresh_required'},409);
  const next={stem:q.stem,option_a:q.options[0],option_b:q.options[1],option_c:q.options[2],option_d:q.options[3],correct_mask:q.mask,source_page:q.page,rationale:q.rationale};
  const updatedHash=await fingerprintExamItem(next);
  if(previous===updatedHash)return json({error:'no_substantive_change'},409);
  const now=new Date().toISOString();
  const results=await db.batch([
   db.prepare("UPDATE learning_exam_questions SET stem=?,option_a=?,option_b=?,option_c=?,option_d=?,correct_mask=?,source_page=?,rationale=? WHERE course_id=? AND version=? AND ordinal=? AND EXISTS(SELECT 1 FROM learning_exam_banks WHERE course_id=? AND version=? AND status='draft')")
    .bind(q.stem,...q.options,q.mask,q.page,q.rationale,course,version,ordinal,course,version),
   db.prepare('DELETE FROM learning_exam_item_reviews WHERE course_id=? AND version=? AND ordinal=?').bind(course,version,ordinal),
   db.prepare('INSERT INTO learning_exam_item_corrections(id,course_id,version,ordinal,previous_sha256,revised_sha256,editor,reason,corrected_at) VALUES(?,?,?,?,?,?,?,?,?)')
    .bind(crypto.randomUUID(),course,version,ordinal,previous,updatedHash,editor,reason,now)
  ]);
  if(results[0].meta?.changes!==1)throw Error('concurrent_change');
  return json({corrected:true,course,version,ordinal,newHash:updatedHash,reviewReset:true,reviewRequired:true});
 }catch(e){return json({error:e.message==='payload_too_large'?'payload_too_large':'unavailable'},503)}
}
