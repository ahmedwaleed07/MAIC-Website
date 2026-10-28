'use strict';
const MAIC_COURSE_MODES=[{"id": "self-paced", "route": "courses:self-paced", "icon": "book", "en": "Self-Paced Online", "ar": "التعلم الذاتي عبر الإنترنت"}, {"id": "group", "route": "courses:group", "icon": "school", "en": "Live Group Classes", "ar": "دورات جماعية مباشرة"}, {"id": "one-on-one", "route": "courses:one-on-one", "icon": "user", "en": "Private Classes", "ar": "دورات فردية"}];
const MAIC_COURSE_CATALOG=[
  {
    "id": "project-management",
    "en": "Project Management Foundations",
    "ar": "أساسيات إدارة المشاريع",
    "areaEn": "Project Management",
    "areaAr": "إدارة المشاريع",
    "descriptionEn": "Plan a practical project from scope and scheduling to risk management and delivery.",
    "descriptionAr": "خطط لمشروع عملي بدءاً من تحديد النطاق والجدول الزمني وحتى إدارة المخاطر والتسليم.",
    "objectivesEn": "Define a project goal, scope and deliverables.\nBuild a task schedule and identify dependencies.\nTrack risks, responsibilities and progress.",
    "objectivesAr": "حدد هدف المشروع ونطاقه ومخرجاته.\nأعد جدول المهام وحدد العلاقات بينها.\nتابع المخاطر والمسؤوليات وتقدم العمل.",
    "syllabusEn": "Project brief and stakeholder mapping\nWork breakdown, schedule and resources\nRisk register and change control\nDelivery review and lessons learned",
    "syllabusAr": "وثيقة المشروع وتحليل أصحاب المصلحة\nتجزئة العمل والجدولة والموارد\nسجل المخاطر وضبط التغييرات\nمراجعة التسليم والدروس المستفادة",
    "requirementsEn": "No previous experience is required. Basic computer and internet skills are recommended.",
    "requirementsAr": "لا تتطلب خبرة سابقة. يُنصح بمهارات أساسية في استخدام الحاسوب والإنترنت.",
    "mode": [
      "self-paced"
    ],
    "status": "preparing",
    "level": "beginner",
    "courseLanguage": "bilingual",
    "duration": "",
    "instructor": "",
    "feeAmount": "",
    "feeCurrency": "USD"
  },
  {
    "id": "digital-marketing",
    "en": "Marketing Foundations",
    "ar": "أساسيات التسويق",
    "areaEn": "Marketing",
    "areaAr": "التسويق",
    "descriptionEn": "Create a focused marketing plan built around audience needs, positioning and measurable campaigns.",
    "descriptionAr": "ابنِ خطة تسويقية واضحة تعتمد على احتياجات الجمهور والتموضع والحملات القابلة للقياس.",
    "objectivesEn": "Identify a target audience and customer need.\nWrite a clear value proposition.\nSelect channels and measure campaign performance.",
    "objectivesAr": "حدد الجمهور المستهدف واحتياجات العميل.\nاكتب عرض قيمة واضحاً.\nاختر القنوات وقس أداء الحملات.",
    "syllabusEn": "Audience research and customer personas\nPositioning and value proposition\nContent, channels and campaign planning\nBudget, conversion and performance measurement",
    "syllabusAr": "دراسة الجمهور وشخصيات العملاء\nالتموضع وعرض القيمة\nالمحتوى والقنوات وتخطيط الحملات\nالميزانية والتحويل وقياس الأداء",
    "requirementsEn": "No previous experience is required. Basic computer and internet skills are recommended.",
    "requirementsAr": "لا تتطلب خبرة سابقة. يُنصح بمهارات أساسية في استخدام الحاسوب والإنترنت.",
    "mode": [
      "self-paced"
    ],
    "status": "preparing",
    "level": "beginner",
    "courseLanguage": "bilingual",
    "duration": "",
    "instructor": "",
    "feeAmount": "",
    "feeCurrency": "USD"
  },
  {
    "id": "management-foundations",
    "en": "Management Foundations",
    "ar": "أساسيات الإدارة",
    "areaEn": "Management",
    "areaAr": "الإدارة",
    "descriptionEn": "Develop essential skills for planning work, organizing resources and leading a team.",
    "descriptionAr": "طوّر المهارات الأساسية لتخطيط العمل وتنظيم الموارد وقيادة الفريق.",
    "objectivesEn": "Set measurable team objectives.\nDelegate work with clear responsibilities.\nUse feedback and simple performance indicators.",
    "objectivesAr": "ضع أهدافاً قابلة للقياس للفريق.\nفوّض العمل بمسؤوليات واضحة.\nاستخدم التغذية الراجعة ومؤشرات الأداء الأساسية.",
    "syllabusEn": "Planning and goal setting\nOrganizing work and delegating responsibility\nTeam communication and decision making\nPerformance review and continuous improvement",
    "syllabusAr": "التخطيط وتحديد الأهداف\nتنظيم العمل وتفويض المسؤوليات\nالتواصل داخل الفريق واتخاذ القرارات\nمراجعة الأداء والتحسين المستمر",
    "requirementsEn": "No previous experience is required. Basic computer and internet skills are recommended.",
    "requirementsAr": "لا تتطلب خبرة سابقة. يُنصح بمهارات أساسية في استخدام الحاسوب والإنترنت.",
    "mode": [
      "self-paced"
    ],
    "status": "preparing",
    "level": "beginner",
    "courseLanguage": "bilingual",
    "duration": "",
    "instructor": "",
    "feeAmount": "",
    "feeCurrency": "USD"
  },
  {
    "id": "human-resources",
    "en": "Human Resources Foundations",
    "ar": "أساسيات الموارد البشرية",
    "areaEn": "Human Resources",
    "areaAr": "الموارد البشرية",
    "descriptionEn": "Understand the employee journey from workforce planning and recruitment to development and retention.",
    "descriptionAr": "تعرّف على رحلة الموظف من تخطيط القوى العاملة والتوظيف إلى التطوير والاحتفاظ بالكفاءات.",
    "objectivesEn": "Write a role profile and structured interview questions.\nPlan onboarding and employee development.\nRecognize fair and consistent people practices.",
    "objectivesAr": "اكتب وصفاً وظيفياً وأسئلة مقابلة منظمة.\nخطط لتهيئة الموظف وتطويره.\nميّز ممارسات إدارة الأفراد العادلة والمتسقة.",
    "syllabusEn": "Workforce planning and job descriptions\nRecruitment and structured selection\nOnboarding, learning and performance\nEmployee engagement and retention",
    "syllabusAr": "تخطيط القوى العاملة والوصف الوظيفي\nالاستقطاب والاختيار المنظم\nالتهيئة والتعلم والأداء\nمشاركة الموظفين والاحتفاظ بالكفاءات",
    "requirementsEn": "No previous experience is required. Basic computer and internet skills are recommended.",
    "requirementsAr": "لا تتطلب خبرة سابقة. يُنصح بمهارات أساسية في استخدام الحاسوب والإنترنت.",
    "mode": [
      "self-paced"
    ],
    "status": "preparing",
    "level": "beginner",
    "courseLanguage": "bilingual",
    "duration": "",
    "instructor": "",
    "feeAmount": "",
    "feeCurrency": "USD"
  }
];
