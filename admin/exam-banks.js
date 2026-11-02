'use strict';
const el=id=>document.getElementById(id);
const bankList=el('banks'),courseSelect=el('course'),upload=el('upload'),stageMessage=el('message'),reviewMessage=el('reviewMessage'),drafts=el('drafts'),details=el('details');
let materials=[];
function node(tag,text,className){const e=document.createElement(tag);if(text!=null)e.textContent=String(text);if(className)e.className=className;return e;}
async function api(data,search=''){
 const response=await fetch('/api/admin/exam-banks'+search,{method:data?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});
 const json=await response.json();
 if(!response.ok)throw Object.assign(Error(json.error||'unavailable'),{status:response.status});
 return json;
}
function button(text,fn){const b=node('button',text);b.type='button';b.addEventListener('click',async()=>{b.disabled=true;reviewMessage.textContent='';try{await fn()}catch(e){reviewMessage.textContent='تعذر تنفيذ العملية: '+e.message}finally{b.disabled=false}});return b;}
async function refresh(){
 const data=await api();
 materials=data.materials;bankList.replaceChildren();courseSelect.replaceChildren();drafts.replaceChildren();
 const blank=node('option','—');blank.value='';courseSelect.append(blank);
 for(const m of data.materials){
  bankList.append(node('p',m.title+' — '+(m.status==='approved'?'100 سؤال معتمد':'بانتظار بنك معتمد')));
  const o=node('option',m.title);o.value=m.course_id;courseSelect.append(o);
 }
 if(!materials.length)bankList.append(node('p','لا توجد مواد محفوظة'));
 const records=data.banks||[];
 for(const b of records){
  const row=node('section',null,'question');
  row.append(node('p',b.course_id+' — '+b.question_count+'/100 — '+b.status+' — المُعدّ: '+(b.prepared_by||'غير موثق')));
  if(b.status==='draft'&&b.question_count===100){
   row.append(button('فتح المسودة للمراجعة',()=>openDraft(b.course_id,b.version)));
  }
  if(b.status==='approved'){
   row.append(button('إيقاف هذا الامتحان',async()=>{
    if(!confirm('هل تؤكد إيقاف الامتحان الحالي لهذا الكورس؟'))return;
    await api({action:'withdraw',courseId:b.course_id});await refresh();
   }));
  }
  drafts.append(row);
 }
 if(!records.length)drafts.append(node('p','لا توجد مسودات أو بنوك أسئلة مسجّلة في القاعدة حالياً'));
}
upload.addEventListener('submit',async e=>{
 e.preventDefault();const submit=el('send');submit.disabled=true;stageMessage.textContent='';
 try{
  const selected=materials.find(m=>m.course_id===courseSelect.value);
  if(!selected)throw Error('اختر الكورس');
  const f=el('bankfile').files?.[0];
  if(!f||f.size>350000||!f.name.toLowerCase().endsWith('.json'))throw Error('ملف JSON غير صالح أو يتجاوز الحد');
  const preparer=el('preparer').value.trim();if(preparer.length<3)throw Error('اسم المُعدّ مطلوب');
  const bank=JSON.parse(await f.text());
  if(bank.format!=='maic-mcq-v1'||!Array.isArray(bank.questions)||bank.questions.length!==100)throw Error('يجب أن يحتوي الملف على مائة سؤال بالضبط');
  if(!confirm('سيتم حفظ المسودة للمراجعة فقط دون ظهورها للطلاب. هل تريد المتابعة؟'))return;
  const result=await api({action:'stage',format:bank.format,questions:bank.questions,courseId:selected.course_id,sourceSha256:selected.sha256,preparedBy:preparer});
  stageMessage.textContent='حُفظت مسودة 100 سؤال، وهي غير منشورة. تشابه الصياغة: '+result.quality.nearPairs+' زوج؛ تكرار 3 خيارات أو أكثر: '+result.quality.optionOverlapPairs+' زوج';
  upload.reset();await refresh();
 }catch(error){stageMessage.textContent='تعذر حفظ المسودة: '+error.message}finally{submit.disabled=false}
});
async function openDraft(courseId,version){
 const data=await api(null,'?course='+encodeURIComponent(courseId)+'&version='+encodeURIComponent(version));
 details.replaceChildren();
 details.append(node('h3','مراجعة جميع الأسئلة — '+courseId),node('p','المُعدّ: '+data.bank.prepared_by));
 const quality=data.quality;
 const health=node('p','بصمة المادة: '+(data.sourceMatch?'مطابقة':'مختلفة')+' · الأسئلة المتشابهة: '+(quality?.nearPairs??'غير متاح')+' زوج · تكرار 3 خيارات: '+(quality?.optionOverlapPairs??'غير متاح')+' زوج · الحد الأعلى لتكرار البداية: '+(quality?.maxOpening??'-'),'review-status');
 details.append(health);
 if(!data.sourceMatch||!quality?.canApprove)details.append(node('p','لا يمكن اعتماد هذا البنك: النسخة المصدر مختلفة أو مستوى تكرار الأسئلة مرتفع. يلزم رفع مسودة مصححة.','review-status'));
 for(const q of data.questions){
  const block=node('section',null,'question');block.append(node('h3','السؤال '+q.ordinal),node('p',q.stem));
  q.options.forEach((value,i)=>block.append(node('p',String.fromCharCode(65+i)+'. '+value+(q.correct.includes(i)?' ✓':''),q.correct.includes(i)?'answer':'muted')));
  block.append(node('p','صفحة المصدر: '+q.page),node('p','التبرير: '+q.rationale));
  details.append(block);
 }
 if(!data.sourceMatch||!quality?.canApprove)return;
 const form=node('form');form.setAttribute('aria-label','اعتماد مراجعة أكاديمية مستقلة');
 const reviewName=node('input');reviewName.required=true;reviewName.maxLength=150;reviewName.placeholder='اسم المراجع الأكاديمي المستقل';
 const notes=node('textarea');notes.required=true;notes.minLength=30;notes.maxLength=2000;notes.placeholder='ملاحظات مراجعة المفاهيم والإجابات والأسئلة ومراجع الصفحات (30 حرفاً على الأقل)';
 form.append(node('h3','اعتماد مستقل بعد تدقيق جميع الأسئلة'),node('label','اسم المراجع (يجب أن يختلف عن اسم المُعدّ)'),reviewName,node('label','تقرير المراجعة الأكاديمية'),notes);
 const checks=[
  ['pdfFormatReviewed','راجعت المادة المنشورة بصيغة Tinos 12 والشعار الرسمي'],
  ['sourceReviewed','تحققت من مراجع الصفحات لكل الأسئلة المئة مقابل PDF المعتمد'],
  ['academicQualityReviewed','تحققت من صحة جميع الإجابات وخيارات التشتت وعدم وجود صياغات مضللة']
 ];
 const values={};
 for(const [key,label] of checks){
  const row=node('label'),input=node('input');input.type='checkbox';input.required=true;values[key]=input;row.append(input,node('span',label));form.append(row);
 }
 const submit=node('button','اعتماد الاختبار ونشره للطلاب');submit.type='submit';form.append(submit);
 form.addEventListener('submit',async event=>{
  event.preventDefault();submit.disabled=true;reviewMessage.textContent='';
  try{
   const reviewedBy=reviewName.value.trim(),reviewNotes=notes.value.trim();
   if(reviewedBy.toLocaleLowerCase('en')===String(data.bank.prepared_by).trim().toLocaleLowerCase('en'))throw Error('المراجع يجب أن يكون مختلفاً عن مُعدّ الأسئلة');
   if(!confirm('تأكيد: راجعت جميع أسئلة هذا البنك وتريد تفعيله للمتعلمين الذين أكملوا المادة؟'))return;
   await api({action:'approve',courseId,version,reviewedBy,reviewNotes,...Object.fromEntries(Object.entries(values).map(([key,input])=>[key,input.checked]))});
   reviewMessage.textContent='تم اعتماد الاختبار بعد المراجعة المستقلة';details.replaceChildren();await refresh();
  }catch(error){reviewMessage.textContent='لم يُعتمد الاختبار: '+error.message}finally{submit.disabled=false}
 });
 details.append(form);
}
refresh().catch(error=>{bankList.textContent=error.status===401?'يلزم تسجيل دخول المدير أولاً':'تعذر تحميل حالة بنوك الأسئلة'});
