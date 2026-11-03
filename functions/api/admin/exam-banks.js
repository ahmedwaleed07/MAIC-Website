import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {catalog} from '../../_lib/learning.js';
import {fingerprintExamItem,reviewInputValid,countVerifiedItemReviews} from '../../_lib/exam-item-review.js';
import {countNearDuplicateQuestionPairs,countOverlappingOptionPairs,checkTemplateDraftCues} from '../../_lib/exam-quality.js';

const validId=x=>typeof x==='string'&&/^[-a-z0-9]{2,80}$/.test(x);
const nameOK=x=>typeof x==='string'&&x.trim().length>=3&&x.trim().length<=150;
async function parseJSON(request){
 const type=(request.headers.get('Content-Type')||'').split(';')[0];
 if(type!=='application/json')throw Error('invalid_content_type');
 if(Number(request.headers.get('Content-Length')||'0')>350000)throw Error('too_large');
 const reader=request.body?.getReader();if(!reader)throw Error('no_body');
 const chunks=[];let len=0;while(true){
  const {done,value}=await reader.read();if(done)break;len+=value.byteLength;
  if(len>350000){await reader.cancel();throw Error('too_large')}chunks.push(value);
 }
 const bytes=new Uint8Array(len);let at=0;
 for(const c of chunks){bytes.set(c,at);at+=c.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
function normalizeQuestion(q,index,pages){
 if(!q||typeof q!=='object'||Array.isArray(q))throw Error('invalid_question_'+index);
 const txt=(s,min,max)=>typeof s==='string'&&s.trim().length>=min&&s.trim().length<=max?s.trim():null;
 const stem=txt(q.stem,30,750);
 if(!stem||!Array.isArray(q.options)||q.options.length!==4)throw Error('stem_or_four_options_'+index);
 const opts=q.options.map(v=>txt(v,2,300));
 if(opts.some(x=>!x)||new Set(opts.map(x=>x.toLocaleLowerCase('en'))).size!==4)throw Error('duplicate_options_'+index);
 const correct=q.correct;
 if(!Array.isArray(correct)||!correct.length||correct.length>4||new Set(correct).size!==correct.length||correct.some(x=>!Number.isInteger(x)||x<0||x>3))throw Error('correct_answer_'+index);
 if(!Number.isInteger(q.page)||q.page<1||q.page>pages)throw Error('missing_source_page_'+index);
 const rationale=txt(q.rationale,15,1250);
 if(!rationale)throw Error('missing_explanation_'+index);
 return {stem,options:opts,mask:correct.reduce((m,i)=>m|(1<<i),0),page:q.page,rationale};
}
function quality(questions){
 const unique=new Set(questions.map(q=>q.stem.trim().toLocaleLowerCase('en')));
 if(unique.size!==100)throw Error('duplicate_stems');
 const families=new Map();
 for(const q of questions){
  const prefix=q.stem.toLocaleLowerCase('en').replace(/\s+/g,' ').slice(0,34);
  families.set(prefix,(families.get(prefix)||0)+1);
 }
 const maxOpening=Math.max(...families.values());
 const nearPairs=countNearDuplicateQuestionPairs(questions.map(q=>q.stem),0.85,12);
 const optionOverlapPairs=countOverlappingOptionPairs(questions.map(q=>({options:q.options||[q.option_a,q.option_b,q.option_c,q.option_d]})),3,12);
 // A final assessment must measure understanding, not ask where a sentence is printed.
 const sourceRecallItems=questions.filter(q=>/\bpage\s*\d{1,3}\b/i.test(q.stem)).length;
 const draftingCues=checkTemplateDraftCues(questions.map(q=>({stem:q.stem,options:q.options||[q.option_a,q.option_b,q.option_c,q.option_d],rationale:q.rationale})));
 return {maxOpening,nearPairs,optionOverlapPairs,sourceRecallItems,...draftingCues,canApprove:maxOpening<=14&&nearPairs<=12&&optionOverlapPairs<=12&&sourceRecallItems<=12&&draftingCues.canApprove};
}
async function list(db){
 const materials=(await db.prepare("SELECT m.course_id,m.title,m.pages,m.sha256,b.version,b.status,b.question_count,b.approved_at FROM learning_materials m LEFT JOIN learning_exam_active a ON a.course_id=m.course_id LEFT JOIN learning_exam_banks b ON b.course_id=a.course_id AND b.version=a.version ORDER BY m.title").all()).results;
 const banks=(await db.prepare("SELECT b.course_id,b.version,b.status,b.question_count,b.source_sha256,b.created_at,s.prepared_by,s.prepared_at,s.reviewed_by,s.reviewed_at,s.review_notes,CASE WHEN m.sha256=b.source_sha256 THEN 1 ELSE 0 END AS matches_published_pdf FROM learning_exam_banks b LEFT JOIN learning_exam_review_signoffs s ON s.course_id=b.course_id AND s.version=b.version LEFT JOIN learning_materials m ON m.course_id=b.course_id ORDER BY b.created_at DESC LIMIT 250").all()).results;
 return {materials,banks,summary:{coursesWithMaterials:materials.length,completeDraftBanks:banks.filter(b=>b.status==='draft'&&b.question_count===100).length,questionsInDrafts:banks.filter(b=>b.status==='draft').reduce((n,b)=>n+b.question_count,0),coursesWithNoDraft:materials.filter(m=>!banks.some(b=>b.course_id===m.course_id)).length,activatedBanks:banks.filter(b=>b.status==='approved').length},questionsRequired:100,answerOptions:4};
}
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const db=env.MAIC_DB,url=new URL(request.url),course=url.searchParams.get('course'),version=url.searchParams.get('version');
  if(!course&&!version)return json(await list(db));
  if(!validId(course)||typeof version!=='string'||!/^[\w-]{8,100}$/.test(version))return json({error:'invalid_bank'},400);
  const bank=await db.prepare("SELECT b.*,r.prepared_by,r.prepared_at,r.reviewed_by,r.reviewed_at,r.review_notes FROM learning_exam_banks b LEFT JOIN learning_exam_review_signoffs r ON r.course_id=b.course_id AND r.version=b.version WHERE b.course_id=? AND b.version=?").bind(course,version).first();
  if(!bank)return json({error:'bank_not_found'},404);
  const source=await db.prepare('SELECT sha256,pages FROM learning_materials WHERE course_id=?').bind(course).first();
  const rows=(await db.prepare("SELECT ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale FROM learning_exam_questions WHERE course_id=? AND version=? ORDER BY ordinal").bind(course,version).all()).results;
  const questions=rows.map(r=>({ordinal:r.ordinal,stem:r.stem,options:[r.option_a,r.option_b,r.option_c,r.option_d],correct:[0,1,2,3].filter(i=>r.correct_mask&(1<<i)),page:r.source_page,rationale:r.rationale}));
  const itemReviews=(await db.prepare("SELECT ordinal,reviewed_by,verdict,review_notes,reviewed_at FROM learning_exam_item_reviews WHERE course_id=? AND version=? ORDER BY ordinal").bind(course,version).all()).results;
  const qualityIssues=(await db.prepare("SELECT ordinal,issue_code,severity,detail,detected_at,resolved_at,resolved_by FROM learning_exam_quality_issues WHERE course_id=? AND version=? ORDER BY ordinal,issue_code").bind(course,version).all()).results;
  return json({bank:{course_id:bank.course_id,version:bank.version,status:bank.status,question_count:bank.question_count,source_sha256:bank.source_sha256,prepared_by:bank.prepared_by,reviewed_by:bank.reviewed_by,review_notes:bank.review_notes},sourceMatch:source?.sha256===bank.source_sha256,questions,quality:questions.length===100?quality(questions):null,itemReviews,qualityIssues,reviewProgress:{recorded:itemReviews.length,approved:itemReviews.filter(r=>r.verdict==='approved').length,needsRevision:itemReviews.filter(r=>r.verdict==='revise').length}});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const d=await parseJSON(request),course=d.courseId,db=env.MAIC_DB;
  if(d.action==='withdraw'){
   if(!validId(course))return json({error:'invalid_course'},400);
   const current=await db.prepare("SELECT version FROM learning_exam_active WHERE course_id=?").bind(course).first();
   if(!current)return json({error:'no_active_bank'},404);
   await db.batch([
    db.prepare("UPDATE learning_exam_banks SET status='withdrawn' WHERE course_id=? AND version=? AND status='approved'").bind(course,current.version),
    db.prepare("DELETE FROM learning_exam_active WHERE course_id=? AND version=?").bind(course,current.version)
   ]);
   return json({withdrawn:true,courseId:course});
  }
  if(d.action==='review-item'){
   if(!validId(course)||typeof d.version!=='string'||!/^[\w-]{8,100}$/.test(d.version)||!reviewInputValid(d))return json({error:'invalid_item_review'},400);
   const bank=await db.prepare("SELECT b.status,b.source_sha256,s.prepared_by FROM learning_exam_banks b JOIN learning_exam_review_signoffs s ON s.course_id=b.course_id AND s.version=b.version WHERE b.course_id=? AND b.version=?").bind(course,d.version).first();
   if(!bank||bank.status!=='draft')return json({error:'draft_bank_required'},409);
   const reviewer=d.reviewedBy.trim();
   if(reviewer.toLocaleLowerCase('en')===bank.prepared_by.trim().toLocaleLowerCase('en'))return json({error:'independent_reviewer_required'},409);
   const source=await db.prepare('SELECT sha256 FROM learning_materials WHERE course_id=?').bind(course).first();
   if(d.verdict==='approved'&&source?.sha256!==bank.source_sha256)return json({error:'source_material_mismatch'},409);
   if(d.verdict==='approved'){
    const unresolved=await db.prepare("SELECT COUNT(*) AS n FROM learning_exam_quality_issues WHERE course_id=? AND version=? AND ordinal=? AND severity='blocker' AND resolved_at IS NULL").bind(course,d.version,d.ordinal).first();
    if(unresolved?.n)return json({error:'item_has_unresolved_academic_issues',count:unresolved.n},409);
   }
   const q=await db.prepare('SELECT ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale FROM learning_exam_questions WHERE course_id=? AND version=? AND ordinal=?').bind(course,d.version,d.ordinal).first();
   if(!q)return json({error:'question_not_found'},404);
   const itemHash=await fingerprintExamItem(q),now=new Date().toISOString();
   const checked=d.verdict==='approved'?1:0;
   await db.prepare("INSERT INTO learning_exam_item_reviews(course_id,version,ordinal,reviewed_by,verdict,review_notes,item_sha256,source_confirmed,key_confirmed,distractors_confirmed,reviewed_at) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(course_id,version,ordinal) DO UPDATE SET reviewed_by=excluded.reviewed_by,verdict=excluded.verdict,review_notes=excluded.review_notes,item_sha256=excluded.item_sha256,source_confirmed=excluded.source_confirmed,key_confirmed=excluded.key_confirmed,distractors_confirmed=excluded.distractors_confirmed,reviewed_at=excluded.reviewed_at")
    .bind(course,d.version,d.ordinal,reviewer,d.verdict,d.reviewNotes.trim(),itemHash,checked,checked,checked,now).run();
   return json({recorded:true,ordinal:d.ordinal,verdict:d.verdict,reviewedAt:now});
  }
  if(d.action==='resolve-issue'){
   if(!validId(course)||typeof d.version!=='string'||!/^[\w-]{8,100}$/.test(d.version)||!Number.isInteger(d.ordinal)||d.ordinal<1||d.ordinal>100||typeof d.issueCode!=='string'||!/^[-A-Z_]{3,80}$/.test(d.issueCode)||!nameOK(d.reviewedBy))return json({error:'invalid_issue'},400);
   const notes=typeof d.reviewNotes==='string'?d.reviewNotes.trim():'';
   if(notes.length<35||notes.length>2000)return json({error:'specific_rewrite_evidence_required'},400);
   const bank=await db.prepare("SELECT b.status,s.prepared_by FROM learning_exam_banks b JOIN learning_exam_review_signoffs s ON s.course_id=b.course_id AND s.version=b.version WHERE b.course_id=? AND b.version=?").bind(course,d.version).first();
   if(!bank||bank.status!=='draft')return json({error:'draft_bank_required'},409);
   if(d.reviewedBy.trim().toLocaleLowerCase('en')===bank.prepared_by.trim().toLocaleLowerCase('en'))return json({error:'independent_reviewer_required'},409);
   const issue=await db.prepare("SELECT detected_at FROM learning_exam_quality_issues WHERE course_id=? AND version=? AND ordinal=? AND issue_code=? AND resolved_at IS NULL").bind(course,d.version,d.ordinal,d.issueCode).first();
   if(!issue)return json({error:'open_issue_not_found'},404);
   const question=await db.prepare('SELECT ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale FROM learning_exam_questions WHERE course_id=? AND version=? AND ordinal=?').bind(course,d.version,d.ordinal).first();
   const hash=await fingerprintExamItem(question);
   const revision=await db.prepare("SELECT revised_sha256,corrected_at FROM learning_exam_item_corrections WHERE course_id=? AND version=? AND ordinal=? AND corrected_at>=? ORDER BY corrected_at DESC LIMIT 1").bind(course,d.version,d.ordinal,issue.detected_at).first();
   if(!revision||revision.revised_sha256!==hash)return json({error:'actual_recorded_correction_required'},409);
   const checks=quality([question]);
   if(checks.draftingDisclaimers||checks.stronglyCueDominatedItems||checks.sourceRecallItems||question.stem.length>300)return json({error:'template_or_overlong_problem_remains'},422);
   const now=new Date().toISOString();
   const update=await db.prepare('UPDATE learning_exam_quality_issues SET resolved_at=?,resolved_by=?,resolution_notes=? WHERE course_id=? AND version=? AND ordinal=? AND issue_code=? AND resolved_at IS NULL')
    .bind(now,d.reviewedBy.trim(),notes,course,d.version,d.ordinal,d.issueCode).run();
   return json({resolved:update.meta?.changes===1,ordinal:d.ordinal,issueCode:d.issueCode});
  }
  if(d.action==='approve'){
   if(!validId(course)||typeof d.version!=='string'||!/^[\w-]{8,100}$/.test(d.version)||!nameOK(d.reviewedBy))return json({error:'review_fields_required'},400);
   const notes=typeof d.reviewNotes==='string'?d.reviewNotes.trim():'';
   if(notes.length<30||notes.length>2000)return json({error:'review_notes_required'},400);
   if(d.pdfFormatReviewed!==true||d.sourceReviewed!==true||d.academicQualityReviewed!==true)return json({error:'all_reviews_required'},409);
   const bank=await db.prepare("SELECT b.*,s.prepared_by FROM learning_exam_banks b JOIN learning_exam_review_signoffs s ON s.course_id=b.course_id AND s.version=b.version WHERE b.course_id=? AND b.version=?").bind(course,d.version).first();
   if(!bank||bank.status!=='draft'||bank.question_count!==100)return json({error:'draft_bank_required'},409);
   if(bank.prepared_by.trim().toLocaleLowerCase('en')===d.reviewedBy.trim().toLocaleLowerCase('en'))return json({error:'independent_reviewer_required'},409);
   const source=await db.prepare('SELECT sha256 FROM learning_materials WHERE course_id=?').bind(course).first();
   if(!source||source.sha256!==bank.source_sha256)return json({error:'source_material_mismatch'},409);
   const rows=(await db.prepare("SELECT ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale FROM learning_exam_questions WHERE course_id=? AND version=? ORDER BY ordinal").bind(course,d.version).all()).results;
   if(rows.length!==100)return json({error:'incomplete_bank'},409);
   const signals=quality(rows);
   if(!signals.canApprove)return json({error:'repetitive_questions_block_approval',signals},422);
   const openIssues=await db.prepare("SELECT COUNT(*) AS n FROM learning_exam_quality_issues WHERE course_id=? AND version=? AND severity='blocker' AND resolved_at IS NULL").bind(course,d.version).first();
   if(openIssues?.n>0)return json({error:'unresolved_academic_issues',count:openIssues.n},409);
   // A bank-level declaration is not proof that 100 individual answer keys were checked.
   // Match each independent signoff to the exact, unchanged question contents.
   const reviews=(await db.prepare("SELECT * FROM learning_exam_item_reviews WHERE course_id=? AND version=?").bind(course,d.version).all()).results;
   const perItem=await countVerifiedItemReviews(rows,reviews,d.reviewedBy.trim());
   if(perItem.approved!==100||perItem.requiresRevision>0)return json({error:'100_individual_reviews_required',...perItem},409);
   const doc=await catalog(db);
   if(!doc.courses.some(c=>c.id===course&&c.mode.includes('self-paced')&&c.status!=='archived'))return json({error:'course_not_self_paced'},409);
   const now=new Date().toISOString(),reviewer=d.reviewedBy.trim();
   const out=await db.batch([
    db.prepare("UPDATE learning_exam_banks SET status='approved',approved_by=?,approved_at=? WHERE course_id=? AND version=? AND status='draft'").bind(reviewer,now,course,d.version),
    db.prepare("UPDATE learning_exam_review_signoffs SET reviewed_by=?,reviewed_at=?,review_notes=? WHERE course_id=? AND version=? AND reviewed_at IS NULL").bind(reviewer,now,notes,course,d.version),
    db.prepare("INSERT INTO learning_exam_active(course_id,version,activated_at) VALUES(?,?,?) ON CONFLICT(course_id) DO UPDATE SET version=excluded.version,activated_at=excluded.activated_at").bind(course,d.version,now)
   ]);
   if(out[0].meta?.changes!==1||out[1].meta?.changes!==1)throw Error('concurrent_review');
   return json({approved:true,courseId:course,version:d.version,questionCount:100});
  }
  if(d.action&&d.action!=='stage')return json({error:'invalid_action'},400);
  if(d.format!=='maic-mcq-v1'||!validId(course)||!Array.isArray(d.questions)||d.questions.length!==100)return json({error:'exactly_100_questions_required'},400);
  if(!nameOK(d.preparedBy))return json({error:'preparer_required'},400);
  const m=await db.prepare('SELECT sha256,pages FROM learning_materials WHERE course_id=?').bind(course).first();
  if(!m||m.sha256!==d.sourceSha256)return json({error:'source_material_mismatch'},409);
  const doc=await catalog(db);
  if(!doc.courses.some(c=>c.id===course&&c.mode.includes('self-paced')&&c.status!=='archived'))return json({error:'course_not_self_paced'},409);
  let questions;
  try{questions=d.questions.map((q,i)=>normalizeQuestion(q,i+1,m.pages));}catch(e){return json({error:String(e.message||e).slice(0,120)},400)}
  const uniqueness=new Set(questions.map(q=>q.stem.trim().toLocaleLowerCase('en')));
  if(uniqueness.size!==100)return json({error:'duplicate_stems'},400);
  const version=crypto.randomUUID(),now=new Date().toISOString();
  await db.prepare("INSERT INTO learning_exam_banks(course_id,version,source_sha256,status,question_count,created_at) VALUES(?,?,?,'draft',0,?)").bind(course,version,m.sha256,now).run();
  try{
   for(let n=0;n<100;n+=12){
    await db.batch(questions.slice(n,n+12).map((q,j)=>db.prepare('INSERT INTO learning_exam_questions(course_id,version,ordinal,stem,option_a,option_b,option_c,option_d,correct_mask,source_page,rationale) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(course,version,n+j+1,q.stem,...q.options,q.mask,q.page,q.rationale)));
   }
   const count=await db.prepare('SELECT COUNT(*) AS n FROM learning_exam_questions WHERE course_id=? AND version=?').bind(course,version).first();
   if(count?.n!==100)return json({error:'incomplete_draft'},503);
   await db.batch([
    db.prepare("UPDATE learning_exam_banks SET question_count=100 WHERE course_id=? AND version=? AND status='draft'").bind(course,version),
    db.prepare("INSERT INTO learning_exam_review_signoffs(course_id,version,prepared_by,prepared_at) VALUES(?,?,?,?)").bind(course,version,d.preparedBy.trim(),now)
   ]);
   const signals=quality(questions);
   return json({staged:true,approved:false,courseId:course,version,questionCount:100,quality:{...signals}});
  }catch{return json({error:'upload_incomplete_check_draft'},503)}
 }catch(e){return json({error:['too_large','invalid_content_type'].includes(String(e.message))?e.message:'invalid_or_unavailable'},400)}
}
