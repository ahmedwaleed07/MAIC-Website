import {json,validOrigin,body,profile,limited,derive,randomHex,hash} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 try{
  if(await limited(request,env.MAIC_DB,'register',8))return json({error:'rate'},429);
  let p;try{const d=await body(request);if(d.confirmPassword!==d.password)throw Error();p=profile(d);}catch{return json({error:'profile'},400);}
  const db=env.MAIC_DB;
  if(!await db.prepare('SELECT 1 FROM learning_students WHERE email=?').bind(p.email).first()){
   const {password,...details}=p;
   const salt=randomHex(16), token=randomHex(32), key=await hash(token);
   const digest=await derive(password,salt,env.MAIC_SESSION_SECRET);
   await db.batch([
    db.prepare('DELETE FROM learning_pending_signups WHERE expires_at<=unixepoch()'),
    db.prepare('INSERT INTO learning_pending_signups VALUES(?,?,?,?,?,unixepoch()+86400)').bind(key,p.email,JSON.stringify(details),salt,digest)
   ]);
   const sent=await env.ACCOUNT_MAILER.fetch('https://mailer.internal/confirm',{method:'POST',body:JSON.stringify({email:p.email,token})});
   if(!sent.ok)throw Error('mail unavailable');
  }
  return json({accepted:true},202);
 }catch{return json({error:'unavailable'},503);}
}
