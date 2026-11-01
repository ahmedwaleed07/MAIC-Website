import {json} from '../_lib/cms.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
function html(row){
 const status=row.status==='issued'?'Valid':row.status==='revoked'?'Revoked':'Corrected';
 const rows=[
  ['Full name',row.graduate_full_name],['Course',row.course_title],
  ['Certificate type',row.certificate_type==='completion'?'Certificate of Completion':'Certificate of Participation'],
  ['Country',row.graduate_country],['Authorized agent',row.agent_name],
  ['Certificate number',row.certificate_number],['Date issued',row.issued_at.slice(0,10)],['Verification status',status]
 ];
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<meta name="robots" content="noindex,nofollow"><title>MAIC | Certificate Verification</title>'+
  '<style>body{margin:0;min-height:100vh;background:#081c30;color:#f4efe4;font:16px/1.6 system-ui,Arial}header,main,footer{max-width:850px;margin:auto;padding:26px 22px}header{display:flex;align-items:center;gap:14px;border-bottom:1px solid #b79958}header img{width:66px;height:66px;object-fit:contain}small,.muted{color:#d6bf91}h1{font:normal 32px Georgia,serif;color:#e4c991}dl{display:grid;grid-template-columns:1fr 2fr;border:1px solid #b7995860;border-radius:10px;overflow:hidden}dt,dd{padding:12px 16px;border-bottom:1px solid #b7995830;margin:0}dt{color:#e4c991;background:#102b45}dd{overflow-wrap:anywhere}a{color:#e4c991}em{font-style:normal}strong.valid{color:#b3dfc7}strong.revoked{color:#f3a4a4}@media(max-width:540px){dl{grid-template-columns:1fr}dt{padding-bottom:3px}dd{padding-top:3px}}</style></head><body>'+
  '<header><img src="/assets/maic-official-crest.png" alt="MAIC approved academic crest"><div><b>MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY</b><br><small>Innovate. Create. Lead.</small></div></header>'+
  '<main><p class="muted">MAIC Official Graduate Register</p><h1>Certificate Verification</h1><p>This page shows the current verification record for the identified certificate.</p>'+
  '<dl>'+rows.map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+(k==='Verification status'?'<strong class="'+(status==='Valid'?'valid':'revoked')+'">'+esc(v)+'</strong>':esc(v))+'</dd>').join('')+
  '</dl><p>This online record is not an academic degree or accreditation statement.</p><p><a href="/graduates/">Graduate register</a> · <a href="/">MAIC Home</a></p></main>'+
  '<footer><small>© Michigan Academy of Innovation and Creativity · Privacy-aware public verification</small></footer></body></html>';
}
export async function onRequestGet({params,env}){
 const token=params?.token;
 if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return new Response('Not found',{status:404});
 try{
  if(!env.MAIC_DB)return json({error:'unavailable'},503);
  const row=await env.MAIC_DB.prepare("SELECT certificate_number,graduate_full_name,course_title,certificate_type,graduate_country,agent_name,issued_at,status FROM learning_certificates WHERE verification_token=? AND public_consent=1").bind(token).first();
  if(!row)return new Response('Certificate record is not publicly available',{status:404,headers:{'Cache-Control':'no-store'}});
  return new Response(html(row),{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}});
 }catch{return json({error:'unavailable'},503);}
}
