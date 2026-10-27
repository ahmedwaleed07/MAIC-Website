import {json,isAdmin} from '../../_lib/cms.js';
export async function onRequestGet({request,env}){
 return await isAdmin(request,env)?json({authenticated:true,role:'MAIC Owner'}):json({authenticated:false},401);
}
