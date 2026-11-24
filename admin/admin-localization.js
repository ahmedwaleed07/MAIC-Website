/* MAIC Admin UI localization. Translates interface labels only; never changes stored content or credentials. */
'use strict';
(() => {
  const pairs = [
    ['الإدارة','Administration'],['لوحة الإدارة','Admin Dashboard'],['تسجيل دخول إدارة MAIC','MAIC administrator sign-in'],
    ['تسجيل دخول الإدارة','Administrator Sign In'],
    ['هذه اللوحة مخصصة لإدارة محتوى الأكاديمية ونشره.','Manage and publish the academy website content securely.'],
    ['مفتاح دخول المدير','Administrator access key'],['مفتاح الإدارة السري','Administrator access key'],
    ['دخول لوحة الإدارة','Sign in to Admin Dashboard'],
    ['الجلسة محمية وتنتهي تلقائياً. لا تشارك مفتاح الإدارة مع الآخرين.','Your session is protected and expires automatically. Do not share your access key.'],
    ['إدارة محتوى الأكاديمية','Academy Content Management'],['إدارة محتوى الموقع','Website Content Management'],
    ['نظرة عامة','Overview'],['إدارة الدورات','Course Management'],
    ['الطلاب وتفعيل المواد','Learners & Course Activation'],['قالب شهادة MAIC الرسمي','Official MAIC Certificate Template'],
    ['جاهزية وإطلاق الدورات','Course Readiness & Release'],
    ['المخطوطات العلمية الخاصة','Private Academic Manuscripts'],
    ['توثيق مراجعة المواد الأكاديمية','Academic Material Review Sign-off'],
    ['اعتماد مواد PDF بخط Tinos 12','Approve PDFs · Tinos 12'],
    ['اختبارات الدورات (100 سؤال)','Course Exams (100 Questions)'],
    ['مسودات الامتحانات الخاصة (مراجعة فقط)','Private Exam Drafts (Review Only)'],
    ['إكمال الدورات والشهادات','Course Completions & Certificates'],
    ['طلبات الشهادات الورقية','Printed Certificate Requests'],
    ['مكتبة مايك','MAIC Library'],['الرسائل والعروض','Messages & Offers'],['الوكلاء','Agents'],
    ['الصفحات والقائمة','Pages & Navigation'],['النسخ والاستعادة','Backups & Restore'],
    ['قائمة الإدارة','Admin Navigation'],['فتح القائمة','Open menu'],
    ['احفظ مسودتك، راجعها، ثم انشرها من الزر العلوي.','Save your draft, review it, then publish using the button above.'],
    ['جارٍ تحميل المحتوى','Loading content…'],['نشر التغييرات على الموقع','Publish Website Changes'],
    ['معاينة ↗','Preview ↗'],['خروج','Sign Out'],
    ['إدارة محتوى MAIC:','MAIC Content Management:'],
    ['احفظ تعديلاتك في المسودة، راجعها عبر المعاينة، ثم انشرها للزوار من الزر العلوي. حالة الحفظ تظهر بجانب زر النشر.','Save changes in your draft, preview them, and publish to visitors using the top button. Draft status appears beside Publish.'],
    ['محرر المحتوى','Content Editor'],['تعديل المحتوى','Edit Content'],['إلغاء','Cancel'],
    ['حفظ المسودة','Save Draft'],['إغلاق','Close'],['إدارة محتوى الأكاديمية من مساحة واحدة','Manage academy content in one workspace'],
    ['الدورات النشطة','Active Courses'],['صيغ التعلم','Learning Formats'],
    ['الوكلاء النشطون','Active Agents'],['الصفحات الظاهرة','Visible Pages'],
    ['مسار العمل','Workflow'],
    ['عدّل الدورات والوكلاء والصفحات من القائمة الجانبية.','Edit courses, agents and pages in the sidebar.'],
    ['احفظ المسودة داخل محرر المحتوى.','Save your draft in the content editor.'],
    ['راجع النتيجة عبر زر المعاينة العلوي.','Check the result with Preview above.'],
    ['انشر التغييرات من زر النشر العلوي.','Publish changes using the top button.'],
    ['جاهزية الإطلاق','Launch Readiness'],
    ['الدورات الأولية تحتوي على أهداف ومحاور ومتطلبات. افتح التسجيل بعد رفع المواد التعليمية وتحديد الرسوم والمدة والمدرب.','Course listings include objectives, topics and prerequisites. Open enrollment after verifying materials, fees, duration and instructor.'],
    ['واجهة الموقع متعددة اللغات. تعديل نصوص جديدة بعد هذه المراجعة يتطلب تحديث ترجماتها قبل الإطلاق.','The public site has multiple languages. New content must be translated before launch.'],
    ['أضف أو عدّل أو احذف الدورات وحدد نوع التعلّم وحالة عرضها','Add, edit or remove courses and choose their format and listing status'],
    ['+ دورة جديدة','+ New Course'],['بحث في الدورات','Search Courses'],
    ['اسم الدورة أو التصنيف','Course name or category'],['العرض','View'],
    ['الدورات الحالية','Current Courses'],['الأرشيف','Archive'],['الكل','All'],
    ['الكتالوج','Catalog'],['الدورة','Course'],['الدورات','Courses'],
    ['الأنواع','Formats'],['التصنيف','Category'],['الحالة','Status'],
    ['التحكم','Actions'],['تعديل','Edit'],['حذف','Delete'],
    ['قيد الإعداد','In Preparation'],['معروض في دليل الدورات','Listed in Course Catalog'],
    ['مؤرشف','Archived'],['نشط','Active'],['غير نشط','Inactive'],
    ['تعلّم ذاتي عبر الإنترنت','Self-paced Online'],
    ['جماعي مباشر','Live Group'],['فردي خاص','One-on-One'],
    ['حالة الدورة تحدد عرضها في الكتالوج. الحفظ يحدّث المسودة؛ زر النشر العلوي يحدّث الموقع. الدورات المؤرشفة لا تظهر للزوار.','Course status controls catalog visibility. Save updates your draft; Publish updates the website. Archived courses are hidden from visitors.'],
    ['إدارة الوكلاء','Agent Management'],
    ['الاسم والشعار والبلد والمدينة والموقع والبريد الإلكتروني والهاتف والتخصيص','Manage each agent’s identity, country, city, website, email, phone and assignment'],
    ['+ وكيل جديد','+ New Agent'],['البلد','Country'],['المدينة','City'],
    ['الموقع','Website'],['البريد الإلكتروني','Email'],['الهاتف','Phone'],
    ['غير محددة','Not specified'],
    ['Unity Bridge هو الوكيل الأمريكي والبديل الدولي، لذلك يبقى نشطاً دائماً. التعديل والحذف هنا لا يغيّران عقود الاعتماد الحقيقية.','Unity Bridge is the US agent and international fallback and must remain active. Editing catalog entries does not change signed appointment agreements.'],
    ['مكان واحد لإدارة العناوين والترتيب والمحتوى والظهور','Manage page titles, ordering, content and visibility'],
    ['+ صفحة جديدة','+ New Page'],['ترتيب عناصر القائمة','Navigation Item Order'],
    ['ظاهر','Visible'],['مخفي','Hidden'],
    ['يؤدي إخفاء العنصر إلى إزالته من القائمة دون حذف الصفحة الأصلية من الشيفرة البرمجية للموقع.','Hiding an item removes it from navigation without deleting its underlying website page.'],
    ['نسخة احتياطية من المسودة أو استعادة المحتوى المنشور','Back up your draft or restore published content'],
    ['حفظ نسخة احتياطية واستيرادها','Back Up & Import'],
    ['صدّر المسودة قبل تغييرات كبيرة. الاستيراد يستبدل المسودة بعد التأكيد ولا ينشر تلقائياً.','Export a draft before major changes. Import replaces the local draft after confirmation and does not publish automatically.'],
    ['تصدير المسودة','Export Draft'],['استيراد نسخة','Import Draft'],
    ['استعادة المحتوى المنشور','Restore Published Content'],
    ['استعادة آخر نسخة منشورة','Restore Latest Published Version'],
    ['إضافة الكتب وتصنيفها وتحديد المجاني والمدفوع','Add and categorize books and set free or paid access'],
    ['+ كتاب جديد','+ New Book'],['الكتاب','Book'],['التخصص','Subject'],['الإتاحة','Access'],
    ['مجاني','Free'],['مدفوع','Paid'],
    ['الكتب المجانية تفتح الرابط الذي تضيفه. الكتب المدفوعة تعرض السعر وتتيح الاستفسار لدى الوكيل المخصص؛ لا تُستحصل مدفوعات عبر الموقع.','Free books open the link you provide. Paid books show the price and direct inquiries to the designated agent; this site does not process payments.'],
    ['استهداف بلد واحد أو مجموعة بلدان أو جميع الزوار','Target one country, a group of countries or all visitors'],
    ['+ رسالة جديدة','+ New Message'],['جميع البلدان','All Countries'],
    ['مفعّلة','Enabled'],['غير مفعّلة','Disabled'],
    ['تظهر الرسالة حسب بلد الإقامة الذي يختاره الزائر، وليس بناءً على تحديد موقعه تلقائياً. تُسجّل مواعيد النشر والانتهاء بتوقيت UTC.','Messages use the country selected by the visitor, not automatic geolocation. Start and end times use UTC.'],
    ['تعديل تفاصيل الدورة','Edit Course Details'],['إضافة دورة جديدة','Add Course'],
    ['١. معلومات الدورة','1. Course Information'],
    ['اسم الدورة بالعربية *','Course Name (Arabic) *'],
    ['التصنيف بالعربية','Category (Arabic)'],
    ['نبذة عن الدورة بالعربية','Course Summary (Arabic)'],
    ['٢. نوع الدورة وطريقة تقديمها *','2. Course Formats *'],
    ['يمكنك اختيار نوع واحد أو أكثر؛ وتظهر الدورة ضمن كل نوع تحدده في قائمة الموقع.','Select one or more formats. The course will appear under each selected format in the catalog.'],
    ['دروس مسجلة ومواد واختبارات داخل الموقع','Recorded lessons, materials and exams on the website'],
    ['دروس مباشرة مع محاضر ومجموعة من المتعلّمين في موعد محدد','Live lessons with an instructor and a group of learners'],
    ['جلسات فردية مع مدرّب ومتعلّم واحد','Private sessions with one instructor and one learner'],
    ['٣. معلومات الدراسة','3. Study Information'],
    ['مستوى الدورة','Course Level'],['جميع المستويات','All Levels'],
    ['مبتدئ','Beginner'],['متوسط','Intermediate'],['متقدم','Advanced'],
    ['لغة تقديم الدورة','Course Language'],['العربية','Arabic'],['الإنكليزية','English'],
    ['العربية والإنكليزية','Arabic and English'],['لغة أخرى','Other Language'],
    ['مدة الدورة (مثلاً: 6 أسابيع)','Course Duration (e.g. 6 weeks)'],
    ['المدة بالساعات — اختياري','Hours — Optional'],
    ['اعتماد المدة','Duration Approval'],['مدة مقترحة','Proposed Duration'],
    ['مدة معتمدة','Approved Duration'],['الصورة المعتمدة','Approved Illustration'],
    ['دون صورة','No Image'],['مهارات الإدارة الأساسية','Core Management Skills'],
    ['التسويق والاتصالات','Marketing & Communications'],
    ['الموارد البشرية','Human Resources'],
    ['اسم المحاضر / المدرب','Instructor / Trainer'],
    ['الأهداف التعليمية (كل هدف في سطر مستقل) — عربي','Learning Objectives (one per line) — Arabic'],
    ['المنهج ووحدات الدورة (كل وحدة في سطر مستقل) — عربي','Syllabus and Modules (one per line) — Arabic'],
    ['متطلبات الالتحاق بالعربية','Prerequisites (Arabic)'],
    ['٤. الرسوم وحالة النشر','4. Fees & Publication'],
    ['رسوم الدورة (اختياري — دفع للوكيل حصراً)','Course Fee (optional — paid to agent only)'],
    ['عملة الرسوم','Fee Currency'],['حالة عرض الدورة','Course Listing Status'],
    ['منشور في دليل الدورات بالموقع','Published in Course Catalog'],
    ['مؤرشف / غير ظاهر','Archived / Hidden'],
    ['تُعرض الرسوم للمعلومات فقط. تُدفع الرسوم للوكيل المعتمد، وتختص إدارة MAIC وحدها بتفعيل الدورة. ولا يعني نشر الدورة هنا فتح التسجيل الإلكتروني.','Fees are displayed for information only and paid to the approved agent. MAIC alone activates courses. Catalog publication does not open enrollment automatically.'],
    ['تعديل معلومات الوكيل','Edit Agent Information'],['إضافة وكيل جديد','Add Agent'],
    ['١. هوية الوكيل وبلده','1. Agent Identity & Country'],
    ['اسم الشركة / الوكيل المعتمد *','Company / Approved Agent *'],
    ['الدولة المخصصة *','Assigned Country *'],
    ['اختر الدولة','Select Country'],
    ['حالة ظهور الوكيل','Agent Status'],
    ['نشط ومعتمد للتوجيه','Active & Assigned'],
    ['غير نشط — لا يوجّه إليه الطلاب','Inactive — No Learner Routing'],
    ['اسم البلد بالعربية','Country Name (Arabic)'],
    ['المدينة بالعربية','City (Arabic)'],
    ['الولاية أو المحافظة بالعربية','State / Province (Arabic)'],
    ['٢. معلومات التواصل الرسمية','2. Official Contact Details'],
    ['الموقع الرسمي *','Official Website *'],['البريد الإلكتروني للتواصل *','Contact Email *'],
    ['رقم التواصل مع مفتاح البلد *','Phone with Country Code *'],
    ['٣. شعار الوكيل','3. Agent Logo'],['معاينة شعار الوكيل','Agent Logo Preview'],
    ['رابط صورة الشعار أو مسار الصورة بالموقع','Logo URL or Website Asset Path'],
    ['ضع رابط صورة HTTPS مباشر، أو مسار الشعار الموجود على الموقع مثل ./assets/agents/asas360.webp. تظهر الصورة داخل إطار دائري في البطاقة.','Enter a direct HTTPS logo URL or an asset path such as ./assets/agents/asas360.webp. The image appears inside a circular frame.'],
    ['تعديل القائمة','Edit Navigation'],['إضافة صفحة','Add Page'],
    ['الاسم بالعربية *','Name (Arabic) *'],['الحالة','Status'],
    ['محتوى الصفحة بالعربية','Page Content (Arabic)'],
    ['تعديل الكتاب','Edit Book'],['إضافة كتاب','Add Book'],
    ['عنوان الكتاب بالعربية *','Book Title (Arabic) *'],
    ['عنوان الكتاب بالإنكليزية *','Book Title (English) *'],
    ['المؤلف','Author'],['سنة الإصدار — أربعة أرقام','Publication Year — Four Digits'],
    ['دار النشر','Publisher'],['رمز لغة ملف الكتاب — مثل ar أو en أو fr','Book Language Code — e.g. ar, en or fr'],
    ['رابط الغلاف الأصلي — اختياري','Original Cover URL — Optional'],
    ['اختيار بلدان يدوياً','Choose Countries Manually'],
    ['دول مجلس التعاون الخليجي','Gulf Cooperation Council'],
    ['البلدان العربية','Arab Countries'],['الاتحاد الأوروبي','European Union'],
    ['العنوان بالعربية *','Title (Arabic) *'],['العنوان بالإنكليزية *','Title (English) *'],
    ['النص بالعربية *','Body (Arabic) *'],['النص بالإنكليزية *','Body (English) *'],
    ['تحديد مجموعة بلدان','Choose Country Group'],
    ['البلدان المستهدفة — اتركها دون تحديد لجميع البلدان','Target Countries — Leave blank for all'],
    ['تم الحفظ محلياً. اضغط على زر النشر لإظهار التغييرات للزوار.','Saved locally. Click Publish to show changes to visitors.'],
    ['مسودة غير منشورة','Unpublished Draft'],['جارٍ النشر','Publishing…'],
    ['جارٍ النشر...','Publishing…'],['منشور','Published'],
    ['تم نشر التغييرات على الموقع. حدّث الصفحة لعرض التعديلات.','Changes published. Refresh the public website to see updates.'],
    ['انتهت جلسة الإدارة؛ يرجى تسجيل الدخول مجدداً.','Your admin session expired. Please sign in again.'],
    ['تعذّر الدخول. تحقق من مفتاح المدير.','Sign in failed. Check your administrator access key.'],
    ['تجاوزت الحد المسموح به لمحاولات تسجيل الدخول. يُرجى المحاولة بعد خمس عشرة دقيقة.','Too many login attempts. Try again in 15 minutes.'],
    ['تم تسجيل الخروج من الإدارة.','You have signed out.'],
    ['خدمة الإدارة غير متاحة حالياً. تأكد من الاتصال.','Admin service is unavailable. Check your connection.'],
    ['حجم الملف كبير جداً.','File is too large.'],
    ['حدد الدولة.','Select a country.'],
    ['لا يجوز حذف الوكيل الأمريكي الأساسي','Cannot remove the primary US agent'],
    ['حذف من المسودة المحلية فقط؟','Remove this item from the local draft only?'],
    ['تأكيد نشر التعديلات على موقع MAIC لجميع الزوار؟','Publish these MAIC changes to all visitors?'],
    ['استبدال المسودة الحالية بنسخة الموقع المنشورة؟','Replace your local draft with the published version?'],
    ['استبدال مسودتك الحالية؟','Replace your current draft?'],
    ['العودة إلى لوحة الإدارة','Return to Admin Dashboard'],
    ['إدارة الطلاب','Learner Management'],
    ['الطلاب وتفعيل المواد العلمية','Learners & Learning Material Activation'],
    ['لا يتيح إنشاء الحساب أو تسجيل الطلب أي مادة علمية. التفعيل إجراء مستقل للإدارة بعد مراجعة هوية الطالب وتأكيد الدفع من الوكيل المخصص له','Creating an account or submitting a request does not grant course access. MAIC activates courses after verifying learner identity and the assigned agent’s payment confirmation.'],
    ['حالة الدورات','Course Status'],['قيد التحضير','Preparing'],
    ['المنشورة','Published'],['المؤرشفة','Archived'],
    ['جاهزية كورسات MAIC','MAIC Course Readiness'],
    ['ملخص حالة الكورسات','Course Readiness Summary'],
    ['الكتب','Materials'],['الامتحانات','Exams'],
    ['توثيق المراجع الأكاديمي','Academic Reviewer Sign-off'],
    ['المسودات الخاصة','Private Drafts'],
    ['تقرير مباشر من قاعدة بيانات الأكاديمية؛ الحالة المنشورة ليست دليلاً تلقائياً على مراجعة أكاديمية موثقة.','Live academy database report. Published status alone does not prove independent academic review.'],
    ['النشر الجديد يتطلب PDF مراجعاً وامتحاناً معتمداً ومطابقاً للمصدر. مسودات الأسئلة التي سبق كشف مفاتيحها تحتاج إعادة إعداد قبل استخدامها للطلاب.','Release requires a reviewed PDF and a source-matched approved exam. Drafts with exposed answer keys must be replaced before learner use.'],
    ['جارٍ تحميل بيانات الدورات…','Loading course data…'],
    ['بنوك اختبارات MAIC — ١٠٠ سؤال','MAIC Exam Banks — 100 Questions'],
    ['المرحلة الأولى — رفع بنك أسئلة كمسودة','Step 1 — Upload Exam Bank Draft'],
    ['المرحلة الثانية — مراجعة مستقلة واعتماد','Step 2 — Independent Review & Approval'],
    ['اسم مُعدّ بنك الأسئلة','Question Bank Author'],
    ['ملف 100 سؤال بصيغة JSON','100-Question JSON File'],
    ['حفظ المسودة للمراجعة فقط','Save Draft for Review Only'],
    ['مثال صيغة السؤال','Example Question Format'],
    ['إدارة الشهادات','Certificate Management'],['اعتماد PDF','Approve PDF'],
    ['جارٍ التحميل…','Loading…']
  ];
  const toEN = new Map(pairs), toAR = new Map(pairs.map(([ar,en])=>[en,ar]));
  let locale = 'en';
  try { const saved=localStorage.getItem('maic_admin_locale'); if(saved==='ar'||saved==='en')locale=saved; } catch {}
  function translateText(text) {
    const lead = text.match(/^\s*/u)?.[0]||'', tail = text.match(/\s*$/u)?.[0]||'';
    const core = text.slice(lead.length,text.length-tail.length);
    if (!core) return text;
    const dictionary=locale==='en'?toEN:toAR;
    let converted=dictionary.get(core);
    if (!converted && locale==='en') {
      const version=/^(محدّث|منشور) · الإصدار (\d+)$/u.exec(core);
      if(version) converted=(version[1]==='محدّث'?'Updated':'Published')+' · version '+version[2];
      const published=/^نسخة الموقع المنشورة رقم (\d+)\. استعادتها تستبدل المسودة المحلية فقط\.$/u.exec(core);
      if(published) converted='Published website version '+published[1]+'. Restoring it replaces the local draft only.';
      const catalog=/^الكتالوج \((\d+)\)$/u.exec(core);
      if(catalog) converted='Catalog ('+catalog[1]+')';
    }
    if (!converted && locale==='ar') {
      const version=/^(Updated|Published) · version (\d+)$/u.exec(core);
      if(version) converted=(version[1]==='Updated'?'محدّث':'منشور')+' · الإصدار '+version[2];
      const published=/^Published website version (\d+)\. Restoring it replaces the local draft only\.$/u.exec(core);
      if(published) converted='نسخة الموقع المنشورة رقم '+published[1]+'. استعادتها تستبدل المسودة المحلية فقط.';
      const catalog=/^Catalog \((\d+)\)$/u.exec(core);
      if(catalog) converted='الكتالوج ('+catalog[1]+')';
    }
    return converted?lead+converted+tail:text;
  }
  const skip = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','PRE','CODE','OPTION']);
  function applyLanguage() {
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-maic-admin-lang]').forEach(select=>{if(select.value!==locale)select.value=locale;});
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())) {
      if(node.parentElement?.closest('script,style,noscript,textarea,pre,code,[contenteditable="true"]')) continue;
      const result=translateText(node.nodeValue);
      if(result!==node.nodeValue)node.nodeValue=result;
    }
    document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
      for(const attr of ['placeholder','title','aria-label']) {
        if(!el.hasAttribute(attr)) continue;
        const s=el.getAttribute(attr), converted=translateText(s);
        if(s!==converted)el.setAttribute(attr,converted);
      }
    });
    for(const o of document.querySelectorAll('option')) {
      const s=o.textContent,converted=translateText(s);
      if(s!==converted)o.textContent=converted;
    }
  }
  let scheduled=false;
  function schedule() {
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;applyLanguage();});
  }
  function buildSwitch(target) {
    if(!target) return;
    const wrap=document.createElement('div');
    wrap.className='maic-admin-language';
    const label=document.createElement('label');
    label.textContent='Language / اللغة';
    const select=document.createElement('select');
    select.setAttribute('data-maic-admin-lang','');
    select.setAttribute('aria-label','Dashboard language / لغة لوحة الإدارة');
    const en=document.createElement('option');en.value='en';en.textContent='English';
    const ar=document.createElement('option');ar.value='ar';ar.textContent='العربية';
    select.append(en,ar);select.value=locale;
    select.addEventListener('change',()=>{
      locale=select.value;
      try{localStorage.setItem('maic_admin_locale',locale);}catch{}
      applyLanguage();
    });
    wrap.append(label,select);
    target.prepend(wrap);
  }
  const style=document.createElement('style');
  style.textContent='.maic-admin-language{display:inline-flex;align-items:center;gap:7px;margin:10px 8px;vertical-align:middle;white-space:nowrap}.maic-admin-language label{font-size:13px;font-weight:700}.maic-admin-language select{background:#fff;color:#142839;border:1px solid #b9975d;border-radius:7px;padding:7px 10px;font-size:14px;min-height:40px;min-width:105px}';
  document.head.appendChild(style);
  if(document.querySelector('.studio-top-actions')) {
    buildSwitch(document.querySelector('.studio-top-actions'));
    buildSwitch(document.querySelector('.maic-login-panel .login-logo')?.parentElement);
  } else {
    buildSwitch(document.querySelector('body > header') || document.querySelector('header') || document.body);
  }
  const observer=new MutationObserver(schedule);
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  applyLanguage();
})();