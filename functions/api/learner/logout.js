import {json,validOrigin,hash,clearCookie} from '../../_lib/learning.js';
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 const token=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)__Host-maic_learner=([a-f0-9]{64})(?:;|$)/)?.[1];
 if(token)await env.MAIC_DB.prepare('DELETE FROM learning_sessions WHERE token_hash=?').bind(await hash(token)).run();
 return json({authenticated:false},200,{'Set-Cookie':clearCookie});
}
