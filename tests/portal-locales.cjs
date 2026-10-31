const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={'#language':{innerHTML:'',value:'',addEventListener(){}},'#portal':{innerHTML:''}};
const c={console,document:{documentElement:{},querySelector:s=>nodes[s],addEventListener(){}},localStorage:{getItem:()=> 'ar',setItem(){}},location:{href:'https://maic.test/learner/'},URL,Intl,fetch(){throw Error('Unexpected fetch')}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
vm.runInContext(fs.readFileSync('data/languages.js','utf8'),c);vm.runInContext(fs.readFileSync('data/countries.js','utf8'),c);vm.runInContext(fs.readFileSync('learner/translations.js','utf8'),c);
let src=fs.readFileSync('learner/portal.js','utf8');src=src.slice(0,src.indexOf('(async()=>{render();'));vm.runInContext(src,c);
const locales=vm.runInContext('languageOptions.map(x=>x[0])',c);assert.equal(locales.length,29);
for(const locale of locales){vm.runInContext(`lang=${JSON.stringify(locale)};mode='login';render()`,c);const h=nodes['#portal'].innerHTML;assert.equal((h.match(/<form/g)||[]).length,1);const label=vm.runInContext("t('login')",c);assert.equal(h.split('>'+label+'</button>').length-1,1,locale);assert(h.includes('data-mode="register"'));assert.equal(vm.runInContext('Object.keys(words[lang]).sort().join()===Object.keys(words["en-US"]).sort().join()',c),true,locale);vm.runInContext("mode='register';render()",c);assert(nodes['#portal'].innerHTML.includes('data-mode="login"'));}
assert.equal((nodes['#language'].innerHTML.match(/<option/g)||[]).length,29);
console.log('PASS: 29 complete portal locales, shared language registry, one sign-in submit, separate account switch, signup rendering');
