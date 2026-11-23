const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
test('private admin exam overview shows real progress and source-PDF gate, with no visual identity change',()=>{
 const api=fs.readFileSync(path.join(base,'functions/api/admin/exam-banks.js'),'utf8');
 const ui=fs.readFileSync(path.join(base,'admin/exam-banks.js'),'utf8');
 assert.match(api,/isAdmin\(request,env\)/);
 assert.match(api,/matches_published_pdf/);
 assert.match(api,/coursesWithNoDraft/);
 assert.match(api,/completeDraftBanks/);
 assert.match(ui,/questionsInDrafts/);
 assert.match(ui,/ملف Tinos المرشح لم يُعتمد بعد/);
 assert.match(ui,/نسخة PDF مختلفة عن المنشورة/);
});

test('review inventory separates current source-matched blockers from historical drafts',()=>{
 const api=fs.readFileSync(path.join(base,'functions/api/admin/exam-banks.js'),'utf8');
 const ui=fs.readFileSync(path.join(base,'admin/exam-banks.js'),'utf8');
 assert.match(api,/currentDrafts=banks\.filter/);
 assert.match(api,/b\.matches_published_pdf===1/);
 assert.match(api,/historicalBlockingIssues/);
 assert.match(api,/CASE WHEN a\.version=b\.version THEN 1 ELSE 0 END AS is_active/);
 assert.match(ui,/ملاحظاتها التاريخية المفتوحة/);
 assert.match(ui,/النسخ السابقة أو غير المطابقة/);
 assert.match(ui,/b\.status==='approved'&&b\.is_active===1/);
 assert.match(ui,/current\.includes\(b\)/);
});
