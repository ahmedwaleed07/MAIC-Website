'use strict';
const list=document.querySelector('#list'),status=document.querySelector('#status');
const sequence={awaiting_agent_quote:'awaiting_payment',awaiting_payment:'payment_confirmed',payment_confirmed:'printing',printing:'shipped',shipped:'delivered'};
const labels={awaiting_agent_quote:'بانتظار عرض السعر من الوكيل',awaiting_payment:'بانتظار الدفع للوكيل',payment_confirmed:'دفع مؤكد لدى الوكيل',printing:'قيد الطباعة',shipped:'تم الشحن',delivered:'تم التسليم',cancelled:'ملغي'};
function el(tag,value,klass){const x=document.createElement(tag);if(value!=null)x.textContent=String(value);if(klass)x.className=klass;return x}
async function api(data){const r=await fetch('/api/admin/originals',{method:data?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});const b=await r.json();if(!r.ok)throw Object.assign(Error(b.error),{status:r.status});return b}
async function refresh(){
 try{const data=await api();list.replaceChildren();status.textContent=data.requests.length?'الطلبات المسجلة: '+data.requests.length:'لا توجد طلبات حالياً';
 for(const r of data.requests){const card=el('article',null,'card');
  card.append(el('h2',r.graduate_full_name+' — '+r.course_title),el('p','الشهادة: '+r.certificate_number),el('p','الوكيل: '+r.agent_id),el('p','حالة الإشعار: '+(r.notification_status||'غير موجود')),el('p','حالة الطلب: '+(labels[r.status]||r.status)));
  card.append(el('p','المستلم: '+r.recipient_name+'\nالهاتف: '+r.recipient_phone+'\nالبلد: '+r.shipping_country+'\nالعنوان: '+r.shipping_address+'\nالرمز البريدي: '+r.postal_code,'details'));
  if(r.fee_amount)card.append(el('p','الأجور: '+r.fee_amount+' '+r.fee_currency));if(r.tracking_reference)card.append(el('p','التتبع: '+r.tracking_reference));
  const next=sequence[r.status];
  if(next){const button=el('button','تحديث إلى: '+(labels[next]||next));button.onclick=async()=>{
   const payload={id:r.id,status:next};if(next==='awaiting_payment'){payload.feeAmount=prompt('الأجور التي حددها الوكيل (بدون العملة)')||'';payload.feeCurrency=(prompt('العملة USD / IQD / EUR ...')||'').toUpperCase()}
   if(next==='payment_confirmed'){payload.paymentReference=prompt('مرجع تحصيل الأجور لدى الوكيل')||'';payload.agentConfirmed=confirm('هل وصل تأكيد استلام الدفع من الوكيل المعتمد؟')}
   if(next==='shipped')payload.trackingReference=prompt('رقم الشحنة أو التتبع')||'';
   if(!confirm('تأكيد تحديث حالة الطلب؟'))return;button.disabled=true;try{await api(payload);await refresh()}catch(e){status.textContent='تعذر التحديث: '+e.message;button.disabled=false}
  };card.append(button)}
  if(!['delivered','cancelled','shipped'].includes(r.status)){const cancel=el('button','إلغاء الطلب');cancel.onclick=async()=>{if(!confirm('إلغاء هذا الطلب؟'))return;try{await api({id:r.id,status:'cancelled'});await refresh()}catch(e){status.textContent='تعذر الإلغاء: '+e.message}};card.append(cancel)}
  list.append(card)}
 }catch(e){status.textContent=e.status===401?'يجب تسجيل الدخول إلى لوحة الإدارة أولاً':'خدمة الطلبات غير مهيّأة بعد';list.replaceChildren();const link=el('a','تسجيل الدخول');link.href='./';list.append(link)}}
refresh();