'use strict';
const lang=(()=>{try{return localStorage.getItem('maic_lang')||'en-US'}catch{return'en-US'}})();
const ar=lang==='ar',ku=lang==='ku';
const strings={
 en:{title:'My Certificates',intro:'View your issued certificates, their verification records and requests for printed originals.',none:'No certificates have been issued to your account yet.',login:'Please sign in to your learner account first.',link:'Verify certificate',download:'Download PDF',notReady:'PDF is being prepared',share:'Publish graduate record',unshare:'Remove public listing',consent:'When you publish, your full name, country, course and agent become visible to anyone with your link or through the graduate register. You may withdraw publication later.',order:'Request printed original',recipient:'Recipient full name',phone:'Recipient telephone',address:'Full shipping address',country:'Shipping country (2-letter code)',postal:'Postal code (optional)',submit:'Send request to your agent',status:'Request status',requested:'Your request has been recorded for the designated agent. Agent delivery and service charges must be confirmed separately.',agent:'Authorized agent',waiting:'Awaiting fee quotation',error:'Unable to complete request.',cert:'Certificate',issued:'Issued'},
 ar:{title:'شهاداتي',intro:'شهاداتك الصادرة وروابط التحقق منها وتنزيل نسخ PDF وطلبات النسخ الورقية الأصلية',none:'لا توجد شهادات صادرة لحسابك حتى الآن',login:'يرجى تسجيل الدخول إلى حساب المتعلم أولاً',link:'التحقق من الشهادة',download:'تنزيل PDF',notReady:'ملف الشهادة قيد التجهيز',share:'نشر السجل في سجل الخريجين',unshare:'إلغاء عرض السجل للعامة',consent:'عند النشر يظهر اسمك الكامل وبلدك ودورتك ووكيلك لكل من يفتح الرابط أو سجل الخريجين، ويمكن إلغاء النشر لاحقاً',order:'طلب النسخة الورقية الأصلية',recipient:'الاسم الكامل للمستلم',phone:'هاتف المستلم',address:'عنوان الشحن الكامل',country:'رمز بلد الشحن (حرفان)',postal:'الرمز البريدي (اختياري)',submit:'إرسال الطلب إلى الوكيل',status:'حالة الطلب',requested:'تم تسجيل الطلب باسم الوكيل المعتمد، ويُستكمل تحديد الأجور وإبلاغ الوكيل عبر النظام بعد تفعيل قنواته',agent:'الوكيل المعتمد',waiting:'بانتظار تحديد أجور الشحن',error:'تعذّر إكمال الطلب',cert:'الشهادة',issued:'تاريخ الإصدار'},
 ku:{title:'بڕوانامەکانم',intro:'بڕوانامە دەرچووەکان و بەستەری پشتڕاستکردنەوە و داواکاری نوسخەی چاپکراو',none:'هێشتا هیچ بڕوانامەیەک دەرنەچووە',login:'تکایە سەرەتا بچۆ ژوورەوە',link:'پشتڕاستکردنەوە',download:'داگرتنی PDF',notReady:'PDF ئامادە دەکرێت',share:'بڵاوکردنەوەی تۆماری دەرچوو',unshare:'لابردنی تۆماری گشتی',consent:'کاتێک بڵاوی دەکەیتەوە ناو و وڵات و کۆرس و بریکارەکەت دەبینرێت',order:'داواکردنی نوسخەی چاپکراو',recipient:'ناوی وەرگر',phone:'تەلەفۆن',address:'ناونیشانی تەواو',country:'کۆدی وڵات',postal:'کۆدی پۆست',submit:'ناردنی داواکاری',status:'دۆخی داواکاری',requested:'داواکاری تۆمار کرا و تێچوو لەلایەن بریکار دیاری دەکرێت',agent:'بریکاری ڕێپێدراو',waiting:'چاوەڕوانی نرخ',error:'داواکاری سەرکەوتوو نەبوو',cert:'بڕوانامە',issued:'دەرچوو'}
};
const t=k=>(ar?strings.ar:ku?strings.ku:strings.en)[k];
document.documentElement.lang=lang;document.documentElement.dir=ar||ku?'rtl':'ltr';
document.querySelector('#title').textContent=t('title');document.querySelector('#intro').textContent=t('intro');
const root=document.querySelector('#certificates'),status=document.querySelector('#status');
function elt(tag,txt,cls){const e=document.createElement(tag);if(txt!=null)e.textContent=String(txt);if(cls)e.className=cls;return e}
async function api(payload){const r=await fetch('/api/learner/certificates',{method:payload?'POST':'GET',headers:payload?{'Content-Type':'application/json'}:{},body:payload?JSON.stringify(payload):undefined,cache:'no-store',credentials:'same-origin'});const d=await r.json();if(!r.ok)throw Object.assign(Error(d.error||'unavailable'),{status:r.status});return d}
async function load(){
 try{
  const data=await api();root.replaceChildren();status.textContent='';
  if(!data.certificates.length){root.append(elt('p',t('none')));return}
  for(const c of data.certificates){
   const article=elt('article',null,'card'),title=elt('h2',c.course_title),subtitle=elt('p',(c.certificate_type==='completion'?'Certificate of Completion':'Certificate of Participation')+' · '+c.certificate_number),meta=elt('p',t('issued')+': '+c.issued_at.slice(0,10)+' · '+t('agent')+': '+c.agent_name),actions=elt('div',null,'actions');
   article.append(title,subtitle,meta);
   if(c.public_consent){
    const verify=elt('a',t('link'),'btn secondary');verify.href='/graduates/'+encodeURIComponent(c.verification_token);verify.target='_blank';verify.rel='noopener';actions.append(verify);
   }
   if(c.pdf_ready){const download=elt('a',t('download'),'btn');download.href='/api/learner/certificate-pdf?id='+encodeURIComponent(c.id);actions.append(download)}
   else{const pending=elt('button',t('notReady'));pending.disabled=true;actions.append(pending)}
   const publication=elt('button',c.public_consent?t('unshare'):t('share'),'secondary');
   publication.addEventListener('click',async()=>{if(!c.public_consent&&!confirm(t('consent')))return;publication.disabled=true;try{await api({action:'set-publication',certificateId:c.id,consent:!c.public_consent});await load()}catch{status.textContent=t('error')}finally{publication.disabled=false}});
   actions.append(publication);
   const request=elt('button',t('order'),'secondary');article.append(actions);
   const existing=data.originals.find(o=>o.certificate_id===c.id&&o.status!=='cancelled');
   if(existing){article.append(elt('p',t('status')+': '+existing.status+(existing.fee_amount?' · '+existing.fee_amount+' '+existing.fee_currency:'')))}
   else if(c.status==='issued'){
    actions.append(request);
    const form=elt('form',null,'form');form.hidden=true;
    const fields=[['recipientName',t('recipient'),'text',true],['recipientPhone',t('phone'),'tel',true],['address',t('address'),'textarea',true],['country',t('country'),'text',true],['postalCode',t('postal'),'text',false]];
    for(const [key,label,type,required] of fields){const wrapper=elt('label',label),input=document.createElement(type==='textarea'?'textarea':'input');input.name=key;if(type!=='textarea')input.type=type;input.required=required;if(key==='country'){input.maxLength=2;input.placeholder='IQ'}wrapper.append(input);form.append(wrapper)}
    const send=elt('button',t('submit'));send.type='submit';form.append(send);
    request.addEventListener('click',()=>{form.hidden=!form.hidden});
    form.addEventListener('submit',async e=>{e.preventDefault();send.disabled=true;try{const d=Object.fromEntries(new FormData(form));await api({action:'request-original',certificateId:c.id,...d});status.textContent=t('requested');await load()}catch{status.textContent=t('error')}finally{send.disabled=false}});
    article.append(form);
   }
   root.append(article);
  }
 }catch(e){status.textContent=e.status===401?t('login'):t('error');if(e.status===401){const a=elt('a','Learner Portal Login');a.href='/learner/';root.replaceChildren(a)}}
}
load();