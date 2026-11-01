import {json,session,validOrigin,body,limited} from '../../_lib/learning.js';
const validId=s=>typeof s==='string'&&s.length>=8&&s.length<=100&&/^[a-zA-Z0-9-]+$/.test(s);
export async function onRequestGet({request,env}){
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  const certificates=(await env.MAIC_DB.prepare(
   "SELECT id,certificate_number,course_title,course_mode,certificate_type,graduate_full_name,graduate_country,agent_name,verification_token,status,issued_at,public_consent,CASE WHEN pdf_storage_key IS NOT NULL THEN 1 ELSE 0 END AS pdf_ready FROM learning_certificates WHERE student_id=? AND pdf_storage_key IS NOT NULL ORDER BY issued_at DESC"
  ).bind(student.id).all()).results;
  const originals=(await env.MAIC_DB.prepare(
   "SELECT id,certificate_id,status,fee_amount,fee_currency,tracking_reference,created_at,updated_at FROM learning_original_requests WHERE student_id=? ORDER BY created_at DESC"
  ).bind(student.id).all()).results;
  return json({certificates,originals});
 }catch{return json({error:'unavailable'},503);}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{
  const student=await session(request,env);if(!student)return json({error:'login_required'},401);
  if(await limited(request,env.MAIC_DB,'certificates',12))return json({error:'rate_limited'},429);
  const d=await body(request);
  if(!validId(d.certificateId))return json({error:'invalid_certificate'},400);
  const cert=await env.MAIC_DB.prepare("SELECT id,agent_id,status,public_consent,pdf_storage_key FROM learning_certificates WHERE id=? AND student_id=?").bind(d.certificateId,student.id).first();
  if(!cert)return json({error:'not_available'},404);
  if(d.action==='set-publication'){
   if(typeof d.consent!=='boolean')return json({error:'invalid_consent'},400);
   await env.MAIC_DB.prepare("UPDATE learning_certificates SET public_consent=?,consent_at=? WHERE id=? AND student_id=?")
    .bind(d.consent?1:0,d.consent?new Date().toISOString():null,cert.id,student.id).run();
   return json({saved:true,publicConsent:d.consent});
  }
  if(d.action!=='request-original')return json({error:'invalid_action'},400);
  if(cert.status!=='issued'||!cert.pdf_storage_key)return json({error:'not_available'},409);
  const name=typeof d.recipientName==='string'?d.recipientName.trim():'',phone=typeof d.recipientPhone==='string'?d.recipientPhone.trim():'',address=typeof d.address==='string'?d.address.trim():'',country=typeof d.country==='string'?d.country.trim().toUpperCase():'',postal=typeof d.postalCode==='string'?d.postalCode.trim():'';
  if(name.length<3||name.length>180||!/^\+?[\d ()-]{7,40}$/.test(phone)||address.length<12||address.length>1000||!/^[A-Z]{2}$/.test(country)||postal.length>30)return json({error:'invalid_shipping_details'},400);
  const active=await env.MAIC_DB.prepare("SELECT id FROM learning_original_requests WHERE certificate_id=? AND student_id=? AND status NOT IN ('delivered','cancelled') LIMIT 1").bind(cert.id,student.id).first();
  if(active)return json({error:'request_already_open',requestId:active.id},409);
  const id=crypto.randomUUID(),notificationId=crypto.randomUUID(),now=new Date().toISOString();
  await env.MAIC_DB.batch([
   env.MAIC_DB.prepare("INSERT INTO learning_original_requests(id,certificate_id,student_id,agent_id,recipient_name,recipient_phone,shipping_country,shipping_address,postal_code,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,'awaiting_agent_quote',?,?)").bind(id,cert.id,student.id,cert.agent_id,name,phone,country,address,postal,now,now),
   env.MAIC_DB.prepare("INSERT INTO learning_agent_notifications(id,agent_id,request_id,category,status,created_at) VALUES(?,?,?,'original_certificate_request','queued',?)").bind(notificationId,cert.agent_id,id,now)
  ]);
  return json({requested:true,requestId:id,status:'awaiting_agent_quote',notificationStatus:'queued'},202);
 }catch{return json({error:'unavailable'},503);}
}
