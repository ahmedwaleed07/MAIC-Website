import {json,session,validOrigin,body,catalog} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{const student=await session(request,env);if(!student)return json({error:'login_required'},401);const d=await body(request),doc=await catalog(env.MAIC_DB);if(!doc.courses.some(c=>c.id===d.courseId&&c.status!=='archived'))return json({error:'course'},404);
 await env.MAIC_DB.prepare('INSERT INTO learning_requests VALUES(?,?,?) ON CONFLICT(student_id,course_id) DO NOTHING').bind(student.id,d.courseId,new Date().toISOString()).run();return json({requested:true},202);
 }catch{return json({error:'unavailable'},503);}
}
