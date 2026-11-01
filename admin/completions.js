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
   if(!c.mode.includes(s.delivery_mode))continue;
   const card=el('article'),name=[s.first_name,s.middle_name,s.last_name].filter(Boolean).join(' ');
   card.append(el('h2',name+' — '+c.en),el('p','البلد: '+s.country+' · الوكيل: '+s.agent_id));
   const form=el('div');form.className='groups';const label=el('label','نوع الدراسة');const select=document.createElement('select');for(const m of c.mode.filter(x=>x===s.delivery_mode)){const o=el('option',modes[m]||m);o.value=m;select.append(o)}label.append(select);
   const evidenceLabel=el('label','مرجع إثبات الإكمال');const evidence=document.createElement('input');evidence.placeholder='مرجع تقرير المدرس أو الاختبار';evidence.maxLength=500;evidenceLabel.append(evidence);form.append(label,evidenceLabel);
   const details=el('div');form.append(details);card.append(form);root.append(card);
   function update(){
    details.replaceChildren();const completion=model.completions.find(x=>x.student_id===s.id&&x.course_id===s.course_id&&x.mode===select.value);
    const cert=completion&&model.certificates.find(x=>x.completion_id===completion.id);
    details.append(el('p','حالة الإكمال: '+(completion?.status||'لم يكتمل')));
    if(cert){
     details.append(el('p','الشهادة: '+cert.certificate_number+' · '+cert.status));
     const url=new URL('/graduates/'+encodeURIComponent(cert.verification_token||''),location.origin).href;
     if(cert.verification_token&&typeof qrcode==='function'){
      const qr=qrcode(0,'M');qr.addData(url);qr.make();
      const svg=qr.createSvgTag({cellSize:5,margin:2});
      const wrap=el('div');wrap.innerHTML=svg;details.append(wrap);
      details.append(button('تنزيل QR بصيغة SVG',async()=>{
       const blob=new Blob([svg],{type:'image/svg+xml'}),src=URL.createObjectURL(blob),a=document.createElement('a');
       a.href=src;a.download=cert.certificate_number+'-QR.svg';a.click();setTimeout(()=>URL.revokeObjectURL(src),1000);
      }));
     }
     if(cert.status==='issued'){
      if(cert.certificate_type==='completion'&&window.MAICCertificateRenderer){
       const card=document.createElement('div');card.style.cssText='margin:18px 0;padding:12px;border:1px solid #b4976170;border-radius:9px';
       const preview=document.createElement('img');preview.src=MAICCertificateRenderer.asset;
       preview.alt='قالب شهادة إكمال MAIC الرسمي بمربع QR فارغ، يملأ عند الإصدار';
       preview.style.cssText='max-width:100%;width:560px;display:block;border:1px solid #b49761;border-radius:6px';
       card.append(preview,el('p','قالب الإكمال الرسمي المعتمد · رقم QR خاص بهذه الشهادة · شهادة غير موقّعة لا تُصدر كنسخة نهائية'));
       card.append(button('تنزيل مسودة PDF مع QR الخاص بالطالب',async()=>{
        const result=await MAICCertificateRenderer.render(cert,[],true);
        MAICCertificateRenderer.download(result.pdf,cert.certificate_number+'-DRAFT.pdf');
       }));
       const signatureLabels=['توقيع الرئيس President','توقيع رئيس القسم Head of Department','توقيع الوكيل Authorized Agent'],signatures=[];
       for(const labelText of signatureLabels){
        const label=document.createElement('label');label.style.cssText='display:grid;gap:4px;margin-block:8px';label.append(document.createTextNode(labelText));
        const file=document.createElement('input');file.type='file';file.accept='image/png,image/jpeg,image/webp';file.setAttribute('aria-label',labelText);label.append(file);card.append(label);signatures.push(file);
       }
       card.append(button('إنشاء وحفظ PDF الرسمي بالتواقيع الثلاثة و QR',async()=>{
        if(!signatures.every(input=>input.files&&input.files[0]))throw Error('يجب اختيار صور التواقيع الأصلية الثلاثة قبل الحفظ');
        if(!confirm('هل تملك الصلاحية لاعتماد هذه التواقيع الأصلية الثلاثة على شهادة هذا المتعلم؟'))return;
        const result=await MAICCertificateRenderer.render(cert,signatures.map(input=>input.files[0]),false);
        const response=await fetch('/api/admin/certificate-upload?id='+encodeURIComponent(cert.id),{
         method:'POST',credentials:'same-origin',
         headers:{'Content-Type':'application/pdf','X-MAIC-Approved-Template':'confirmed'},
         body:result.pdf
        });
        const outcome=await response.json();if(!response.ok)throw Error(outcome.error||'upload_failed');
        status.textContent='حُفظت الشهادة الأصلية مع QR والتواقيع الثلاثة في الحساب الخاص بالمتعلم';
       }));
       if(cert.pdf_ready)card.append(el('p','نسخة PDF الأصلية محفوظة في حساب المتعلم'));
       details.append(card);
      }
      const picker=document.createElement('input');picker.type='file';picker.accept='application/pdf';picker.setAttribute('aria-label','ملف الشهادة الأصلي PDF');details.append(picker);
      details.append(button('اعتماد ورفع PDF الأصلي',async()=>{
       const pdf=picker.files?.[0];if(!pdf||pdf.size>2500000)throw Error('اختر ملف PDF لا يتجاوز 2.5 MB');
       if(!confirm('هل هذا هو قالب الشهادة الأصلية المعتمد ويتضمن التواقيع الثلاثة ورمز QR الصحيح؟'))return;
       const response=await fetch('/api/admin/certificate-upload?id='+encodeURIComponent(cert.id),{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/pdf','X-MAIC-Approved-Template':'confirmed'},body:pdf});
       const result=await response.json();if(!response.ok)throw Error(result.error||'upload_failed');
      }));
     }
     return
    }
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