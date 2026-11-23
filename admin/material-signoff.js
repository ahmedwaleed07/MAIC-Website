'use strict';
const form=document.querySelector('#signoff');
const select=document.querySelector('#course');
const source=document.querySelector('#source');
const message=document.querySelector('#message');
let materials=[];
async function refresh(){
 const response=await fetch('/api/admin/material-signoff',{credentials:'same-origin',cache:'no-store'});
 const data=await response.json();
 if(!response.ok)throw Error(data.error||'unavailable');
 materials=data.materials;
 select.replaceChildren();
 const blank=document.createElement('option');blank.value='';blank.textContent='—';select.append(blank);
 for(const item of materials){
  const option=document.createElement('option');option.value=item.courseId;
  option.textContent=item.title+(item.academicReviewRecorded?' — مراجعة موثقة':' — مراجعة بشرية غير مسجلة');
  select.append(option);
 }
}
select.addEventListener('change',()=>{
 const m=materials.find(x=>x.courseId===select.value);
 source.replaceChildren();
 if(m){
  const caption=document.createElement('span');
  caption.textContent='بصمة ملف PDF الحالي: '+m.sourceSha256+(m.academicReviewRecorded?' · المراجع: '+m.reviewerName:'')+' · ';
  const link=document.createElement('a');
  link.textContent='فتح هذه النسخة للتحقق قبل التوقيع';
  link.href='/api/admin/material-preview?course='+encodeURIComponent(m.courseId)+'&sha='+encodeURIComponent(m.sourceSha256);
  link.target='_blank';link.rel='noopener noreferrer';
  source.append(caption,link);
 }
});
form.addEventListener('submit',async event=>{
 event.preventDefault();
 const button=document.querySelector('#submit');
 button.disabled=true;message.textContent='';
 try{
  const item=materials.find(x=>x.courseId===select.value);
  if(!item)throw Error('اختر كورساً');
  if(item.academicReviewRecorded)throw Error('المراجعة موثقة مسبقاً لهذه النسخة');
  const reviewerName=document.querySelector('#reviewer').value.trim();
  const reviewDate=document.querySelector('#reviewDate').value;
  const reviewNotes=document.querySelector('#notes').value.trim();
  if(!confirm('هل تؤكد أن مراجعاً أكاديمياً بشرياً راجع هذه النسخة نفسها، وأنك توثّق مراجعة حقيقية؟'))return;
  const response=await fetch('/api/admin/material-signoff',{
   method:'POST',credentials:'same-origin',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({courseId:item.courseId,reviewerName,reviewDate,reviewNotes,
     ownerAttestation:document.querySelector('#attest').checked})
  });
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'unavailable');
  message.textContent='تم توثيق المراجعة لملف PDF ذي البصمة '+result.sourceSha256.slice(0,12)+'… دون تفعيل الامتحان.';
  form.reset();source.textContent='';await refresh();
 }catch(e){message.textContent='تعذر التسجيل: '+e.message;}
 finally{button.disabled=false;}
});
refresh().catch(()=>{message.textContent='يلزم تسجيل دخول المدير أو التأكد من قاعدة البيانات';});
