'use strict';
const counters=document.querySelector('#summary'),list=document.querySelector('#courses'),status=document.querySelector('#status');
const controls=[...document.querySelectorAll('[data-status]')];
let data=[],selected='preparing';
function el(tag,text){const x=document.createElement(tag);if(text!=null)x.textContent=String(text);return x}
function metric(value,label){const card=el('div');card.className='metric';card.append(el('b',value),el('small',label));return card}
function yesNo(value){return value?'نعم':'لا'}
function render(){
 controls.forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.status===selected)));
 const rows=selected==='all'?data:data.filter(x=>x.status===selected);
 list.replaceChildren();status.textContent='عدد الدورات في هذه الفئة: '+rows.length;
 for(const item of rows){
  const section=el('article');section.className='item';
  section.append(el('h3',item.title));
  const details=el('div');details.className='details';
  for(const pair of [
   ['PDF مسجّل',item.hasPdf],['مراجعة PDF موثّقة',item.pdfReviewed],
   ['امتحان مفعّل ومطابق',item.activeExam],
   ['مراجعة كل أسئلته',item.activeExamHasItemReviews],
   ['بنك خاص',item.hasPrivateCandidate]
  ]){
   const x=el('span',pair[0]+': '+yesNo(pair[1]));details.append(x);
  }
  section.append(details);
  if(item.activeExamOpenBlockers)section.append(el('p','ملاحظات أكاديمية مفتوحة: '+item.activeExamOpenBlockers));
  const next=el('p','الخطوة التالية: '+item.nextAction);next.className='muted';
  section.append(next);list.append(section);
 }
 if(!rows.length)list.append(el('p','لا توجد دورات في هذه الفئة.'));
}
controls.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.status;render()}));
(async()=>{
 try{
  const response=await fetch('/api/admin/course-readiness',{credentials:'same-origin',cache:'no-store'});
  const json=await response.json();if(!response.ok)throw Error(json.error||'unavailable');
  data=json.rows;
  const counts=json.counts;counters.replaceChildren();
  for(const [n,t] of [
   [counts.published,'منشورة'],[counts.preparing,'قيد التحضير'],
   [counts.archived,'مؤرشفة'],[counts.withPdf,'PDF مسجّل'],
   [counts.withActiveExam,'امتحانات مفعّلة ومطابقة'],
   [counts.withPrivateCandidate,'بنوك خاصة للمراجعة']
  ])counters.append(metric(n,t));
  render();
 }catch(e){
  status.textContent='تعذر جلب حالة الدورات. تأكد من تسجيل دخول الإدارة أو جاهزية قاعدة البيانات.';
 }
})();
