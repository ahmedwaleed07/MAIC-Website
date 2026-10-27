import {json,validOrigin,clearCookie} from '../../_lib/cms.js';
export async function onRequestPost({request}){
 if(!validOrigin(request))return json({error:'Origin rejected'},403);
 return json({authenticated:false},200,{'Set-Cookie':clearCookie});
}
