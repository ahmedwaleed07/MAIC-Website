'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function gallery(){
 const handlers={};
 const mock={window:{},document:{documentElement:{lang:'en-US'},body:{classList:{add(){},remove(){}}},addEventListener(n,cb){handlers[n]=cb},querySelector(){return null}}};
 vm.runInNewContext(read('michigan-gallery.js'),mock,{filename:'michigan-gallery.js'});
 return {api:mock.window.MAIC_MICHIGAN_GALLERY,handlers,mock};
}
test('Michigan heritage shows exactly six distinct real places and six historic people',()=>{
 const {api}=gallery();
 assert.equal(api.count,12);
 const en=api.render('en-US',k=>k==='landmarks'?'Places to discover':k);
 const ar=api.render('ar',k=>k==='landmarks'?'أماكن تستحق الاكتشاف':k);
 assert.equal((en.match(/class="mi-gallery-card /g)||[]).length,12);
 assert.equal((en.match(/mi-person/g)||[]).length,7); // 6 card markers plus people grid
 assert.equal((en.match(/data-mi-story=/g)||[]).length,12);
 assert.equal((ar.match(/data-mi-story=/g)||[]).length,12);
 for(const name of ['Henry Ford','Claude Shannon','Gerald R. Ford','Rosa Parks','Sojourner Truth','Aretha Franklin','Mackinac Bridge','Pictured Rocks National Lakeshore','Michigan State Capitol'])assert.ok(en.includes(name),name);
 assert.ok(ar.includes('هنري فورد'));
 assert.ok(ar.includes('روزا باركس'));
 assert.match(en,/id="miStoryDialog"/);
 assert.match(en,/id="miDialogImage"/);
 assert.match(en,/id="miDialogDescription"/);
 assert.match(en,/aria-labelledby="miDialogTitle"/);
 assert.match(en,/loading="lazy"/);
 const ids=[...en.matchAll(/data-mi-story="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,12);
 assert.equal((en.match(/upload\.wikimedia\.org\/wikipedia\/commons\//g)||[]).length,12);
 assert.doesNotMatch(en,/data:image|placehold\.co|unsplash|ai-generated/i);
});
test('gallery is a semantic button-driven modal and provides attribution and primary fact sources',()=>{
 const s=read('michigan-gallery.js');
 assert.match(s,/data-mi-story/);
 assert.match(s,/d\.showModal\(\)/);
 assert.match(s,/d\.close\(\)/);
 assert.match(s,/miDialogFacts/);
 assert.match(s,/miDialogPhoto/);
 assert.match(s,/miDialogCredit/);
 assert.match(s,/miDialogLicense/);
 assert.match(s,/image\.onerror/);
 assert.match(s,/maic-gallery/i);
 assert.match(s,/https:\/\/www\.nps\.gov/);
 assert.match(s,/https:\/\/www\.itsoc\.org/);
 assert.match(s,/https:\/\/www\.loc\.gov/);
 assert.match(s,/CC BY 4\.0/);
});
test('site loads Michigan gallery before the main router and keeps all other nav routes intact',()=>{
 const html=read('index.html'),app=read('app.js'),css=read('michigan-gallery.css');
 assert.match(html,/michigan-gallery\.css/);
 assert.ok(html.indexOf('michigan-gallery.js')<html.indexOf('app.js?'));
 assert.match(app,/function renderMichigan\(\)/);
 assert.match(app,/gallery\.render\(state\.lang,t\)/);
 assert.match(css,/\.mi-story-dialog::backdrop/);
 assert.match(css,/object-fit:contain/);
 assert.match(css,/@media\(max-width:640px\)/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(app,/advisor:renderAcademicAdvisor/);
 assert.match(app,/agents:renderAgents/);
 assert.doesNotMatch(app,/exams:renderExamCatalog/);
});
test('clicking a gallery card opens its matching image and caption, and close restores page flow',()=>{
 const {handlers,mock,api}=gallery();
 const fields={};
 const dialog={
  open:false,
  querySelector(id){return fields[id]??(fields[id]={textContent:'',href:'',hidden:false,alt:'',src:'',onerror:null})},
  showModal(){this.open=true},
  close(){this.open=false}
 };
 mock.document.querySelector=sel=>sel==='#miStoryDialog'?dialog:null;
 let classIsOpen=false;
 mock.document.body.classList={add(x){if(x==='mi-dialog-open')classIsOpen=true},remove(x){if(x==='mi-dialog-open')classIsOpen=false}};
 const trigger={dataset:{miStory:'rosa-parks'},isConnected:true,focus(){},closest(sel){return sel==='[data-mi-story]'?this:null}};
 handlers.click({target:trigger,preventDefault(){}});
 assert.equal(dialog.open,true);
 assert.equal(classIsOpen,true);
 assert.equal(fields['#miDialogTitle'].textContent,'Rosa Parks');
 assert.match(fields['#miDialogDescription'].textContent,/Detroit/);
 assert.match(fields['#miDialogImage'].src,/Rosa_Parks_1956/);
 assert.match(fields['#miDialogPhoto'].href,/commons\.wikimedia\.org/);
 assert.match(fields['#miDialogFacts'].href,/loc\.gov/);
 handlers.click({target:{closest(sel){return sel==='[data-mi-close]'?{}:null}}});
 assert.equal(dialog.open,false);
 handlers.close({target:{id:'miStoryDialog'}});
 assert.equal(classIsOpen,false);
});
