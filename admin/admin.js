'use strict';
(()=> {
const KEY='maic_studio_draft_v1';
const $=s=>document.querySelector(s);
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));
const genId=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
const mainNav=['home','michigan','courses','educators','learners','products','community','about','careers','agents','support','languages'];
const nativeNames={
home:['Home','الرئيسية'],michigan:['Michigan','ولاية مشيغان'],courses:['Courses','كورسات'],
educators:['Educators and Organizations','المعلمون والمؤسسات'],learners:['Learners','المتعلمون'],products:['Learning Products','المنتجات التعليمية'],community:['Community','المجتمع'],about:['About Us','من نحن'],careers:['Careers','الوظائف'],agents:['Our Agents','وكلاؤنا'],support:['Support','الدعم'],languages:['Languages','اللغات']
};
const initialCourses=clone(MAIC_COURSE_CATALOG),initialAgents=clone(MAIC_ENROLLMENT_AGENTS);
const initial=()=>({version:1,courses:clone(initialCourses),agents:clone(initialAgents),nav:mainNav.map(id=>({id,en:nativeNames[id][0],ar:nativeNames[id][1],visible:true,contentEn:'',contentAr:''}))});
let draft=initial(),tab='overview',editing='',serverVersion=0,serverDocument=null,authenticated=false;
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
if(mainNav.some(id=>!v.nav.some(n=>n.id===id)))throw Error('صفحة أساسية مفقودة. يمكن إخفاؤها بدلاً من حذفها.');
return clone(v);
}
try{const s=localStorage.getItem(KEY);if(s)draft=clean(JSON.parse(s))}catch(e){console.warn('MAIC preview draft invalid',e)}
function note(s){let t=$('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.textContent=s;t.setAttribute('role','status');document.body.append(t);setTimeout(()=>t.remove(),2600)}
function save(){try{draft=clean(draft);localStorage.setItem(KEY,JSON.stringify(draft));$('#draftState').textContent='مسودة لم تُنشر';render();note('تم الحفظ محلياً. اضغط نشر حتى تظهر التغييرات للزوار.');return true}catch(e){note(e.message);return false}}
function btn(title,action,cls=''){return '<button type="button" class="btn '+cls+'" data-action="'+E(action)+'">'+E(title)+'</button>'}
function head(title,sub,buttons=''){return '<div class="page-head"><div><h1>'+E(title)+'</h1><p>'+E(sub)+'</p></div><div class="page-actions">'+buttons+'</div></div>'}
function tag(s){const labels={preparing:'قيد الإعداد',published:'منشور بالمعاينة',archived:'مؤرشف',active:'نشط',inactive:'غير نشط'};return '<span class="pill '+E(s)+'">'+E(labels[s]||s)+'</span>'}
function format(m){return (m||[]).map(k=>({'self-paced':'ذاتي أونلاين',group:'جماعي مباشر','one-on-one':'فردي خاص'})[k]||k).join('، ')}
function overview(){
 const published=draft.courses.filter(c=>c.status==='published').length;
 return head('نظرة عامة','إدارة كتالوج دورات MAIC ودليل الوكلاء وهيكلة الموقع',btn('إضافة كورس','new-course','primary')+btn('إضافة وكيل','new-agent'))+
 '<div class="metrics">'+[['إجمالي الكورسات',draft.courses.length],['منشور في المعاينة',published],['الوكلاء',draft.agents.length],['صفحات القائمة',draft.nav.length]].map(x=>'<div class="metric"><small>'+E(x[0])+'</small><strong>'+x[1]+'</strong><span>مسودة إدارة محتوى</span></div>').join('')+'</div>'+
 '<section class="panel"><h2>إدارة سريعة</h2><div class="page-actions">'+btn('الكورسات','tab:courses')+btn('الوكلاء','tab:agents')+btn('هيكلة القائمة','tab:structure')+btn('الصفحات','tab:pages')+'</div></section>'+
 '<section class="panel"><h2>نظام تسجيل المتعلّمين</h2><p>يدفع الطالب للوكيل المعتمد حصراً، والوكيل يؤكد الاستلام، وإدارة MAIC هي الوحيدة التي تفعّل الكورس. Unity Bridge Services LLC وكيل الولايات المتحدة والبديل الدولي.</p></section>';
}
function courses(){
return head('إدارة الكورسات','أضف أو عدّل أو احذف الكورسات وحدد نوع التعلّم وحالة عرضها',btn('+ كورس جديد','new-course','primary'))+
 '<section class="panel"><h2>الكتالوج ('+draft.courses.length+')</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>الدورة</th><th>الأنواع</th><th>التصنيف</th><th>الحالة</th><th>التحكم</th></tr></thead><tbody>'+
 draft.courses.map(c=>'<tr><td><b>'+E(c.ar)+'</b><small>'+E(c.en)+'</small></td><td>'+E(format(c.mode))+'</td><td>'+E(c.areaAr||c.areaEn||'—')+'</td><td>'+tag(c.status)+'</td><td><div class="actions">'+btn('تعديل','edit-course:'+c.id,'small')+btn('نسخ','copy-course:'+c.id,'small')+btn('حذف','remove-course:'+c.id,'small danger')+'</div></td></tr>').join('')+
 '</tbody></table></div></section><div class="callout">الدورات المنشورة في المسودة تظهر فقط بمعاينة جهازك؛ لا يوجد تسجيل حقيقي ولا تحصيل رسوم على الموقع.</div>';
}
function agents(){
return head('إدارة الوكلاء','الاسم والشعار والبلد والمدينة والموقع والإيميل والهاتف والتخصيص',btn('+ وكيل جديد','new-agent','primary'))+
 '<div class="agent-list">'+draft.agents.map(a=>{
const image=String(a.logo||'../assets/maic-official-crest.png').replace(/^\.\/assets\//,'../assets/');
return '<article class="agent-box"><div class="agent-header"><img src="'+E(image)+'" alt="'+E(a.name)+'" /><div><h3>'+E(a.name)+'</h3>'+tag(a.active?'active':'inactive')+' <small>'+E(a.country)+'</small></div></div><dl>'+
 [['البلد',a.countryAr||a.country],['المدينة',a.cityAr||'غير محددة'],['الموقع',a.website],['الإيميل',a.email],['الهاتف',a.phone]].map(([title,val])=>'<div><dt>'+E(title)+'</dt><dd>'+E(val)+'</dd></div>').join('')+
 '</dl><div class="actions">'+btn('تعديل','edit-agent:'+a.id,'small')+btn('حذف','remove-agent:'+a.id,'small danger')+'</div></article>'}).join('')+'</div>'+
 '<div class="callout">Unity Bridge هو الوكيل الأمريكي والبديل الدولي، لذلك يبقى فعال دائماً. التعديل والحذف هنا لا يغيّران عقود الاعتماد الحقيقية.</div>';
}
function structure(){
return head('هيكلة القائمة','رتب الأقسام الرئيسية وعدل عنوانها أو أخفها من القائمة',btn('معاينة','preview'))+
 '<section class="panel"><h2>ترتيب عناصر القائمة</h2><div class="structure-list">'+draft.nav.map((n,i)=>
 '<div class="structure-row"><span class="structure-num">'+(i+1)+'</span><div class="structure-label"><b>'+E(n.ar)+'</b><small>'+E(n.en)+' · '+E(n.id)+'</small></div><div class="structure-tools"><label><input type="checkbox" data-visible="'+E(n.id)+'" '+(n.visible?'checked':'')+' /> ظاهر</label>'+btn('↑','up:'+n.id,'small')+btn('↓','down:'+n.id,'small')+btn('تعديل','edit-nav:'+n.id,'small')+'</div></div>').join('')+'</div></section><div class="callout">إخفاء عنصر يعني إخفاءه من القائمة، مو حذف الصفحة الأصلية من كود الموقع.</div>';
}
function pages(){
const custom=draft.nav.filter(x=>x.id.startsWith('custom:'));
return head('الصفحات الإضافية','أضف صفحات نصية بسيطة للعربي والإنكليزي',btn('+ صفحة جديدة','new-page','primary'))+
 '<section class="panel"><h2>صفحات مخصصة ('+custom.length+')</h2>'+(custom.length?custom.map(n=>
 '<div class="structure-row"><div class="structure-label"><b>'+E(n.ar)+'</b><small>'+E(n.en)+'</small></div>'+tag(n.visible?'active':'inactive')+
 '<div class="actions">'+btn('تعديل','edit-nav:'+n.id,'small')+btn('حذف','remove-page:'+n.id,'small danger')+'</div></div>').join(''):'<p>ماكو صفحات إضافية بعد. أضف صفحة تعريفية أو خدمة أو قسم جديد.</p>')+'</section>';
}
function settings(){
return head('المعاينة والنسخ','تحكم بالتعديلات المنشورة والمسودات المحفوظة')+
 '<section class="panel"><h2>معاينة حية على جهازك</h2><p>تگدر تشوف التغييرات بفتح الموقع من أزرار المعاينة. المسودة ما تنشر لزوار الموقع الآخرين.</p><div class="page-actions">'+btn('معاينة الرئيسية','preview','primary')+btn('معاينة الكورسات','preview-courses')+btn('معاينة الوكلاء','preview-agents')+'</div></section>'+
 '<section class="panel"><h2>تصدير واستيراد</h2><div class="page-actions">'+btn('تصدير JSON','export','primary')+btn('استيراد JSON','import')+btn('استرجاع الأصل','reset','danger')+'</div><input type="file" id="importFile" accept=".json,application/json" hidden /><textarea class="code-preview" readonly>'+E(JSON.stringify(draft,null,2))+'</textarea></section>'+
 '<section class="panel"><h2>نشر التعديلات للموقع الحقيقي</h2><p>النسخة المنشورة الحالية رقم '+serverVersion+'. عند النشر ينتقل كتالوج الكورسات والوكلاء والقائمة إلى قاعدة بيانات MAIC. تگدر تستخدم زر «تحميل المحتوى المنشور» للتراجع عن مسودتك الحالية.</p><div class="page-actions">'+btn('نشر المسودة الآن','publish','primary')+btn('تحميل آخر محتوى منشور','load-live')+'</div></section>';
}
const views={overview,courses,agents,structure,pages,settings};
const titles={overview:'نظرة عامة',courses:'إدارة الكورسات',agents:'الوكلاء',structure:'هيكلة الموقع',pages:'الصفحات',settings:'المعاينة والنسخ'};
function render(){$('#studioMain').innerHTML=views[tab]();$('#studioTitle').textContent=titles[tab];document.querySelectorAll('#studioNav [data-tab]').forEach(b=>b.classList.toggle('is-active',b.dataset.tab===tab))}
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
 title=id?'تعديل تفاصيل الكورس':'إضافة كورس جديد';
 fields='<section class="editor-section"><h3>١. معلومات الكورس</h3><div class="edit-grid">'+
 field('اسم الكورس بالعربي *','ar',c.ar,'text',true)+field('Course name (English) *','en',c.en,'text',true)+
 field('التصنيف بالعربي','areaAr',c.areaAr)+field('Category in English','areaEn',c.areaEn)+
 textarea('نبذة عن الكورس بالعربي','descriptionAr',c.descriptionAr)+textarea('Course summary in English','descriptionEn',c.descriptionEn)+
 '</div></section>'+
 '<section class="editor-section"><h3>٢. نوع الدورة وطريقة تقديمها *</h3><p class="editor-help">تگدر تختار نوع واحد أو أكثر؛ الكورس يظهر تحت كل نوع تحدده في قائمة الموقع.</p>'+
 '<div class="course-mode-grid">'+MAIC_COURSE_MODES.map((m,i)=>'<label class="course-mode-option"><input type="checkbox" name="mode" value="'+E(m.id)+'" '+(c.mode.includes(m.id)?'checked':'')+' /><span class="course-mode-copy"><strong>'+E(m.ar)+'</strong><small>'+E(m.en)+'</small><em>'+E(['دروس مسجلة ومواد واختبارات داخل الموقع','محاضر مباشر مع مجموعة طلبة بموعد محدد','مدرب مع طالب واحد بشكل خاص'][i])+'</em></span></label>').join('')+'</div></section>'+
 '<section class="editor-section"><h3>٣. معلومات الدراسة</h3><div class="edit-grid">'+
 select('مستوى الدورة','level',c.level||'all',[['all','جميع المستويات'],['beginner','مبتدئ'],['intermediate','متوسط'],['advanced','متقدم']])+
 select('لغة تقديم الدورة','courseLanguage',c.courseLanguage||'ar',[['ar','العربية'],['en','الإنكليزية'],['bilingual','العربية والإنكليزية'],['other','لغة أخرى']])+
 field('مدة الكورس (مثلاً: 6 أسابيع)','duration',c.duration)+
 field('اسم المحاضر / المدرب','instructor',c.instructor)+
 textarea('الأهداف التعليمية (كل هدف بسطر) — عربي','objectivesAr',c.objectivesAr)+
 textarea('Learning objectives — English','objectivesEn',c.objectivesEn)+
 textarea('المنهج ووحدات الدورة (كل وحدة بسطر) — عربي','syllabusAr',c.syllabusAr)+
 textarea('Course syllabus / modules — English','syllabusEn',c.syllabusEn)+
 textarea('متطلبات الالتحاق بالعربي','requirementsAr',c.requirementsAr)+
 textarea('Prerequisites in English','requirementsEn',c.requirementsEn)+
 '</div></section>'+
 '<section class="editor-section"><h3>٤. الرسوم وحالة النشر</h3><div class="edit-grid">'+
 field('رسوم الدورة (اختياري — دفع للوكيل حصراً)','feeAmount',c.feeAmount,'text')+
 select('عملة الرسوم','feeCurrency',c.feeCurrency||'USD',[['USD','USD · دولار أمريكي'],['IQD','IQD · دينار عراقي'],['EUR','EUR · يورو'],['GBP','GBP · جنيه إسترليني'],['CAD','CAD · دولار كندي'],['AED','AED · درهم إماراتي'],['SAR','SAR · ريال سعودي']])+
 select('حالة عرض الكورس','status',c.status,[['preparing','قيد الإعداد'],['published','منشور بكتالوج الموقع'],['archived','مؤرشف / غير ظاهر']])+
 '</div><div class="editor-help boxed">الرسوم تظهر كمعلومات فقط. الدفع يبقى للوكيل المعتمد، وتفعيل الدورة حصراً من إدارة MAIC. نشر الدورة هنا ما يعني فتح التسجيل الإلكتروني.</div></section>';
}
if(kind==='agent'){
 const a=draft.agents.find(x=>x.id===id)||{name:'',country:'',countryAr:'',countryEn:'',cityAr:'',cityEn:'',stateAr:'',stateEn:'',website:'https://',email:'',phone:'',logo:'',active:false};
 title=id?'تعديل معلومات الوكيل':'إضافة وكيل جديد';
 fields='<section class="editor-section"><h3>١. هوية الوكيل وبلده</h3><div class="edit-grid">'+
 field('اسم الشركة / الوكيل المعتمد *','name',a.name,'text',true,true)+
 select('الدولة المخصصة *','country',a.country,[['','اختر الدولة'],...(window.MAIC_COUNTRIES||[]).map(c=>[c.code,c.name])])+
 select('حالة ظهور الوكيل','active',a.active?'yes':'no',[['yes','نشط ومعتمد للتوجيه'],['no','غير نشط — لا يوجّه إليه الطلاب']])+
 field('اسم البلد بالعربي','countryAr',a.countryAr)+field('Country name English','countryEn',a.countryEn)+
 field('المدينة بالعربي','cityAr',a.cityAr)+field('City English','cityEn',a.cityEn)+
 field('الولاية أو المحافظة بالعربي','stateAr',a.stateAr)+field('State / Region English','stateEn',a.stateEn)+
 '</div></section>'+
 '<section class="editor-section"><h3>٢. معلومات التواصل الرسمية</h3><div class="edit-grid">'+
 field('الموقع الرسمي *','website',a.website,'url',true,true)+
 field('إيميل التواصل *','email',a.email,'email',true)+
 field('رقم التواصل مع مفتاح البلد *','phone',a.phone,'tel',true)+
 '</div></section>'+
 '<section class="editor-section"><h3>٣. شعار الوكيل</h3>'+
 '<div class="agent-logo-preview"><img id="agentLogoPreview" alt="معاينة شعار الوكيل" src="'+E(String(a.logo||'../assets/maic-official-crest.png').replace(/^\.\/assets\//,'../assets/'))+'" /></div>'+
 '<div class="edit-grid">'+field('رابط صورة الشعار أو مسار الصورة بالموقع','logo',a.logo,'text',false,true)+'</div>'+
 '<p class="editor-help">ضع رابط صورة HTTPS مباشر، أو مسار الشعار الموجود على الموقع مثل ./assets/agents/asas360.webp. تظهر الصورة دائرية بالكارد.</p></section>';
}
if(kind==='nav'){
 const n=draft.nav.find(x=>x.id===id)||{ar:'',en:'',visible:true,contentAr:'',contentEn:''};
 title=id?'تعديل القائمة':'إضافة صفحة';
 fields=field('الاسم بالعربي *','ar',n.ar,'text',true)+field('English name *','en',n.en,'text',true)+select('الحالة','visible',n.visible?'yes':'no',[['yes','ظاهر'],['no','مخفي']]);
 if(!id||id.startsWith('custom:'))fields+=textarea('محتوى الصفحة بالعربي','contentAr',n.contentAr)+textarea('Page content in English','contentEn',n.contentEn);
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
 if(c.feeAmount&&(!/^(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?$/.test(c.feeAmount)||Number(c.feeAmount)>10000000)){note('راجع مبلغ الرسوم. اكتب الرقم بدون فواصل أو اتركه فارغ.');return}
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
 const old=draft;draft=next;if(save())$('#editDialog').close();else draft=old;
}
function remove(kind,id){
 if(kind==='agent'&&id==='unity-bridge'){note('Unity Bridge وكيل أساسي، ما ينحذف.');return}
 if(!confirm('حذف من المسودة المحلية فقط؟'))return;
 const prop=kind==='course'?'courses':kind==='agent'?'agents':'nav',next=clone(draft);
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
   note('تم تحميل آخر نسخة منشورة، بدون نشر أي تغيير.');
  }else if(!localStorage.getItem(KEY)){
   draft=clone(serverDocument);
   localStorage.setItem(KEY,JSON.stringify(draft));
  }
  $('#draftState').textContent='النسخة المنشورة رقم '+serverVersion;
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
 const button=$('#adminLoginSubmit');button.disabled=true;button.textContent='جاري التحقق...';
 try{
  await serverCall('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:$('#adminPassword').value})});
  $('#adminLoginError').textContent='';
  await enterDashboard();
 }catch(err){$('#adminLoginError').textContent=err.status===429?'محاولات كثيرة. حاول بعد ربع ساعة.':'تعذّر الدخول. تحقق من مفتاح المدير.'}
 finally{button.disabled=false;button.textContent='دخول لوحة الإدارة'}
}
async function logoutAdmin(){
 try{await serverCall('/api/admin/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})}catch{}
 showLogin('تم تسجيل الخروج من الإدارة.');
}
async function publish(){
 if(!authenticated||!serverVersion){note('تحتاج جلسة إدارة صالحة قبل النشر.');return}
 let validated;try{validated=clean(draft)}catch(err){note('راجع البيانات أولاً: '+err.message);return}
 if(!confirm('تأكيد نشر التعديلات على موقع MAIC لجميع الزوار؟'))return;
 const btn=$('#publishButton');btn.disabled=true;btn.textContent='جاري النشر...';
 try{
  const result=await serverCall('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:validated,expectedVersion:serverVersion})});
  serverVersion=result.version;serverDocument=clone(validated);draft=clone(validated);
  localStorage.setItem(KEY,JSON.stringify(draft));
  $('#draftState').textContent='منشور · الإصدار '+serverVersion;note('تم النشر فعلياً للموقع. حدّث صفحة الموقع حتى تشوف التعديل.');render();
 }catch(err){
  if(err.status===401){showLogin('انتهت جلسة الدخول قبل النشر.');return}
  if(err.status===409){note('صار تعديل أحدث على الموقع. حمّل النسخة المنشورة وراجع تغييراتك قبل إعادة النشر.')}
  else note('تعذر النشر: '+err.message);
 }finally{btn.disabled=false;btn.textContent='نشر التغييرات للموقع'}
}

function exportJson(){
 const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='MAIC_Admin_Draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function clickAction(a){
 const sep=a.indexOf(':'),kind=sep>=0?a.slice(0,sep):a,id=sep>=0?a.slice(sep+1):'';
 if(kind==='tab')return switchTab(id);
 if(a==='new-course')return openEditor('course');
 if(a==='new-agent')return openEditor('agent');
 if(a==='new-page')return openEditor('nav');
 if(kind==='edit-course')return openEditor('course',id);
 if(kind==='copy-course'){const c=draft.courses.find(x=>x.id===id);if(!c)return;draft.courses.push({...clone(c),id:genId('course'),ar:c.ar+' (نسخة)',en:c.en+' (Copy)',status:'preparing'});return save()}
 if(kind==='edit-agent')return openEditor('agent',id);
 if(kind==='edit-nav')return openEditor('nav',id);
 if(kind==='remove-course')return remove('course',id);
 if(kind==='remove-agent')return remove('agent',id);
 if(kind==='remove-page')return remove('nav',id);
 if(kind==='up')return move(id,-1);
 if(kind==='down')return move(id,1);
 if(a==='preview')return preview();
 if(a==='preview-courses')return preview('courses');
 if(a==='preview-agents')return preview('agents');
 if(a==='export')return exportJson();
 if(a==='publish')return publish();
 if(a==='load-live')return loadLive(true);
 if(a==='import')return $('#importFile').click();
 if(a==='reset'){if(!confirm('استرجاع الأصل وحذف تعديلات مسودتك؟'))return;draft=initial();save()}
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]');if(a)return clickAction(a.dataset.action);const n=e.target.closest('[data-tab]');if(n)return switchTab(n.dataset.tab)});
document.addEventListener('change',e=>{
 const vis=e.target.closest('[data-visible]');if(vis){const n=draft.nav.find(x=>x.id===vis.dataset.visible);if(n){n.visible=vis.checked;save()}}
 if(e.target.id==='importFile'){
 const f=e.target.files[0];if(!f)return;if(f.size>400000){note('حجم الملف كبير جداً.');return}
 const r=new FileReader();r.onload=()=>{try{const p=clean(JSON.parse(r.result));if(!confirm('استبدال مسودتك الحالية؟'))return;draft=p;save()}catch(err){note(err.message)}};r.readAsText(f);e.target.value='';
 }
});
document.addEventListener('input',e=>{if(e.target?.name==='logo'&&editing.startsWith('agent|')){const img=$('#agentLogoPreview');if(img){const value=e.target.value.trim();if(value.startsWith('https://')||value.startsWith('./assets/agents/')||value.startsWith('/assets/agents/'))img.src=value.replace(/^\.\/assets\//,'../assets/');}}});
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
