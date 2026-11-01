import {json,session,validOrigin,body,catalog,allowed} from '../../_lib/learning.js';
export async function onRequestGet({request,env}){
 try{
  const student=await session(request,env);
  if(!student)return json({error:'login_required'},401);
  const course=new URL(request.url).searchParams.get('course')||'';
  if(!/^[-a-z0-9]{2,80}$/.test(course))return json({error:'invalid_course'},400);
  if(!await allowed(env.MAIC_DB,student.id,course))return json({error:'activation_required'},403);
  const material=await env.MAIC_DB.prepare('SELECT sha256 FROM learning_materials WHERE course_id=?').bind(course).first();
  const study=await env.MAIC_DB.prepare('SELECT source_sha256,first_opened_at,confirmed_reviewed_at FROM learning_material_study WHERE student_id=? AND course_id=?').bind(student.id,course).first();
  return json({course,sourceAvailable:!!material,opened:!!material&&material.sha256===study?.source_sha256&&!!study.first_opened_at,reviewed:!!material&&material.sha256===study?.source_sha256&&!!study.confirmed_reviewed_at});
 }catch{return json({error:'unavailable'},503);}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  const d=await body(request),course=d.course;
  if(d.action!=='confirm-reviewed'||!/^[-a-z0-9]{2,80}$/.test(course||'')||d.confirmed!==true)return json({error:'invalid'},400);
  if(!await allowed(env.MAIC_DB,student.id,course))return json({error:'activation_required'},403);
  const m=await env.MAIC_DB.prepare('SELECT sha256 FROM learning_materials WHERE course_id=?').bind(course).first();if(!m)return json({error:'material_not_ready'},409);
  const now=new Date().toISOString();
  const done=await env.MAIC_DB.prepare('UPDATE learning_material_study SET confirmed_reviewed_at=?,updated_at=? WHERE student_id=? AND course_id=? AND source_sha256=? AND first_opened_at IS NOT NULL').bind(now,now,student.id,course,m.sha256).run();
  if(done.meta.changes!==1)return json({error:'open_material_first'},409);
  return json({reviewed:true});
 }catch{return json({error:'unavailable'},503)}
}