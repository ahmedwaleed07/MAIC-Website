import {json} from '../_lib/cms.js';
export async function onRequestGet({env}){
 if(!env.MAIC_DB)return json({error:'CMS unavailable'},503);
 try{
  const row=await env.MAIC_DB.prepare("SELECT content,version,updated_at FROM cms_documents WHERE id='published'").first();
  if(!row)return json({error:'CMS not initialized'},503);
  return json({document:JSON.parse(row.content),version:row.version,updatedAt:row.updated_at},200,{'Access-Control-Allow-Origin':'*'});
 }catch{return json({error:'CMS temporarily unavailable'},503)}
}
