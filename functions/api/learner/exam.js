import {json,session,validOrigin,body,allowed,limited} from '../../_lib/learning.js';
const courseOK=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
const maskOf=indices=>{
 if(!Array.isArray(indices)||indices.length<1||indices.length>4||new Set(indices).size!==indices.length||
    indices.some(x=>!Number.isInteger(x)||x<0||x>3))return null;
 return indices.reduce((m,x)=>m|(1<<x),0);
};
async function context(db,student,course){
 if(!await allowed(db,student.id,course))return {error:'activation_required',code:403};
 const mode=await db.prepare('SELECT delivery_mode FROM learning_enrollment_modes WHERE student_id=? AND course_id=?').bind(student.id,course).first();
 if(mode&&mode.delivery_mode!=='self-paced')return {error:'not_self_paced',code:409};
 const m=await db.prepare('SELECT sha256 FROM learning_materials WHERE course_id=?').bind(course).first();
 if(!m)return {error:'material_not_ready',code:409};
 const active=await db.prepare("SELECT b.course_id,b.version,b.source_sha256,b.question_count,b.status FROM learning_exam_active a JOIN learning_exam_banks b ON a.course_id=b.course_id AND a.version=b.version WHERE a.course_id=? AND b.status='approved' AND b.question_count=100").bind(course).first();
 const study=await db.prepare('SELECT source_sha256,first_opened_at,confirmed_reviewed_at FROM learning_material_study WHERE student_id=? AND course_id=?').bind(student.id,course).first();
 return {material:m,bank:active&&active.source_sha256===m.sha256?active:null,studied:study?.source_sha256===m.sha256&&!!study?.first_opened_at&&!!study?.confirmed_reviewed_at};
}
async function attemptView(db,attempt){
 if(attempt.state==='submitted')return {state:'submitted',total:100,correct:attempt.correct_count,score:attempt.score_percent};
 if(attempt.state!=='in_progress'||attempt.current_question<1||attempt.current_question>100)return {state:'unavailable'};
 const q=await db.prepare('SELECT ordinal,stem,option_a,option_b,option_c,option_d FROM learning_exam_questions WHERE course_id=? AND version=? AND ordinal=?').bind(attempt.course_id,attempt.version,attempt.current_question).first();
 if(!q)return {state:'unavailable'};
 return {state:'in_progress',current:q.ordinal,total:100,question:{stem:q.stem,options:[q.option_a,q.option_b,q.option_c,q.option_d]}};
}
async function latest(db,student,course,bank){
 const prior=await db.prepare("SELECT * FROM learning_exam_attempts WHERE student_id=? AND course_id=? AND state='in_progress' ORDER BY started_at DESC LIMIT 1").bind(student.id,course).first();
 if(prior)return prior;
 if(!bank)return null;
 return db.prepare('SELECT * FROM learning_exam_attempts WHERE student_id=? AND course_id=? AND version=?').bind(student.id,course,bank.version).first();
}
export async function onRequestGet({request,env}){
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  const course=new URL(request.url).searchParams.get('course')||'';
  if(!courseOK(course))return json({error:'invalid_course'},400);
  const x=await context(env.MAIC_DB,student,course);if(x.error)return json({error:x.error},x.code);
  if(!x.bank)return json({state:'pending',total:100,reason:'approved_bank_pending'});
  if(!x.studied)return json({state:'study_required',total:100});
  const prior=await latest(env.MAIC_DB,student,course,x.bank);
  if(prior&&prior.source_sha256!==x.material.sha256)return json({state:'pending',reason:'material_updated'});
  if(prior)return json(await attemptView(env.MAIC_DB,prior));
  return json({state:'ready',total:100});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  if(await limited(request,env.MAIC_DB,'exam',250))return json({error:'rate_limited'},429);
  const d=await body(request),course=d.course;
  if(!courseOK(course)||!['start','next'].includes(d.action))return json({error:'invalid'},400);
  const db=env.MAIC_DB,x=await context(db,student,course);if(x.error)return json({error:x.error},x.code);
  if(!x.bank)return json({error:'approved_bank_pending'},409);
  if(!x.studied)return json({error:'study_required'},409);
  const previous=await latest(db,student,course,x.bank);
  if(previous&&(previous.version!==x.bank.version||previous.source_sha256!==x.material.sha256))return json({error:'attempt_requires_review'},409);
  if(d.action==='start'){
   if(previous)return json(await attemptView(db,previous));
   const id=crypto.randomUUID();
   await db.prepare("INSERT INTO learning_exam_attempts(id,student_id,course_id,version,source_sha256,state,current_question,started_at) VALUES(?,?,?,?,?,'in_progress',1,?) ON CONFLICT(student_id,course_id,version) DO NOTHING").bind(id,student.id,course,x.bank.version,x.material.sha256,new Date().toISOString()).run();
   const attempt=await latest(db,student,course,x.bank);if(!attempt)return json({error:'unavailable'},503);
   return json(await attemptView(db,attempt));
  }
  if(!previous||previous.state!=='in_progress')return json({error:'not_in_progress'},409);
  if(!Number.isInteger(d.ordinal)||d.ordinal!==previous.current_question)return json({error:'already_advanced',current:previous.current_question},409);
  const mask=maskOf(d.selections);if(mask===null)return json({error:'select_one_or_more'},400);
  const now=new Date().toISOString();
  // D1 batch executes in one transaction: the old question is never re-opened,
  // and the exact-match grade is only computed after question 100 is submitted.
  try{
   const results=await db.batch([
    db.prepare("INSERT INTO learning_exam_answers(attempt_id,ordinal,selected_mask,is_correct,answered_at) SELECT a.id,q.ordinal,?,CASE WHEN q.correct_mask=? THEN 1 ELSE 0 END,? FROM learning_exam_attempts a JOIN learning_exam_questions q ON q.course_id=a.course_id AND q.version=a.version AND q.ordinal=? WHERE a.id=? AND a.student_id=? AND a.state='in_progress' AND a.current_question=?").bind(mask,mask,now,d.ordinal,previous.id,student.id,d.ordinal),
    db.prepare("UPDATE learning_exam_attempts SET state=CASE WHEN current_question=100 THEN 'submitted' ELSE 'in_progress' END,correct_count=CASE WHEN current_question=100 THEN (SELECT COALESCE(SUM(is_correct),0) FROM learning_exam_answers WHERE attempt_id=?) ELSE NULL END,score_percent=CASE WHEN current_question=100 THEN (SELECT 100.0*COALESCE(SUM(is_correct),0)/100 FROM learning_exam_answers WHERE attempt_id=?) ELSE NULL END,submitted_at=CASE WHEN current_question=100 THEN ? ELSE NULL END,current_question=current_question+1 WHERE id=? AND student_id=? AND state='in_progress' AND current_question=? AND EXISTS(SELECT 1 FROM learning_exam_answers WHERE attempt_id=? AND ordinal=?)").bind(previous.id,previous.id,now,previous.id,student.id,d.ordinal,previous.id,d.ordinal)
   ]);
   if(results[0].meta?.changes!==1||results[1].meta?.changes!==1)return json({error:'already_advanced'},409);
  }catch{return json({error:'already_advanced'},409)}
  const fresh=await db.prepare('SELECT * FROM learning_exam_attempts WHERE id=? AND student_id=?').bind(previous.id,student.id).first();
  return json(await attemptView(db,fresh));
 }catch{return json({error:'unavailable'},503)}
}
