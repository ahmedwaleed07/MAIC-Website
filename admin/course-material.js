'use strict';
const materials=document.querySelector('#materials'),history=document.querySelector('#history'),course=document.querySelector('#course'),file=document.querySelector('#file'),message=document.querySelector('#message'),upload=document.querySelector('#upload'),form=document.querySelector('#manual');
let source=[];
async function refresh(){
 const response=await fetch('/api/admin/course-material',{credentials:'same-origin',cache:'no-store'});
 const data=await response.json();if(!response.ok)throw Error(data.error||'unavailable');
 source=data.materials;materials.replaceChildren();history.replaceChildren();
 course.replaceChildren();const blank=document.createElement('option');blank.value='';blank.textContent='—';course.append(blank);
 for(const m of source){
  const row=document.createElement('div');row.className='row';
  row.textContent=m.title+' — '+m.pages+' صفحة — آخر تحديث: '+m.updated_at+' — SHA-256: '+m.sha256.slice(0,12)+'…';
  materials.append(row);const option=document.createElement('option');option.value=m.course_id;option.textContent=m.title;course.append(option);
 }
 for(const h of data.revisions){
  const row=document.createElement('div');row.className='row';
  row.textContent=h.course_id+' | '+h.created_at+' | المراجع: '+h.reviewed_by+' | SHA '+h.new_sha256.slice(0,12)+'…';
  history.append(row);
 }
 if(!data.revisions.length)history.textContent='لا توجد نسخ تمت ترقيتها عبر هذه اللوحة بعد';
}
form.addEventListener('submit',async event=>{
 event.preventDefault();message.textContent='';upload.disabled=true;
 try{
  const selected=source.find(m=>m.course_id===course.value);
  const doc=file.files?.[0];
  if(!selected||!doc||doc.type!=='application/pdf'&& !doc.name.toLowerCase().endsWith('.pdf')||doc.size>1250000)throw Error('اختر ملف PDF صالحاً لا يتجاوز 1.25 MB');
  const reviewer=document.querySelector('#reviewer').value.trim();
  if(reviewer.length<3)throw Error('أدخل اسم المسؤول عن مراجعة المادة');
  if(!document.querySelector('#checkContent').checked||!document.querySelector('#checkStyle').checked)throw Error('يجب اعتماد مراجعة المادة والخط والهوية أولاً');
  if(!confirm('تأكيد: تم تدقيق الملف علمياً وصفحة بصفحة؛ هل تريد استبدال نسخة الدورة '+selected.title+' الموجودة في موقع MAIC؟'))return;
  const response=await fetch('/api/admin/course-material?course='+encodeURIComponent(selected.course_id),{
    method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/pdf','X-MAIC-Reviewed':'yes','X-MAIC-Format':'Tinos12-BW','X-MAIC-Reviewer':reviewer},body:doc
  });
  const result=await response.json();if(!response.ok)throw Error(result.error||'upload_failed');
  message.textContent=result.unchanged?'هذا نفس الملف المخزن حالياً ولم يتغير شيء':'تم رفع الملف المعتمد وتحديث بصمته: '+result.sha256;
  form.reset();await refresh();
 }catch(e){message.textContent='تعذّر الاعتماد: '+e.message}finally{upload.disabled=false}
});
refresh().catch(()=>{materials.textContent='يلزم تسجيل دخول المدير أو التحقق من جاهزية قاعدة البيانات';history.replaceChildren()});
