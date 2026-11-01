'use strict';
const status=document.querySelector('#status'),root=document.querySelector('#results');const modes={'self-paced':'Self-Paced Online',group:'Live Group Classroom','one-on-one':'One-on-One Private'};
function el(tag,text){const x=document.createElement(tag);if(text!=null)x.textContent=String(text);return x}
async function api(url,body){const r=await fetch(url,{credentials:'same-origin',cache:'no-store',method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});const d=await r.json();if(!r.ok)throw Object.assign(Error(d.error||'unavailable'),{status:r.status});return d}
function button(text,fn){const b=el('button',text);b.onclick=async()=>{b.disabled=true;try{await fn();await load()}catch(e){status.textContent='تعذر تحديث السجل: '+e.message; b.disabled=false}};return b}
async function load(){
 try{
  const [model,catalog]=await Promise.all([api('/api/admin/completions'),api('/api/content')]);
  const courses=catalog.document.courses;root.replaceChildren();
  status.textContent='عدد اشتراكات المتعلمين: '+model.students.length+(model.issuanceConfigured?' · خدمة الإصدار مهيأة':' · إصدار PDF غير مفعّل');
  for(const s of model.students){
   const c=courses.find(x=>x.id===s.course_id);if(!c)continue;
   const card=el('article'),name=[s.first_name,s.middle_name,s.last_name].filter(Boolean).join(' ');
   card.append(el('h2',name+' — '+c.en),el('p','البلد: '+s.country+' · الوكيل: '+s.agent_id));
   const form=el('div');form.className='groups';const label=el('label','نوع الدراسة');const select=document.createElement('select');for(const m of c.mode){const o=el('option',modes[m]||m);o.value=m;select.append(o)}label.append(select);
   const evidenceLabel=el('label','مرجع إثبات الإكمال');const evidence=document.createElement('input');evidence.placeholder='مرجع تقرير المدرس أو الاختبار';evidence.maxLength=500;evidenceLabel.append(evidence);form.append(label,evidenceLabel);
   const details=el('div');form.append(details);card.append(form);root.append(card);
   function update(){
    details.replaceChildren();const completion=model.completions.find(x=>x.student_id===s.id&&x.course_id===s.course_id&&x.mode===select.value);
    const cert=completion&&model.certificates.find(x=>x.completion_id===completion.id);
    details.append(el('p','حالة الإكمال: '+(completion?.status||'لم يكتمل')));
    if(cert){details.append(el('p','الشهادة: '+cert.certificate_number+' · '+cert.status));return}
    const payload={studentId:s.id,courseId:s.course_id,mode:select.value};
    if(!completion||completion.status==='in_progress'||completion.status==='rejected'){
     details.append(button('توثيق إكمال الدورة',async()=>{
      if(evidence.value.trim().length<5)throw Error('يجب إدخال مرجع موثق لتقييم الدارس');
      if(!confirm('هل تملك الإدارة إثباتاً صحيحاً لإكمال المتعلم؟'))return;
      await api('/api/admin/completions',{...payload,action:'complete',evidenceRef:evidence.value.trim()})
     }));
    }else if(completion.status==='completed'){
     details.append(el('p','مرجع الإثبات: '+completion.evidence_ref),button('التحقق واعتماد الإكمال',async()=>{
      if(!confirm('هل تحققت من أدلة التقييم والحضور بحسب شروط الدورة؟'))return;
      await api('/api/admin/completions',{...payload,action:'verify',confirmEvidence:true})
     }));
    }else if(completion.status==='verified'){
     const b=button('إصدار شهادة إكمال',async()=>{
      if(!confirm('إصدار شهادة رسمية لهذا المتعلم؟'))return;
      await api('/api/admin/completions',{...payload,action:'issue',certificateType:'completion'})
     });
     b.disabled=!model.issuanceConfigured;b.title=b.disabled?'ربط قالب الشهادة والـPDF مطلوب قبل الإصدار':'';details.append(b,el('p','الإكمال موثّق، وسيكون إصدار الشهادة بعد تجهيز القالب الرسمي'))
    }
   }select.onchange=update;update();
  }
  if(!model.students.length)root.append(el('p','لا يوجد متعلمون لديهم دورات مفعّلة حالياً'));
 }catch(e){status.textContent=e.status===401?'يجب تسجيل دخول المدير أولاً':'قاعدة بيانات الشهادات غير مهيّأة حالياً';root.replaceChildren();const a=el('a','تسجيل دخول الإدارة');a.href='./';root.append(a)}
}
load();