/* Public names only. Exam text, answers, rationale, hashes and bank versions
 * are intentionally never returned to callers of this route.
 * Access is calculated independently from login, verified enrollment,
 * delivery mode, source-matched academic approval and study completion.
 */
import {json,session,catalog} from '../../_lib/learning.js';

export async function onRequestGet({request,env}){
 try{
  const db=env.MAIC_DB;
  if(!db)return json({error:'unavailable'},503);
  const [doc,bankRows,student]=await Promise.all([
   catalog(db),
   db.prepare("SELECT course_id FROM learning_exam_banks WHERE question_count=100 AND status IN ('draft','approved') GROUP BY course_id ORDER BY course_id").all(),
   session(request,env)
  ]);
  const availableCourseIds=new Set((bankRows.results||[]).map(x=>x.course_id));
  // Only course display metadata is public; never include any bank record.
  const enrollments=student?(await db.prepare(
   "SELECT e.course_id,COALESCE(m.delivery_mode,'self-paced') AS mode FROM learning_enrollments e LEFT JOIN learning_enrollment_modes m ON m.student_id=e.student_id AND m.course_id=e.course_id WHERE e.student_id=? AND e.status='active'"
  ).bind(student.id).all()).results:[];
  const enrolled=new Map(enrollments.map(x=>[x.course_id,x.mode]));
  const ready=student?(await db.prepare(
   "SELECT a.course_id FROM learning_exam_active a JOIN learning_exam_banks b ON b.course_id=a.course_id AND b.version=a.version JOIN learning_materials m ON m.course_id=b.course_id AND m.sha256=b.source_sha256 WHERE b.status='approved' AND b.question_count=100"
  ).all()).results:[];
  const active=new Set(ready.map(x=>x.course_id));
  const studied=student?(await db.prepare(
   "SELECT s.course_id FROM learning_material_study s JOIN learning_materials m ON m.course_id=s.course_id AND m.sha256=s.source_sha256 WHERE s.student_id=? AND s.first_opened_at IS NOT NULL AND s.confirmed_reviewed_at IS NOT NULL"
  ).bind(student.id).all()).results:[];
  const studiedIds=new Set(studied.map(x=>x.course_id));
  const exams=doc.courses.filter(c=>availableCourseIds.has(c.id)&&c.status!=='archived'&&Array.isArray(c.mode)&&c.mode.includes('self-paced'))
   .map(c=>{
    let access='locked';
    if(student&&enrolled.has(c.id)){
     if(enrolled.get(c.id)!=='self-paced')access='different_delivery_mode';
     else if(!active.has(c.id))access='academic_review_pending';
     else if(!studiedIds.has(c.id))access='study_required';
     else access='available';
    }
    return {courseId:c.id,titleEn:c.en,titleAr:c.ar,questionCount:100,access};
   });
  return json({exams,authenticated:!!student});
 }catch(e){
  console.error('MAIC public exam catalog unavailable',e?.message||String(e));
  return json({error:'unavailable'},503);
 }
}
