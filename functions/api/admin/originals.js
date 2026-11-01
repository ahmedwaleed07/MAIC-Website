import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {body} from '../../_lib/learning.js';
const choices={awaiting_agent_quote:['awaiting_payment','cancelled'],awaiting_payment:['payment_confirmed','cancelled'],payment_confirmed:['printing','cancelled'],printing:['shipped','cancelled'],shipped:['delivered'],delivered:[],cancelled:[]};
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const requests=(await env.MAIC_DB.prepare("SELECT r.*,c.certificate_number,c.course_title,c.graduate_full_name,n.status AS notification_status FROM learning_original_requests r JOIN learning_certificates c ON c.id=r.certificate_id LEFT JOIN learning_agent_notifications n ON n.request_id=r.id ORDER BY r.created_at DESC LIMIT 500").all()).results;
  return json({requests});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const d=await body(request);
  if(typeof d.id!=='string'||!/^[a-z0-9-]{16,100}$/i.test(d.id)||typeof d.status!=='string')return json({error:'invalid'},400);
  const prior=await env.MAIC_DB.prepare('SELECT * FROM learning_original_requests WHERE id=?').bind(d.id).first();
  if(!prior)return json({error:'not_found'},404);
  if(!(choices[prior.status]||[]).includes(d.status))return json({error:'invalid_transition'},409);
  let amount=prior.fee_amount,currency=prior.fee_currency,reference=prior.agent_payment_reference,tracking=prior.tracking_reference;
  if(d.status==='awaiting_payment'){
   amount=typeof d.feeAmount==='string'?d.feeAmount.trim():'';
   currency=typeof d.feeCurrency==='string'?d.feeCurrency.trim().toUpperCase():'';
   if(!/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(amount)||Number(amount)<=0||!['USD','IQD','EUR','GBP','CAD','AED','SAR'].includes(currency))return json({error:'invalid_fee'},400);
  }
  if(d.status==='payment_confirmed'){
   reference=typeof d.paymentReference==='string'?d.paymentReference.trim():'';
   if(d.agentConfirmed!==true||reference.length<3||reference.length>200)return json({error:'agent_confirmation_required'},400);
  }
  if(d.status==='shipped'){
   tracking=typeof d.trackingReference==='string'?d.trackingReference.trim():'';
   if(tracking.length<3||tracking.length>200)return json({error:'tracking_reference_required'},400);
  }
  const now=new Date().toISOString();
  const result=await env.MAIC_DB.prepare('UPDATE learning_original_requests SET status=?,fee_amount=?,fee_currency=?,agent_payment_reference=?,tracking_reference=?,updated_at=? WHERE id=? AND status=?').bind(d.status,amount,currency,reference,tracking,now,d.id,prior.status).run();
  if(result.meta?.changes!==1)return json({error:'concurrent_update'},409);
  return json({saved:true,status:d.status});
 }catch{return json({error:'unavailable'},503)}
}
