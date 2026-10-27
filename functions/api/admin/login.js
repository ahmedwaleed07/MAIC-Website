import {json,validOrigin,hasDB,rateLimit,verifyPassword,createSession,sessionCookie} from '../../_lib/cms.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'Origin rejected'},403);
 if(!hasDB(env)||!env.MAIC_SESSION_SECRET||!env.MAIC_PASSWORD_HASH||!env.MAIC_PASSWORD_SALT)return json({error:'Administrator login not configured'},503);
 try{
  if(await rateLimit(env.MAIC_DB,request))return json({error:'Too many attempts. Try again later.'},429);
  if(Number(request.headers.get('Content-Length')||0)>10000)return json({error:'Invalid request'},400);
  const d=await request.json();
  if(typeof d?.password!=='string'||d.password.length>300)return json({error:'Invalid credentials'},401);
  if(!await verifyPassword(d.password,env))return json({error:'Invalid credentials'},401);
  const token=await createSession(env);
  return json({authenticated:true,expiresIn:28800},200,{'Set-Cookie':sessionCookie(token)});
 }catch{return json({error:'Login unavailable'},503)}
}
