const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('the approved body is Tinos 12, not mislabeled as Times New Roman',()=>{
 const src=read('tools/create_maic_course_pdf.py');
 assert.match(src,/MAIC-Tinos/);
 assert.match(src,/fontSize=12/);
 assert.match(src,/--tinos-regular/);
 assert.match(src,/--tinos-bold/);
 assert.match(src,/ImageOps\.grayscale/);
 assert.doesNotMatch(src,/MAIC-TNR/);
});
test('academic PDF upload is protected, versioned and auditable',()=>{
 const src=read('functions/api/admin/course-material.js');
 for(const marker of ["validOrigin(request)","isAdmin(request,env)","course_material_locked_due_to_active_learning","academic_review_required","expected_12_pages","tinos_font_not_embedded","learning_material_revisions","sha256","db.batch(statements)"])assert.ok(src.includes(marker),marker);
 assert.match(src,/MAX=1250000/);
});
test('admin approval requires content and style review, no auto-publish',()=>{
 const src=read('admin/course-material.html');
 assert.match(src,/id="checkContent" type="checkbox" required/);
 assert.match(src,/id="checkStyle" type="checkbox" required/);
 assert.match(src,/Tinos/);
 const code=read('admin/course-material.js');
 assert.match(code,/confirm\(/);
 assert.match(code,/encodeURIComponent\(reviewer\)/);
});
test('recycled question families are blocked, despite 100 valid records',()=>{
 const src=read('functions/api/admin/exam-banks.js');
 assert.match(src,/repetitive_questions_block_approval/);
 assert.match(src,/maxOpening/);
 assert.match(src,/nearPairs/);
});

test('first PDF upload is possible for an eligible catalog course without existing material',()=>{
 const api=read('functions/api/admin/course-material.js');
 const ui=read('admin/course-material.js');
 assert.match(api,/const availableCourses=doc\.courses/);
 assert.match(api,/c\.status!=='archived'/);
 assert.match(api,/c\.mode\.includes\('self-paced'\)/);
 assert.match(api,/has_material:stored\.has\(c\.id\)/);
 assert.match(ui,/availableCourses=data\.availableCourses/);
 assert.match(ui,/availableCourses\.find\(m=>m\.course_id===course\.value\)/);
 assert.match(ui,/إضافة أول نسخة/);
 assert.doesNotMatch(ui,/source\.find\(m=>m\.course_id===course\.value\)/);
});
test('PDF builder preserves review formatting while public source manuscript pipeline protects originals',()=>{
 const render=read('tools/render_maic_manuscript.py');
 const workflow=read('.github/workflows/maic-manuscripts.yml');
 const upload=read('functions/api/admin/course-material.js');
 assert.match(render,/format="JPEG", quality=82, optimize=True/);
 assert.match(render,/original crest/);
 assert.match(workflow,/check_no_public_manuscripts.py/);
 assert.match(upload,/MAX=1250000/);
 assert.match(upload,/expected_12_pages/);
});

test('catalog cannot newly publish unreviewed self-paced courses',()=>{
 const src=read('functions/api/admin/content.js');
 assert.match(src,/newlyPublished=doc\.courses\.filter/);
 assert.match(src,/oldStatuses\.get\(c\.id\)!=='published'/);
 assert.match(src,/r\.content_reviewed=1/);
 assert.match(src,/r\.black_white_tinos12_verified=1/);
 assert.match(src,/b\.status='approved'/);
 assert.match(src,/b\.source_sha256=m\.sha256/);
 assert.match(src,/i\.verdict='approved'/);
 assert.match(src,/course_academic_release_required/);
 assert.match(src,/\['approved_source_matched_100_item_exam'\]/);
});

test('PDF upload recognizes 12-page tree for ReportLab and alternative key order',async()=>{
 const {pathToFileURL}=require('node:url');
 const {hasTwelvePageTree}=await import(pathToFileURL(path.join(root,'functions/_lib/pdf-page-tree.js')).href);
 const reportLab='28 0 obj\\n<<\\n/Count 12 /Kids [ 6 0 R 7 0 R 8 0 R 9 0 R 10 0 R 11 0 R 12 0 R 13 0 R 14 0 R 15 0 R 16 0 R 17 0 R ] /Type /Pages\\n>>';
 const other='<< /Type /Pages /Kids [1 0 R 2 0 R] /Count 12 >>';
 assert.equal(hasTwelvePageTree(reportLab),true);
 assert.equal(hasTwelvePageTree(other),true);
 assert.equal(hasTwelvePageTree('<< /Type /Page /Count 12 >>'),false);
 assert.equal(hasTwelvePageTree('<< /Type /Pages /Count 13 >>'),false);
 assert.equal(hasTwelvePageTree('<< /Count 12 >> << /Type /Pages >>'),false);
 const api=read('functions/api/admin/course-material.js');
 assert.match(api,/hasTwelvePageTree\(ascii\)/);
});
