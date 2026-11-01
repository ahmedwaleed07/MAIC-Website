import {json} from '../_lib/cms.js';
export async function onRequestGet({request,env}){
 try{
  if(!env.MAIC_DB)return json({error:'not_configured'},503);
  const url=new URL(request.url),offset=Math.max(0,Math.min(1000,Number.parseInt(url.searchParams.get('offset')||'0',10)||0));
  const rows=(await env.MAIC_DB.prepare(
   "SELECT verification_token,certificate_number,graduate_full_name,course_title,certificate_type,graduate_country,agent_name,issued_at,status FROM learning_certificates WHERE public_consent=1 ORDER BY issued_at DESC LIMIT 50 OFFSET ?"
  ).bind(offset).all()).results;
  return json({graduates:rows,nextOffset:rows.length===50?offset+50:null});
 }catch{return json({error:'unavailable'},503);}
}
