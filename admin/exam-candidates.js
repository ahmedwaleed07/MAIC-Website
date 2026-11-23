'use strict';
const status=document.querySelector('#state');
const mount=document.querySelector('#list');
function element(tag,text){const el=document.createElement(tag);if(text!=null)el.textContent=String(text);return el}
(async()=>{
 try{
  const res=await fetch('/api/admin/exam-candidates',{credentials:'same-origin',cache:'no-store'});
  const data=await res.json();
  if(!res.ok)throw Error(data.error||'unauthorized');
  status.textContent='عدد المسودات: '+data.count+' · كل نسخة تحت المراجعة، وليست امتحاناً منشوراً.';
  mount.replaceChildren();
  for(const item of data.candidates){
   const card=element('section');card.className='entry';
   const top=element('div');top.className='row';
   const title=element('strong',item.course_id);
   const link=element('a','تنزيل نسخة للمراجعة الداخلية');
   link.className='action';
   link.href='/api/admin/exam-candidates?course='+encodeURIComponent(item.course_id);
   link.setAttribute('aria-label','تحميل مسودة '+item.course_id+' للمراجعة الداخلية فقط');
   top.append(title,link);
   const meta=element('div',item.question_count+' سؤال · غير معتمد · PDF مسجّل: '+(item.has_registered_pdf?'نعم':'لا')+' · آخر استيراد: '+item.imported_at);
   meta.className='muted';
   card.append(top,meta);mount.append(card);
  }
  if(!data.candidates.length)mount.textContent='لا توجد مسودات محفوظة.';
 }catch(error){
  status.textContent='تعذر عرض المسودات. تأكد من تسجيل دخول المدير، أو تحقق من اتصال قاعدة البيانات.';
  mount.replaceChildren();
 }
})();
