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
  const row=await env.MAIC_DB.prepare("SELECT version FROM cms_documents WHERE id='published'").first();
  if(!row||row.version!==expected)return json({error:'Conflict: reload current version',currentVersion:row?.version||null},409);
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
