import {Buffer} from 'node:buffer';
import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
const MAX=2500000,PART=64000;
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(request.headers.get('Content-Type')?.split(';')[0].trim()!=='application/pdf')return json({error:'pdf_required'},415);
 if(request.headers.get('X-MAIC-Approved-Template')!=='confirmed')return json({error:'approval_required'},400);
 const id=new URL(request.url).searchParams.get('id')||'';
 if(!/^[a-zA-Z0-9-]{8,100}$/.test(id))return json({error:'invalid_id'},400);
 try{
  const certificate=await env.MAIC_DB.prepare("SELECT id FROM learning_certificates WHERE id=? AND status='issued'").bind(id).first();
  if(!certificate)return json({error:'not_issued'},404);
  const sizeHeader=Number(request.headers.get('Content-Length')||'0');
  if(sizeHeader>MAX)return json({error:'file_too_large'},413);
  const reader=request.body?.getReader();if(!reader)return json({error:'missing_pdf'},400);
  const chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX){await reader.cancel();return json({error:'file_too_large'},413)}chunks.push(value)}
  if(size<200)return json({error:'invalid_pdf'},400);
  const pdf=new Uint8Array(size);let pos=0;for(const c of chunks){pdf.set(c,pos);pos+=c.length}
  if(new TextDecoder().decode(pdf.subarray(0,5))!=='%PDF-'||!new TextDecoder().decode(pdf.subarray(Math.max(0,size-2048))).includes('%%EOF'))return json({error:'invalid_pdf'},400);
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',pdf)),b=>b.toString(16).padStart(2,'0')).join('');
  const version=crypto.randomUUID(),now=new Date().toISOString(),total=Math.ceil(size/PART);
  const statements=[env.MAIC_DB.prepare("DELETE FROM learning_certificate_pdf_chunks WHERE certificate_id=?").bind(id)];
  for(let i=0;i<total;i++)statements.push(env.MAIC_DB.prepare("INSERT INTO learning_certificate_pdf_chunks VALUES(?,?,?,?)").bind(id,version,i,Buffer.from(pdf.subarray(i*PART,Math.min(size,(i+1)*PART))).toString('base64')));
  statements.push(env.MAIC_DB.prepare("INSERT INTO learning_certificate_pdfs(certificate_id,version,bytes,sha256,chunk_count,uploaded_at) VALUES(?,?,?,?,?,?) ON CONFLICT(certificate_id) DO UPDATE SET version=excluded.version,bytes=excluded.bytes,sha256=excluded.sha256,chunk_count=excluded.chunk_count,uploaded_at=excluded.uploaded_at").bind(id,version,size,hash,total,now));
  statements.push(env.MAIC_DB.prepare("UPDATE learning_certificates SET pdf_storage_key=?,pdf_generated_at=? WHERE id=? AND status='issued'").bind('d1:'+version,now,id));
  statements.push(env.MAIC_DB.prepare("INSERT INTO learning_certificate_events(id,certificate_id,action,performed_by,notes,created_at) VALUES(?,?,'pdf_approved_upload','MAIC Admin',?,?)").bind(crypto.randomUUID(),id,'Approved template manually confirmed; SHA-256 '+hash,now));
  await env.MAIC_DB.batch(statements);
  return json({saved:true,bytes:size,sha256:hash});
 }catch{return json({error:'unavailable'},503)}
}
