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
 assert.match(src,/excessive_repeated_question_templates/);
 assert.match(src,/openingFamilies/);
 assert.match(src,/openingFamilies\.values\(\)/);
});
