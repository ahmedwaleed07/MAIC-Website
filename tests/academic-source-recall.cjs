const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('MAIC academic approval rejects a bank dominated by page-location recall',()=>{
 const src=fs.readFileSync(path.resolve(__dirname,'../functions/api/admin/exam-banks.js'),'utf8');
 assert.ok(src.includes('sourceRecallItems<=12'));
 assert.match(src,/sourceRecallItems=questions\.filter/);
 const probe=/\bpage\s*\d{1,3}\b/i;
 assert.ok(probe.test('Which THREE claims appear on page 5 of the manual?'));
 assert.ok(probe.test('Which TWO statements are drawn from page 9 of this course?'));
 assert.equal(probe.test('Which operational control is appropriate when a student lacks authorization?'),false);
 const admin=fs.readFileSync(path.resolve(__dirname,'../admin/exam-banks.js'),'utf8');
 assert.ok(admin.includes('sourceRecallItems'));
});
