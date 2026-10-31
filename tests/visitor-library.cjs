const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base={courses:[],agents:[{id:'unity-bridge',country:'US',name:'Unity Bridge',website:'https://example.com',email:'info@example.com',phone:'+1',active:true}],nav:['home','courses','about','agents','support','contact','languages','michigan'].map(id=>({id,ar:id,en:id}))};
const ctx={URL,TextEncoder,Uint8Array,console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('functions/_lib/cms.js','utf8').replaceAll('export ',''),ctx);
ctx.fixture=base;let clean=vm.runInContext('validateDocument(fixture)',ctx);assert.equal(clean.books.length,0);assert.equal(clean.messages.length,0);
const free={id:'free-book',category:'business',titleAr:'كتاب',titleEn:'Book',access:'free',freeUrl:'https://example.com/book.pdf',active:true};
const paid={...free,id:'paid-book',access:'paid',price:'10',currency:'USD',freeUrl:'https://example.com/paid-private.pdf'};
ctx.fixture={...base,books:[free,paid],messages:[{id:'iraq-message',titleAr:'عرض',titleEn:'Offer',bodyAr:'تفاصيل',bodyEn:'Details',countries:['IQ'],active:true}]};clean=vm.runInContext('validateDocument(fixture)',ctx);assert.equal(clean.books[1].freeUrl,'');assert.equal(clean.books[0].freeUrl,free.freeUrl);
for(const bad of [{...free,freeUrl:'javascript:alert(1)'},{...paid,price:'-1'},{...paid,category:'other'}]){ctx.fixture={...base,books:[bad]};assert.throws(()=>vm.runInContext('validateDocument(fixture)',ctx));}
const ui={console,URL,Intl,localStorage:{getItem:()=>null,setItem:()=>{}},document:{addEventListener:()=>{}},window:{MAIC_COUNTRIES:[{code:'IQ',name:'Iraq'},{code:'US',name:'United States'}]},CustomEvent:function(){}};vm.createContext(ui);
vm.runInContext(fs.readFileSync('library.js','utf8')+'\n'+fs.readFileSync('app.js','utf8').replace(/bootMAIC\(\);\s*$/,''),ui);
ui.en=JSON.parse(fs.readFileSync('i18n/en-US.json'));vm.runInContext('englishPack=en;languagePack=en;state.lang="en-US";state.page="library:business";maicAssignAgent=()=>null;',ui);
const now=Date.now();ui.now=now;
for(const [message,country,expected] of [[{active:true,countries:['IQ']},'IQ',true],[{active:true,countries:['IQ']},'US',false],[{active:true,countries:[]},'US',true],[{active:false,countries:[]},'IQ',false],[{active:true,countries:[],startsAt:new Date(now+10000).toISOString()},'IQ',false],[{active:true,countries:[],endsAt:new Date(now-10000).toISOString()},'IQ',false]]){ui.message=message;ui.country=country;assert.equal(vm.runInContext('maicCountryMessageVisible(message,country,now)',ui),expected)}
ui.fixtureBooks=[free,clean.books[1]];vm.runInContext('maicLibraryBooks=fixtureBooks;',ui);const html=vm.runInContext('renderLibrary()',ui);assert(html.includes('Read book'));assert(html.includes('Ask about this book'));assert(!html.includes('paid-private.pdf'));
vm.runInContext('maicBookFilter="free";',ui);assert(!vm.runInContext('renderLibrary()',ui).includes('Ask about this book'));
for(const file of fs.readdirSync('i18n')){const pack=JSON.parse(fs.readFileSync('i18n/'+file));for(const key of ['library','libraryIntro','libraryBusiness','libraryOrganizations','exploreBooks','free','paid','allBooks','noBooks','readBook','requestBook','backLibrary','preferenceHint'])assert(pack.ui[key],file+':'+key)}
console.log('PASS: legacy catalogs, free/paid validation, paid-link privacy, country targeting and schedule, library filters, 29 locale packs');
const catalog=JSON.parse(fs.readFileSync('data/library-books.json'));assert.equal(catalog.length,48);
for(const category of ['business','projects','organizations','hr'])assert.equal(catalog.filter(b=>b.category===category).length,12);
ctx.fixture={...base,books:catalog};const validated=vm.runInContext('validateDocument(fixture)',ctx);assert.equal(validated.books.length,48);assert(validated.books.every(b=>b.sourceUrl&&b.author&&b.authorBioAr));
ui.fixtureBooks=catalog;vm.runInContext('maicLibraryBooks=fixtureBooks;maicBookFilter="all";',ui);const cards=vm.runInContext('renderLibrary()',ui);assert.equal((cards.match(/<article class="content-panel maic-book-card">/g)||[]).length,12);assert(cards.includes('maic-leather-book'));assert(cards.includes('Publication year'));assert(cards.includes('Publisher'));
ctx.fixture={...base,books:[{...free,coverUrl:'javascript:alert(1)'}]};assert.throws(()=>vm.runInContext('validateDocument(fixture)',ctx));
console.log('PASS: 48 books, 12 per specialty, metadata persistence, card rendering and unsafe cover rejection');
