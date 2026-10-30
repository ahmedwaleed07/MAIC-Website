'use strict';
/* MAIC enrollment UI: PREVIEW ONLY until a private backend, verified identity,
 * agent dashboard, administrator authorization and access-control gates exist.
 * Never save preview form PII, payment confirmations or course access in the browser.
 */
const MAIC_ENROLL_COPY={
 en:{
 eyebrow:'STUDENT ENROLLMENT · MAIC',title:'Student Registration & Enrollment',
 intro:'Create your learning account, choose a course, pay your assigned MAIC enrollment agent, and await MAIC approval before course access begins.',
 preview:'Development preview only — this form does not create a student account, submit an enrollment request, receive payment, or unlock any course.',
 step1:'1. Choose your course',step2:'2. Student information',step3:'3. Your designated agent',step4:'4. Confirmation and activation',
 courses:'Course of interest',chooseCourse:'Select a course',coursePrelaunch:'All listed courses are currently in preparation. Enrollment cannot be submitted yet.',
 first:'First name',last:'Last name',email:'Email address',mobile:'Mobile number',country:'Country of residence',chooseCountry:'Select your country',language:'Preferred learning language',
 note:'Additional notes (optional)',ack:'I understand this is a preview; no registration or payment request will be submitted.',
 assigned:'Assigned MAIC Enrollment Agent',local:'Local-country agent',fallback:'United States agent · international fallback',selection:'Choose a country to see who handles your enrollment and payment.',
 pay:'All course fees are paid directly to the assigned agent only. MAIC does not collect course fees through this website.',
 confirm:'The agent verifies receipt of payment, then the MAIC administration separately reviews and approves the enrollment. Only MAIC can activate course access.',
 previewButton:'Preview enrollment summary',review:'Preview summary — not submitted',previewText:'Your request was NOT submitted. No invoice was issued, no payment was received and no course was activated.',
 status:'Proposed administrative process',s1:'Student profile and course request',s2:'Payment to assigned agent',s3:'Agent confirms funds received',s4:'MAIC reviews and approves',s5:'MAIC activates course access',
 future:'Identity verification, secure registration, agent receipts and MAIC-only activation will be connected when the academy backend is approved.',
 viewFormats:'Explore courses',arabic:'Arabic',english:'English',courseType:'Learning format'
 },
 ar:{
 eyebrow:'MAIC · تسجيل المتعلّمين',title:'تسجيل المتعلّم والالتحاق بالدورات',
 intro:'يسجّل المتعلّم حسابه، ويختار الدورة، ويسدد رسومها لوكيل MAIC المخصص لبلده حصراً، ثم يخضع طلب الالتحاق لموافقة إدارة الأكاديمية لتفعيل الوصول.',
 preview:'نسخة تجريبية للتصميم فقط؛ هذه الاستمارة لا تنشئ حساباً حقيقياً ولا ترسل طلب تسجيل أو تتلقى مدفوعات أو تفتح الدورات.',
 step1:'١. اختيار الدورة',step2:'٢. بيانات المتعلّم',step3:'٣. الوكيل المخصص',step4:'٤. التأكيد وتفعيل الوصول',
 courses:'الدورة المطلوبة',chooseCourse:'اختر دورة',coursePrelaunch:'جميع الدورات الظاهرة حالياً قيد الإعداد، والتسجيل الفعلي بها لم يبدأ بعد.',
 first:'الاسم الأول',last:'اسم العائلة',email:'البريد الإلكتروني',mobile:'رقم الهاتف',country:'بلد الإقامة',chooseCountry:'اختر البلد',language:'لغة التعلّم المفضلة',
 note:'ملاحظات إضافية (اختياري)',ack:'أفهم أن هذا نموذج للمعاينة فقط ولن يُرسل طلب تسجيل أو دفع.',
 assigned:'وكيل تسجيل MAIC المخصص',local:'وكيل محلي للبلد',fallback:'وكيل الولايات المتحدة · الوكيل الدولي البديل',selection:'اختر بلد الإقامة لعرض وكيل التسجيل والتحصيل المخصص لك.',
 pay:'تُدفع رسوم الدورة للوكيل المحدد حصراً؛ موقع MAIC لا يستحصل رسوم الدورات مباشرة.',
 confirm:'يؤكد الوكيل استلام المبلغ، ثم تراجع إدارة MAIC التسجيل وتوافق عليه بصورة مستقلة. وتختص إدارة MAIC وحدها بتفعيل الدورة.',
 previewButton:'معاينة ملخص التسجيل',review:'ملخص تجريبي — لم يُرسل',previewText:'لم يُرسل طلبك، ولم تصدر فاتورة، ولم يُستلم دفع، ولم تُفعّل أي دورة.',
 status:'التسلسل الإداري المعتمد',s1:'إنشاء حساب الطالب وطلب الدورة',s2:'الدفع للوكيل المحدد',s3:'تأكيد استلام الرسوم من الوكيل',s4:'مراجعة وموافقة إدارة MAIC',s5:'تفعيل الدورة من إدارة MAIC',
 future:'سيتم ربط التحقق من الهوية والتسجيل الآمن وإيصالات الوكلاء والتفعيل الحصري للإدارة بعد اعتماد النظام الخلفي للأكاديمية.',
 viewFormats:'استعرض الدورات',arabic:'العربية',english:'الإنكليزية',courseType:'نوع التعلّم'
 }
};
delete MAIC_ENROLL_COPY.en.save;
function maicEnrollT(key){return (state.lang==='ar'?MAIC_ENROLL_COPY.ar:MAIC_ENROLL_COPY.en)[key]||key;}
function maicEnrollmentCountryNames(){
  let disp;try{disp=new Intl.DisplayNames([state.lang],{type:'region'});}catch{disp=null;}
  return (window.MAIC_COUNTRIES||[]).map(c=>({code:c.code,name:disp?.of(c.code)||c.name})).sort((a,b)=>a.name.localeCompare(b.name,state.lang));
}
function maicEnrollmentAgentText(assigned){
  if(!assigned)return '<p>'+escapeHTML(maicEnrollT('selection'))+'</p>';
  return maicRenderAgentCard(assigned,state.lang==='ar')+'<p class="maic-agent-card-policy">'+escapeHTML(maicEnrollT('pay'))+'</p>';
}
function renderEnrollmentPage(){
 const course=MAIC_COURSE_CATALOG.map(c=>'<option value="'+escapeHTML(c.id)+'">'+escapeHTML(state.lang==='ar'?c.ar:c.en)+'</option>').join('');
 const countries=maicEnrollmentCountryNames().map(c=>'<option value="'+c.code+'">'+escapeHTML(c.name)+'</option>').join('');
 const e=maicEnrollT;
 const form='<form id="maicEnrollmentPreviewForm" class="maic-enrollment-form">'+
 '<div class="maic-enroll-step"><h2>'+e('step1')+'</h2><label>'+e('courses')+'<select name="course" id="enrollmentCourse" required><option value="">'+e('chooseCourse')+'</option>'+course+'</select></label><p class="maic-enroll-warning">'+e('coursePrelaunch')+'</p></div>'+
 '<div class="maic-enroll-step"><h2>'+e('step2')+'</h2><div class="maic-enroll-fields"><label>'+e('first')+' *<input name="first" maxlength="70" autocomplete="given-name" required /></label><label>'+e('last')+' *<input name="last" maxlength="70" autocomplete="family-name" required /></label><label>'+e('email')+' *<input name="email" type="email" maxlength="150" autocomplete="email" required /></label><label>'+e('mobile')+' *<input name="mobile" type="tel" minlength="6" maxlength="28" autocomplete="tel" required /></label><label>'+e('country')+' *<select id="enrollmentCountry" name="country" required><option value="">'+e('chooseCountry')+'</option>'+countries+'</select></label><label>'+e('language')+' *<select name="learningLanguage" required><option value="ar">'+e('arabic')+'</option><option value="en">'+e('english')+'</option></select></label></div><label>'+e('note')+'<textarea name="note" rows="2" maxlength="500"></textarea></label></div>'+
 '<div class="maic-enroll-step"><h2>'+e('step3')+'</h2><div class="maic-enroll-agent" id="maicEnrollmentAgent" aria-live="polite">'+maicEnrollmentAgentText(null)+'</div></div>'+
 '<div class="maic-enroll-step"><h2>'+e('step4')+'</h2><p>'+e('confirm')+'</p><label class="maic-enroll-ack"><input name="previewConsent" type="checkbox" required /><span>'+e('ack')+'</span></label><button class="btn btn-gold" type="submit">'+e('previewButton')+icon('chevron')+'</button></div>'+
 '</form><div id="maicEnrollmentSummary" class="maic-enroll-summary" hidden aria-live="polite"></div>';
 const progress=['s1','s2','s3','s4','s5'].map((k,i)=>'<li><span>'+(i+1)+'</span>'+escapeHTML(e(k))+'</li>').join('');
 return '<div class="maic-enrollment-page"><section class="maic-enrollment-hero page-pad"><div class="maic-enrollment-wrap"><span class="eyebrow">'+e('eyebrow')+'</span><h1>'+e('title')+'</h1><p>'+e('intro')+'</p><div class="maic-enrollment-disclaimer">'+e('preview')+'</div></div></section><section class="maic-enrollment-body page-pad"><div class="maic-enrollment-layout"><div>'+form+'</div><aside class="maic-enroll-explainer"><h2>'+e('status')+'</h2><ol>'+progress+'</ol><p>'+e('future')+'</p><button type="button" data-nav="courses" class="btn">'+e('viewFormats')+'</button></aside></div></section></div>';
}
function maicRefreshEnrollmentAgent(){
 const country=document.querySelector('#enrollmentCountry');
 const panel=document.querySelector('#maicEnrollmentAgent');
 if(!panel||!country)return;
 panel.innerHTML=maicEnrollmentAgentText(maicAssignAgent(country.value));
 const summary=document.querySelector('#maicEnrollmentSummary');if(summary)summary.hidden=true;
}
function maicPreviewEnrollment(e){
 const f=e.target.closest('#maicEnrollmentPreviewForm');if(!f)return false;
 e.preventDefault();
 if(!f.reportValidity())return true;
 const d=new FormData(f),agent=maicAssignAgent(d.get('country'));
 if(!agent)return true;
 const course=MAIC_COURSE_CATALOG.find(c=>c.id===d.get('course'));
 if(!course)return true;
 const ar=state.lang==='ar';
 const box=document.querySelector('#maicEnrollmentSummary');
 const safeFirst=escapeHTML(String(d.get('first')||'').trim());
 const safeLast=escapeHTML(String(d.get('last')||'').trim());
 box.innerHTML='<h2>'+escapeHTML(maicEnrollT('review'))+'</h2><p><strong>'+safeFirst+' '+safeLast+'</strong> · '+escapeHTML(ar?course.ar:course.en)+'</p><p>'+escapeHTML(maicEnrollT('assigned'))+': <strong>'+escapeHTML(agent.agent.name)+'</strong></p><p>'+escapeHTML(maicEnrollT('previewText'))+'</p>';
 box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'nearest'});
 return true;
}
