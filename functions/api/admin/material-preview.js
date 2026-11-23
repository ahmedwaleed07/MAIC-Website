import {Buffer} from 'node:buffer';
import {json,isAdmin} from '../../_lib/cms.js';
import {rangeFor} from '../../_lib/learning.js';

// Owner-only academic verification of the exact registered source PDF.
// This endpoint deliberately does not touch learner study/progress records.
const courseIdOK=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
const shaOK=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);

export async function onRequest({request,env}){
 if(!['GET','HEAD'].includes(request.method))return json({error:'method_not_allowed'},405);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'database_unavailable'},503);
 const url=new URL(request.url),id=url.searchParams.get('course')||'',expected=url.searchParams.get('sha');
 if(!courseIdOK(id)||expected!==null&&!shaOK(expected))return json({error:'invalid_material_identity'},400);
 try{
  const db=env.MAIC_DB;
  const m=await db.prepare('SELECT course_id,version,sha256,bytes,chunk_count,pages FROM learning_materials WHERE course_id=?').bind(id).first();
  if(!m||m.pages!==12||m.bytes<1000||m.bytes>8_000_000||m.chunk_count<1||m.chunk_count>256)
   return json({error:'registered_pdf_not_found'},404);
  if(expected!==null&&expected!==m.sha256)return json({error:'source_material_changed'},409);
  const range=rangeFor(request.headers.get('Range'),m.bytes);
  const headers={
   'Content-Type':'application/pdf',
   'Cache-Control':'private, no-store, max-age=0',
   'X-Content-Type-Options':'nosniff',
   'Content-Disposition':'inline; filename="MAIC-'+id+'-academic-review.pdf"',
   'X-Frame-Options':'SAMEORIGIN',
   'Referrer-Policy':'no-referrer',
   'Accept-Ranges':'bytes'
  };
  if(range===false)return new Response(null,{status:416,headers:{...headers,'Content-Range':'bytes */'+m.bytes}});
  const start=range?.start||0,end=range?.end??m.bytes-1;
  headers['Content-Length']=String(end-start+1);
  if(range)headers['Content-Range']='bytes '+start+'-'+end+'/'+m.bytes;
  if(request.method==='HEAD')return new Response(null,{status:range?206:200,headers});
  const rows=(await db.prepare('SELECT part,payload FROM learning_material_chunks WHERE course_id=? AND version=? ORDER BY part').bind(id,m.version).all()).results;
  if(rows.length!==m.chunk_count||rows.some((r,i)=>Number(r.part)!==i))
   return json({error:'pdf_chunks_incomplete'},503);
  const bytes=new Uint8Array(m.bytes);
  let pos=0;
  for(const row of rows){
   const part=Buffer.from(row.payload,'base64');
   if(part.length===0||pos+part.length>bytes.length)return json({error:'pdf_corrupt'},503);
   bytes.set(part,pos);pos+=part.length;
  }
  if(pos!==m.bytes)return json({error:'pdf_corrupt'},503);
  // Only the authenticated academic administrator receives the rendered PDF.
  return new Response(bytes.subarray(start,end+1),{status:range?206:200,headers});
 }catch(e){
  console.error('MAIC admin PDF preview failed',String(e?.message||e));
  return json({error:'unavailable'},503);
 }
}
