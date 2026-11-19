import {json,validOrigin,body,hash} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 let token;
 try{({token}=await body(request));}catch{return json({error:'invalid'},400);}
 if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return json({error:'invalid'},400);
 const db=env.MAIC_DB,key=await hash(token);
 const insert=db.prepare(`INSERT INTO learning_students(id,email,first_name,middle_name,last_name,dob,country,phone,education,password_salt,password_hash)
 SELECT ?,email,json_extract(profile_json,'$.firstName'),'',json_extract(profile_json,'$.lastName'),json_extract(profile_json,'$.dob'),json_extract(profile_json,'$.country'),json_extract(profile_json,'$.phone'),json_extract(profile_json,'$.education'),password_salt,password_hash
 FROM learning_pending_signups WHERE token_hash=? AND expires_at>unixepoch() ON CONFLICT(email) DO NOTHING`).bind(crypto.randomUUID(),key);
 const cleanup=db.prepare('DELETE FROM learning_pending_signups WHERE email=(SELECT email FROM learning_pending_signups WHERE token_hash=? AND expires_at>unixepoch())').bind(key);
 const [result]=await db.batch([insert,cleanup]);
 return result.meta.changes?json({confirmed:true}):json({error:'invalid'},400);
}
