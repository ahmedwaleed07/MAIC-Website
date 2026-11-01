import {json,session} from '../../_lib/learning.js';
export async function onRequestGet({request,env}){
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  const id=new URL(request.url).searchParams.get('id')||'';
  if(!/^[a-zA-Z0-9-]{8,100}$/.test(id))return json({error:'certificate'},400);
  const record=await env.MAIC_DB.prepare("SELECT certificate_number,pdf_storage_key FROM learning_certificates WHERE id=? AND student_id=? AND status='issued'").bind(id,student.id).first();
  if(!record)return json({error:'not_available'},404);
  if(!record.pdf_storage_key||!env.MAIC_CERTIFICATES)return json({error:'pdf_not_ready'},404);
  const object=await env.MAIC_CERTIFICATES.get(record.pdf_storage_key);if(!object)return json({error:'pdf_not_ready'},404);
  return new Response(object.body,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="MAIC-Certificate-'+record.certificate_number.replace(/[^A-Z0-9-]/gi,'')+'.pdf"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'"}});
 }catch{return json({error:'unavailable'},503);}
}
