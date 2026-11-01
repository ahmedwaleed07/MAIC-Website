'use strict';
const list=document.querySelector('#banks'),course=document.querySelector('#course'),form=document.querySelector('#upload'),status=document.querySelector('#message'),file=document.querySelector('#bankfile'),send=document.querySelector('#send');
let materials=[];
function el(tag,text){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e}
async function refresh(){
 const r=await fetch('/api/admin/exam-banks',{cache:'no-store',credentials:'same-origin'}),d=await r.json();
 if(!r.ok)throw Error(d.error||'unauthorized');
 materials=d.materials;list.replaceChildren();course.replaceChildren(el('option','—'));course.lastElementChild.value='';
 for(const m of materials){
  const p=el('p',m.title+' — '+(m.status==='approved'?'100 سؤال معتمد':'بانتظار بنك الأسئلة المعتمد'));
  list.append(p);const o=el('option',m.title);o.value=m.course_id;course.append(o);
 }
 if(!materials.length)list.append(el('p','لم توجد مواد مسجلة للدورات'));
}
form.addEventListener('submit',async e=>{
 e.preventDefault();send.disabled=true;status.textContent='';
 try{
  const m=materials.find(x=>x.course_id===course.value);if(!m)throw Error('حدد الدورة');
  const f=file.files[0];if(!f||f.size>350000||!f.name.toLowerCase().endsWith('.json'))throw Error('ملف غير صالح أو أكبر من المسموح');
  const d=JSON.parse(await f.text());
  if(d.format!=='maic-mcq-v1'||!Array.isArray(d.questions)||d.questions.length!==100)throw Error('يجب أن يحتوي الملف على 100 سؤال وفق المخطط المعتمد');
  if(!document.querySelector('#pdfChecked').checked||!document.querySelector('#sourceChecked').checked||!document.querySelector('#qualityChecked').checked)throw Error('لا يمكن النشر قبل اكتمال إقرارات المراجعة');
  const who=document.querySelector('#reviewer').value.trim();if(who.length<3)throw Error('أدخل اسم المراجع');
  if(!confirm('هل راجعت فعلياً كل الأسئلة المئة والـPDF المعتمد وترغب بنشر الاختبار للمتعلمين؟'))return;
  const payload={...d,courseId:m.course_id,sourceSha256:m.sha256,reviewedBy:who,pdfFormatReviewed:true,sourceReviewed:true,academicQualityReviewed:true};
  const res=await fetch('/api/admin/exam-banks',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify(payload)});
  const result=await res.json();if(!res.ok)throw Error(result.error||'upload_failed');
  status.textContent='نجح اعتماد الاختبار: 100 سؤال للدورة '+m.title;await refresh();form.reset();
 }catch(err){status.textContent='تعذر الاعتماد: '+err.message}finally{send.disabled=false}
});
refresh().catch(()=>{list.textContent='يجب تسجيل دخول مدير الأكاديمية أولاً';status.textContent='تعذر جلب الكورسات'});
