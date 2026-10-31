import {json,limited,randomHex,hash} from '../../_lib/learning.js';
export async function onRequestGet({request,env}){try{
 if(!env.MAIC_PASSWORD_HASH||!env.MAIC_PASSWORD_SALT||!env.MAIC_SESSION_SECRET)return json({error:'unavailable'},503);
 if(await limited(request,env.MAIC_DB,'owner-challenge',20))return json({error:'rate'},429);
 const challenge=randomHex(32),now=Math.floor(Date.now()/1000);
 await env.MAIC_DB.batch([env.MAIC_DB.prepare('DELETE FROM learning_owner_challenges WHERE expires_at<=?').bind(now),env.MAIC_DB.prepare('INSERT INTO learning_owner_challenges VALUES(?,?)').bind(await hash(challenge),now+120)]);
 return json({challenge,salt:env.MAIC_PASSWORD_SALT});
 }catch{return json({error:'unavailable'},503);}}
