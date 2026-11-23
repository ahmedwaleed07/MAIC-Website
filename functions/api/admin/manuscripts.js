import {json,isAdmin} from '../../_lib/cms.js';

const courseOK=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
// Admin-only source manuscript retrieval. No public CDN or student endpoint.
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'database_unavailable'},503);
 const course=new URL(request.url).searchParams.get('course');
 try{
  if(!course){
   const entries=(await env.MAIC_DB.prepare(`
    SELECT course_id,source_filename,source_git_blob_sha,section_count,imported_at
    FROM learning_material_private_manuscripts ORDER BY course_id`).all()).results;
   return json({count:entries.length,manuscripts:entries,note:'Original source manuscripts for academic editing only, not live student books.'});
  }
  if(!courseOK(course))return json({error:'invalid_course'},400);
  const row=await env.MAIC_DB.prepare(`
   SELECT content_markdown,section_count FROM learning_material_private_manuscripts
   WHERE course_id=? AND access_status='admin_only'`).bind(course).first();
  if(!row)return json({error:'manuscript_not_found'},404);
  return new Response(row.content_markdown,{status:200,headers:{
   'Content-Type':'text/markdown; charset=utf-8',
   'Content-Disposition':'attachment; filename="maic-'+course+'-editorial-source.md"',
   'Cache-Control':'no-store',
   'X-Content-Type-Options':'nosniff'
  }});
 }catch{return json({error:'unavailable'},503)}
}
