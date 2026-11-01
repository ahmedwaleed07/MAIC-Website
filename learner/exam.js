'use strict';
const q=new URL(location.href).searchParams.get('course')||'';
const exam=document.querySelector('#exam'),feedback=document.querySelector('#feedback'),title=document.querySelector('#title');
const saved=(()=>{try{return localStorage.getItem('maic_lang')||'en-US'}catch{return'en-US'}})();
const language=saved==='ar'?'ar':saved==='ku'?'ku':'en';
const T={
 en:{title:'Course Examination',load:'Loading examination…',back:'Learner Portal',pending:'The 100-question examination is being prepared and reviewed by MAIC.',studyFirst:'Please open your course PDF, study it carefully, and then confirm you have finished reviewing the material.',read:'Open course PDF',confirm:'I have finished reviewing this material',ready:'You are ready to begin your 100-question examination.',instructions:'Every question has four options. Select all answers you believe are correct; one or several may be correct. Once you select Next, you cannot return to any earlier question. Your grade is shown only after Question 100.',begin:'Start the exam',question:'Question',of:'of',choose:'Select one or more options',next:'Next question',finish:'Submit final answer',irreversible:'Your answer will be final. You cannot return to this question.',confirmNext:'Proceed to the next question? You cannot return to the current question.',confirmFinish:'Submit your final answer and receive your grade?',done:'Examination completed',result:'Your result',correct:'correct answers out of 100',noImmediateCert:'The result is recorded. Certificate eligibility remains subject to MAIC review and the selected certificate requirements.',error:'Unable to load or save this answer. Your current question has not advanced unless the server confirms it.',login:'Sign in to your learner account',reload:'Refresh',locked:'This examination is not available for your enrollment.'},
 ar:{title:'اختبار الدورة',load:'جارٍ تحميل الاختبار…',back:'بوابة المتعلم',pending:'اختبار الأسئلة المئة قيد إعداد المادة ومراجعة الأسئلة واعتمادها لدى الأكاديمية',studyFirst:'افتح ملف المادة العلمية وادرس محتواه بعناية، ثم أكّد أنك انتهيت من مراجعته',read:'فتح المادة العلمية PDF',confirm:'أؤكد أنني انتهيت من دراسة المادة العلمية',ready:'أنت جاهز للبدء باختبار مكوّن من ١٠٠ سؤال',instructions:'لكل سؤال أربعة خيارات. اختر جميع الإجابات التي تراها صحيحة، فقد تكون الإجابة واحدة أو أكثر. بعد الضغط على «السؤال التالي» لا يمكن العودة إلى أي سؤال سابق. لا يظهر تقييمك إلا بعد إنهاء السؤال المئة',begin:'بدء الاختبار',question:'السؤال',of:'من',choose:'اختر إجابة واحدة أو أكثر',next:'السؤال التالي',finish:'تسليم الإجابة الأخيرة',irreversible:'إجابتك نهائية، ولن تتمكن من الرجوع إلى هذا السؤال',confirmNext:'هل تريد الانتقال للسؤال التالي؟ لن تتمكن من العودة إلى هذا السؤال',confirmFinish:'هل تؤكد تسليم الإجابة الأخيرة وظهور النتيجة النهائية؟',done:'اكتمل الاختبار',result:'نتيجتك النهائية',correct:'إجابة صحيحة من أصل ١٠٠',noImmediateCert:'تم تسجيل النتيجة، ويبقى استحقاق الشهادة خاضعاً لمراجعة MAIC وشروط نوع الشهادة المختارة',error:'تعذّر تحميل السؤال أو حفظ الإجابة. لن يتغير رقم السؤال ما لم يؤكد الخادم الانتقال',login:'تسجيل الدخول إلى حساب المتعلم',reload:'تحديث',locked:'الاختبار غير متاح لهذا الاشتراك'},
 ku:{title:'تاقیکردنەوەی کۆرس',load:'تاقیکردنەوەکە بار دەکرێت…',back:'دەروازەی فێرخواز',pending:'تاقیکردنەوەی ١٠٠ پرسیار هێشتا لە قۆناغی ئامادەکردن و پێداچوونەوەدایە',studyFirst:'سەرەتا PDFـی کۆرسەکە بخوێنەوە، دواتر تەواوکردنی خوێندنەوە پشتڕاست بکەرەوە',read:'کردنەوەی PDF',confirm:'خوێندنەوەی ماددەکەم تەواو کردووە',ready:'ئامادەیت بۆ تاقیکردنەوەی ١٠٠ پرسیار',instructions:'هەر پرسیارێک چوار هەڵبژاردەی هەیە. ڕەنگە وەڵامی دروست یەک یان زیاتر بێت. دوای دوگمەی پرسیاری داهاتوو ناتوانیت بگەڕێیتەوە. ئەنجام تەنها لە کۆتاییدا دەردەکەوێت',begin:'دەستپێکردنی تاقیکردنەوە',question:'پرسیار',of:'لە',choose:'یەک یان زیاتر هەڵبژێرە',next:'پرسیاری داهاتوو',finish:'ناردنی وەڵامی کۆتایی',irreversible:'ناتوانیت بگەڕێیتەوە بۆ ئەم پرسیارە',confirmNext:'بچیت بۆ پرسیاری داهاتوو؟',confirmFinish:'وەڵامی کۆتایی بنێریت؟',done:'تاقیکردنەوە تەواو بوو',result:'ئەنجامی تۆ',correct:'وەڵامی دروست لە ١٠٠',noImmediateCert:'ئەنجام تۆمارکرا، بڕوانامە پێویستی بە پشتڕاستکردنەوەی MAIC هەیە',error:'هەڵەیەک لە پاشەکەوتکردندا ڕوویدا',login:'چوونەژوورەوە',reload:'نوێکردنەوە',locked:'ئەم تاقیکردنەوەیە بەردەست نییە'}
};
const tr=k=>T[language][k],esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.documentElement.lang=language;document.documentElement.dir=['ar','ku'].includes(language)?'rtl':'ltr';title.textContent=tr('title');
const h=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e};
function card(){const d=h('section',undefined,'exam-card');exam.replaceChildren(d);return d}
function link(text,url){const a=h('a',text,'button');a.href=url;return a}
function message(s){feedback.textContent=s||''}
function action(text,fn){const b=h('button',text);b.type='button';b.addEventListener('click',async()=>{b.disabled=true;message('');try{await fn()}catch(e){message(e.message||tr('error'));b.disabled=false}});return b}
async function request(path,body){
 const res=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 let data={};try{data=await res.json()}catch{}
 if(!res.ok){const err=new Error(data.error==='already_advanced'?tr('error'):(data.error||tr('error')));err.code=res.status;throw err}
 return data
}
async function load(){
 message('');if(!/^[-a-z0-9]{2,80}$/.test(q)){card().append(h('p',tr('locked')));return}
 try{const data=await request('/api/learner/exam?course='+encodeURIComponent(q));render(data)}
 catch(err){const d=card();d.append(h('p',err.code===401?tr('login'):tr('locked')));d.append(link(tr('back'),'./'))}
}
function render(data){
 const d=card();message('');
 if(data.state==='pending'||data.state==='unavailable'){d.append(h('p',tr('pending')));d.append(link(tr('back'),'./'));return}
 if(data.state==='study_required'){
  d.append(h('h2',tr('studyFirst')));d.append(link(tr('read'),'/api/learner/material?course='+encodeURIComponent(q)));
  const actionGroup=h('div',undefined,'exam-actions');
  actionGroup.append(action(tr('confirm'),async()=>{
   const study=await request('/api/learner/study?course='+encodeURIComponent(q));
   if(!study.opened)throw Error(tr('studyFirst'));
   await request('/api/learner/study',{action:'confirm-reviewed',course:q,confirmed:true});await load();
  }));
  d.append(actionGroup);return;
 }
 if(data.state==='ready'){
  d.append(h('h2',tr('ready')),h('p',tr('instructions'),'exam-note'));
  const actions=h('div',undefined,'exam-actions');actions.append(action(tr('begin'),async()=>render(await request('/api/learner/exam',{action:'start',course:q}))));d.append(actions);return;
 }
 if(data.state==='submitted'){
  d.append(h('h2',tr('done')),h('p',tr('result')));
  d.append(h('div',String(data.correct)+' / 100','grade'),h('p',tr('correct')),h('p',tr('noImmediateCert'),'exam-note'),link(tr('back'),'./'));return;
 }
 if(data.state!=='in_progress'||!data.question){d.append(h('p',tr('error')));d.append(action(tr('reload'),load));return}
 d.append(h('p',tr('question')+' '+data.current+' '+tr('of')+' '+data.total,'muted'));
 const progress=h('div',undefined,'exam-progress'),inner=h('div');inner.style.width=(100*(data.current-1)/100)+'%';progress.append(inner);d.append(progress);
 d.append(h('h2',data.question.stem),h('p',tr('choose'),'muted'));
 const form=h('fieldset',undefined,'options');form.setAttribute('aria-label',tr('choose'));
 data.question.options.forEach((option,index)=>{
  const label=h('label',undefined,'option'),input=document.createElement('input');input.type='checkbox';input.value=String(index);input.name='answer';label.append(input,h('span',String.fromCharCode(65+index)+'. '+option));form.append(label);
 });
 d.append(form,h('p',tr('irreversible'),'exam-note'));
 const actions=h('div',undefined,'exam-actions'),last=data.current===100;
 const next=action(last?tr('finish'):tr('next'),async()=>{
  const selections=[...form.querySelectorAll('input:checked')].map(x=>Number(x.value));
  if(!selections.length)throw Error(tr('choose'));
  if(!confirm(last?tr('confirmFinish'):tr('confirmNext')))return;
  render(await request('/api/learner/exam',{action:'next',course:q,ordinal:data.current,selections}));
 });
 actions.append(next);d.append(actions);
}
load();