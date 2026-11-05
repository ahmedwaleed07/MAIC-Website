'use strict';
/* Display-only catalog copy; no bank contents or answer keys in browser assets. */
(function(){
 const english={
  title:'Course Examinations',
  intro:'Examination names are visible to everyone. Questions remain private until your authorized agent confirms receipt, MAIC activates your course enrollment, and the examination receives academic approval.',
  locked:'Locked — agent confirmation and MAIC enrollment activation required',
  academic_review_pending:'Awaiting academic review — questions remain hidden',
  study_required:'Enrollment active — complete course material study first',
  available:'Access permitted — open examination',
  different_delivery_mode:'This enrollment uses another learning format',
  portal:'Learner Portal',
  begin:'Open Examination',
  total:'100 questions',
  unavailable:'The exam catalog is temporarily unavailable.'
 };
 const arabic={
  title:'اختبارات الدورات',
  intro:'أسماء الاختبارات ظاهرة للجميع، بينما تبقى الأسئلة مخفية إلى أن يؤكد الوكيل المعتمد الاستلام وتفعّل إدارة MAIC اشتراك المتعلم ويُعتمد الاختبار علمياً.',
  locked:'مقفل — يتطلب تأكيد الوكيل وتفعيل الاشتراك من MAIC',
  academic_review_pending:'بانتظار الاعتماد العلمي — الأسئلة مخفية',
  study_required:'الاشتراك مفعّل — أكمل دراسة المادة العلمية أولاً',
  available:'مسموح بالدخول — افتح الاختبار',
  different_delivery_mode:'هذا الاشتراك ضمن نمط تعليمي مختلف',
  portal:'بوابة المتعلم',
  begin:'فتح الاختبار',
  total:'١٠٠ سؤال',
  unavailable:'تعذر عرض قائمة الاختبارات حالياً.'
 };
 // Concise, localized public catalog labels in all site languages.
 const localized={
 'de-DE':['Kursprüfungen','Die Prüfungsnamen sind sichtbar. Fragen bleiben bis zur Bestätigung durch den Vertreter, zur Freischaltung durch MAIC und zur akademischen Genehmigung verborgen.','Gesperrt — Bestätigung und Freischaltung erforderlich','Akademische Prüfung läuft','Kursunterlagen zuerst durcharbeiten','Prüfung öffnen','Lernendenportal'],
 'pt-BR':['Exames dos cursos','Os nomes são públicos. As questões ficam ocultas até a confirmação do agente, a ativação pela MAIC e a aprovação acadêmica.','Bloqueado — confirmação e ativação necessárias','Aguardando revisão acadêmica','Estude o material primeiro','Abrir exame','Portal do aluno'],
 'bg-BG':['Изпити по курсове','Имената на изпитите са видими. Въпросите остават скрити до потвърждение от представителя, активиране от MAIC и академично одобрение.','Заключено — изисква се потвърждение','Очаква академичен преглед','Първо изучете материала','Отворете изпита','Портал за обучаеми'],
 'zh-CN':['课程考试','考试名称公开显示。题目仅在代理确认、MAIC 激活注册及学术审核通过后开放。','已锁定 — 需要确认和激活','等待学术审核','请先完成课程学习','打开考试','学员门户'],
 'cs-CZ':['Zkoušky ke kurzům','Názvy zkoušek jsou veřejné. Otázky se zpřístupní až po potvrzení zástupcem, aktivaci MAIC a akademickém schválení.','Uzamčeno — čeká na potvrzení','Čeká na akademické posouzení','Nejdříve prostudujte materiály','Otevřít zkoušku','Portál studenta'],
 'fr-FR':['Examens des cours','Les titres sont publics. Les questions restent privées jusqu’à la confirmation de l’agent, l’activation par MAIC et la validation académique.','Verrouillé — confirmation et activation requises','En attente de validation académique','Étudiez d’abord les supports','Ouvrir l’examen','Portail apprenant'],
 'el-GR':['Εξετάσεις μαθημάτων','Οι τίτλοι εμφανίζονται δημόσια. Οι ερωτήσεις παραμένουν κρυφές έως την επιβεβαίωση του εκπροσώπου, την ενεργοποίηση από τη MAIC και την ακαδημαϊκή έγκριση.','Κλειδωμένο — απαιτείται ενεργοποίηση','Εκκρεμεί ακαδημαϊκή έγκριση','Μελετήστε πρώτα το υλικό','Άνοιγμα εξέτασης','Πύλη εκπαιδευόμενου'],
 'hi-IN':['पाठ्यक्रम परीक्षाएँ','परीक्षा के नाम दिखते हैं। प्रश्न केवल एजेंट पुष्टि, MAIC नामांकन सक्रियण और शैक्षणिक स्वीकृति के बाद खुलेंगे।','लॉक — पुष्टि और सक्रियण आवश्यक','शैक्षणिक समीक्षा लंबित','पहले पाठ्य सामग्री पढ़ें','परीक्षा खोलें','शिक्षार्थी पोर्टल'],
 'id-ID':['Ujian Kursus','Nama ujian terlihat. Soal tetap rahasia hingga konfirmasi agen, aktivasi MAIC, dan persetujuan akademik.','Terkunci — perlu konfirmasi dan aktivasi','Menunggu tinjauan akademik','Pelajari materi terlebih dahulu','Buka ujian','Portal pelajar'],
 'it-IT':['Esami dei corsi','I titoli degli esami sono pubblici. Le domande restano riservate fino alla conferma dell’agente, all’attivazione MAIC e all’approvazione accademica.','Bloccato — necessaria attivazione','In attesa di revisione accademica','Studia prima il materiale','Apri esame','Portale studenti'],
 'ja-JP':['コース試験','試験名は公開されます。設問は代理店の確認、MAICによる受講登録の有効化および学術承認後のみ利用できます。','ロック中 — 確認と有効化が必要','学術審査待ち','先に教材を学習してください','試験を開く','受講者ポータル'],
 'ko-KR':['과정 시험','시험명은 공개됩니다. 문제는 대리인 확인, MAIC 수강 활성화 및 학술 승인 후에만 공개됩니다.','잠김 — 확인 및 활성화 필요','학술 검토 대기','먼저 학습 자료를 완료하세요','시험 열기','학습자 포털'],
 'es-ES':['Exámenes de cursos','Los nombres son públicos. Las preguntas permanecen privadas hasta la confirmación del agente, la activación de MAIC y la aprobación académica.','Bloqueado — requiere confirmación','Pendiente de revisión académica','Estudia primero el material','Abrir examen','Portal del alumno'],
 'nl-NL':['Cursusexamens','Examentitels zijn zichtbaar. Vragen blijven verborgen totdat de agent bevestigt, MAIC de inschrijving activeert en de academische beoordeling is afgerond.','Vergrendeld — bevestiging vereist','Wacht op academische beoordeling','Bestudeer eerst het lesmateriaal','Examen openen','Studentenportaal'],
 'pl-PL':['Egzaminy kursowe','Nazwy egzaminów są widoczne. Pytania pozostają ukryte do potwierdzenia agenta, aktywacji MAIC i zatwierdzenia naukowego.','Zablokowane — wymagane potwierdzenie','Oczekuje na ocenę akademicką','Najpierw zapoznaj się z materiałami','Otwórz egzamin','Portal ucznia'],
 'ro-RO':['Examenele cursurilor','Titlurile sunt vizibile. Întrebările rămân private până la confirmarea agentului, activarea MAIC și aprobarea academică.','Blocat — necesită confirmare','În așteptarea evaluării academice','Studiază întâi materialul','Deschide examenul','Portal cursant'],
 'sr-RS':['Испити на курсевима','Називи испита су јавни. Питања остају скривена до потврде агента, активације MAIC и академског одобрења.','Закључано — потребна потврда','Чека академску проверу','Прво проучите материјал','Отвори испит','Портал полазника'],
 'zh-TW':['課程考試','考試名稱公開顯示。題目須在代理確認、MAIC 啟用註冊及學術審核通過後才能開啟。','已鎖定 — 需要確認與啟用','等待學術審核','請先完成課程學習','開啟考試','學員入口'],
 'th-TH':['การสอบของหลักสูตร','ชื่อข้อสอบเปิดเผยได้ แต่คำถามจะถูกซ่อนไว้จนกว่าตัวแทนจะยืนยัน MAIC เปิดใช้งาน และผ่านการรับรองทางวิชาการ','ล็อก — ต้องยืนยันและเปิดใช้งาน','รอการตรวจสอบทางวิชาการ','กรุณาศึกษาเนื้อหาก่อน','เปิดข้อสอบ','พอร์ทัลผู้เรียน'],
 'tr-TR':['Kurs Sınavları','Sınav adları görünür. Sorular temsilci onayı, MAIC kayıt aktivasyonu ve akademik onay tamamlanana kadar gizli kalır.','Kilitli — onay ve aktivasyon gerekli','Akademik inceleme bekleniyor','Önce ders materyalini çalışın','Sınavı aç','Öğrenci portalı'],
 'uk-UA':['Іспити курсів','Назви іспитів відкриті. Запитання приховані до підтвердження агента, активації MAIC та академічного схвалення.','Заблоковано — потрібне підтвердження','Очікує академічної перевірки','Спочатку опрацюйте матеріал','Відкрити іспит','Портал слухача'],
 'vi-VN':['Bài thi khóa học','Tên bài thi hiển thị công khai. Câu hỏi chỉ được mở sau xác nhận của đại lý, kích hoạt MAIC và phê duyệt học thuật.','Đã khóa — cần xác nhận','Đang chờ thẩm định học thuật','Hãy học tài liệu trước','Mở bài thi','Cổng học viên'],
 'ku':['تاقیکردنەوەکانی کۆرس','ناوی تاقیکردنەوەکان دیارن. پرسیارەکان تەنها دوای پشتڕاستکردنەوەی بریکار و چالاککردنی MAIC و پەسەندکردنی ئەکادیمی دەکرێنەوە.','داخراوە — پێویستی بە پشتڕاستکردنەوەیە','چاوەڕوانی پەسەندی ئەکادیمییە','سەرەتا ماددەی کۆرس بخوێنەوە','کردنەوەی تاقیکردنەوە','دەروازەی فێرخواز']
 };
 const aliases={'de-AT':'de-DE','de-CH':'de-DE','pt-PT':'pt-BR','fr-CH':'fr-FR','es-419':'es-ES'};
 const labels={};
 for(const [lang,a] of Object.entries(localized))labels[lang]={title:a[0],intro:a[1],locked:a[2],academic_review_pending:a[3],study_required:a[4],available:a[5],begin:a[5],portal:a[6]};
 for(const [alias,base] of Object.entries(aliases))labels[alias]=labels[base];
 globalThis.maicExamCopy=locale=>({
  ...english,...(locale==='ar'?arabic:labels[locale]||{}),
  // For all languages the exact name of the educational institution remains MAIC.
 });
})();
