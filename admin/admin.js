'use strict';
(()=> {
const KEY='maic_studio_draft_v1';
const $=s=>document.querySelector(s);
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));
const genId=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
const mainNav=['home','library','courses','about','agents','support','contact','languages','michigan'];
const nativeNames={
library:['MAIC Library','مكتبة مايك'],home:['Home','الرئيسية'],michigan:['Michigan','مشيغان'],courses:['Courses','الدورات'],
educators:['Educators and Organizations','المعلمون والمؤسسات'],learners:['Learners','المتعلمون'],products:['Learning Products','المنتجات التعليمية'],community:['Community','المجتمع'],about:['About Us','من نحن'],careers:['Careers','الوظائف'],agents:['Our Agents','وكلاؤنا'],support:['Help & FAQ','المساعدة والأسئلة الشائعة'],languages:['Languages','اللغات'],contact:['Contact Us','تواصل معنا']
};
const initialCourses=clone(MAIC_COURSE_CATALOG),initialAgents=clone(MAIC_ENROLLMENT_AGENTS);
const initial=()=>({version:1,books:[],messages:[],courses:clone(initialCourses),agents:clone(initialAgents),nav:mainNav.map(id=>({id,en:nativeNames[id][0],ar:nativeNames[id][1],visible:!['educators','learners','products','community','careers'].includes(id),contentEn:'',contentAr:''}))});
let draft=initial(),tab='overview',editing='',serverVersion=0,serverDocument=null,authenticated=false,busy=false,courseQuery='',courseScope='current';
function books(){return head('مكتبة مايك','إضافة الكتب وتصنيفها وتحديد المجاني والمدفوع',btn('+ كتاب جديد','new-book','primary'))+'<section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>الكتاب</th><th>التخصص</th><th>الإتاحة</th><th>الحالة</th><th>التحكم</th></tr></thead><tbody>'+draft.books.map(b=>'<tr><td>'+E(b.titleAr)+'<small>'+E(b.titleEn)+'</small></td><td>'+E(bookCategoryLabel(b.category))+'</td><td>'+E(b.access==='free'?'مجاني':b.price+' '+b.currency)+'</td><td>'+E(b.active?'ظاهر':'مخفي')+'</td><td>'+btn('تعديل','edit-book:'+b.id,'small')+btn('حذف','remove-book:'+b.id,'small danger')+'</td></tr>').join('')+'</tbody></table></div><p>الكتب المجانية تفتح الرابط الذي تضيفه. الكتب المدفوعة تعرض السعر وتتيح الاستفسار لدى الوكيل المخصص؛ لا تُستحصل مدفوعات عبر الموقع.</p></section>'}
const bookCategories=[['business','إدارة الأعمال'],['projects','إدارة المشاريع'],['organizations','إدارة المؤسسات'],['hr','الموارد البشرية'],['cybersecurity','الأمن السيبراني'],['ai','الذكاء الاصطناعي'],['cloud-computing','الحوسبة السحابية'],['advanced-programming','البرمجة المتقدمة'],['cryptography','التشفير'],['telecommunications','الاتصالات']];
function bookCategoryLabel(id){return bookCategories.find(c=>c[0]===id)?.[1]||id}
const messageRegions={gulf:['BH','KW','OM','QA','SA','AE'],arab:['DZ','BH','KM','DJ','EG','IQ','JO','KW','LB','LY','MR','MA','OM','PS','QA','SA','SO','SD','SY','TN','AE','YE'],europe:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']};
function messages(){return head('الرسائل والعروض','استهداف بلد واحد أو مجموعة بلدان أو جميع الزوار',btn('+ رسالة جديدة','new-message','primary'))+'<section class="panel">'+draft.messages.map(m=>'<article><h2>'+E(m.titleAr)+'</h2><p>'+E(m.bodyAr)+'</p><p>'+E(m.countries.length?m.countries.map(c=>new Intl.DisplayNames(['ar'],{type:'region'}).of(c)).join('، '):'جميع البلدان')+' · '+E(m.active?'مفعّلة':'غير مفعّلة')+'</p>'+btn('تعديل','edit-message:'+m.id,'small')+btn('حذف','remove-message:'+m.id,'small danger')+'</article>').join('')+'<p>تظهر الرسالة حسب بلد الإقامة الذي يختاره الزائر، وليس بناءً على تحديد موقعه تلقائياً. تُسجّل مواعيد النشر والانتهاء بتوقيت UTC.</p></section>'}
function validateExtras(v){
 v.books??=[];v.messages??=[];
 if(!Array.isArray(v.books)||!Array.isArray(v.messages)||v.books.length>300||v.messages.length>100)throw Error('تجاوزت الحد المسموح به للكتب أو الرسائل.');
 if(new Set(v.books.map(b=>b.id)).size!==v.books.length||new Set(v.messages.map(m=>m.id)).size!==v.messages.length)throw Error('يوجد معرّف مكرر.');
 for(const b of v.books){
  if(!b.titleAr||!b.titleEn||!bookCategories.some(c=>c[0]===b.category)||!['free','paid'].includes(b.access))throw Error('بيانات الكتاب غير مكتملة.');
  if(b.access==='free'){try{const u=new URL(b.freeUrl);if(u.protocol!=='https:'||u.username||u.password)throw Error()}catch{throw Error('أضف رابط HTTPS صالحاً للكتاب المجاني.')}}
  if(b.access==='paid'&&(!/^(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?$/.test(String(b.price))||Number(b.price)<=0))throw Error('أدخل سعراً صحيحاً أكبر من الصفر للكتاب المدفوع.');
 }
 for(const m of v.messages){if(!m.titleAr||!m.titleEn||!m.bodyAr||!m.bodyEn||!Array.isArray(m.countries)||m.countries.some(c=>!/^[A-Z]{2}$/.test(c)))throw Error('بيانات الرسالة غير مكتملة.');if(m.startsAt&&!Number.isFinite(Date.parse(m.startsAt))||m.endsAt&&!Number.isFinite(Date.parse(m.endsAt))||m.startsAt&&m.endsAt&&Date.parse(m.endsAt)<=Date.parse(m.startsAt))throw Error('تحقق من مواعيد بدء الرسالة وانتهائها.');}
}

function clean(v){
if(!v||!Array.isArray(v.courses)||!Array.isArray(v.agents)||!Array.isArray(v.nav))throw Error('صيغة الملف غير صالحة.');
if(v.courses.length>500||v.agents.length>150||v.nav.length>120)throw Error('الملف كبير جداً.');
const unique=(arr)=>new Set(arr.map(x=>x.id)).size===arr.length;
if(!unique(v.courses)||!unique(v.agents)||!unique(v.nav))throw Error('يوجد مُعرّف مكرر.');
for(const c of v.courses){
 if(!c.id||!c.en||!c.ar||!['preparing','published','archived'].includes(c.status)||!Array.isArray(c.mode)||!c.mode.some(x=>['self-paced','group','one-on-one'].includes(x)))throw Error('بيانات دورة ناقصة.');
 if(c.level&&!['all','beginner','intermediate','advanced'].includes(c.level))throw Error('مستوى الدورة غير صحيح.');
 if(c.courseLanguage&&!['ar','en','bilingual','other'].includes(c.courseLanguage))throw Error('لغة الدورة غير صحيحة.');
 if(c.feeCurrency&&!['USD','IQD','EUR','GBP','CAD','AED','SAR'].includes(c.feeCurrency))throw Error('عملة الدورة غير صحيحة.');
 if(c.feeAmount&&!/^(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?$/.test(String(c.feeAmount)))throw Error('رسوم الدورة يجب أن تكون مبلغاً صحيحاً أو تترك فارغة.');
 if(!/^[a-z0-9-]{2,80}$/.test(c.id))throw Error('معرّف دورة غير صالح.');
}
for(const a of v.agents){
 if(!a.id||!a.name||!a.country||!a.email||!a.website||!a.phone||!/^[A-Z]{2}$/.test(a.country)||!/^https:\/\//i.test(a.website))throw Error('بيانات وكيل غير صالحة.');
 if(!/^[a-z0-9-]{2,80}$/.test(a.id))throw Error('معرّف وكيل غير صالح.');
}
if(!v.agents.some(a=>a.id==='unity-bridge'&&a.country==='US'&&a.active))throw Error('Unity Bridge يجب أن يبقى وكيل الولايات المتحدة والبديل الدولي.');
if(v.agents.filter(a=>a.active).some((a,i,arr)=>arr.some((b,j)=>j!==i&&a.country===b.country)))throw Error('لا يجوز وجود وكيلين نشطين للبلد نفسه.');
for(const n of v.nav)if(!n.id||!n.en||!n.ar||!/^(custom:)?[a-z0-9-]{2,80}$/.test(n.id))throw Error('بيانات صفحة غير صالحة.');
v.nav=v.nav.filter(n=>!['educators','learners','products','community','careers'].includes(n.id)||n.contentAr||n.contentEn);
if(!v.nav.some(n=>n.id==='contact'))v.nav.push({id:'contact',ar:'تواصل معنا',en:'Contact Us',visible:true,contentAr:'',contentEn:''});
if(!v.nav.some(n=>n.id==='library'))v.nav.splice(1,0,{id:'library',ar:'مكتبة مايك',en:'MAIC Library',visible:true,contentAr:'',contentEn:''});
validateExtras(v);
if(mainNav.some(id=>!v.nav.some(n=>n.id===id)))throw Error('صفحة أساسية مفقودة. يمكن إخفاؤها بدلاً من حذفها.');
return clone(v);
}
try{const s=localStorage.getItem(KEY);if(s)draft=clean(JSON.parse(s))}catch(e){console.warn('MAIC preview draft invalid',e)}
function note(s){let t=$('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.textContent=s;t.setAttribute('role','status');document.body.append(t);setTimeout(()=>t.remove(),2600)}
function save(){try{draft=clean(draft);localStorage.setItem(KEY,JSON.stringify(draft));render();note('تم الحفظ محلياً. اضغط على زر النشر لإظهار التغييرات للزوار.');return true}catch(e){note(e.message);return false}}
function btn(title,action,cls=''){return '<button type="button" class="btn '+cls+'" data-action="'+E(action)+'">'+E(title)+'</button>'}
function head(title,sub,buttons=''){return '<div class="page-head"><div><h1>'+E(title)+'</h1><p>'+E(sub)+'</p></div><div class="page-actions">'+buttons+'</div></div>'}
function tag(s){const labels={preparing:'قيد الإعداد',published:'معروض في دليل الدورات',archived:'مؤرشف',active:'نشط',inactive:'غير نشط'};return '<span class="pill '+E(s)+'">'+E(labels[s]||s)+'</span>'}
function format(m){return (m||[]).map(k=>({'self-paced':'تعلّم ذاتي عبر الإنترنت',group:'جماعي مباشر','one-on-one':'فردي خاص'})[k]||k).join('، ')}
function overview(){
 const formats=new Set(draft.courses.filter(c=>c.status!=='archived').flatMap(c=>c.mode)).size;
 return head('نظرة عامة','إدارة محتوى الأكاديمية من مساحة واحدة')+
 '<div class="metrics">'+[['الدورات النشطة',draft.courses.filter(c=>c.status!=='archived').length],['صيغ التعلم',formats],['الوكلاء النشطون',draft.agents.filter(a=>a.active).length],['الصفحات الظاهرة',draft.nav.filter(n=>n.visible).length]].map(x=>'<div class="metric"><small>'+E(x[0])+'</small><strong>'+x[1]+'</strong></div>').join('')+'</div>'+
 '<section class="panel"><h2>مسار العمل</h2><ol class="workflow-steps"><li>عدّل الدورات والوكلاء والصفحات من القائمة الجانبية.</li><li>احفظ المسودة داخل محرر المحتوى.</li><li>راجع النتيجة عبر زر المعاينة العلوي.</li><li>انشر التغييرات من زر النشر العلوي.</li></ol></section>'+
 '<section class="panel"><h2>جاهزية الإطلاق</h2><p>الدورات الأولية تحتوي على أهداف ومحاور ومتطلبات. افتح التسجيل بعد رفع المواد التعليمية وتحديد الرسوم والمدة والمدرب.</p><p>واجهة الموقع متعددة اللغات. تعديل نصوص جديدة بعد هذه المراجعة يتطلب تحديث ترجماتها قبل الإطلاق.</p></section>';
}
function courses(){
return head('إدارة الدورات','أضف أو عدّل أو احذف الدورات وحدد نوع التعلّم وحالة عرضها',btn('+ دورة جديدة','new-course','primary'))+
 '<section class="panel"><label class="admin-filter">بحث في الدورات<input id="courseFilter" type="search" value="'+E(courseQuery)+'" placeholder="اسم الدورة أو التصنيف" /></label><label class="admin-filter">العرض<select id="courseScope"><option value="current" '+(courseScope==='current'?'selected':'')+'>الدورات الحالية</option><option value="archived" '+(courseScope==='archived'?'selected':'')+'>الأرشيف</option><option value="all" '+(courseScope==='all'?'selected':'')+'>الكل</option></select></label><h2>الكتالوج ('+draft.courses.length+')</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>الدورة</th><th>الأنواع</th><th>التصنيف</th><th>الحالة</th><th>التحكم</th></tr></thead><tbody>'+
 draft.courses.filter(c=>courseScope==='all'||(courseScope==='archived'?c.status==='archived':c.status!=='archived')).filter(c=>(c.ar+' '+c.en+' '+c.areaAr+' '+c.areaEn).toLowerCase().includes(courseQuery.toLowerCase())).map(c=>'<tr><td><b>'+E(c.ar)+'</b><small>'+E(c.en)+'</small></td><td>'+E(format(c.mode))+'</td><td>'+E(c.areaAr||c.areaEn||'—')+'</td><td>'+tag(c.status)+'</td><td><div class="actions">'+btn('تعديل','edit-course:'+c.id,'small')+btn('حذف','remove-course:'+c.id,'small danger')+'</div></td></tr>').join('')+
 '</tbody></table></div></section><div class="callout">حالة الدورة تحدد عرضها في الكتالوج. الحفظ يحدّث المسودة؛ زر النشر العلوي يحدّث الموقع. الدورات المؤرشفة لا تظهر للزوار.</div>';
}
function agents(){
return head('إدارة الوكلاء','الاسم والشعار والبلد والمدينة والموقع والبريد الإلكتروني والهاتف والتخصيص',btn('+ وكيل جديد','new-agent','primary'))+
 '<div class="agent-list">'+draft.agents.map(a=>{
const image=String(a.logo||'../assets/maic-official-crest.png').replace(/^\.\/assets\//,'../assets/');
return '<article class="agent-box"><div class="agent-header"><img src="'+E(image)+'" alt="'+E(a.name)+'" /><div><h3>'+E(a.name)+'</h3>'+tag(a.active?'active':'inactive')+' <small>'+E(a.country)+'</small></div></div><dl>'+
 [['البلد',a.countryAr||a.country],['المدينة',a.cityAr||'غير محددة'],['الموقع',a.website],['البريد الإلكتروني',a.email],['الهاتف',a.phone]].map(([title,val])=>'<div><dt>'+E(title)+'</dt><dd>'+E(val)+'</dd></div>').join('')+
 '</dl><div class="actions">'+btn('تعديل','edit-agent:'+a.id,'small')+btn('حذف','remove-agent:'+a.id,'small danger')+'</div></article>'}).join('')+'</div>'+
 '<div class="callout">Unity Bridge هو الوكيل الأمريكي والبديل الدولي، لذلك يبقى نشطاً دائماً. التعديل والحذف هنا لا يغيّران عقود الاعتماد الحقيقية.</div>';
}
function structure(){
return head('الصفحات والقائمة','مكان واحد لإدارة العناوين والترتيب والمحتوى والظهور',btn('+ صفحة جديدة','new-page','primary'))+
 '<section class="panel"><h2>ترتيب عناصر القائمة</h2><div class="structure-list">'+draft.nav.map((n,i)=>
 '<div class="structure-row"><span class="structure-num">'+(i+1)+'</span><div class="structure-label"><b>'+E(n.ar)+'</b><small>'+E(n.en)+' · '+E(n.id)+'</small></div><div class="structure-tools"><label><input type="checkbox" data-visible="'+E(n.id)+'" '+(n.visible?'checked':'')+' /> ظاهر</label>'+(i>0?btn('↑','up:'+n.id,'small'):'')+(i<draft.nav.length-1?btn('↓','down:'+n.id,'small'):'')+btn('تعديل','edit-nav:'+n.id,'small')+(n.id.startsWith('custom:')?btn('حذف','remove-page:'+n.id,'small danger'):'')+'</div></div>').join('')+'</div></section><div class="callout">يؤدي إخفاء العنصر إلى إزالته من القائمة دون حذف الصفحة الأصلية من الشيفرة البرمجية للموقع.</div>';
}
function settings(){
return head('النسخ والاستعادة','نسخة احتياطية من المسودة أو استعادة المحتوى المنشور')+
 '<section class="panel"><h2>حفظ نسخة احتياطية واستيرادها</h2><p>صدّر المسودة قبل تغييرات كبيرة. الاستيراد يستبدل المسودة بعد التأكيد ولا ينشر تلقائياً.</p><div class="page-actions">'+btn('تصدير المسودة','export','primary')+btn('استيراد نسخة','import')+'</div><input type="file" id="importFile" accept=".json,application/json" hidden /></section>'+
 '<section class="panel"><h2>استعادة المحتوى المنشور</h2><p>نسخة الموقع المنشورة رقم '+serverVersion+'. استعادتها تستبدل المسودة المحلية فقط.</p><div class="page-actions">'+btn('استعادة آخر نسخة منشورة','load-live')+'</div></section>';
}
const views={overview,courses,books,messages,agents,structure,settings};
const titles={books:'مكتبة مايك',messages:'الرسائل والعروض',overview:'نظرة عامة',courses:'إدارة الدورات',agents:'الوكلاء',structure:'الصفحات والقائمة',settings:'النسخ والاستعادة'};
function syncState(){const dirty=!serverDocument||JSON.stringify(draft)!==JSON.stringify(serverDocument);$('#draftState').textContent=busy?'جارٍ النشر':dirty?'مسودة غير منشورة':'محدّث · الإصدار '+serverVersion;$('#publishButton').disabled=busy||!authenticated||!serverDocument||!dirty;}
function render(){syncState();$('#studioMain').innerHTML=views[tab]();$('#studioTitle').textContent=titles[tab];document.querySelectorAll('#studioNav [data-tab]').forEach(b=>b.classList.toggle('is-active',b.dataset.tab===tab))}
function switchTab(t){if(!views[t])return;tab=t;render();$('.studio-sidebar').classList.remove('is-open')}
function field(label,key,v='',type='text',required=false,wide=false){
return '<label class="'+(wide?'full':'')+'">'+E(label)+'<input type="'+type+'" name="'+E(key)+'" value="'+E(v??'')+'" maxlength="300" '+(required?'required':'')+' /></label>';
}
function textarea(label,key,v=''){return '<label class="full">'+E(label)+'<textarea name="'+E(key)+'" maxlength="5000">'+E(v)+'</textarea></label>'}
function select(label,key,v,values){return '<label>'+E(label)+'<select name="'+E(key)+'">'+values.map(([value,title])=>'<option value="'+E(value)+'" '+(String(v)===String(value)?'selected':'')+'>'+E(title)+'</option>').join('')+'</select></label>'}
function openEditor(kind,id=''){
editing=kind+'|'+id;
let fields='',title='';
if(kind==='course'){
 const c=draft.courses.find(x=>x.id===id)||{ar:'',en:'',areaAr:'',areaEn:'',descriptionAr:'',descriptionEn:'',objectivesAr:'',objectivesEn:'',syllabusAr:'',syllabusEn:'',requirementsAr:'',requirementsEn:'',instructor:'',duration:'',level:'all',courseLanguage:'ar',feeAmount:'',feeCurrency:'USD',mode:['self-paced'],status:'preparing'};
 title=id?'تعديل تفاصيل الدورة':'إضافة دورة جديدة';
 fields='<section class="editor-section"><h3>١. معلومات الدورة</h3><div class="edit-grid">'+
 field('اسم الدورة بالعربية *','ar',c.ar,'text',true)+field('Course name (English) *','en',c.en,'text',true)+
 field('التصنيف بالعربية','areaAr',c.areaAr)+field('Category in English','areaEn',c.areaEn)+
 textarea('نبذة عن الدورة بالعربية','descriptionAr',c.descriptionAr)+textarea('Course summary in English','descriptionEn',c.descriptionEn)+
 '</div></section>'+
 '<section class="editor-section"><h3>٢. نوع الدورة وطريقة تقديمها *</h3><p class="editor-help">يمكنك اختيار نوع واحد أو أكثر؛ وتظهر الدورة ضمن كل نوع تحدده في قائمة الموقع.</p>'+
 '<div class="course-mode-grid">'+MAIC_COURSE_MODES.map((m,i)=>'<label class="course-mode-option"><input type="checkbox" name="mode" value="'+E(m.id)+'" '+(c.mode.includes(m.id)?'checked':'')+' /><span class="course-mode-copy"><strong>'+E(m.ar)+'</strong><small>'+E(m.en)+'</small><em>'+E(['دروس مسجلة ومواد واختبارات داخل الموقع','دروس مباشرة مع محاضر ومجموعة من المتعلّمين في موعد محدد','جلسات فردية مع مدرّب ومتعلّم واحد'][i])+'</em></span></label>').join('')+'</div></section>'+
 '<section class="editor-section"><h3>٣. معلومات الدراسة</h3><div class="edit-grid">'+
 select('مستوى الدورة','level',c.level||'all',[['all','جميع المستويات'],['beginner','مبتدئ'],['intermediate','متوسط'],['advanced','متقدم']])+
 select('لغة تقديم الدورة','courseLanguage',c.courseLanguage||'ar',[['ar','العربية'],['en','الإنكليزية'],['bilingual','العربية والإنكليزية'],['other','لغة أخرى']])+
 field('مدة الدورة (مثلاً: 6 أسابيع)','duration',c.duration)+
 field('اسم المحاضر / المدرب','instructor',c.instructor)+
 textarea('الأهداف التعليمية (كل هدف في سطر مستقل) — عربي','objectivesAr',c.objectivesAr)+
 textarea('Learning objectives — English','objectivesEn',c.objectivesEn)+
 textarea('المنهج ووحدات الدورة (كل وحدة في سطر مستقل) — عربي','syllabusAr',c.syllabusAr)+
 textarea('Course syllabus / modules — English','syllabusEn',c.syllabusEn)+
 textarea('متطلبات الالتحاق بالعربية','requirementsAr',c.requirementsAr)+
 textarea('Prerequisites in English','requirementsEn',c.requirementsEn)+
 '</div></section>'+
 '<section class="editor-section"><h3>٤. الرسوم وحالة النشر</h3><div class="edit-grid">'+
 field('رسوم الدورة (اختياري — دفع للوكيل حصراً)','feeAmount',c.feeAmount,'text')+
 select('عملة الرسوم','feeCurrency',c.feeCurrency||'USD',[['USD','USD · دولار أمريكي'],['IQD','IQD · دينار عراقي'],['EUR','EUR · يورو'],['GBP','GBP · جنيه إسترليني'],['CAD','CAD · دولار كندي'],['AED','AED · درهم إماراتي'],['SAR','SAR · ريال سعودي']])+
 select('حالة عرض الدورة','status',c.status,[['preparing','قيد الإعداد'],['published','منشور في دليل الدورات بالموقع'],['archived','مؤرشف / غير ظاهر']])+
 '</div><div class="editor-help boxed">تُعرض الرسوم للمعلومات فقط. تُدفع الرسوم للوكيل المعتمد، وتختص إدارة MAIC وحدها بتفعيل الدورة. ولا يعني نشر الدورة هنا فتح التسجيل الإلكتروني.</div></section>';
}
if(kind==='agent'){
 const a=draft.agents.find(x=>x.id===id)||{name:'',country:'',countryAr:'',countryEn:'',cityAr:'',cityEn:'',stateAr:'',stateEn:'',website:'https://',email:'',phone:'',logo:'',active:false};
 title=id?'تعديل معلومات الوكيل':'إضافة وكيل جديد';
 fields='<section class="editor-section"><h3>١. هوية الوكيل وبلده</h3><div class="edit-grid">'+
 field('اسم الشركة / الوكيل المعتمد *','name',a.name,'text',true,true)+
 select('الدولة المخصصة *','country',a.country,[['','اختر الدولة'],...(window.MAIC_COUNTRIES||[]).map(c=>[c.code,c.name])])+
 select('حالة ظهور الوكيل','active',a.active?'yes':'no',[['yes','نشط ومعتمد للتوجيه'],['no','غير نشط — لا يوجّه إليه الطلاب']])+
 field('اسم البلد بالعربية','countryAr',a.countryAr)+field('Country name English','countryEn',a.countryEn)+
 field('المدينة بالعربية','cityAr',a.cityAr)+field('City English','cityEn',a.cityEn)+
 field('الولاية أو المحافظة بالعربية','stateAr',a.stateAr)+field('State / Region English','stateEn',a.stateEn)+
 '</div></section>'+
 '<section class="editor-section"><h3>٢. معلومات التواصل الرسمية</h3><div class="edit-grid">'+
 field('الموقع الرسمي *','website',a.website,'url',true,true)+
 field('البريد الإلكتروني للتواصل *','email',a.email,'email',true)+
 field('رقم التواصل مع مفتاح البلد *','phone',a.phone,'tel',true)+
 '</div></section>'+
 '<section class="editor-section"><h3>٣. شعار الوكيل</h3>'+
 '<div class="agent-logo-preview"><img id="agentLogoPreview" alt="معاينة شعار الوكيل" src="'+E(String(a.logo||'../assets/maic-official-crest.png').replace(/^\.\/assets\//,'../assets/'))+'" /></div>'+
 '<div class="edit-grid">'+field('رابط صورة الشعار أو مسار الصورة بالموقع','logo',a.logo,'text',false,true)+'</div>'+
 '<p class="editor-help">ضع رابط صورة HTTPS مباشر، أو مسار الشعار الموجود على الموقع مثل ./assets/agents/asas360.webp. تظهر الصورة داخل إطار دائري في البطاقة.</p></section>';
}
if(kind==='nav'){
 const n=draft.nav.find(x=>x.id===id)||{ar:'',en:'',visible:true,contentAr:'',contentEn:''};
 title=id?'تعديل القائمة':'إضافة صفحة';
 fields=field('الاسم بالعربية *','ar',n.ar,'text',true)+field('English name *','en',n.en,'text',true)+select('الحالة','visible',n.visible?'yes':'no',[['yes','ظاهر'],['no','مخفي']]);
 if(!id||id.startsWith('custom:'))fields+=textarea('محتوى الصفحة بالعربية','contentAr',n.contentAr)+textarea('Page content in English','contentEn',n.contentEn);
}
if(kind==='book'){
 const b=draft.books.find(x=>x.id===id)||{category:'business',access:'free',active:false,currency:'USD'};title=id?'تعديل الكتاب':'إضافة كتاب';
 fields=field('عنوان الكتاب بالعربية *','titleAr',b.titleAr,'text',true)+field('عنوان الكتاب بالإنكليزية *','titleEn',b.titleEn,'text',true)+select('التخصص','category',b.category,bookCategories)+field('المؤلف','author',b.author)+field('سنة الإصدار — أربعة أرقام','year',b.year)+field('دار النشر','publisher',b.publisher)+field('لغة ملف الكتاب — ar أو en','language',b.language)+field('رابط الغلاف الأصلي — اختياري','coverUrl',b.coverUrl,'url')+field('صفحة الكتاب لدى الناشر','sourceUrl',b.sourceUrl,'url')+field('رابط الترخيص — اختياري','licenseUrl',b.licenseUrl,'url')+textarea('نبذة موثقة عن المؤلف بالعربية','authorBioAr',b.authorBioAr)+textarea('Author biography in English','authorBioEn',b.authorBioEn)+textarea('الوصف بالعربية','descriptionAr',b.descriptionAr)+textarea('الوصف بالإنكليزية','descriptionEn',b.descriptionEn)+select('الإتاحة','access',b.access,[['free','مجاني'],['paid','مدفوع']])+field('السعر — للكتب المدفوعة','price',b.price)+select('العملة','currency',b.currency,[['USD','دولار أمريكي'],['IQD','دينار عراقي'],['EUR','يورو'],['GBP','جنيه إسترليني'],['CAD','دولار كندي'],['AED','درهم إماراتي'],['SAR','ريال سعودي']])+field('رابط القراءة أو التحميل — للكتاب المجاني فقط','freeUrl',b.freeUrl,'url',false,true)+select('حالة النشر','active',b.active?'yes':'no',[['yes','ظاهر'],['no','مخفي']])+'<p class="full">أضف فقط الكتب التي تملك حق عرضها أو توزيعها. لا تضف ملفات الكتب المدفوعة إلى رابط عام؛ الاستفسار عنها يُوجّه إلى الوكيل المخصص.</p>';
}
if(kind==='message'){
 const m=draft.messages.find(x=>x.id===id)||{countries:[],active:false};title=id?'تعديل الرسالة':'إضافة رسالة أو عرض';const regionOptions=[['custom','اختيار بلدان يدوياً'],['global','جميع البلدان'],['gulf','دول مجلس التعاون الخليجي'],['arab','البلدان العربية'],['europe','الاتحاد الأوروبي']];
 fields=field('العنوان بالعربية *','titleAr',m.titleAr,'text',true)+field('العنوان بالإنكليزية *','titleEn',m.titleEn,'text',true)+textarea('النص بالعربية *','bodyAr',m.bodyAr)+textarea('النص بالإنكليزية *','bodyEn',m.bodyEn)+select('تحديد مجموعة بلدان','messageRegion','custom',regionOptions)+'<label class="full">البلدان المستهدفة — اتركها دون تحديد لجميع البلدان<select id="messageCountries" name="countries" multiple size="7">'+(window.MAIC_COUNTRIES||[]).map(c=>'<option value="'+c.code+'" '+(m.countries.includes(c.code)?'selected':'')+'>'+E(new Intl.DisplayNames(['ar'],{type:'region'}).of(c.code))+'</option>').join('')+'</select></label>'+field('بداية العرض — بتوقيت UTC، اختياري','startsAt',m.startsAt,'text')+field('نهاية العرض — بتوقيت UTC، اختياري','endsAt',m.endsAt,'text')+select('حالة الرسالة','active',m.active?'yes':'no',[['yes','مفعّلة'],['no','غير مفعّلة']])+'<p class="full">مثال للموعد: 2026-11-01T09:00:00Z. يُحدّد البلد من اختيار الزائر في شاشة البداية.</p>';
}

$('#dialogTitle').textContent=title;$('#dialogFields').innerHTML='<div class="edit-grid">'+fields+'</div>';$('#editDialog').showModal();
}
function editSave(e){
 e.preventDefault();const data=new FormData(e.currentTarget),[kind,id]=editing.split('|'),v=k=>String(data.get(k)||'').trim();
 const next=clone(draft);
 if(kind==='course'){
 const mode=data.getAll('mode');if(!mode.length){note('حدد نوع دراسة واحد على الأقل.');return}
 const c={...(next.courses.find(x=>x.id===id)||{}),id:id||genId('course'),
  ar:v('ar'),en:v('en'),areaAr:v('areaAr'),areaEn:v('areaEn'),
  descriptionAr:v('descriptionAr'),descriptionEn:v('descriptionEn'),
  objectivesAr:v('objectivesAr'),objectivesEn:v('objectivesEn'),
  syllabusAr:v('syllabusAr'),syllabusEn:v('syllabusEn'),
  requirementsAr:v('requirementsAr'),requirementsEn:v('requirementsEn'),
  instructor:v('instructor'),duration:v('duration'),level:v('level'),courseLanguage:v('courseLanguage'),
  feeAmount:v('feeAmount'),feeCurrency:v('feeCurrency'),mode,status:v('status')};
 if(c.feeAmount&&(!/^(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?$/.test(c.feeAmount)||Number(c.feeAmount)>10000000)){note('راجع مبلغ الرسوم. اكتب الرقم دون فواصل أو اترك الحقل فارغاً.');return}
 next.courses=id?next.courses.map(x=>x.id===id?c:x):[...next.courses,c];
 }
 if(kind==='agent'){
 const c=v('country');if(!c){note('حدد الدولة.');return}
 const url=v('website');try{const u=new URL(url);if(u.protocol!=='https:')throw Error('scheme')}catch{note('اكتب رابط موقع HTTPS صحيح.');return}
 const logo=v('logo');
 if(logo&&!(/^https:\/\/[^ "'<>]+$/i.test(logo)||/^\.?\/?assets\/agents\/[-a-zA-Z0-9_./]+$/.test(logo))){note('رابط الشعار يجب أن يكون HTTPS أو مسار صورة داخل assets/agents.');return}
 const a={...(next.agents.find(x=>x.id===id)||{}),id:id||genId('agent'),name:v('name'),country:c,active:v('active')==='yes',countryAr:v('countryAr'),countryEn:v('countryEn'),cityAr:v('cityAr')||null,cityEn:v('cityEn')||null,stateAr:v('stateAr')||null,stateEn:v('stateEn')||null,website:url,email:v('email'),phone:v('phone'),logo};
 next.agents=id?next.agents.map(x=>x.id===id?a:x):[...next.agents,a];
 }
 if(kind==='nav'){
 const n={id:id||'custom:'+genId('page'),ar:v('ar'),en:v('en'),visible:v('visible')==='yes',contentAr:v('contentAr'),contentEn:v('contentEn')};
 next.nav=id?next.nav.map(x=>x.id===id?{...x,...n}:x):[...next.nav,n];
 }
 if(kind==='book'){
  const b={id:id||genId('book'),titleAr:v('titleAr'),titleEn:v('titleEn'),descriptionAr:v('descriptionAr'),descriptionEn:v('descriptionEn'),category:v('category'),author:v('author'),year:v('year'),publisher:v('publisher'),language:v('language'),coverUrl:v('coverUrl'),sourceUrl:v('sourceUrl'),licenseUrl:v('licenseUrl'),authorBioAr:v('authorBioAr'),authorBioEn:v('authorBioEn'),access:v('access'),price:v('access')==='free'?'0':v('price'),currency:v('currency'),freeUrl:v('access')==='free'?v('freeUrl'):'',active:v('active')==='yes'};
  next.books=id?next.books.map(x=>x.id===id?b:x):[...next.books,b];
 }
 if(kind==='message'){
  const m={id:id||genId('message'),titleAr:v('titleAr'),titleEn:v('titleEn'),bodyAr:v('bodyAr'),bodyEn:v('bodyEn'),countries:data.getAll('countries'),startsAt:v('startsAt'),endsAt:v('endsAt'),active:v('active')==='yes'};
  next.messages=id?next.messages.map(x=>x.id===id?m:x):[...next.messages,m];
 }

 const old=draft;draft=next;if(save())$('#editDialog').close();else draft=old;
}
function remove(kind,id){
 if(kind==='agent'&&id==='unity-bridge'){note('Unity Bridge وكيل أساسي، ولا يمكن حذفه.');return}
 if(!confirm('حذف من المسودة المحلية فقط؟'))return;
 const prop=kind==='book'?'books':kind==='message'?'messages':kind==='course'?'courses':kind==='agent'?'agents':'nav',next=clone(draft);
 next[prop]=next[prop].filter(x=>x.id!==id);
 const old=draft;draft=next;if(!save())draft=old;
}
function move(id,n){const pos=draft.nav.findIndex(x=>x.id===id),j=pos+n;if(j<0||j>=draft.nav.length)return;[draft.nav[pos],draft.nav[j]]=[draft.nav[j],draft.nav[pos]];save()}
function preview(page='home'){
 const u=new URL('../index.html',location.href);u.searchParams.set('cms-preview','1');u.hash=page;window.open(u.toString(),'_blank','noopener');
}

async function serverCall(path,opts={}){
 const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...opts});
 let body={};try{body=await response.json()}catch{}
 if(!response.ok){const err=new Error(body.error||'تعذّر الاتصال بالخادم');err.status=response.status;throw err}
 return body;
}
function showLogin(message=''){
 authenticated=false;document.querySelector('.studio-shell').hidden=true;$('#adminLogin').hidden=false;
 $('#adminLoginError').textContent=message;$('#adminPassword').value='';
}
async function loadLive(force=false){
 try{
  const result=await serverCall('/api/admin/content');
  serverVersion=result.version;serverDocument=clean(result.document);
  if(force){
   if(!confirm('استبدال المسودة الحالية بنسخة الموقع المنشورة؟'))return;
   draft=clone(serverDocument);localStorage.setItem(KEY,JSON.stringify(draft));
   note('تم تحميل أحدث نسخة منشورة دون نشر أي تغيير.');
  }else if(!localStorage.getItem(KEY)){
   draft=clone(serverDocument);
   localStorage.setItem(KEY,JSON.stringify(draft));
  }
  if(JSON.stringify(draft)!==JSON.stringify(serverDocument))note('توجد مسودة محلية مختلفة. راجعها قبل النشر، أو استعد النسخة المنشورة من النسخ والاستعادة.');
  render();
 }catch(err){
  if(err.status===401){showLogin('انتهت جلسة الإدارة؛ يرجى تسجيل الدخول مجدداً.');return}
  note('فشل تحميل المحتوى المنشور: '+err.message);
 }
}
async function enterDashboard(){
 authenticated=true;$('#adminLogin').hidden=true;document.querySelector('.studio-shell').hidden=false;
 await loadLive();render();
}
async function boot(){
 try{await serverCall('/api/admin/session');await enterDashboard()}
 catch(err){showLogin(err.status===401?'':'خدمة الإدارة غير متاحة حالياً. تأكد من الاتصال.')}
}
async function loginAdmin(e){
 e.preventDefault();
 const button=$('#adminLoginSubmit');button.disabled=true;button.textContent='جارٍ التحقق...';
 try{
  await serverCall('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:$('#adminPassword').value})});
  $('#adminLoginError').textContent='';
  await enterDashboard();
 }catch(err){$('#adminLoginError').textContent=err.status===429?'تجاوزت الحد المسموح به لمحاولات تسجيل الدخول. يُرجى المحاولة بعد خمس عشرة دقيقة.':'تعذّر الدخول. تحقق من مفتاح المدير.'}
 finally{button.disabled=false;button.textContent='دخول لوحة الإدارة'}
}
async function logoutAdmin(){
 try{await serverCall('/api/admin/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})}catch{}
 showLogin('تم تسجيل الخروج من الإدارة.');
}
async function publish(){
 if(busy)return;
 if(!authenticated||!serverVersion){note('يلزم تسجيل الدخول إلى لوحة الإدارة قبل النشر.');return}
 let validated;try{validated=clean(draft)}catch(err){note('راجع البيانات أولاً: '+err.message);return}
 if(!confirm('تأكيد نشر التعديلات على موقع MAIC لجميع الزوار؟'))return;
 busy=true;const btn=$('#publishButton');btn.disabled=true;btn.textContent='جارٍ النشر...';
 try{
  const result=await serverCall('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:validated,expectedVersion:serverVersion})});
  serverVersion=result.version;serverDocument=clone(validated);draft=clone(validated);
  localStorage.setItem(KEY,JSON.stringify(draft));
  $('#draftState').textContent='منشور · الإصدار '+serverVersion;note('تم نشر التغييرات على الموقع. حدّث الصفحة لعرض التعديلات.');render();
 }catch(err){
  if(err.status===401){showLogin('انتهت جلسة الدخول قبل النشر.');return}
  if(err.status===409){note('توجد تعديلات أحدث على الموقع. حمّل النسخة المنشورة وراجع تغييراتك قبل إعادة النشر.')}
  else note('تعذر النشر: '+err.message);
 }finally{busy=false;btn.textContent='نشر التغييرات على الموقع';syncState()}
}

function exportJson(){
 const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='MAIC_Admin_Draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function clickAction(a){
 const sep=a.indexOf(':'),kind=sep>=0?a.slice(0,sep):a,id=sep>=0?a.slice(sep+1):'';
 if(kind==='tab')return switchTab(id);
 if(a==='new-book')return openEditor('book');
 if(a==='new-message')return openEditor('message');
 if(kind==='edit-book')return openEditor('book',id);
 if(kind==='edit-message')return openEditor('message',id);
 if(kind==='remove-book')return remove('book',id);
 if(kind==='remove-message')return remove('message',id);
 if(a==='new-course')return openEditor('course');
 if(a==='new-agent')return openEditor('agent');
 if(a==='new-page')return openEditor('nav');
 if(kind==='edit-course')return openEditor('course',id);
 if(kind==='edit-agent')return openEditor('agent',id);
 if(kind==='edit-nav')return openEditor('nav',id);
 if(kind==='remove-course')return remove('course',id);
 if(kind==='remove-agent')return remove('agent',id);
 if(kind==='remove-page')return remove('nav',id);
 if(kind==='up')return move(id,-1);
 if(kind==='down')return move(id,1);
 if(a==='preview')return preview();
 if(a==='export')return exportJson();
 if(a==='load-live')return loadLive(true);
 if(a==='import')return $('#importFile').click();
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]');if(a)return clickAction(a.dataset.action);const n=e.target.closest('[data-tab]');if(n)return switchTab(n.dataset.tab)});
document.addEventListener('change',e=>{
 if(e.target.name==='messageRegion'){const countries=messageRegions[e.target.value]||[];document.querySelectorAll('#messageCountries option').forEach(o=>o.selected=countries.includes(o.value));return}
 if(e.target.id==='courseScope'){courseScope=e.target.value;render();return}
 const vis=e.target.closest('[data-visible]');if(vis){const n=draft.nav.find(x=>x.id===vis.dataset.visible);if(n){n.visible=vis.checked;save()}}
 if(e.target.id==='importFile'){
 const f=e.target.files[0];if(!f)return;if(f.size>1048576){note('حجم الملف كبير جداً.');return}
 const r=new FileReader();r.onload=()=>{try{const p=clean(JSON.parse(r.result));if(!confirm('استبدال مسودتك الحالية؟'))return;draft=p;save()}catch(err){note(err.message)}};r.readAsText(f);e.target.value='';
 }
});
document.addEventListener('input',e=>{if(e.target.id==='courseFilter'){courseQuery=e.target.value;const pos=e.target.selectionStart;render();const el=$('#courseFilter');el.focus();el.setSelectionRange(pos,pos);return}if(e.target?.name==='logo'&&editing.startsWith('agent|')){const img=$('#agentLogoPreview');if(img){const value=e.target.value.trim();if(value.startsWith('https://')||value.startsWith('./assets/agents/')||value.startsWith('/assets/agents/'))img.src=value.replace(/^\.\/assets\//,'../assets/');}}});
$('#editForm').addEventListener('submit',editSave);
$('#dialogClose').addEventListener('click',()=>$('#editDialog').close());
$('#dialogCancel').addEventListener('click',()=>$('#editDialog').close());
$('#previewButton').addEventListener('click',()=>preview());
$('#mobileNavToggle').addEventListener('click',()=>$('.studio-sidebar').classList.toggle('is-open'));
$('#adminLoginForm').addEventListener('submit',loginAdmin);
$('#adminLogout').addEventListener('click',logoutAdmin);
$('#publishButton').addEventListener('click',publish);
boot();
})();
