import {json,validOrigin,hasDB,rateLimit,createSession,sessionCookie} from '../../_lib/cms.js';
import {body,hash,hex,same} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'Origin rejected'},403);
 if(!hasDB(env)||!env.MAIC_SESSION_SECRET||!env.MAIC_PASSWORD_HASH||!env.MAIC_PASSWORD_SALT)return json({error:'Administrator login not configured'},503);
 try{
  if(await rateLimit(env.MAIC_DB,request))return json({error:'Too many attempts. Try again later.'},429);
  const d=await body(request);
  if(!/^[a-f0-9]{64}$/.test(d?.challenge||'')||!/^[a-f0-9]{64}$/.test(d?.proof||''))return json({error:'Invalid credentials'},401);
  const consumed=await env.MAIC_DB.prepare('DELETE FROM learning_owner_challenges WHERE digest=? AND expires_at>? RETURNING digest').bind(await hash(d.challenge),Math.floor(Date.now()/1000)).first();
  if(!consumed)return json({error:'Invalid credentials'},401);
  const key=await crypto.subtle.importKey('raw',Uint8Array.from(env.MAIC_PASSWORD_HASH.match(/../g),x=>parseInt(x,16)),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const expected=hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(d.challenge+'|'+new URL(request.url).origin)));
  if(!same(expected,d.proof))return json({error:'Invalid credentials'},401);
  const token=await createSession(env);return json({authenticated:true,expiresIn:28800},200,{'Set-Cookie':sessionCookie(token)});
 }catch{return json({error:'Login unavailable'},503);}
}
