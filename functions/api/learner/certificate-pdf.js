import {Buffer} from 'node:buffer';
import {json,session} from '../../_lib/learning.js';
export async function onRequestGet({request,env}){
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  const id=new URL(request.url).searchParams.get('id')||'';
  if(!/^[a-zA-Z0-9-]{8,100}$/.test(id))return json({error:'certificate'},400);
  const record=await env.MAIC_DB.prepare("SELECT certificate_number,pdf_storage_key FROM learning_certificates WHERE id=? AND student_id=? AND status='issued'").bind(id,student.id).first();
  if(!record)return json({error:'not_available'},404);
  if(!record.pdf_storage_key)return json({error:'pdf_not_ready'},404);
  const filename='MAIC-Certificate-'+record.certificate_number.replace(/[^A-Z0-9-]/gi,'')+'.pdf';
  const headers={'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="'+filename+'"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'"};
  if(record.pdf_storage_key.startsWith('d1:')){
   const meta=await env.MAIC_DB.prepare("SELECT * FROM learning_certificate_pdfs WHERE certificate_id=?").bind(id).first();
   if(!meta||record.pdf_storage_key!=='d1:'+meta.version||meta.bytes>2500000||meta.chunk_count>50)return json({error:'pdf_not_ready'},404);
   const chunks=(await env.MAIC_DB.prepare("SELECT part,payload FROM learning_certificate_pdf_chunks WHERE certificate_id=? AND version=? ORDER BY part").bind(id,meta.version).all()).results;
   if(chunks.length!==meta.chunk_count||chunks.some((row,i)=>row.part!==i))return json({error:'pdf_not_ready'},503);
   const pdf=new Uint8Array(meta.bytes);let pos=0;
   for(const part of chunks){const b=Buffer.from(part.payload,'base64');if(pos+b.length>pdf.length)return json({error:'pdf_not_ready'},503);pdf.set(b,pos);pos+=b.length}
   if(pos!==pdf.length)return json({error:'pdf_not_ready'},503);
   const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',pdf)),b=>b.toString(16).padStart(2,'0')).join('');
   if(digest!==meta.sha256)return json({error:'integrity_failure'},503);
   return new Response(pdf,{status:200,headers});
  }
  if(!env.MAIC_CERTIFICATES)return json({error:'pdf_not_ready'},404);
  const object=await env.MAIC_CERTIFICATES.get(record.pdf_storage_key);if(!object)return json({error:'pdf_not_ready'},404);
  return new Response(object.body,{status:200,headers});
 }catch{return json({error:'unavailable'},503)}
}
