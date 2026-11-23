import {json,isAdmin} from '../../_lib/cms.js';

// Only the verified MAIC administrator can inspect imported editorial drafts.
// These drafts contain answer keys that were already exposed in public Git
// history. They are NOT suitable for live assessment without replacement.
const courseOK=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);

export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'database_unavailable'},503);
 const url=new URL(request.url),course=url.searchParams.get('course');
 try{
  const db=env.MAIC_DB;
  if(!course){
   const rows=(await db.prepare(`
    SELECT c.course_id,c.bank_version,c.source_manuscript,c.question_count,
     c.academic_status,c.imported_at,
     CASE WHEN m.course_id IS NOT NULL THEN 1 ELSE 0 END AS has_registered_pdf,
     CASE WHEN a.course_id IS NOT NULL THEN 1 ELSE 0 END AS has_active_exam
    FROM learning_exam_private_candidates c
    LEFT JOIN learning_materials m ON m.course_id=c.course_id
    LEFT JOIN learning_exam_active a ON a.course_id=c.course_id
    ORDER BY c.course_id
   `).all()).results;
   return json({count:rows.length,candidates:rows,
    warning:'These original editorial drafts and their keys were publicly exposed in Git history; re-author and independently review before any student use.'});
  }
  if(!courseOK(course))return json({error:'invalid_course'},400);
  const row=await db.prepare(`
   SELECT course_id,bank_version,source_manuscript,source_manuscript_blob_sha,
    question_count,questions_json,academic_status,imported_at,import_note
   FROM learning_exam_private_candidates WHERE course_id=?
  `).bind(course).first();
  if(!row)return json({error:'candidate_not_found'},404);
  const draft=JSON.parse(row.questions_json);
  if(!Array.isArray(draft.questions)||draft.questions.length!==100)
   return json({error:'candidate_incomplete'},409);
  // Export only to an authenticated admin, on an explicit course request.
  // Keys are never sent to student endpoints or the public catalog.
  return json({courseId:row.course_id,bankVersion:row.bank_version,
   approvalStatus:'unreviewed_exposed_draft',sourceManuscript:row.source_manuscript,
   sourceManuscriptBlobSha:row.source_manuscript_blob_sha,
   caution:'For editing/replacement only; not a valid live exam.',
   questions:draft.questions},200,{
    'Content-Disposition':'attachment; filename="maic-'+course+'-private-review-only.json"'
   });
 }catch(e){
  console.error('MAIC candidate retrieval failed',String(e?.message||e));
  return json({error:'unavailable'},503);
 }
}
