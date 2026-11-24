(() => {
 'use strict';
 // Presentation-only translation; learner, agent and course records remain unchanged.
 const AR_EN=new Map([["الإدارة","Administration"],["لوحة الإدارة","Admin Dashboard"],["تسجيل دخول إدارة MAIC","MAIC administrator sign-in"],["تسجيل دخول الإدارة","Administrator Sign In"],["هذه اللوحة مخصصة لإدارة محتوى الأكاديمية ونشره.","Manage and publish MAIC academy content securely."],["مفتاح دخول المدير","Administrator access key"],["مفتاح الإدارة السري","Enter your administrator access key"],["دخول لوحة الإدارة","Sign In to Dashboard"],["الجلسة محمية وتنتهي تلقائياً. لا تشارك مفتاح الإدارة مع الآخرين.","Your session is protected and expires automatically. Never share your administrator key."],["إدارة محتوى الأكاديمية","Academy Content Management"],["نظرة عامة","Overview"],["إدارة الدورات","Course Management"],["الطلاب وتفعيل المواد","Students & Course Access"],["قالب شهادة MAIC الرسمي","Official MAIC Certificate Template"],["جاهزية وإطلاق الدورات","Course Readiness & Launch"],["المخطوطات العلمية الخاصة","Private Academic Manuscripts"],["توثيق مراجعة المواد الأكاديمية","Academic Material Reviews"],["اعتماد مواد PDF بخط Tinos 12","Approve Course PDFs (Tinos 12)"],["اختبارات الدورات (100 سؤال)","Course Exams (100 Questions)"],["مسودات الامتحانات الخاصة (مراجعة فقط)","Private Exam Drafts (Review Only)"],["إكمال الدورات والشهادات","Completions & Certificates"],["طلبات الشهادات الورقية","Printed Certificate Requests"],["مكتبة مايك","MAIC Library"],["الرسائل والعروض","Messages & Promotions"],["الوكلاء","Agents"],["الصفحات والقائمة","Pages & Navigation"],["النسخ والاستعادة","Backup & Restore"],["إدارة محتوى الموقع","Website Content Management"],["احفظ مسودتك، راجعها، ثم انشرها من الزر العلوي.","Save your draft, preview it, then publish using the top button."],["نشر التغييرات على الموقع","Publish Website Changes"],["معاينة ↗","Preview ↗"],["خروج","Sign Out"],["جارٍ تحميل المحتوى","Loading content"],["جارٍ النشر","Publishing"],["مسودة غير منشورة","Unpublished draft"],["إدارة محتوى MAIC:","MAIC Content Management:"],["احفظ تعديلاتك في المسودة، راجعها عبر المعاينة، ثم انشرها للزوار من الزر العلوي. حالة الحفظ تظهر بجانب زر النشر.","Save edits as a draft, review in Preview, then use Publish to make changes visible. The save status appears next to the Publish button."],["إدارة محتوى الأكاديمية من مساحة واحدة","Manage the academy's website content in one place."],["الدورات النشطة","Active Courses"],["صيغ التعلم","Learning Formats"],["الوكلاء النشطون","Active Agents"],["الصفحات الظاهرة","Visible Pages"],["مسار العمل","Workflow"],["عدّل الدورات والوكلاء والصفحات من القائمة الجانبية.","Edit courses, agents and pages from the sidebar."],["احفظ المسودة داخل محرر المحتوى.","Save your draft in the content editor."],["راجع النتيجة عبر زر المعاينة العلوي.","Review the results with the Preview button."],["انشر التغييرات من زر النشر العلوي.","Publish changes using the Publish button."],["جاهزية الإطلاق","Launch Readiness"],["الدورات الأولية تحتوي على أهداف ومحاور ومتطلبات. افتح التسجيل بعد رفع المواد التعليمية وتحديد الرسوم والمدة والمدرب.","Initial courses have objectives, syllabuses and requirements. Open enrollment only after materials, fees, duration and instructor are confirmed."],["واجهة الموقع متعددة اللغات. تعديل نصوص جديدة بعد هذه المراجعة يتطلب تحديث ترجماتها قبل الإطلاق.","The public website supports multiple languages. New copy requires translation review before launch."],["أضف أو عدّل أو احذف الدورات وحدد نوع التعلّم وحالة عرضها","Add, edit or delete courses and manage delivery formats and listing status."],["+ دورة جديدة","+ New Course"],["بحث في الدورات","Search Courses"],["اسم الدورة أو التصنيف","Course title or category"],["العرض","View"],["الدورات الحالية","Current Courses"],["الأرشيف","Archive"],["الكل","All"],["الدورة","Course"],["الأنواع","Formats"],["التصنيف","Category"],["الحالة","Status"],["التحكم","Actions"],["تعديل","Edit"],["حذف","Delete"],["حالة الدورة تحدد عرضها في الكتالوج. الحفظ يحدّث المسودة؛ زر النشر العلوي يحدّث الموقع. الدورات المؤرشفة لا تظهر للزوار.","Course status controls catalog visibility. Save updates the draft; Publish updates the website. Archived courses are hidden from visitors."],["إدارة الوكلاء","Agent Management"],["الاسم والشعار والبلد والمدينة والموقع والبريد الإلكتروني والهاتف والتخصيص","Manage agent identity, logo, region, website and contacts."],["+ وكيل جديد","+ New Agent"],["نشط","Active"],["غير نشط","Inactive"],["البلد","Country"],["المدينة","City"],["الموقع","Website"],["البريد الإلكتروني","Email"],["الهاتف","Phone"],["غير محددة","Not specified"],["Unity Bridge هو الوكيل الأمريكي والبديل الدولي، لذلك يبقى نشطاً دائماً. التعديل والحذف هنا لا يغيّران عقود الاعتماد الحقيقية.","Unity Bridge is the U.S. agent and global fallback and must remain active. Editing these records does not change signed agency agreements."],["مكان واحد لإدارة العناوين والترتيب والمحتوى والظهور","Manage navigation titles, order, content and visibility in one place."],["+ صفحة جديدة","+ New Page"],["ترتيب عناصر القائمة","Navigation Order"],["ظاهر","Visible"],["يؤدي إخفاء العنصر إلى إزالته من القائمة دون حذف الصفحة الأصلية من الشيفرة البرمجية للموقع.","Hiding a menu item removes it from navigation without deleting its source page."],["نسخة احتياطية من المسودة أو استعادة المحتوى المنشور","Back up drafts or restore published content."],["حفظ نسخة احتياطية واستيرادها","Backup & Import"],["صدّر المسودة قبل تغييرات كبيرة. الاستيراد يستبدل المسودة بعد التأكيد ولا ينشر تلقائياً.","Export your draft before major edits. Import replaces your draft after confirmation; it does not publish automatically."],["تصدير المسودة","Export Draft"],["استيراد نسخة","Import Backup"],["استعادة المحتوى المنشور","Restore Published Content"],["استعادة آخر نسخة منشورة","Restore Latest Published Version"],["إضافة الكتب وتصنيفها وتحديد المجاني والمدفوع","Add and categorize free and paid library books."],["+ كتاب جديد","+ New Book"],["الكتاب","Book"],["التخصص","Subject"],["الإتاحة","Availability"],["الكتاب المجاني","Free Book"],["مجاني","Free"],["مدفوع","Paid"],["مخفي","Hidden"],["الكتب المجانية تفتح الرابط الذي تضيفه. الكتب المدفوعة تعرض السعر وتتيح الاستفسار لدى الوكيل المخصص؛ لا تُستحصل مدفوعات عبر الموقع.","Free books link to the URL you supply. Paid books display prices and direct inquiries to an agent; the website does not process payments."],["استهداف بلد واحد أو مجموعة بلدان أو جميع الزوار","Target a country, several countries or all visitors."],["+ رسالة جديدة","+ New Message"],["جميع البلدان","All Countries"],["مفعّلة","Enabled"],["غير مفعّلة","Disabled"],["تظهر الرسالة حسب بلد الإقامة الذي يختاره الزائر، وليس بناءً على تحديد موقعه تلقائياً. تُسجّل مواعيد النشر والانتهاء بتوقيت UTC.","Messages are targeted by the visitor's selected country, not automatic geolocation. Start and end times are in UTC."],["قيد الإعداد","In Preparation"],["معروض في دليل الدورات","Listed in Course Catalog"],["مؤرشف","Archived"],["تعلّم ذاتي عبر الإنترنت","Self-Paced Online"],["جماعي مباشر","Live Group"],["فردي خاص","One-on-One"],["محرر المحتوى","Content Editor"],["تعديل المحتوى","Edit Content"],["إلغاء","Cancel"],["حفظ المسودة","Save Draft"],["إغلاق","Close"],["إضافة دورة جديدة","Add New Course"],["تعديل تفاصيل الدورة","Edit Course Details"],["١. معلومات الدورة","1. Course Information"],["اسم الدورة بالعربية *","Course name (Arabic) *"],["التصنيف بالعربية","Category (Arabic)"],["نبذة عن الدورة بالعربية","Course summary (Arabic)"],["٢. نوع الدورة وطريقة تقديمها *","2. Course Format & Delivery *"],["يمكنك اختيار نوع واحد أو أكثر؛ وتظهر الدورة ضمن كل نوع تحدده في قائمة الموقع.","Select one or more formats. The course will appear under each selected format on the website."],["دروس مسجلة ومواد واختبارات داخل الموقع","Recorded lessons, materials and exams on the website."],["دروس مباشرة مع محاضر ومجموعة من المتعلّمين في موعد محدد","Scheduled live sessions with an instructor and learners."],["جلسات فردية مع مدرّب ومتعلّم واحد","Individual sessions with one instructor and one learner."],["٣. معلومات الدراسة","3. Course Details"],["مستوى الدورة","Course Level"],["جميع المستويات","All Levels"],["مبتدئ","Beginner"],["متوسط","Intermediate"],["متقدم","Advanced"],["لغة تقديم الدورة","Teaching Language"],["العربية","Arabic"],["الإنكليزية","English"],["العربية والإنكليزية","Arabic and English"],["لغة أخرى","Other Language"],["مدة الدورة (مثلاً: 6 أسابيع)","Duration (e.g. 6 weeks)"],["المدة بالساعات — اختياري","Duration in Hours — Optional"],["اعتماد المدة","Duration Approval"],["مدة مقترحة","Proposed Duration"],["مدة معتمدة","Approved Duration"],["الصورة المعتمدة","Approved Image"],["دون صورة","No Image"],["مهارات الإدارة الأساسية","Management Skills"],["التسويق والاتصالات","Marketing & Communications"],["الموارد البشرية","Human Resources"],["اسم المحاضر / المدرب","Instructor / Trainer"],["الأهداف التعليمية (كل هدف في سطر مستقل) — عربي","Learning Objectives (one per line) — Arabic"],["المنهج ووحدات الدورة (كل وحدة في سطر مستقل) — عربي","Syllabus & Modules (one per line) — Arabic"],["متطلبات الالتحاق بالعربية","Admission Requirements (Arabic)"],["٤. الرسوم وحالة النشر","4. Fees & Publishing"],["رسوم الدورة (اختياري — دفع للوكيل حصراً)","Course Fee (optional — paid to agent only)"],["عملة الرسوم","Fee Currency"],["دولار أمريكي","US Dollar"],["دينار عراقي","Iraqi Dinar"],["يورو","Euro"],["جنيه إسترليني","Pound Sterling"],["دولار كندي","Canadian Dollar"],["درهم إماراتي","UAE Dirham"],["ريال سعودي","Saudi Riyal"],["حالة عرض الدورة","Course Listing Status"],["منشور في دليل الدورات بالموقع","Published in Course Catalog"],["مؤرشف / غير ظاهر","Archived / Hidden"],["تُعرض الرسوم للمعلومات فقط. تُدفع الرسوم للوكيل المعتمد، وتختص إدارة MAIC وحدها بتفعيل الدورة. ولا يعني نشر الدورة هنا فتح التسجيل الإلكتروني.","Fees are informational and paid only to the approved agent. MAIC alone activates enrollment. Publishing a catalog listing does not automatically open online registration."],["تعديل معلومات الوكيل","Edit Agent Information"],["إضافة وكيل جديد","Add New Agent"],["١. هوية الوكيل وبلده","1. Agent Identity & Region"],["اسم الشركة / الوكيل المعتمد *","Company / Approved Agent Name *"],["الدولة المخصصة *","Assigned Country *"],["اختر الدولة","Select Country"],["حالة ظهور الوكيل","Agent Status"],["نشط ومعتمد للتوجيه","Active for Student Routing"],["غير نشط — لا يوجّه إليه الطلاب","Inactive — Excluded from Routing"],["اسم البلد بالعربية","Country Name (Arabic)"],["المدينة بالعربية","City (Arabic)"],["الولاية أو المحافظة بالعربية","State / Province (Arabic)"],["٢. معلومات التواصل الرسمية","2. Official Contact Details"],["الموقع الرسمي *","Official Website *"],["البريد الإلكتروني للتواصل *","Contact Email *"],["رقم التواصل مع مفتاح البلد *","Phone with Country Code *"],["٣. شعار الوكيل","3. Agent Logo"],["معاينة شعار الوكيل","Agent Logo Preview"],["رابط صورة الشعار أو مسار الصورة بالموقع","Logo Image URL or Site File Path"],["ضع رابط صورة HTTPS مباشر، أو مسار الشعار الموجود على الموقع مثل ./assets/agents/asas360.webp. تظهر الصورة داخل إطار دائري في البطاقة.","Use a direct HTTPS image URL or an existing asset path such as ./assets/agents/asas360.webp. The logo displays in a circular frame."],["تعديل القائمة","Edit Navigation Item"],["إضافة صفحة","Add Page"],["الاسم بالعربية *","Page Name (Arabic) *"],["الحالة","Status"],["محتوى الصفحة بالعربية","Page Content (Arabic)"],["تعديل الكتاب","Edit Book"],["إضافة كتاب","Add Book"],["عنوان الكتاب بالعربية *","Book Title (Arabic) *"],["عنوان الكتاب بالإنكليزية *","Book Title (English) *"],["المؤلف","Author"],["سنة الإصدار — أربعة أرقام","Publication Year — 4 Digits"],["دار النشر","Publisher"],["رمز لغة ملف الكتاب — مثل ar أو en أو fr","Book Language Code — e.g. ar/en/fr"],["رابط الغلاف الأصلي — اختياري","Original Cover URL — Optional"],["تعديل الرسالة","Edit Message"],["إضافة رسالة أو عرض","Add Message / Promotion"],["العنوان بالعربية *","Message Title (Arabic) *"],["العنوان بالإنكليزية *","Message Title (English) *"],["النص بالعربية *","Message Body (Arabic) *"],["النص بالإنكليزية *","Message Body (English) *"],["تحديد مجموعة بلدان","Country Group"],["اختيار بلدان يدوياً","Choose Countries Manually"],["دول مجلس التعاون الخليجي","Gulf Cooperation Council"],["البلدان العربية","Arab Countries"],["الاتحاد الأوروبي","European Union"],["البلدان المستهدفة — اتركها دون تحديد لجميع البلدان","Target Countries — Leave Empty for All"],["تم الحفظ محلياً. اضغط على زر النشر لإظهار التغييرات للزوار.","Saved locally. Click Publish to make changes visible to visitors."],["فشل تحميل المحتوى المنشور:","Unable to load published content:"],["تعذّر الاتصال بالخادم","Unable to connect to the server"],["خدمة الإدارة غير متاحة حالياً. تأكد من الاتصال.","Admin service is currently unavailable. Check your connection."],["انتهت جلسة الإدارة؛ يرجى تسجيل الدخول مجدداً.","Your admin session has expired. Please sign in again."],["جارٍ التحقق...","Verifying..."],["تعذّر الدخول. تحقق من مفتاح المدير.","Sign-in failed. Check the administrator key."],["تجاوزت الحد المسموح به لمحاولات تسجيل الدخول. يُرجى المحاولة بعد خمس عشرة دقيقة.","Too many login attempts. Please retry after 15 minutes."],["تم تسجيل الخروج من الإدارة.","You have signed out."],["يلزم تسجيل الدخول إلى لوحة الإدارة قبل النشر.","You must sign in before publishing."],["راجع البيانات أولاً:","Please review the data first:"],["تأكيد نشر التعديلات على موقع MAIC لجميع الزوار؟","Publish these MAIC website changes for all visitors?"],["جارٍ النشر...","Publishing..."],["تم نشر التغييرات على الموقع. حدّث الصفحة لعرض التعديلات.","Website changes published. Refresh the public page to see them."],["توجد تعديلات أحدث على الموقع. حمّل النسخة المنشورة وراجع تغييراتك قبل إعادة النشر.","Newer changes exist on the website. Load the published version and review your draft before publishing again."],["تعذر النشر:","Publish failed:"],["استبدال المسودة الحالية بنسخة الموقع المنشورة؟","Replace the current draft with the published website content?"],["تم تحميل أحدث نسخة منشورة دون نشر أي تغيير.","Latest published version loaded without publishing changes."],["توجد مسودة محلية مختلفة. راجعها قبل النشر، أو استعد النسخة المنشورة من النسخ والاستعادة.","A different local draft exists. Review it before publishing or restore the published copy."],["حذف من المسودة المحلية فقط؟","Delete from the local draft only?"],["حجم الملف كبير جداً.","The file is too large."],["استبدال مسودتك الحالية؟","Replace your current draft?"],["حدد نوع دراسة واحد على الأقل.","Select at least one course format."],["راجع مبلغ الرسوم. اكتب الرقم دون فواصل أو اترك الحقل فارغاً.","Check the fee amount. Use numbers without separators or leave blank."],["حدد الدولة.","Select a country."],["اكتب رابط موقع HTTPS صحيح.","Enter a valid HTTPS website URL."],["رابط الشعار يجب أن يكون HTTPS أو مسار صورة داخل assets/agents.","Logo must be an HTTPS URL or an image path within assets/agents."],["Unity Bridge وكيل أساسي، ولا يمكن حذفه.","Unity Bridge is a required agent and cannot be deleted."],["إنشاء حساب","Create Account"],["اسم الدورة","Course Name"]]);
 const EN_AR=new Map(Array.from(AR_EN,(entry)=>[entry[1],entry[0]]));
 const state=new WeakMap();
 const attrState=new WeakMap();
 const KEY='maic_admin_language';
 let language='en';
 try { language=localStorage.getItem(KEY)==='ar'?'ar':'en'; } catch {}
 const normalize=text=>String(text||'').replace(/\s+/g,' ').trim();
 function translatePhrase(text){
   const trimmed=normalize(text);
   if(!trimmed)return text;
   let result=AR_EN.get(trimmed);
   if(!result){
     const match=trimmed.match(/^محدّث · الإصدار (\d+)$/);
     if(match)result='Saved · version '+match[1];
   }
   if(!result){
     const match=trimmed.match(/^منشور · الإصدار (\d+)$/);
     if(match)result='Published · version '+match[1];
   }
   if(!result){
     const match=trimmed.match(/^الكتالوج \((\d+)\)$/);
     if(match)result='Catalog ('+match[1]+')';
   }
   if(!result){
     const match=trimmed.match(/^نسخة الموقع المنشورة رقم (\d+)\. استعادتها تستبدل المسودة المحلية فقط\.$/);
     if(match)result='Published website version '+match[1]+'. Restoring it replaces the local draft only.';
   }
   if(!result && trimmed.startsWith('فشل تحميل المحتوى المنشور: '))result='Unable to load published content: '+trimmed.slice('فشل تحميل المحتوى المنشور: '.length);
   if(!result && trimmed.startsWith('تعذر النشر: '))result='Publish failed: '+trimmed.slice('تعذر النشر: '.length);
   if(!result && trimmed.startsWith('راجع البيانات أولاً: '))result='Please review the data first: '+trimmed.slice('راجع البيانات أولاً: '.length);
   if(!result)return text;
   const prefix=text.match(/^\s*/)?.[0]||'',suffix=text.match(/\s*$/)?.[0]||'';
   return prefix+result+suffix;
 }
 function updateText(node){
   const current=node.nodeValue||'';
   let entry=state.get(node);
   if(!entry||entry.applied!==current){entry={source:current,applied:current};state.set(node,entry);}
   const next=language==='ar'?entry.source:translatePhrase(entry.source);
   if(next!==current){entry.applied=next;node.nodeValue=next;}
 }
 const attributes=['placeholder','aria-label','title'];
 function updateAttributes(element){
   let entries=attrState.get(element);
   if(!entries){entries={};attrState.set(element,entries);}
   for(const attr of attributes){
     if(!element.hasAttribute(attr))continue;
     const current=element.getAttribute(attr)||'';
     let entry=entries[attr];
     if(!entry||entry.applied!==current){entry={source:current,applied:current};entries[attr]=entry;}
     const next=language==='ar'?entry.source:translatePhrase(entry.source);
     if(next!==current){entry.applied=next;element.setAttribute(attr,next);}
   }
 }
 function translateSubtree(node){
   if(node.nodeType===3){updateText(node);return;}
   if(node.nodeType!==1)return;
   if(node.closest('[data-admin-language-control]'))return;
   if(node.matches('script,style,textarea,option[value=""]')){if(node.matches('textarea'))updateAttributes(node);return;}
   updateAttributes(node);
   const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){
     const text=walker.currentNode;
     const parent=text.parentElement;
     if(parent&&parent.closest('[data-admin-language-control],script,style,textarea'))continue;
     updateText(text);
   }
   node.querySelectorAll('[placeholder],[aria-label],[title]').forEach(updateAttributes);
 }
 function applyDirection(){
   document.documentElement.lang=language;
   document.documentElement.dir=language==='ar'?'rtl':'ltr';
   document.querySelectorAll('[data-admin-lang-select]').forEach(select=>{select.value=language;});
 }
 function setLanguage(next){
   language=next==='ar'?'ar':'en';
   try{localStorage.setItem(KEY,language);}catch{}
   applyDirection();
   translateSubtree(document.body);
 }
 function createSelect(){
   const label=document.createElement('label');
   label.setAttribute('data-admin-language-control','');
   label.className='admin-language-control';
   const select=document.createElement('select');
   select.className='admin-language-select';
   select.setAttribute('data-admin-lang-select','');
   select.setAttribute('aria-label','Dashboard language');
   [['en','English'],['ar','العربية']].forEach(([value,title])=>{
     const option=document.createElement('option');option.value=value;option.textContent=title;select.appendChild(option);
   });
   select.value=language;
   label.appendChild(select);
   return label;
 }
 function boot(){
   const actions=document.querySelector('.studio-top-actions');
   if(actions)actions.prepend(createSelect());
   const logo=document.querySelector('.maic-login-panel .login-logo');
   if(logo){
     const wrap=document.createElement('div');
     wrap.className='admin-login-language';
     wrap.appendChild(createSelect());
     logo.before(wrap);
   }
   document.addEventListener('change',event=>{
     if(event.target.matches('[data-admin-lang-select]'))setLanguage(event.target.value);
   });
   applyDirection();
   translateSubtree(document.body);
   const observer=new MutationObserver(records=>{
     for(const record of records){
       if(record.type==='characterData')updateText(record.target);
       else if(record.type==='attributes')updateAttributes(record.target);
       else for(const node of record.addedNodes)translateSubtree(node);
     }
   });
   observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
})();