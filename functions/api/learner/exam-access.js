/* MAIC learner-only exam entitlements.
 * This endpoint never reveals bank names, question counts, questions, options,
 * answer keys or administrative review status to visitors. A learner receives
 * only their own course IDs for exams that the server has actually released.
 */
import {json,session} from '../../_lib/learning.js';

export async function onRequestGet({request,env}){
 try{
  if(!env.MAIC_DB)return json({error:'unavailable'},503);
  const learner=await session(request,env);
  if(!learner)return json({error:'login_required'},401);
  const rows=await env.MAIC_DB.prepare(`
   SELECT DISTINCT e.course_id
     FROM learning_enrollments e
     JOIN learning_exam_active a ON a.course_id=e.course_id
     JOIN learning_exam_banks b
       ON b.course_id=a.course_id AND b.version=a.version
      AND b.status='approved' AND b.question_count=100
     JOIN learning_materials m
       ON m.course_id=e.course_id AND m.sha256=b.source_sha256
     JOIN learning_material_study s
       ON s.student_id=e.student_id AND s.course_id=e.course_id
      AND s.source_sha256=m.sha256
      AND s.first_opened_at IS NOT NULL AND s.confirmed_reviewed_at IS NOT NULL
     LEFT JOIN learning_enrollment_modes mode
       ON mode.student_id=e.student_id AND mode.course_id=e.course_id
    WHERE e.student_id=? AND e.status='active'
      AND COALESCE(mode.delivery_mode,'self-paced')='self-paced'
   ORDER BY e.course_id
  `).bind(learner.id).all();
  return json({courses:(rows.results||[]).map(row=>row.course_id)});
 }catch(err){
  console.error('MAIC learner exam access unavailable',err?.message||String(err));
  return json({error:'unavailable'},503);
 }
}
