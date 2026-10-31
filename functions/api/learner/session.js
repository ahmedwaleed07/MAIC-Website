import {json,session,catalog} from '../../_lib/learning.js';
export async function onRequestGet({request,env}){try{
 const student=await session(request,env);if(!student)return json({authenticated:false},401);
 const doc=await catalog(env.MAIC_DB),list=(await env.MAIC_DB.prepare("SELECT e.course_id,m.pages,m.language FROM learning_enrollments e JOIN learning_materials m ON m.course_id=e.course_id WHERE e.student_id=? AND e.status='active'").bind(student.id).all()).results;
 const courses=list.map(e=>{const c=doc.courses.find(c=>c.id===e.course_id&&c.status!=='archived');return c?{id:c.id,en:c.en,ar:c.ar,pages:e.pages,language:e.language}:null;}).filter(Boolean);
 const requests=(await env.MAIC_DB.prepare('SELECT course_id,created_at FROM learning_requests WHERE student_id=?').bind(student.id).all()).results;const a=doc.agents.find(a=>a.active&&a.country===student.country)||doc.agents.find(a=>a.active&&a.id==='unity-bridge');const agent=a?{id:a.id,name:a.name,email:a.email,phone:a.phone,website:a.website}:null;return json({authenticated:true,student:{name:[student.first_name,student.last_name].join(' '),email:student.email},courses,requests,agent});
 }catch{return json({error:'unavailable'},503);}}
