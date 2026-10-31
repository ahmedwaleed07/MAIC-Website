import {Buffer} from 'node:buffer';
import {json,session,catalog,allowed,rangeFor} from '../../_lib/learning.js';
export async function onRequest({request,env}){
 if(!['GET','HEAD'].includes(request.method))return json({error:'method'},405);
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  const id=new URL(request.url).searchParams.get('course');if(!/^[-a-z0-9]{2,80}$/.test(id||''))return json({error:'course'},404);
  if(!await allowed(env.MAIC_DB,student.id,id))return json({error:'activation_required'},403);
  const doc=await catalog(env.MAIC_DB);if(!doc.courses.some(c=>c.id===id&&c.status!=='archived'))return json({error:'course'},404);
  const meta=await env.MAIC_DB.prepare('SELECT * FROM learning_materials WHERE course_id=?').bind(id).first();if(!meta||meta.bytes>8000000||meta.chunk_count>64)return json({error:'not_ready'},404);
  const range=rangeFor(request.headers.get('Range'),meta.bytes),headers={'Content-Type':'application/pdf','Cache-Control':'private, no-store, max-age=0','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename="MAIC-${id}-EN.pdf"`,'Accept-Ranges':'bytes','Referrer-Policy':'no-referrer','X-Frame-Options':'SAMEORIGIN'};
  if(range===false)return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${meta.bytes}`}});
  const start=range?.start||0,end=range?.end??meta.bytes-1;headers['Content-Length']=String(end-start+1);if(range)headers['Content-Range']=`bytes ${start}-${end}/${meta.bytes}`;
  if(request.method==='HEAD')return new Response(null,{status:range?206:200,headers});
  const rows=(await env.MAIC_DB.prepare('SELECT part,payload FROM learning_material_chunks WHERE course_id=? AND version=? ORDER BY part').bind(id,meta.version).all()).results;
  if(rows.length!==meta.chunk_count||rows.some((r,i)=>r.part!==i))return json({error:'not_ready'},503);
  const data=new Uint8Array(meta.bytes);let pos=0;
  for(const r of rows){const chunk=Buffer.from(r.payload,'base64');if(pos+chunk.length>data.length)return json({error:'not_ready'},503);data.set(chunk,pos);pos+=chunk.length;}
  if(pos!==meta.bytes)return json({error:'not_ready'},503);
  return new Response(data.subarray(start,end+1),{status:range?206:200,headers});
 }catch{return json({error:'unavailable'},503);}
}
