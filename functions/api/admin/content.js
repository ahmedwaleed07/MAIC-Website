import {json,isAdmin,validOrigin,validateDocument} from '../../_lib/cms.js';
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'Unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'Database not bound'},503);
 try{
  const row=await env.MAIC_DB.prepare("SELECT content,version,updated_at,published_by FROM cms_documents WHERE id='published'").first();
  if(!row)return json({error:'CMS not initialized'},503);
  return json({document:JSON.parse(row.content),version:row.version,updatedAt:row.updated_at,editor:row.published_by});
 }catch{return json({error:'CMS unavailable'},503)}
}
export async function onRequestPut({request,env}){
 if(!validOrigin(request))return json({error:'Origin rejected'},403);
 if(!await isAdmin(request,env))return json({error:'Unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'Database not bound'},503);
 const max=1048576;
 if(Number(request.headers.get('Content-Length')||0)>max)return json({error:'Document too large'},413);
 try{
  const bodyText=await request.text();
  if(new TextEncoder().encode(bodyText).byteLength>max)return json({error:'Document too large'},413);
  const body=JSON.parse(bodyText);
  const expected=Number(body.expectedVersion);
  if(!Number.isSafeInteger(expected)||expected<1)return json({error:'Invalid revision'},400);
  const doc=validateDocument(body.document);
  const payload=JSON.stringify(doc);
  const now=new Date().toISOString(),actor='MAIC Owner';
  const row=await env.MAIC_DB.prepare("SELECT version,content FROM cms_documents WHERE id='published'").first();
  if(!row||row.version!==expected)return json({error:'Conflict: reload current version',currentVersion:row?.version||null},409);

  // Catalog publication is not an academic release. When a self-paced course
  // first becomes public, require an independently reviewed PDF and an active,
  // source-matched, approved 100-item exam. Existing published courses retain
  // their current status while editors update unrelated copy or navigation.
  const previous=JSON.parse(row.content);
  const oldStatuses=new Map(previous.courses.map(c=>[c.id,c.status]));
  const newlyPublished=doc.courses.filter(c=>
   c.status==='published'&&oldStatuses.get(c.id)!=='published'&&c.mode.includes('self-paced')
  );
  for(const course of newlyPublished){
   const gate=await env.MAIC_DB.prepare(`
    SELECT m.course_id,
     EXISTS(
      SELECT 1 FROM learning_material_revisions r
      WHERE r.course_id=m.course_id AND r.new_sha256=m.sha256
       AND r.content_reviewed=1 AND r.black_white_tinos12_verified=1
       AND LENGTH(TRIM(COALESCE(r.reviewed_by,'')))>=3
     ) AS reviewed_material,
     EXISTS(
      SELECT 1 FROM learning_exam_active a
      JOIN learning_exam_banks b ON b.course_id=a.course_id AND b.version=a.version
      JOIN learning_exam_review_signoffs s ON s.course_id=b.course_id AND s.version=b.version
      WHERE a.course_id=m.course_id AND b.status='approved' AND b.question_count=100
       AND b.source_sha256=m.sha256 AND s.reviewed_at IS NOT NULL
       AND (SELECT COUNT(*) FROM learning_exam_item_reviews i
            WHERE i.course_id=b.course_id AND i.version=b.version AND i.verdict='approved')=100
     ) AS approved_exam
    FROM learning_materials m WHERE m.course_id=? AND m.pages=12
   `).bind(course.id).first();
   if(!gate?.reviewed_material||!gate?.approved_exam)
    return json({error:'course_academic_release_required',courseId:course.id,
     missing:[...(!gate?.reviewed_material?['reviewed_12_page_pdf']:[]),
      ...(!gate?.approved_exam?['approved_source_matched_100_item_exam']:[])]},409);
  }
  const result=await env.MAIC_DB.prepare("UPDATE cms_documents SET content=?,version=version+1,updated_at=?,published_by=? WHERE id='published' AND version=?").bind(payload,now,actor,expected).run();
  if(result.meta?.changes!==1)return json({error:'Concurrent update: reload before publishing'},409);
  try{await env.MAIC_DB.prepare('INSERT INTO cms_history(version,content,published_at,published_by) VALUES (?,?,?,?)').bind(expected+1,payload,now,actor).run()}catch{}
  return json({published:true,version:expected+1,updatedAt:now});
 }catch(e){
  if(e instanceof SyntaxError)return json({error:'Invalid JSON'},400);
  if(e instanceof Error&&/Invalid|Catalog|Duplicate|Unsafe|Untrusted|Missing|required|incomplete|fallback|URL|country/i.test(e.message))return json({error:e.message},400);
  return json({error:'Unable to publish at present'},503);
 }
}
