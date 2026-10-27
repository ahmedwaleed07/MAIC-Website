'use strict';
/* MAIC CMS reader. Published content is read from MAIC D1 via /api/content.
 * The local preview is explicitly opt-in and never modifies public content.
 */
let maicStudioDraft=null;
const maicStudioPreviewRequested=new URLSearchParams(location.search).get('cms-preview')==='1';
let maicCmsSource='defaults';
const maicCmsSafe=(d)=>d&&Array.isArray(d.courses)&&Array.isArray(d.agents)&&Array.isArray(d.nav)&&
 d.courses.length<=500&&d.agents.length<=150&&d.nav.length<=120&&
 d.agents.some(a=>a.id==='unity-bridge'&&a.country==='US'&&a.active===true);
function maicCmsApply(d){
 if(!maicCmsSafe(d))return false;
 const allowed=['self-paced','group','one-on-one'];
 const courses=d.courses.filter(c=>c&&/^[a-z0-9-]{2,80}$/.test(c.id)&&typeof c.en==='string'&&typeof c.ar==='string'&&
  ['preparing','published','archived'].includes(c.status)&&Array.isArray(c.mode)&&c.mode.some(m=>allowed.includes(m)));
 const agents=d.agents.filter(a=>a&&/^[a-z0-9-]{2,80}$/.test(a.id)&&/^[A-Z]{2}$/.test(a.country)&&
  typeof a.website==='string'&&a.website.startsWith('https://')&&typeof a.email==='string');
 if(courses.length!==d.courses.length||agents.length!==d.agents.length)return false;
 MAIC_COURSE_CATALOG.splice(0,MAIC_COURSE_CATALOG.length,...courses);
 MAIC_ENROLLMENT_AGENTS.splice(0,MAIC_ENROLLMENT_AGENTS.length,...agents);
 maicStudioDraft={nav:d.nav};
 return true;
}
async function maicCmsLoad(){
 if(maicStudioPreviewRequested){
  try{
   const local=localStorage.getItem('maic_studio_draft_v1');
   if(local&&maicCmsApply(JSON.parse(local))){maicCmsSource='local-draft';return}
  }catch(e){console.warn('Local MAIC preview unavailable',e)}
 }
 try{
  const ctrl=new AbortController();
  const timeout=setTimeout(()=>ctrl.abort(),4500);
  let res;
  try{res=await fetch('/api/content',{signal:ctrl.signal,cache:'no-store',credentials:'omit'})}finally{clearTimeout(timeout)}
  if(!res.ok)return;
  const out=await res.json();
  if(maicCmsApply(out.document))maicCmsSource='published';
 }catch(e){console.warn('MAIC CMS unavailable; using original catalog',e)}
}
window.MAIC_CMS_READY=maicCmsLoad();
function maicStudioNav(keys){
 if(!maicStudioDraft)return keys;
 const allowed=new Set(keys);
 return [...new Set(maicStudioDraft.nav.filter(x=>x&&x.visible!==false&&allowed.has(x.id)).map(x=>x.id))];
}
function maicStudioMenuNav(keys){
 if(!maicStudioDraft)return keys;
 const defaults=new Set(keys);
 return [...new Set(maicStudioDraft.nav.filter(n=>n&&n.visible!==false&&(defaults.has(n.id)||String(n.id).startsWith('custom:'))).map(n=>n.id))];
}
function maicStudioLabel(key,lang,fallback){
 if(!maicStudioDraft)return fallback;
 const n=maicStudioDraft.nav.find(x=>x&&x.id===key);
 return n?String(lang==='ar'?n.ar:n.en):fallback;
}
function maicStudioCustom(id){return maicStudioDraft?.nav.find(x=>x&&x.id===id&&id.startsWith('custom:'))||null}
function maicStudioCustomHTML(id){
 const pg=maicStudioCustom(id);if(!pg)return '';
 const ar=state.lang==='ar',title=escapeHTML(ar?pg.ar:pg.en),body=String(ar?pg.contentAr:pg.contentEn).trim();
 const paras=body.split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+escapeHTML(p).replace(/\n/g,'<span class="maic-cms-newline"></span>')+'</p>').join('');
 return '<section class="inner-scene page-pad maic-cms-custom-page"><div class="inner-copy"><span class="eyebrow">MAIC · ACADEMY</span><h1>'+title+'</h1><div class="short-line"></div></div><div class="content-panel">'+(paras||'<p>'+escapeHTML(ar?'هذه الصفحة قيد الإعداد.':'This page is being prepared.')+'</p>')+'</div></section>';
}
if(maicStudioPreviewRequested)document.addEventListener('DOMContentLoaded',()=>{
 const bar=document.createElement('div');bar.className='maic-studio-preview-ribbon';
 bar.textContent=maicCmsSource==='local-draft'?'MAIC · LOCAL CONTENT PREVIEW — NOT PUBLISHED':'MAIC · PUBLIC CONTENT (NO LOCAL DRAFT)';
 document.body.appendChild(bar);
});
