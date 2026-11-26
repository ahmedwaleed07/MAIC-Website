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
  // Secondary admin pages: academic reviews, exam banks, learner access and certificates.
  pairs.push(
    ['لوحة إدارة MAIC','MAIC Admin Dashboard'],['لوحة MAIC Admin','MAIC Admin Dashboard'],
    ['القالب الرسمي لشهادة MAIC','Official MAIC Certificate Template'],
    ['هذا هو التصميم الرسمي المعتمد لشهادة الإكمال. يظهر مربع QR فارغاً في القالب الأساسي، وتولّد الأكاديمية داخله رمز تحقق فريداً عند إصدار شهادة حقيقية. لا تُضاف بيانات متعلم أو توقيعات إلا بعد التحقق من الإكمال وموافقة الإدارة.','This is the approved MAIC completion certificate design. The blank QR area is filled with a unique verification code only when a real certificate is issued. Learner details and signatures require verified completion and administrative authorization.'],
    ['لإعداد نسخة PDF شخصية اضغط «إكمال الدورات والشهادات»، واختر شهادة صادرة؛ يمكن تنزيل مسودة بعلامة DRAFT أو إيداع النسخة الأصلية بعد تحميل التواقيع الثلاثة المصرح بها.','To prepare an individual PDF, open Course Completions & Certificates and select an issued certificate. Download a watermarked DRAFT or store the original after adding three authorized signatures.'],
    ['شهاداتي','My Certificates'],['سجل الخريجين','Graduate Register'],
    ['جاهزية الدورات','Course Readiness'],['جاهزية الكورسات','Course Readiness'],
    ['النسخ الأصلية الخاصة لمناهج MAIC','Private Source Manuscripts — MAIC'],
    ['ملفات النص العلمي القابلة للتحرير محفوظة داخل D1 ولا تُقدَّم من المستودع العام.','Editable academic source manuscripts are stored privately in D1 and are not available from the public repository.'],
    ['المخطوطات العلمية','Academic Manuscripts'],
    ['هذه نسخ تحريرية، وليست ملفات PDF المعتمدة للمتعلمين. التنزيل متاح فقط لجلسة المدير الموثوقة.','These are editable source manuscripts, not learner-approved PDFs. Downloads are restricted to authenticated administrators.'],
    ['جارٍ تحميل قائمة المخطوطات…','Loading manuscript list…'],
    ['عدد المناهج المصدرية المسجّلة:','Registered Source Manuscripts:'],
    ['صفحة','Page'],['تحميل نسخة للتحرير','Download Editable Source'],
    ['تعذر عرض النسخ. تحقق من تسجيل دخول المدير واتصال قاعدة البيانات.','Unable to load manuscripts. Verify your admin session and database connection.'],
    ['توثيق المراجعة الأكاديمية المستقلة','Independent Academic Review Record'],
    ['هذا السجل مستقل عن فحص PDF الآلي، ويربط اعتماد المراجع بشخص حقيقي وبصمة نسخة المادة التي راجعها.','This record is separate from automated PDF checks and links the approval to a real reviewer and the specific material file hash.'],
    ['تنبيه:','Notice:'],
    ['لا تُدرج اسم OpenAI أو أي نظام آلي كمراجع مستقل. الاستمارة مخصصة لمراجعة حقيقية أُنجزت بالفعل، ويقر مدير الأكاديمية بصحتها. لا يُفعّل الامتحان بمجرد تسجيلها.','Do not name OpenAI or an automated system as an independent academic reviewer. This form records a real completed review, attested by MAIC management. Recording a review does not activate an exam.'],
    ['سجل مراجعة ملف المادة العلمية','Learning Material Review Record'],['اختر الكورس','Select Course'],
    ['اسم المراجع الأكاديمي الذي راجع المادة','Name of the Academic Reviewer'],
    ['تاريخ إكمال المراجعة','Review Completion Date'],
    ['ملاحظات المراجع العلمية والتعديلات التي تحقق منها','Academic Review Notes and Verified Corrections'],
    ['وثّق بدقة نطاق الفحص ونتائجه ومراجع المحتوى، بما لا يقل عن 60 حرفاً','Describe the review scope, findings and content sources in at least 60 characters'],
    ['أؤكد بصفتي مسؤولاً مخولاً من MAIC أن المراجع المذكور شخص حقيقي، وقد راجع نسخة PDF نفسها، وأن التفاصيل المذكورة صحيحة.','As an authorized MAIC official, I attest that the named reviewer is a real person, reviewed this exact PDF, and that the recorded details are accurate.'],
    ['توثيق مراجعة هذه النسخة فقط','Record Review for This Version Only'],
    ['— مراجعة موثقة','— Review Recorded'],['— مراجعة بشرية غير مسجلة','— Human Review Not Recorded'],
    ['بصمة ملف PDF الحالي:','Current PDF Hash:'],
    ['· المراجع:','· Reviewer:'],['فتح هذه النسخة للتحقق قبل التوقيع','Open This Version Before Signing'],
    ['اختر كورساً','Select a Course'],['المراجعة موثقة مسبقاً لهذه النسخة','Review Already Recorded for This Version'],
    ['هل تؤكد أن مراجعاً أكاديمياً بشرياً راجع هذه النسخة نفسها، وأنك توثّق مراجعة حقيقية؟','Do you confirm that a real academic reviewer examined this exact version and that this record reflects an actual review?'],
    ['تعذر التسجيل:','Unable to Record:'],
    ['يلزم تسجيل دخول المدير أو التأكد من قاعدة البيانات','Admin sign-in or database connection is required'],
    ['اعتماد النسخة النهائية للمادة العلمية','Approve Final Learning Material'],
    ['لا تُنشر مسودات المواد تلقائياً. يختار مسؤول الأكاديمية نسخة PDF ذات 12 صفحة، ويتحقق من الهوية والمحتوى العلمي وخط Tinos حجم 12، ثم يرفع النسخة المعتمدة حصراً.','Draft learning materials are not published automatically. The administrator selects a 12-page PDF, verifies identity, academic content and Tinos 12 typography, and uploads only the approved version.'],
    ['المواد الموجودة حالياً','Existing Learning Materials'],
    ['ترقية المادة العلمية','Update Learning Material'],['اختر الدورة','Select Course'],
    ['ملف المادة العلميّة PDF','Learning Material PDF'],
    ['اسم المسؤول عن المراجعة','Name of Reviewing Official'],
    ['المراجع الأكاديمي المعتمد','Approved Academic Reviewer'],
    ['راجعت المادة العلمية صفحة بصفحة، والأمثلة، والمصادر، وحقوق المحتوى، ولا تحتوي دعاية أو قوالب لجهة منافسة','I have reviewed the material page by page, including examples, sources, copyrights and absence of competitor branding or templates'],
    ['تأكدت من وجود شعار MAIC الأصلي ونسخة أبيض وأسود، وأن متن المادة Tinos حجم 12 وأن الملف يتكون من 12 صفحة','I verified the official MAIC crest, black-and-white layout, Tinos 12 body text and a total of 12 pages'],
    ['منعاً لانقطاع الدراسة، يمنع النظام استبدال ملف دورة تحتوي اشتراكات مفعّلة أو امتحانات جارية. لا يغيّر هذا الإجراء شهادات المتعلمين أو مفاتيح إجابات الاختبارات.','To avoid interrupting studies, a course PDF cannot be replaced while enrollments or exams are active. This action does not alter certificates or exam answer keys.'],
    ['اعتماد النسخة ورفعها إلى الموقع','Approve and Upload Version'],
    ['سجل مراجعات المواد','Learning Material Review History'],
    ['— مسجّل','— Registered'],['— لم تُرفع مادة بعد','— No Material Uploaded'],
    ['دورة بلا مادة PDF مسجّلة. يمكن اختيارها من القائمة لرفع أول نسخة بعد المراجعة الأكاديمية.','Course without a registered PDF. Select it to upload the first academically reviewed version.'],
    ['لا توجد نسخ تمت ترقيتها عبر هذه اللوحة بعد','No material revisions have been uploaded through this panel'],
    ['اختر ملف PDF صالحاً لا يتجاوز 1.25 MB','Select a valid PDF no larger than 1.25 MB'],
    ['أدخل اسم المسؤول عن مراجعة المادة','Enter the material reviewer’s name'],
    ['يجب اعتماد مراجعة المادة والخط والهوية أولاً','Confirm the content, typography and identity checks first'],
    ['استبدال النسخة الموجودة','Replace Existing Version'],['إضافة أول نسخة','Upload First Version'],
    ['هذا نفس الملف المخزن حالياً ولم يتغير شيء','This file matches the current version. Nothing changed.'],
    ['تعذّر الاعتماد:','Approval Failed:'],
    ['يلزم تسجيل دخول المدير أو التحقق من جاهزية قاعدة البيانات','Admin sign-in or a functioning database is required'],
    ['بنوك الأسئلة','Question Banks'],
    ['مسار اعتماد من مرحلتين: إعداد المسودة، ثم مراجعة أكاديمية مستقلة لمائة سؤال ومصادر الإجابات. لا يظهر الامتحان للمتعلمين بمجرد رفع المسودة.','Approval has two steps: preparing a draft, then independent academic review of 100 items and their sources. Uploading a draft does not make the exam available to learners.'],
    ['يُشترط 100 سؤال بأربعة خيارات، وإجابة صحيحة واحدة أو أكثر، وذكر الصفحة المصدر والتفسير. لن يكون رفع هذه المسودة اعتماداً للامتحان.','The file must have 100 questions with four options, at least one correct answer, a source page and a rationale. Uploading the draft is not exam approval.'],
    ['اختر مسودة لعرض الأسئلة والإجابات ومصادرها داخل لوحة المدير فقط. لا تعتمدها قبل المراجعة البشرية الكاملة.','Select a draft to review questions, answers and sources inside the administrator area only. Approval requires complete independent human review.'],
    ['المثال توضيحي فقط، ولا يمثل بنكاً جاهزاً للاختبار.','Example only; not a ready-to-use exam bank.'],
    ['تعذر تنفيذ العملية:','Action Failed:'],['المواد:','Materials:'],
    ['امتحان معتمد','Approved Exam'],['مسودة','Draft'],
    ['الأسئلة غير مكتوبة','Questions Not Available'],
    ['لا توجد مواد محفوظة','No Materials Stored'],['نسخة PDF مطابقة','Matching PDF'],
    ['نسخة PDF مختلفة عن المنشورة','PDF Differs from Published Material'],
    ['غير موثق','Not Documented'],
    ['عرض المسودة السابقة (غير معتمدة للنشر)','View Earlier Draft (Not Approved for Release)'],
    ['فتح المسودة الحالية للمراجعة','Open Current Draft for Review'],
    ['إيقاف الامتحان المفعّل','Deactivate Active Exam'],
    ['هل تؤكد إيقاف الامتحان الحالي لهذا الكورس؟','Deactivate the current exam for this course?'],
    ['بنوك الأسئلة الحالية المطابقة للمواد — مراجعة الـ100 سؤال','Current Source-Matched Exam Banks — 100-Item Review'],
    ['لا توجد مسودات حالية من 100 سؤال تحتاج مراجعة.','No current 100-question drafts require review.'],
    ['الامتحانات المفعّلة:','Active Exams:'],['(إدارة وإيقاف عند الحاجة)','(Manage or deactivate if needed)'],
    ['النسخ السابقة أو غير المطابقة:','Previous or Unmatched Versions:'],
    ['— للرجوع التاريخي فقط','— Historical Reference Only'],
    ['ملف JSON غير صالح أو يتجاوز الحد','Invalid or Oversized JSON File'],
    ['اسم المُعدّ مطلوب','Author Name Required'],
    ['يجب أن يحتوي الملف على مائة سؤال بالضبط','The file must contain exactly 100 questions'],
    ['سيتم حفظ المسودة للمراجعة فقط دون ظهورها للطلاب. هل تريد المتابعة؟','Save this draft for review only, without displaying it to learners?'],
    ['تعذر حفظ المسودة:','Unable to Save Draft:'],
    ['مراجعة الامتحانات','Review Exams'],
    ['مسودات الامتحانات الخاصة — للمراجعة فقط','Private Exam Drafts — Review Only'],
    ['المواد التي أُعدّت مسبقاً، معزولة عن الاختبارات المفعلة وعن الموقع العام.','Previously prepared content kept separate from active assessments and the public website.'],
    ['تنبيه أكاديمي وأمني','Academic & Security Warning'],
    ['مفاتيح هذه المسودات ظهرت سابقاً في مستودع GitHub عام. لا تصلح للاستخدام كاختبارات رسمية حتى بعد نقلها إلى قاعدة خاصة. يلزم إعادة تأليف المفاتيح والأسئلة المتأثرة، تدقيق أكاديمي مستقل، وتفعيل بنك جديد مطابق للمادة المعتمدة.','These draft answer keys were previously exposed in a public GitHub repository. They must not be used in official assessments without replacing affected content, independent academic review and activation of a new source-matched bank.'],
    ['المسودات الموجودة في D1','Drafts Stored in D1'],
    ['عدد المسودات:','Draft Count:'],
    ['تنزيل نسخة للمراجعة الداخلية','Download for Internal Review'],
    ['تحميل مسودة','Download Draft'],
    ['للمراجعة الداخلية فقط','For Internal Review Only'],
    ['لا توجد مسودات محفوظة.','No Stored Drafts.'],
    ['تعذر عرض المسودات. تأكد من تسجيل دخول المدير، أو تحقق من اتصال قاعدة البيانات.','Unable to load drafts. Check your admin session and database connection.'],
    ['طلبات النسخ الأصلية','Original Copy Requests'],
    ['إدارة الإكمال والشهادات','Course Completions & Certificates'],
    ['تُسجّل أدلة إكمال الدورة أولاً، ثم يتم التحقق الإداري. قالب شهادة الإكمال الرسمي معتمد. يُولّد رمز QR لكل شهادة مستقلة. لا ترفع النسخة النهائية إلا بعد إدراج التواقيع الثلاثة الفعلية.','First record completion evidence, then complete administrative verification. The official template is approved; each certificate receives its own QR code. Upload the final version only after all three actual signatures are included.'],
    ['جارٍ تحميل بيانات المتعلمين…','Loading Learner Records…'],
    ['عدد اشتراكات المتعلمين:','Learner Enrollments:'],
    ['· خدمة الإصدار مهيأة','· Issuance Service Configured'],
    ['· إصدار PDF غير مفعّل','· PDF Issuance Disabled'],
    ['البلد:','Country:'],['· الوكيل:','· Agent:'],
    ['نوع الدراسة','Delivery Format'],['مرجع إثبات الإكمال','Completion Evidence Reference'],
    ['مرجع تقرير المدرس أو الاختبار','Instructor Report or Exam Reference'],
    ['حالة الإكمال:','Completion Status:'],['لم يكتمل','Not Completed'],
    ['الشهادة:','Certificate:'],['تنزيل QR بصيغة SVG','Download QR (SVG)'],
    ['قالب شهادة إكمال MAIC الرسمي بمربع QR فارغ، يملأ عند الإصدار','MAIC official completion template with an empty QR area to be filled upon issuance'],
    ['قالب الإكمال الرسمي المعتمد · رقم QR خاص بهذه الشهادة · شهادة غير موقّعة لا تُصدر كنسخة نهائية','Approved completion template · Certificate-specific QR · An unsigned certificate must not be issued as final'],
    ['تنزيل مسودة PDF مع QR الخاص بالطالب','Download Draft PDF with Learner QR'],
    ['توقيع الرئيس President','President’s Signature'],
    ['توقيع رئيس القسم Head of Department','Head of Department’s Signature'],
    ['توقيع الوكيل Authorized Agent','Authorized Agent’s Signature'],
    ['إنشاء وحفظ PDF الرسمي بالتواقيع الثلاثة و QR','Create and Save Official PDF with Three Signatures and QR'],
    ['يجب اختيار صور التواقيع الأصلية الثلاثة قبل الحفظ','Select All Three Original Signature Images Before Saving'],
    ['هل تملك الصلاحية لاعتماد هذه التواقيع الأصلية الثلاثة على شهادة هذا المتعلم؟','Are you authorized to approve these three original signatures for this learner’s certificate?'],
    ['حُفظت الشهادة الأصلية مع QR والتواقيع الثلاثة في الحساب الخاص بالمتعلم','Signed certificate with QR saved to the learner’s account'],
    ['نسخة PDF الأصلية محفوظة في حساب المتعلم','Original PDF Stored in Learner Account'],
    ['ملف الشهادة الأصلي PDF','Original Certificate PDF'],
    ['اعتماد ورفع PDF الأصلي','Approve and Upload Original PDF'],
    ['اختر ملف PDF لا يتجاوز 2.5 MB','Select a PDF Under 2.5 MB'],
    ['هل هذا هو قالب الشهادة الأصلية المعتمد ويتضمن التواقيع الثلاثة ورمز QR الصحيح؟','Does this use the approved original template, all three signatures and the correct QR?'],
    ['توثيق إكمال الدورة','Record Course Completion'],
    ['يجب إدخال مرجع موثق لتقييم الدارس','Enter a Verifiable Learner Assessment Reference'],
    ['هل تملك الإدارة إثباتاً صحيحاً لإكمال المتعلم؟','Does MAIC hold valid evidence of this learner’s completion?'],
    ['مرجع الإثبات:','Evidence Reference:'],
    ['التحقق واعتماد الإكمال','Verify & Approve Completion'],
    ['هل تحققت من أدلة التقييم والحضور بحسب شروط الدورة؟','Have you verified the assessment and attendance records against course requirements?'],
    ['إصدار شهادة إكمال','Issue Completion Certificate'],
    ['إنشاء سجل شهادة الإكمال تمهيداً لإضافة التواقيع الثلاثة؟ لن تظهر للمتعلم ولن تصبح صالحة إلا بعد حفظ النسخة الموقعة.','Create a certificate record pending three authorized signatures? It remains invalid and hidden until the signed version is stored.'],
    ['تم إيقاف إصدار الشهادات مؤقتاً من إدارة النظام','Certificate Issuance Is Temporarily Disabled'],
    ['القالب الرسمي معتمد. يُنشأ رقم الشهادة وQR ثم تُرفق التواقيع الثلاثة قبل ظهور الشهادة للمتعلم','The template is approved. The certificate number, QR and three signatures are required before the learner can view it.'],
    ['لا يوجد متعلمون لديهم دورات مفعّلة حالياً','No Learners Have Active Courses'],
    ['يجب تسجيل دخول المدير أولاً','Administrator Sign-in Required'],
    ['العودة للوحة إدارة MAIC','Return to MAIC Admin Dashboard'],
    ['طلبات النسخ الورقية الأصلية','Printed Original Certificate Requests'],
    ['للمدير فقط. يُسجّل الطلب للوكيل المعتمد. الإشعار يبقى في الطابور إلى حين تشغيل قناة توصيل فعلية للوكيل.','Administrators only. Requests are logged for the approved agent. Agent notifications remain queued until a working delivery channel is configured.'],
    ['بانتظار عرض السعر من الوكيل','Awaiting Agent Quote'],
    ['بانتظار الدفع للوكيل','Awaiting Agent Payment'],
    ['دفع مؤكد لدى الوكيل','Agent Payment Confirmed'],
    ['قيد الطباعة','Printing'],['تم الشحن','Shipped'],
    ['تم التسليم','Delivered'],['ملغي','Cancelled'],
    ['الطلبات المسجلة:','Registered Requests:'],
    ['لا توجد طلبات حالياً','No Requests Yet'],
    ['الوكيل:','Agent:'],['حالة الإشعار:','Notification Status:'],
    ['غير موجود','Not Available'],['حالة الطلب:','Request Status:'],
    ['المستلم:','Recipient:'],['الأجور:','Fees:'],['التتبع:','Tracking:'],
    ['تحديث إلى:','Update to:'],
    ['الأجور التي حددها الوكيل (بدون العملة)','Agent-Quoted Fees (Amount Only)'],
    ['العملة USD / IQD / EUR ...','Currency USD / IQD / EUR ...'],
    ['مرجع تحصيل الأجور لدى الوكيل','Agent Payment Reference'],
    ['هل وصل تأكيد استلام الدفع من الوكيل المعتمد؟','Has the approved agent confirmed payment?'],
    ['رقم الشحنة أو التتبع','Shipment or Tracking Number'],
    ['تأكيد تحديث حالة الطلب؟','Confirm Request Status Update?'],
    ['تعذر التحديث:','Update Failed:'],
    ['إلغاء الطلب','Cancel Request'],
    ['إلغاء هذا الطلب؟','Cancel This Request?'],
    ['تعذر الإلغاء:','Cancellation Failed:'],
    ['يجب تسجيل الدخول إلى لوحة الإدارة أولاً','Please Sign In to the Admin Dashboard First'],
    ['خدمة الطلبات غير مهيّأة بعد','Requests Service Is Not Configured'],
    ['تسجيل الدخول','Sign In'],
    ['مرجع تأكيد الوكيل','Agent Confirmation Reference'],
    ['نمط الدراسة','Learning Format'],
    ['راجعت تأكيد استلام الدفع من الوكيل المخصص لهذا الطالب','I Have Reviewed Payment Confirmation from This Learner’s Assigned Agent'],
    ['تحققت من هوية الطالب ومطابقة حسابه للتأكيد قبل منحه الوصول','I Have Verified Learner Identity and Enrollment Details Before Granting Access'],
    ['تفعيل الوصول إلى المادة العلمية','Activate Learning Material Access'],
    ['إلغاء الوصول إلى هذه الدورة','Revoke Access to This Course'],
    ['لم تُفعّل أي دورة','No Activated Courses'],
    ['مرجع التأكيد:','Confirmation Reference:'],
    ['مفعّل','Active'],['ملغى','Revoked'],
    ['نعم','Yes'],['عدد الدورات في هذه الفئة:','Courses in This Category:'],
    ['PDF مسجّل','PDF Registered'],['فحص تنسيق PDF موثّق','PDF Format Verified'],
    ['مراجعة أكاديمية مستقلة','Independent Academic Review'],
    ['امتحان مفعّل ومطابق','Matching Active Exam'],
    ['مراجعة كل أسئلته','All Questions Reviewed'],
    ['بنك خاص','Private Bank'],
    ['ملاحظات أكاديمية مفتوحة:','Open Academic Issues:'],
    ['الخطوة التالية:','Next Step:'],
    ['لا توجد دورات في هذه الفئة.','No Courses in This Category.'],
    ['منشورة','Published'],['امتحانات مفعّلة ومطابقة','Matching Active Exams'],
    ['بنوك خاصة للمراجعة','Private Banks for Review'],
    ['تعذر جلب حالة الدورات. تأكد من تسجيل دخول الإدارة أو جاهزية قاعدة البيانات.','Unable to Load Course Readiness. Check Admin Sign-in and Database Availability.']
  );
  pairs.push(
    ['كتب بمراجعة أكاديمية مستقلة','PDFs with Independent Academic Review'],
    ['امتحانات مراجعة بالكامل','Fully Reviewed Active Exams'],
    ['أسئلة قصيرة تتطلب معالجة','Short Questions Needing Correction'],
    ['يحتاج الامتحان المفعّل إلى مراجعة واعتماد مستقل لجميع الأسئلة الـ100 قبل اعتباره جاهزاً أكاديمياً.','The active exam still needs independent review of all 100 questions before an academic release.']
  );
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
      const qa=/^ملاحظات صياغة الامتحان المفعّل: (\d+) سؤال قصير، (\d+) شرح قصير، (\d+) إحالة صفحة غير صحيحة\.$/u.exec(core);
      if(qa) converted='Active exam wording flags: '+qa[1]+' short questions, '+qa[2]+' short rationales, '+qa[3]+' invalid source-page references.';
    }
    if (!converted && locale==='ar') {
      const version=/^(Updated|Published) · version (\d+)$/u.exec(core);
      if(version) converted=(version[1]==='Updated'?'محدّث':'منشور')+' · الإصدار '+version[2];
      const published=/^Published website version (\d+)\. Restoring it replaces the local draft only\.$/u.exec(core);
      if(published) converted='نسخة الموقع المنشورة رقم '+published[1]+'. استعادتها تستبدل المسودة المحلية فقط.';
      const catalog=/^Catalog \((\d+)\)$/u.exec(core);
      if(catalog) converted='الكتالوج ('+catalog[1]+')';
      const qa=/^Active exam wording flags: (\d+) short questions, (\d+) short rationales, (\d+) invalid source-page references\.$/u.exec(core);
      if(qa) converted='ملاحظات صياغة الامتحان المفعّل: '+qa[1]+' سؤال قصير، '+qa[2]+' شرح قصير، '+qa[3]+' إحالة صفحة غير صحيحة.';
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