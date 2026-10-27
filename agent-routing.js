'use strict';
/* MAIC pre-launch enrollment agent assignments, supplied by the academy owner.
 * These records describe the planned routing, not proof of legal agency authorization.
 * Unity Bridge Services LLC serves the US and countries without an assigned local agent.
 */
const MAIC_ENROLLMENT_AGENTS=[
 {id:'unity-bridge',name:'Unity Bridge Services LLC',country:'US',countryEn:'United States',countryAr:'الولايات المتحدة الأمريكية',cityEn:null,cityAr:null,stateEn:'Michigan',stateAr:'مشيغان',website:'https://unitybridgeservices.org/',email:'info@unitybridgeservices.org',phone:'+1 (313) 566-3535',logo:'./assets/agents/unity-bridge.webp',active:true},
 {id:'asas-360',name:'ASAS 360°',country:'IQ',countryEn:'Iraq',countryAr:'العراق',cityEn:'Baghdad',cityAr:'بغداد',stateEn:null,stateAr:null,website:'https://www.asas360.com/',email:'info@asas360.com',phone:'+964 (781) 726-2800',logo:'./assets/agents/asas360.webp',active:true}
];
const MAIC_DEFAULT_AGENT_ID='unity-bridge';
function maicAssignAgent(countryCode){
 const code=String(countryCode||'').trim().toUpperCase();
 if(!/^[A-Z]{2}$/.test(code))return null;
 const active=MAIC_ENROLLMENT_AGENTS.filter(a=>a.active);
 const local=active.find(a=>a.country===code);
 const agent=local||active.find(a=>a.id===MAIC_DEFAULT_AGENT_ID);
 if(!agent)return null;
 return {agent,countryCode:code,isFallback:!local,assignedBy:'MAIC'};
}
function maicRenderAgentCard(assigned,ar){
 if(!assigned)return '';
 const a=assigned.agent;
 const safe=escapeHTML;
 const label=ar?{website:'الموقع الرسمي',email:'البريد الإلكتروني',phone:'رقم التواصل',country:'البلد',city:'المدينة',state:'الولاية',unavailable:'بانتظار تحديد المدينة',fallback:'وكيل الولايات المتحدة والوكيل الدولي البديل',local:'الوكيل المخصص للبلد'}:{website:'Official Website',email:'Contact Email',phone:'Contact Number',country:'Country',city:'City',state:'State',unavailable:'City not yet provided',fallback:'US Agent & International Fallback',local:'Designated Country Agent'};
 const country=ar?a.countryAr:a.countryEn;
 const city=ar?a.cityAr:a.cityEn;
 const stateValue=ar?a.stateAr:a.stateEn;
 const details=[
  ['globe',label.website,'<a href="'+safe(a.website)+'" target="_blank" rel="noopener noreferrer">'+safe(a.website.replace(/^https?:\/\//,'').replace(/\/$/,''))+'</a>'],
  ['mail',label.email,'<a href="mailto:'+safe(a.email)+'">'+safe(a.email)+'</a>'],
  ['phone',label.phone,'<a href="tel:'+safe(a.phone.replace(/[^+\d]/g,''))+'">'+safe(a.phone)+'</a>'],
  ['pin',label.country,safe(country)],
  ['pin',label.city,city?safe(city):'<span class="maic-agent-pending">'+safe(label.unavailable)+'</span>']
 ];
 if(stateValue)details.push(['pin',label.state,safe(stateValue)]);
 const rows=details.map(([glyph,k,v])=>'<div class="maic-agent-detail">'+icon(glyph)+'<dt>'+safe(k)+'</dt><dd>'+v+'</dd></div>').join('');
 return '<article class="maic-agent-card" aria-label="'+safe(a.name)+'"><div class="maic-agent-card-top"><div class="maic-agent-logo-frame"><img src="'+safe(a.logo)+'" alt="'+safe(a.name)+' logo" width="144" height="144" loading="lazy" decoding="async" /></div><div class="maic-agent-ident"><span class="maic-agent-overline">MAIC · ENROLLMENT AGENT</span><h3>'+safe(a.name)+'</h3><p class="maic-agent-role">'+safe(assigned.isFallback?label.fallback:label.local)+'</p></div></div><dl class="maic-agent-details">'+rows+'</dl></article>';
}
