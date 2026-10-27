'use strict';
/* MAIC course directory. Only status:"published" counts as actually available.
 * Preparing records are clearly labeled plans and never offer checkout or booking.
 * Add licensed course content and enrolment links only after academic review/approval.
 */
const MAIC_COURSE_MODES=[
 {id:'self-paced',route:'courses:self-paced',icon:'book',en:'Self-Paced Online',ar:'التعلّم الذاتي عبر الموقع',descriptionEn:'Study independently through structured lessons and assessments on the MAIC website, at a pace that suits you.',descriptionAr:'تعلّم بصورة مستقلة من خلال دروس واختبارات منظّمة داخل موقع الأكاديمية، وبالوتيرة التي تناسبك.'},
 {id:'group',route:'courses:group',icon:'school',en:'Live Group Classes',ar:'الدورات الجماعية المباشرة',descriptionEn:'Learn with an instructor and a group of participants through scheduled, interactive classes.',descriptionAr:'تعلّم مع مدرّب ومجموعة من المشاركين ضمن لقاءات مباشرة وتفاعلية في مواعيد محددة.'},
 {id:'one-on-one',route:'courses:one-on-one',icon:'user',en:'One-to-One Private Classes',ar:'الدورات الفردية الخاصة',descriptionEn:'Individual training with an instructor, focused on your learning objectives.',descriptionAr:'تدريب فردي يجمع المتعلّم والمدرّب، ويركّز على الأهداف والاحتياجات التعليمية الشخصية.'}
];
const MAIC_COURSE_CATALOG=[
 {id:'project-management',mode:['self-paced','group'],status:'preparing',en:'Project Management Foundations',ar:'أساسيات إدارة المشاريع',areaEn:'Business & Management',areaAr:'الإدارة والأعمال'},
 {id:'digital-marketing',mode:['self-paced','group'],status:'preparing',en:'Digital Marketing Fundamentals',ar:'أساسيات التسويق الرقمي',areaEn:'Marketing',areaAr:'التسويق'},
 {id:'entrepreneurship',mode:['self-paced','group'],status:'preparing',en:'Entrepreneurship & Innovation',ar:'ريادة الأعمال والابتكار',areaEn:'Innovation',areaAr:'الابتكار'},
 {id:'python-fundamentals',mode:['self-paced'],status:'preparing',en:'Introduction to Python',ar:'مقدمة في لغة بايثون',areaEn:'Technology',areaAr:'التكنولوجيا'},
 {id:'professional-communication',mode:['self-paced','group'],status:'preparing',en:'Professional Communication Skills',ar:'مهارات التواصل المهني',areaEn:'Professional Skills',areaAr:'المهارات المهنية'},
 {id:'leadership',mode:['group','one-on-one'],status:'preparing',en:'Leadership & Team Development',ar:'القيادة وتطوير فرق العمل',areaEn:'Leadership',areaAr:'القيادة'},
 {id:'business-english',mode:['group','one-on-one'],status:'preparing',en:'Business English Communication',ar:'التواصل باللغة الإنكليزية للأعمال',areaEn:'Languages',areaAr:'اللغات'},
 {id:'project-coaching',mode:['one-on-one'],status:'preparing',en:'Private Project Management Coaching',ar:'تدريب فردي في إدارة المشاريع',areaEn:'Personalized Training',areaAr:'تدريب مخصص'},
 {id:'career-coaching',mode:['one-on-one'],status:'preparing',en:'Professional Development Coaching',ar:'تدريب فردي للتطوير المهني',areaEn:'Personalized Training',areaAr:'تدريب مخصص'},
 {id:'business-strategy',mode:['one-on-one'],status:'preparing',en:'Business Strategy Coaching',ar:'تدريب فردي في استراتيجية الأعمال',areaEn:'Personalized Training',areaAr:'تدريب مخصص'}
];
const MAIC_COURSES_COPY={
 en:{courses:'Courses',eyebrow:'MAIC · LEARNING PATHWAYS',heading:'Choose Your Learning Experience',overview:'Explore three ways to learn with the Michigan Academy of Innovation and Creativity. Select a learning format to see its course catalog.',explore:'Explore courses',back:'All learning formats',enrollInfo:'How Enrollment Works',available:'Available Courses',upcoming:'Courses in Preparation',empty:'No courses are open for enrollment in this format at this time.',planned:'The following subjects are being prepared and are not yet open for enrollment.',preparing:'In preparation',certificate:'Certificate of completion information will be confirmed on each published course page.',details:'Course dates, instructors, fees, and enrollment will appear only after a course is officially published.'},
 ar:{courses:'كورسات',eyebrow:'MAIC · مسارات التعلّم',heading:'اختاروا أسلوب التعلّم المناسب',overview:'اكتشفوا ثلاث طرق للدراسة في أكاديمية مشيغان للابتكار والإبداع. اختاروا نوع التعلّم للاطلاع على الدورات المرتبطة به.',explore:'استعرضوا الدورات',back:'جميع طرق التعلّم',enrollInfo:'طريقة التسجيل والالتحاق',available:'الدورات المتاحة',upcoming:'دورات قيد الإعداد',empty:'لا توجد دورات مفتوحة للتسجيل ضمن هذا القسم حالياً.',planned:'هذه الدورات مخطط لها وقيد الإعداد، ولم يُفتح التسجيل فيها بعد.',preparing:'قيد الإعداد',certificate:'تُوضّح معلومات شهادة الإكمال في صفحة كل دورة عند اعتمادها ونشرها.',details:'تُعرض المواعيد وأسماء المدربين والرسوم والتسجيل بعد نشر الدورة رسمياً.'}
};
function maicCoursesT(key){return (state.lang==='ar'?MAIC_COURSES_COPY.ar:MAIC_COURSES_COPY.en)[key]||key;}
function maicCoursesModeLabel(mode){return state.lang==='ar'?mode.ar:mode.en;}
function maicCoursesModeDescription(mode){return state.lang==='ar'?mode.descriptionAr:mode.descriptionEn;}
function maicCoursesTitle(id){
 if(id==='courses')return maicCoursesT('courses');
 const mode=MAIC_COURSE_MODES.find(x=>x.route===id);
 return mode?maicCoursesModeLabel(mode):maicCoursesT('courses');
}
function maicCoursesFormatCard(mode){
 return '<button class="maic-format-card" type="button" data-nav="'+escapeHTML(mode.route)+'"><span class="maic-format-icon">'+icon(mode.icon)+'</span><h2>'+escapeHTML(maicCoursesModeLabel(mode))+'</h2><p>'+escapeHTML(maicCoursesModeDescription(mode))+'</p><span class="maic-format-action">'+escapeHTML(maicCoursesT('explore'))+icon('chevron')+'</span></button>';
}
function maicCourseTile(course){
 const ar=state.lang==='ar';const desc=ar?course.descriptionAr:course.descriptionEn;
 return '<article class="maic-course-tile"><span class="maic-course-area">'+escapeHTML(ar?course.areaAr:course.areaEn)+'</span><h3>'+escapeHTML(ar?course.ar:course.en)+'</h3>'+
 (desc?'<p class="maic-course-description">'+escapeHTML(desc)+'</p>':'')+
 (course.duration?'<small class="maic-course-duration">'+escapeHTML(course.duration)+'</small>':'')+
 '<span class="maic-course-badge">'+escapeHTML(maicCoursesT('preparing'))+'</span>'+
 '<button type="button" class="btn maic-course-details-btn" data-nav="course:'+escapeHTML(course.id)+'">'+(ar?'تفاصيل الكورس':'Course details')+'</button></article>';
}
function maicCourseDetailLabel(key){
 const text={
  ar:{details:'تفاصيل الدورة',back:'العودة إلى الكورسات',format:'طريقة الدراسة',level:'المستوى',language:'لغة الدراسة',duration:'المدة',instructor:'المحاضر / المدرّب',objectives:'الأهداف التعليمية',syllabus:'المنهج ومحاور الكورس',requirements:'متطلبات الالتحاق',fees:'رسوم الدورة',noFee:'تُعلن عند اعتماد الدورة',payment:'يتم الدفع حصراً للوكيل المعتمد في بلد المتعلّم. تفعيل الدورة من إدارة MAIC بعد تأكيد الوكيل.',pending:'الدورة قيد الإعداد والتسجيل غير متاح حالياً.',available:'دورة مدرجة بالكتالوج — التسجيل الإلكتروني لم يُفعّل بعد.',enroll:'اطلع على طريقة التسجيل',level_all:'كل المستويات',level_beginner:'مبتدئ',level_intermediate:'متوسط',level_advanced:'متقدم',language_ar:'العربية',language_en:'الإنكليزية',language_bilingual:'العربية والإنكليزية',language_other:'لغة أخرى',missing:'الكورس غير موجود أو غير متاح'},
  en:{details:'Course details',back:'Back to courses',format:'Learning format',level:'Level',language:'Instruction language',duration:'Duration',instructor:'Instructor',objectives:'Learning objectives',syllabus:'Course syllabus',requirements:'Prerequisites',fees:'Course fee',noFee:'To be confirmed',payment:'Course fees are collected exclusively by the designated country agent. Access is activated only by MAIC after the agent confirms payment.',pending:'This course is in preparation and enrollment is not yet available.',available:'Listed in the catalog — online enrollment is not active yet.',enroll:'How enrollment works',level_all:'All levels',level_beginner:'Beginner',level_intermediate:'Intermediate',level_advanced:'Advanced',language_ar:'Arabic',language_en:'English',language_bilingual:'Arabic and English',language_other:'Other language',missing:'Course not found or unavailable'}
 };
 return (state.lang==='ar'?text.ar:text.en)[key]||key;
}
function maicCourseDetailValue(course,key){return escapeHTML((state.lang==='ar'?course[key+'Ar']:course[key+'En'])||'');}
function maicCourseDetailSection(course,key,title){
 const value=(state.lang==='ar'?course[key+'Ar']:course[key+'En'])||'';
 if(!value.trim())return '';
 const paragraphs=value.trim().split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 return '<section class="maic-detail-section"><h2>'+escapeHTML(title)+'</h2><ul>'+paragraphs.map(x=>'<li>'+escapeHTML(x)+'</li>').join('')+'</ul></section>';
}
function renderCourseDetails(routeId){
 const id=routeId.slice(7);
 const c=MAIC_COURSE_CATALOG.find(x=>x.id===id&&x.status!=='archived');
 const ar=state.lang==='ar',label=maicCourseDetailLabel;
 if(!c)return '<div class="maic-courses-page"><section class="maic-course-content page-pad"><h1>'+escapeHTML(label('missing'))+'</h1><button class="btn" data-nav="courses">'+escapeHTML(label('back'))+'</button></section></div>';
 const modes=(c.mode||[]).map(id=>MAIC_COURSE_MODES.find(x=>x.id===id)).filter(Boolean).map(x=>escapeHTML(ar?x.ar:x.en)).join(' · ');
 const info=[['format',modes],['level',escapeHTML(label('level_'+(c.level||'all')))],['language',escapeHTML(label('language_'+(c.courseLanguage||'ar')))],['duration',escapeHTML(c.duration||'')],['instructor',escapeHTML(c.instructor||'')],['fees',c.feeAmount?escapeHTML(String(c.feeAmount)+' '+(c.feeCurrency||'USD')):escapeHTML(label('noFee'))]];
 const details=info.filter(x=>x[1]).map(([name,value])=>'<div class="maic-detail-fact"><span>'+escapeHTML(label(name))+'</span><strong>'+value+'</strong></div>').join('');
 const description=ar?c.descriptionAr:c.descriptionEn;
 return '<div class="maic-courses-page"><section class="maic-course-hero page-pad"><div class="maic-course-hero-inner">'+
 '<button class="maic-course-back" type="button" data-nav="courses">'+icon('chevron')+escapeHTML(label('back'))+'</button>'+
 '<div class="maic-course-heading"><span class="eyebrow">MAIC · '+escapeHTML(label('details'))+'</span><h1>'+escapeHTML(ar?c.ar:c.en)+'</h1><div class="short-line"></div>'+(description?'<p>'+escapeHTML(description)+'</p>':'')+'</div></div></section>'+
 '<section class="maic-course-content page-pad"><div class="maic-detail-container"><div class="maic-detail-facts">'+details+'</div>'+
 maicCourseDetailSection(c,'objectives',label('objectives'))+
 maicCourseDetailSection(c,'syllabus',label('syllabus'))+
 maicCourseDetailSection(c,'requirements',label('requirements'))+
 '<div class="maic-detail-payment"><p>'+escapeHTML(label('payment'))+'</p>'+
 '<p class="maic-detail-status">'+escapeHTML(label(c.status==='published'?'available':'pending'))+'</p>'+
 (c.status==='published'?'<button class="btn btn-gold" type="button" data-nav="enrollment">'+escapeHTML(label('enroll'))+'</button>':'')+
 '</div></div></section></div>';
}
function renderCoursesPage(id){
 const mode=MAIC_COURSE_MODES.find(x=>x.route===id);
 const top='<div class="maic-course-heading"><span class="eyebrow">'+escapeHTML(maicCoursesT('eyebrow'))+'</span><h1>'+escapeHTML(mode?maicCoursesModeLabel(mode):maicCoursesT('heading'))+'</h1><div class="short-line"></div><p>'+escapeHTML(mode?maicCoursesModeDescription(mode):maicCoursesT('overview'))+'</p></div>';
 const intro='<section class="maic-course-hero page-pad"><div class="maic-course-hero-inner">'+(mode?'<button class="maic-course-back" type="button" data-nav="courses">'+icon('chevron')+escapeHTML(maicCoursesT('back'))+'</button>':'')+top+'</div></section>';
 if(!mode)return '<div class="maic-courses-page">'+intro+'<section class="maic-course-content page-pad"><div class="maic-format-grid">'+MAIC_COURSE_MODES.map(maicCoursesFormatCard).join('')+'</div><div class="maic-course-info"><button class="btn" type="button" data-nav="enrollment">'+escapeHTML(maicCoursesT('enrollInfo'))+icon('chevron')+'</button></div></section></div>';
 const courses=MAIC_COURSE_CATALOG.filter(x=>x.mode.includes(mode.id));
 const published=courses.filter(x=>x.status==='published');
 const preparing=courses.filter(x=>x.status==='preparing');
 const liveCards=published.map(c=>{const description=state.lang==='ar'?c.descriptionAr:c.descriptionEn;return '<article class="maic-course-tile"><span class="maic-course-area">'+escapeHTML(state.lang==='ar'?c.areaAr:c.areaEn)+'</span><h3>'+escapeHTML(state.lang==='ar'?c.ar:c.en)+'</h3>'+(description?'<p class="maic-course-description">'+escapeHTML(description)+'</p>':'')+(c.duration?'<small class="maic-course-duration">'+escapeHTML(c.duration)+'</small>':'')+'<button class="btn" type="button" data-nav="course:'+escapeHTML(c.id)+'">'+escapeHTML(state.lang==='ar'?'تفاصيل الكورس':'Course details')+'</button></article>'}).join('');
 return '<div class="maic-courses-page">'+intro+'<section class="maic-course-content page-pad"><div class="maic-course-listing"><h2>'+escapeHTML(maicCoursesT('available'))+'</h2>'+(published.length?'<div class="maic-course-grid">'+liveCards+'</div>':'<p class="maic-course-empty" role="status">'+escapeHTML(maicCoursesT('empty'))+'</p>')+(preparing.length?'<h2 class="maic-course-upcoming-heading">'+escapeHTML(maicCoursesT('upcoming'))+'</h2><p class="maic-course-note">'+escapeHTML(maicCoursesT('planned'))+'</p><div class="maic-course-grid">'+preparing.map(maicCourseTile).join('')+'</div>':'')+'<div class="maic-course-info"><button class="btn" type="button" data-nav="enrollment">'+escapeHTML(maicCoursesT('enrollInfo'))+icon('chevron')+'</button></div><p class="maic-course-disclaimer">'+escapeHTML(maicCoursesT('certificate'))+' '+escapeHTML(maicCoursesT('details'))+'</p></div></section></div>';
}
