import {json,isAdmin} from '../../_lib/cms.js';
import {catalog} from '../../_lib/learning.js';

// Owner-only, read-only overview. No answer keys or PDF bytes are returned.
// Editorial staging and academic approval must not be confused with publication.
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if(!env.MAIC_DB)return json({error:'database_unavailable'},503);
 try{
  const db=env.MAIC_DB;
  const [doc,materials,banks,privateCandidates,activeQuestionChecks]=await Promise.all([
   catalog(db),
   db.prepare(`
    SELECT m.course_id,m.sha256,m.pages,
     EXISTS(
      SELECT 1 FROM learning_material_revisions r
      WHERE r.course_id=m.course_id AND r.new_sha256=m.sha256
       AND r.content_reviewed=1 AND r.black_white_tinos12_verified=1
       AND LENGTH(TRIM(COALESCE(r.reviewed_by,'')))>=3
     ) AS technical_pdf_review,
     EXISTS(SELECT 1 FROM learning_material_academic_signoffs s
       WHERE s.course_id=m.course_id AND s.source_sha256=m.sha256) AS academic_pdf_signoff
    FROM learning_materials m`).all(),
   db.prepare(`
    SELECT b.course_id,b.version,b.status,b.question_count,b.source_sha256,
     CASE WHEN a.version=b.version THEN 1 ELSE 0 END AS active,
     CASE WHEN s.reviewed_at IS NOT NULL THEN 1 ELSE 0 END AS bank_reviewed,
     (SELECT COUNT(*) FROM learning_exam_item_reviews r
       WHERE r.course_id=b.course_id AND r.version=b.version
        AND r.verdict='approved') AS reviewed_questions,
     (SELECT COUNT(*) FROM learning_exam_quality_issues i
       WHERE i.course_id=b.course_id AND i.version=b.version
        AND i.severity='blocker' AND i.resolved_at IS NULL) AS open_blockers
    FROM learning_exam_banks b
    LEFT JOIN learning_exam_active a ON a.course_id=b.course_id AND a.version=b.version
    LEFT JOIN learning_exam_review_signoffs s ON s.course_id=b.course_id AND s.version=b.version
   `).all(),
   db.prepare('SELECT course_id,question_count,academic_status FROM learning_exam_private_candidates').all(),
   db.prepare(`SELECT q.course_id,
      SUM(CASE WHEN LENGTH(TRIM(q.stem))<30 THEN 1 ELSE 0 END) AS short_stems,
      SUM(CASE WHEN LENGTH(TRIM(q.rationale))<15 THEN 1 ELSE 0 END) AS short_rationales,
      SUM(CASE WHEN q.source_page<1 OR q.source_page>12 THEN 1 ELSE 0 END) AS invalid_source_pages
     FROM learning_exam_questions q
     JOIN learning_exam_active a ON a.course_id=q.course_id AND a.version=q.version
     GROUP BY q.course_id`).all()
  ]);
  const materialBy=new Map(materials.results.map(m=>[m.course_id,m]));
  const privateBy=new Map(privateCandidates.results.map(m=>[m.course_id,m]));
  const activeChecksBy=new Map(activeQuestionChecks.results.map(row=>[row.course_id,row]));
  const bankBy=new Map();
  for(const bank of banks.results){
   if(!bankBy.has(bank.course_id))bankBy.set(bank.course_id,[]);
   bankBy.get(bank.course_id).push(bank);
  }
  const rows=doc.courses.map(course=>{
   const material=materialBy.get(course.id),allBanks=bankBy.get(course.id)||[];
   const active=allBanks.find(b=>b.active===1);
   const drafts=allBanks.filter(b=>b.status==='draft'&&b.question_count===100);
   const reviewDraft=drafts.find(b=>b.source_sha256===material?.sha256)||drafts[0];
   const privateCandidate=privateBy.get(course.id),checks=activeChecksBy.get(course.id);
   const hasActiveMatchingExam=!!(material&&active&&active.status==='approved'&&active.question_count===100&&active.source_sha256===material.sha256);
   const verifiedNewRelease=!!(material?.technical_pdf_review&&material?.academic_pdf_signoff&&hasActiveMatchingExam&&active.bank_reviewed&&active.reviewed_questions===100&&active.open_blockers===0);
   let nextAction;
   if(course.status==='archived')nextAction='Archived; owner decision needed to restore';
   else if(!material)nextAction='Register reviewed 12-page PDF';
   else if(!material.technical_pdf_review)nextAction='Verify PDF technical-format review record';
   else if(!material.academic_pdf_signoff)nextAction='Record real independent academic reviewer for the exact PDF';
   else if(privateCandidate&&!drafts.length)nextAction='Replace exposed questions and prepare private reviewed bank';
   else if(!hasActiveMatchingExam)nextAction='Independent item review and exam activation required';
   else if(!verifiedNewRelease)nextAction='Verify exam item signoffs and release criteria';
   else nextAction=course.status==='published'?'Already published':'Ready for controlled final learner acceptance';
   return {
    id:course.id,title:course.en,status:course.status,
    modes:Array.isArray(course.mode)?course.mode:[],
    hasPdf:!!material,pdfReviewed:!!material?.academic_pdf_signoff,
    pdfTechnicalChecked:!!material?.technical_pdf_review,
    activeExam:hasActiveMatchingExam,
    activeExamHasItemReviews:!!(active&&active.reviewed_questions===100&&active.bank_reviewed),
    activeExamOpenBlockers:active?.open_blockers??0,
    activeExamShortStems:Number(checks?.short_stems||0),
    activeExamShortRationales:Number(checks?.short_rationales||0),
    activeExamInvalidSourcePages:Number(checks?.invalid_source_pages||0),
    draftBanks:drafts.length,
    reviewBankVersion:reviewDraft?.version||null,
    reviewedDraftQuestions:reviewDraft?.reviewed_questions||0,
    draftOpenBlockers:reviewDraft?.open_blockers||0,
    hasPrivateCandidate:!!privateCandidate,
    confidentialCandidateRequiresReplacement:!!privateCandidate,
    releaseCriteriaRecorded:verifiedNewRelease,nextAction
   };
  });
  const statusCount=key=>rows.filter(r=>r.status===key).length;
  return json({generatedAt:new Date().toISOString(),counts:{
   total:rows.length,published:statusCount('published'),
   preparing:statusCount('preparing'),archived:statusCount('archived'),
   withPdf:rows.filter(r=>r.hasPdf).length,
   withActiveExam:rows.filter(r=>r.activeExam).length,
   withPrivateCandidate:rows.filter(r=>r.hasPrivateCandidate).length,
   withIndependentPdfSignoff:rows.filter(r=>r.pdfReviewed).length,
   withFullyReviewedActiveExam:rows.filter(r=>r.activeExam&&r.activeExamHasItemReviews).length,
   activeExamShortStems:rows.reduce((n,r)=>n+r.activeExamShortStems,0),
   preparingWithoutPdf:rows.filter(r=>r.status==='preparing'&&!r.hasPdf).length
  },rows,note:'Status indicates database records, not an academic credential or a tested student journey.'});
 }catch(e){
  console.error('MAIC readiness summary failed',String(e?.message||e));
  return json({error:'unavailable'},503);
 }
}
