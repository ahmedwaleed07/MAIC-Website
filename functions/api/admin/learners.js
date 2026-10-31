import {json,isAdmin,validOrigin,body,catalog} from '../../_lib/learning.js';
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 const students=(await env.MAIC_DB.prepare('SELECT id,email,first_name,middle_name,last_name,dob,country,phone,education,enabled,created_at FROM learning_students ORDER BY created_at DESC LIMIT 500').all()).results;
 const enrollments=(await env.MAIC_DB.prepare('SELECT * FROM learning_enrollments ORDER BY updated_at DESC LIMIT 2000').all()).results;
 const materials=(await env.MAIC_DB.prepare('SELECT course_id,title,language,pages,bytes,updated_at FROM learning_materials ORDER BY title').all()).results;
 const requests=(await env.MAIC_DB.prepare('SELECT * FROM learning_requests ORDER BY created_at DESC LIMIT 2000').all()).results;return json({students,enrollments,materials,requests});
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const d=await body(request);if(typeof d.studentId!=='string'||typeof d.courseId!=='string'||!['activate','revoke'].includes(d.action))return json({error:'invalid'},400);
  const student=await env.MAIC_DB.prepare('SELECT id,country,enabled FROM learning_students WHERE id=?').bind(d.studentId).first();if(!student?.enabled)return json({error:'student'},404);
  const doc=await catalog(env.MAIC_DB),course=doc.courses.find(c=>c.id===d.courseId&&c.status!=='archived');if(!course)return json({error:'course'},404);
  const now=new Date().toISOString();
  if(d.action==='revoke'){
   const prior=await env.MAIC_DB.prepare('SELECT * FROM learning_enrollments WHERE student_id=? AND course_id=?').bind(d.studentId,d.courseId).first();if(!prior)return json({error:'enrollment'},404);
   await env.MAIC_DB.batch([env.MAIC_DB.prepare("UPDATE learning_enrollments SET status='revoked',updated_at=? WHERE student_id=? AND course_id=?").bind(now,d.studentId,d.courseId),env.MAIC_DB.prepare('INSERT INTO learning_audit VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),d.studentId,d.courseId,'revoke',prior.agent_id,prior.confirmation_ref,now)]);
  }else{
   const agent=doc.agents.find(a=>a.active&&a.country===student.country)||doc.agents.find(a=>a.active&&a.id==='unity-bridge');
   if(d.agentConfirmed!==true||d.identityVerified!==true||!agent||d.agentId!==agent.id||typeof d.confirmationRef!=='string'||d.confirmationRef.trim().length<3||d.confirmationRef.length>200)return json({error:'agent_confirmation'},400);
   const material=await env.MAIC_DB.prepare('SELECT 1 AS ready FROM learning_materials WHERE course_id=?').bind(d.courseId).first();if(!material)return json({error:'material'},409);
   await env.MAIC_DB.batch([env.MAIC_DB.prepare("INSERT INTO learning_enrollments VALUES(?,?,'active',?,?,?,?) ON CONFLICT(student_id,course_id) DO UPDATE SET status='active',agent_id=excluded.agent_id,confirmation_ref=excluded.confirmation_ref,activated_at=excluded.activated_at,updated_at=excluded.updated_at").bind(d.studentId,d.courseId,agent.id,d.confirmationRef.trim(),now,now),env.MAIC_DB.prepare('INSERT INTO learning_audit VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),d.studentId,d.courseId,'activate',agent.id,d.confirmationRef.trim(),now)]);
  }
  return json({saved:true});
 }catch{return json({error:'unavailable'},503);}
}
