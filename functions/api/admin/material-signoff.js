import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {catalog} from '../../_lib/learning.js';

const courseOK=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
const personOK=x=>typeof x==='string'&&x.trim().length>=3&&x.trim().length<=150&&/^[\p{L}\p{M} .'-]+$/u.test(x.trim())&&!/\b(?:openai|codex|chatgpt|ai model|automated review)\b/i.test(x);
function validDate(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const d=new Date(s+'T00:00:00Z');
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s&&
  s<=new Date().toISOString().slice(0,10);
}
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'database_unavailable'},503);
 try{
  const doc=await catalog(env.MAIC_DB);
  const materials=(await env.MAIC_DB.prepare(`
   SELECT m.course_id,m.sha256,m.pages,
    s.reviewer_name,s.reviewer_review_date,s.owner_attested_at
   FROM learning_materials m
   LEFT JOIN learning_material_academic_signoffs s ON s.course_id=m.course_id
    AND s.source_sha256=m.sha256
   WHERE m.pages=12 ORDER BY m.course_id`).all()).results;
  const titles=new Map(doc.courses.map(c=>[c.id,c.en]));
  return json({materials:materials.map(x=>({
   courseId:x.course_id,title:titles.get(x.course_id)||x.course_id,
   sourceSha256:x.sha256,academicReviewRecorded:!!x.reviewer_name,
   reviewerName:x.reviewer_name,reviewDate:x.reviewer_review_date,
   ownerAttestedAt:x.owner_attested_at
  }))});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'database_unavailable'},503);
 if((request.headers.get('Content-Type')||'').split(';')[0]!=='application/json')return json({error:'json_required'},415);
 try{
  if(Number(request.headers.get('Content-Length')||0)>5000)return json({error:'body_too_large'},413);
  const text=await request.text();
  if(text.length>5000)return json({error:'body_too_large'},413);
  const d=JSON.parse(text);
  const course=d.courseId,reviewer=String(d.reviewerName||'').trim();
  const notes=String(d.reviewNotes||'').trim(),day=d.reviewDate;
  if(!courseOK(course)||!personOK(reviewer)||!validDate(day)||notes.length<60||notes.length>2000||d.ownerAttestation!==true)
   return json({error:'actual_human_reviewer_and_owner_attestation_required'},400);
  const m=await env.MAIC_DB.prepare('SELECT course_id,sha256,pages FROM learning_materials WHERE course_id=?').bind(course).first();
  if(!m||m.pages!==12)return json({error:'reviewed_material_missing'},409);
  const doc=await catalog(env.MAIC_DB);
  if(!doc.courses.some(x=>x.id===course&&x.status!=='archived'))return json({error:'course_unavailable'},409);
  const res=await env.MAIC_DB.prepare(`
   INSERT OR IGNORE INTO learning_material_academic_signoffs
    (course_id,source_sha256,reviewer_name,reviewer_review_date,review_notes)
   VALUES(?,?,?,?,?)`).bind(course,m.sha256,reviewer,day,notes).run();
  if(res.meta?.changes!==1)return json({error:'signoff_already_recorded_for_this_exact_pdf'},409);
  return json({recorded:true,courseId:course,sourceSha256:m.sha256,
   reviewDate:day,reviewerName:reviewer});
 }catch(e){
  if(e instanceof SyntaxError)return json({error:'invalid_json'},400);
  return json({error:'unavailable'},503);
 }
}
