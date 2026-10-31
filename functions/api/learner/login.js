import {json,validOrigin,body,limited,derive,same,createSession,cookie} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{
  if(await limited(request,env.MAIC_DB,'login',20))return json({error:'rate'},429);
  let d;try{d=await body(request);}catch{return json({error:'credentials'},401);}
  if(typeof d.email!=='string'||d.email.length>254||typeof d.password!=='string'||d.password.length>200)return json({error:'credentials'},401);
  const s=await env.MAIC_DB.prepare('SELECT id,password_salt,password_hash,enabled FROM learning_students WHERE email=?').bind(d.email.trim().toLowerCase()).first();
  const digest=await derive(d.password,s?.password_salt||'00000000000000000000000000000000',env.MAIC_SESSION_SECRET);
  if(!s||!same(digest,s.password_hash)||!s.enabled)return json({error:'credentials'},401);
  const token=await createSession(env.MAIC_DB,s.id);return json({authenticated:true},200,{'Set-Cookie':cookie(token)});
 }catch{return json({error:'unavailable'},503);}
}
