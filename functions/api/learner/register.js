import {json,validOrigin,body,profile,limited,derive,randomHex} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{
  if(await limited(request,env.MAIC_DB,'register',8))return json({error:'rate'},429);
  let p;try{p=profile(await body(request));}catch{return json({error:'profile'},400);}
  const salt=randomHex(16),digest=await derive(p.password,salt,env.MAIC_SESSION_SECRET);
  await env.MAIC_DB.prepare('INSERT INTO learning_students(id,email,first_name,middle_name,last_name,dob,country,phone,education,password_salt,password_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(email) DO NOTHING').bind(crypto.randomUUID(),p.email,p.firstName,p.middleName,p.lastName,p.dob,p.country,p.phone,p.education,salt,digest).run();
  // Identical response for existing addresses; registering never grants course access.
  return json({accepted:true},202);
 }catch{return json({error:'unavailable'},503);}
}
