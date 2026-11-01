import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {body,catalog,randomHex} from '../../_lib/learning.js';
const modeSet=new Set(['self-paced','group','one-on-one']);
function okId(x){return typeof x==='string'&&/^[a-zA-Z0-9-]{8,100}$/.test(x)}
async function completion(db,id){return db.prepare("SELECT * FROM learning_completions WHERE id=?").bind(id).first()}
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const students=(await env.MAIC_DB.prepare("SELECT s.id,s.first_name,s.middle_name,s.last_name,s.country,e.course_id,e.status AS enrollment_status,e.agent_id,e.activated_at,COALESCE(m.delivery_mode,'self-paced') AS delivery_mode FROM learning_students s JOIN learning_enrollments e ON e.student_id=s.id LEFT JOIN learning_enrollment_modes m ON m.student_id=e.student_id AND m.course_id=e.course_id WHERE e.status='active' ORDER BY e.activated_at DESC LIMIT 500").all()).results;
  const completions=(await env.MAIC_DB.prepare("SELECT * FROM learning_completions ORDER BY created_at DESC LIMIT 500").all()).results;
  const certificates=(await env.MAIC_DB.prepare("SELECT id,certificate_number,completion_id,student_id,course_id,course_mode,certificate_type,graduate_full_name,course_title,verification_token,issued_at,status,CASE WHEN pdf_storage_key IS NULL THEN 0 ELSE 1 END AS pdf_ready FROM learning_certificates ORDER BY issued_at DESC LIMIT 500").all()).results;
  return json({students,completions,certificates,issuanceConfigured:env.MAIC_CERTIFICATE_ISSUANCE_ENABLED!=='false',approvedTemplate:'MAIC-COMPLETION-2026-11-01'});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const d=await body(request),db=env.MAIC_DB,now=new Date().toISOString();
  if(!['complete','verify','issue','revoke'].includes(d.action))return json({error:'invalid_action'},400);
  if(d.action==='revoke'){
   if(!okId(d.certificateId)||typeof d.reason!=='string'||d.reason.trim().length<5)return json({error:'invalid_revoke'},400);
   const result=await db.prepare("UPDATE learning_certificates SET status='revoked',revoked_at=?,revocation_reason=? WHERE id=? AND status='issued'").bind(now,d.reason.trim().slice(0,500),d.certificateId).run();
   return result.meta.changes===1?json({saved:true}):json({error:'not_found'},404);
  }
  if(!okId(d.studentId)||!/^[a-z0-9-]{2,80}$/.test(d.courseId||'')||!modeSet.has(d.mode))return json({error:'invalid_course'},400);
  const doc=await catalog(db),course=doc.courses.find(x=>x.id===d.courseId&&x.status!=='archived'&&x.mode.includes(d.mode));if(!course)return json({error:'course_mode_unavailable'},400);
  const enrolled=await db.prepare("SELECT e.agent_id,s.first_name,s.middle_name,s.last_name,s.country FROM learning_enrollments e JOIN learning_students s ON s.id=e.student_id WHERE e.student_id=? AND e.course_id=? AND e.status='active' AND s.enabled=1").bind(d.studentId,d.courseId).first();
  if(!enrolled)return json({error:'enrollment_inactive'},409);
  const selected=await db.prepare('SELECT delivery_mode FROM learning_enrollment_modes WHERE student_id=? AND course_id=?').bind(d.studentId,d.courseId).first();
  if((selected?.delivery_mode||'self-paced')!==d.mode)return json({error:'mode_mismatch'},409);
  const existing=await db.prepare("SELECT * FROM learning_completions WHERE student_id=? AND course_id=? AND mode=? AND run_id IS NULL").bind(d.studentId,d.courseId,d.mode).first();
  if(d.action==='complete'){
   if(typeof d.evidenceRef!=='string'||d.evidenceRef.trim().length<5||d.evidenceRef.length>500)return json({error:'evidence_required'},400);
   if(existing&&['verified','completed'].includes(existing.status))return json({error:'already_recorded'},409);
   if(existing){
    await db.prepare("UPDATE learning_completions SET status='completed',evidence_ref=?,completed_at=?,verified_at=NULL,verified_by=NULL WHERE id=?").bind(d.evidenceRef.trim(),now,existing.id).run();
   }else{
    await db.prepare("INSERT INTO learning_completions(id,student_id,course_id,mode,run_id,status,evidence_ref,completed_at) VALUES(?,?,?,?,NULL,'completed',?,?)").bind(crypto.randomUUID(),d.studentId,d.courseId,d.mode,d.evidenceRef.trim(),now).run();
   }
   return json({saved:true,status:'completed'});
  }
  if(!existing)return json({error:'completion_required'},409);
  if(d.action==='verify'){
   if(existing.status!=='completed')return json({error:'not_completed'},409);
   if(d.confirmEvidence!==true)return json({error:'confirmation_required'},400);
   await db.prepare("UPDATE learning_completions SET status='verified',verified_at=?,verified_by='MAIC Admin' WHERE id=? AND status='completed'").bind(now,existing.id).run();
   return json({saved:true,status:'verified'});
  }
  if(existing.status!=='verified')return json({error:'verification_required'},409);
  const prior=await db.prepare("SELECT certificate_number FROM learning_certificates WHERE completion_id=?").bind(existing.id).first();
  if(prior)return json({error:'certificate_exists',certificateNumber:prior.certificate_number},409);
  if(env.MAIC_CERTIFICATE_ISSUANCE_ENABLED==='false')return json({error:'issuance_paused'},503);
  if(d.confirmApprovedTemplate!==true)return json({error:'template_confirmation_required'},400);
  if(d.certificateType!=='completion')return json({error:'completion_template_only'},400);
  const agent=doc.agents.find(a=>a.id===enrolled.agent_id);if(!agent)return json({error:'agent_not_found'},409);
  const fullName=[enrolled.first_name,enrolled.middle_name,enrolled.last_name].filter(Boolean).join(' ');
  const number='MAIC-'+new Date().getUTCFullYear()+'-'+randomHex(6).toUpperCase(),token=randomHex(32),certificateId=crypto.randomUUID();
  await db.prepare("INSERT INTO learning_certificates(id,certificate_number,completion_id,student_id,course_id,course_mode,certificate_type,graduate_full_name,course_title,graduate_country,agent_id,agent_name,verification_token,status,public_consent,issued_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,'issued',0,?)").bind(certificateId,number,existing.id,d.studentId,d.courseId,d.mode,d.certificateType,fullName,course.en,enrolled.country,agent.id,agent.name,token,now).run();
  return json({saved:true,status:'awaiting_signed_pdf',certificateNumber:number,certificateId});
 }catch{return json({error:'unavailable'},503)}
}
