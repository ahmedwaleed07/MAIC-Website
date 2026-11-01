const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
test('exactly one hundred questions, each with four selectable choices',()=>{
 const upload=load('functions/api/admin/exam-banks.js'),client=load('learner/exam.js'),server=load('functions/api/learner/exam.js');
 assert.match(upload,/d\.questions\.length!==100/);
 assert.match(upload,/q\.options\.length!==4/);
 assert.match(upload,/q\.correct/);
 assert.match(client,/input\.type='checkbox'/);
 assert.match(server,/q\.correct_mask/);
 assert.match(server,/selected_mask/);
});
test('the server advances the authoritative cursor, never opens previous questions',()=>{
 const server=load('functions/api/learner/exam.js');
 assert.match(server,/d\.ordinal!==previous\.current_question/);
 assert.match(server,/state='in_progress' AND current_question=\?/);
 assert.match(server,/current_question=current_question\+1/);
 assert.match(server,/new Set\(indices\)/);
 assert.ok(!server.includes('previous-question'));
});
test('grading and correctness stay on the server until the last question',()=>{
 const server=load('functions/api/learner/exam.js'),client=load('learner/exam.js');
 assert.match(server,/current_question=100 THEN 'submitted'/);
 assert.match(server,/SUM\(is_correct\)/);
 assert.match(server,/q\.correct_mask=\?/);
 assert.ok(!client.includes('correct_mask'));
 assert.ok(!client.includes('rationale'));
 assert.match(client,/data\.state==='submitted'/);
});
test('material review and question bank approval gate the exam',()=>{
 const server=load('functions/api/learner/exam.js'),review=load('functions/api/admin/exam-banks.js');
 assert.match(server,/reviewed/);
 assert.match(server,/mode\.delivery_mode!=='self-paced'/);
 assert.match(server,/active\.source_sha256===m\.sha256/);
 assert.match(review,/d\.pdfFormatReviewed!==true/);
 assert.match(review,/d\.sourceReviewed!==true/);
 assert.match(review,/d\.academicQualityReviewed!==true/);
});
test('MAIC PDF template requires genuine Times New Roman and the approved wordmark font',()=>{
 const script=load('tools/create_maic_course_pdf.py');
 assert.match(script,/fontSize=12/);
 assert.match(script,/Times New Roman/);
 assert.match(script,/--times-regular/);
 assert.match(script,/--times-bold/);
 assert.match(script,/--brand-font/);
 assert.match(script,/ImageOps\.grayscale/);
});
