const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'app.js'),'utf8');
test('course format note translations include all MAIC supported languages',()=>{
 const start=source.indexOf('const MAIC_COURSE_AVAILABILITY='),end=source.indexOf('function renderCourses(){',start);
 assert.ok(start>0&&end>start);
 const snippet=source.slice(start,end)+'\n;MAIC_COURSE_AVAILABILITY';
 const data=vm.runInNewContext(snippet.replace(/function courseModeAvailability\(mode\)\{[^}]*\}/,''),{});
 const names=fs.readdirSync(path.join(root,'i18n')).filter(name=>name.endsWith('.json')).map(name=>name.slice(0,-5));
 assert.equal(names.length,29);
 for(const locale of names){
  assert.equal(typeof data[locale]?.group,'string','Missing group note in '+locale);
  assert.equal(typeof data[locale]?.['one-on-one'],'string','Missing private note in '+locale);
  assert.ok(data[locale].group.length>=5);
  assert.ok(data[locale]['one-on-one'].length>=5);
 }
 assert.equal(data.ar.group,'تُفتح في مواعيد محددة');
 assert.equal(data.ar['one-on-one'],'متوفرة طوال العام');
});
test('course filter and mode pages render localized schedule notes',()=>{
 assert.match(source,/maic-mode-filter-list/);
 assert.match(source,/maic-mode-availability/);
 assert.match(source,/maic-course-mode-notice/);
 const styles=fs.readFileSync(path.join(root,'courses.css'),'utf8');
 assert.match(styles,/\.maic-mode-filter-list/);
});
