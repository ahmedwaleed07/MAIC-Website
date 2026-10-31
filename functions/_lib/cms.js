/* MAIC CMS server-only helpers. Never import this module in browser bundles. */
export const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export const json=(data,status=200,extras={})=>new Response(JSON.stringify(data),{status,headers:{...headers,...extras}});
export function validOrigin(request){
 const origin=request.headers.get('Origin');
 return !!origin&&origin===new URL(request.url).origin;
}
export function hasDB(env){return !!env.MAIC_DB}
const fromHex=s=>new Uint8Array((s.match(/.{2}/g)||[]).map(x=>parseInt(x,16)));
const toHex=u=>[...new Uint8Array(u)].map(b=>b.toString(16).padStart(2,'0')).join('');
const enc=new TextEncoder();
function equalBytes(a,b){if(a.length!==b.length)return false;let dif=0;for(let i=0;i<a.length;i++)dif|=a[i]^b[i];return dif===0;}
export async function verifyPassword(password,env){
 if(!env.MAIC_PASSWORD_HASH||!env.MAIC_PASSWORD_SALT)return false;
 const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
 const derived=await crypto.subtle.deriveBits({name:'PBKDF2',salt:fromHex(env.MAIC_PASSWORD_SALT),iterations:180000,hash:'SHA-256'},key,256);
 return equalBytes(new Uint8Array(derived),fromHex(env.MAIC_PASSWORD_HASH));
}
async function sign(data,secret){
 const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(data)));
}
function base64url(bytes){
 let s='';for(const byte of bytes)s+=String.fromCharCode(byte);
 return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function unbase64url(s){try{
 const text=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));
 return Uint8Array.from(text,c=>c.charCodeAt(0));
 }catch{return null}}
export async function createSession(env){
 const now=Math.floor(Date.now()/1000);
 const payload=base64url(enc.encode(JSON.stringify({sub:'maic-owner',iat:now,exp:now+8*3600,nonce:crypto.randomUUID()})));
 const mac=base64url(await sign(payload,env.MAIC_SESSION_SECRET));
 return payload+'.'+mac;
}
export async function isAdmin(request,env){
 if(!env.MAIC_SESSION_SECRET)return false;
 const cookie=request.headers.get('Cookie')||'';
 const tok=(cookie.match(/(?:^|;\s*)__Host-maic_admin=([^;]+)/)||[])[1]||'';
 const [body,mac,extra]=tok.split('.');
 if(!body||!mac||extra||body.length>1200)return false;
 const provided=unbase64url(mac),expected=await sign(body,env.MAIC_SESSION_SECRET);
 if(!provided||!equalBytes(provided,expected))return false;
 try{const p=JSON.parse(new TextDecoder().decode(unbase64url(body)));
 return p.sub==='maic-owner'&&p.exp>Math.floor(Date.now()/1000)&&p.iat<=Math.floor(Date.now()/1000)+30;
 }catch{return false}
}
export const sessionCookie=token=>'__Host-maic_admin='+token+'; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800';
export const clearCookie='__Host-maic_admin=; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=0';
export function validateDocument(src){
 if(!src||typeof src!=='object'||!Array.isArray(src.courses)||!Array.isArray(src.agents)||!Array.isArray(src.nav))throw Error('Invalid document');
 if(src.courses.length>500||src.agents.length>150||src.nav.length>120)throw Error('Catalog size limit');
 const str=(s,max)=>typeof s==='string'?s.trim().slice(0,max):'';
 const ids=new Set();
 const modes=new Set(['self-paced','group','one-on-one']);
 const courses=src.courses.map(c=>{
  if(!c||!/^[-a-z0-9]{2,80}$/.test(c.id||'')||ids.has(c.id))throw Error('Invalid or duplicate course ID');
  ids.add(c.id);
  const mode=[...new Set((Array.isArray(c.mode)?c.mode:[]).filter(m=>modes.has(m)))];
  const status=c.status;
  if(!str(c.ar,130)||!str(c.en,130)||!mode.length||!['preparing','published','archived'].includes(status))throw Error('Invalid course');
  const level=str(c.level,30)||'all';if(!['all','beginner','intermediate','advanced'].includes(level))throw Error('Invalid course level');
  const courseLanguage=str(c.courseLanguage,30)||'ar';if(!['ar','en','bilingual','other'].includes(courseLanguage))throw Error('Invalid course language');
  const currency=str(c.feeCurrency,10)||'USD';if(!['USD','IQD','EUR','GBP','CAD','AED','SAR'].includes(currency))throw Error('Invalid fee currency');
  const feeAmount=str(c.feeAmount,20);
  if(feeAmount&&(!/^(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?$/.test(feeAmount)||Number(feeAmount)>10000000))throw Error('Invalid course fee');
  return {id:c.id,ar:str(c.ar,130),en:str(c.en,130),areaAr:str(c.areaAr,100),areaEn:str(c.areaEn,100),
   descriptionAr:str(c.descriptionAr,5000),descriptionEn:str(c.descriptionEn,5000),
   objectivesAr:str(c.objectivesAr,5000),objectivesEn:str(c.objectivesEn,5000),
   syllabusAr:str(c.syllabusAr,5000),syllabusEn:str(c.syllabusEn,5000),
   requirementsAr:str(c.requirementsAr,2000),requirementsEn:str(c.requirementsEn,2000),
   instructor:str(c.instructor,180),duration:str(c.duration,100),level,courseLanguage,
   feeAmount,feeCurrency:currency,mode,status};
 });
 ids.clear();
 const activeCountries=new Set();
 const agents=src.agents.map(a=>{
  if(!a||!/^[-a-z0-9]{2,80}$/.test(a.id||'')||ids.has(a.id)||!/^[A-Z]{2}$/.test(a.country||''))throw Error('Invalid agent identifier');
  ids.add(a.id);
  const website=str(a.website,300);
  let url;
  try{url=new URL(website)}catch{throw Error('Invalid agent URL')}
  if(url.protocol!=='https:'||url.username||url.password||!url.hostname.includes('.'))throw Error('Untrusted agent URL');
  const email=str(a.email,180);
  if(!str(a.name,150)||!/^.+@[^@\s]+\.[^@\s]+$/.test(email)||!str(a.phone,45))throw Error('Agent contact incomplete');
  if(a.active===true){if(activeCountries.has(a.country))throw Error('Duplicate active country agent');activeCountries.add(a.country)}
  const logo=str(a.logo,350);
  if(logo&&!(logo.startsWith('./assets/agents/')||logo.startsWith('/assets/agents/')||/^https:\/\/[^ "'<>]+$/i.test(logo)))throw Error('Unsafe agent logo');
  return {id:a.id,name:str(a.name,150),country:a.country,countryAr:str(a.countryAr,90),countryEn:str(a.countryEn,90),stateAr:str(a.stateAr,90)||null,stateEn:str(a.stateEn,90)||null,cityAr:str(a.cityAr,90)||null,cityEn:str(a.cityEn,90)||null,website:url.toString(),email,phone:str(a.phone,45),logo,active:a.active===true};
 });
 const unity=agents.find(a=>a.id==='unity-bridge');
 if(!unity||unity.country!=='US'||!unity.active||!agents.some(a=>a.id==='unity-bridge'))throw Error('Unity Bridge US fallback must remain active');
 ids.clear();
 const nav=src.nav.map(n=>{
 if(!n||!(/^(?:custom:)?[-a-z0-9]{2,80}$/.test(n.id||''))||ids.has(n.id))throw Error('Invalid menu item ID');
 ids.add(n.id);
 if(!str(n.ar,100)||!str(n.en,100))throw Error('Menu title required');
 return {id:n.id,ar:str(n.ar,100),en:str(n.en,100),visible:n.visible!==false,contentAr:str(n.contentAr,5000),contentEn:str(n.contentEn,5000)};
 });
 const required=['home','courses','about','agents','support','contact','languages','michigan'];
 if(required.some(id=>!ids.has(id)))throw Error('Missing required menu');
 const bookCategories=new Set(['business','projects','organizations','hr','cybersecurity','ai','cloud-computing','advanced-programming','cryptography','telecommunications']);
 const https=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}};
 const rawBooks=src.books??[],rawMessages=src.messages??[];
 if(!Array.isArray(rawBooks)||!Array.isArray(rawMessages)||rawBooks.length>300||rawMessages.length>100)throw Error('Catalog library size limit');
 const extras=new Set();
 const books=rawBooks.map(b=>{
  if(!b||!/^[-a-z0-9]{2,80}$/.test(b.id||'')||extras.has(b.id)||!bookCategories.has(b.category)||!['free','paid'].includes(b.access)||!str(b.titleAr,180)||!str(b.titleEn,180))throw Error('Invalid book');extras.add(b.id);
  const price=String(b.price??'');if(b.access==='paid'&&(!/^(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?$/.test(price)||Number(price)<=0))throw Error('Invalid book price');
  if(!['USD','IQD','EUR','GBP','CAD','AED','SAR'].includes(b.currency||'USD'))throw Error('Invalid book currency');
  const freeUrl=b.access==='free'?str(b.freeUrl,1000):'';if(b.access==='free'&&!https(freeUrl))throw Error('Invalid free book URL');
  const coverUrl=str(b.coverUrl,1000),sourceUrl=str(b.sourceUrl,1000),licenseUrl=str(b.licenseUrl,1000);
  if([coverUrl,sourceUrl,licenseUrl].some(u=>u&&!https(u)))throw Error('Invalid book metadata URL');
  const year=str(b.year,4);if(year&&!/^(?:19|20)\d{2}$/.test(year))throw Error('Invalid publication year');
  return {id:b.id,category:b.category,titleAr:str(b.titleAr,180),titleEn:str(b.titleEn,180),descriptionAr:str(b.descriptionAr,3000),descriptionEn:str(b.descriptionEn,3000),author:str(b.author,500),year,publisher:str(b.publisher,250),coverUrl,sourceUrl,licenseUrl,language:str(b.language,20),authorBioAr:str(b.authorBioAr,1000),authorBioEn:str(b.authorBioEn,1000),access:b.access,price:b.access==='free'?'0':price,currency:b.currency||'USD',freeUrl,active:b.active===true};
 });
 extras.clear();
 const messages=rawMessages.map(m=>{
  if(!m||!/^[-a-z0-9]{2,80}$/.test(m.id||'')||extras.has(m.id)||!str(m.titleAr,180)||!str(m.titleEn,180)||!str(m.bodyAr,3000)||!str(m.bodyEn,3000))throw Error('Invalid message');extras.add(m.id);
  if(!Array.isArray(m.countries)||m.countries.length>249||m.countries.some(c=>!/^[A-Z]{2}$/.test(c)))throw Error('Invalid message country');
  const startsAt=str(m.startsAt,40),endsAt=str(m.endsAt,40);if((startsAt&&!Number.isFinite(Date.parse(startsAt)))||(endsAt&&!Number.isFinite(Date.parse(endsAt)))||(startsAt&&endsAt&&Date.parse(endsAt)<=Date.parse(startsAt)))throw Error('Invalid message dates');
  return {id:m.id,titleAr:str(m.titleAr,180),titleEn:str(m.titleEn,180),bodyAr:str(m.bodyAr,3000),bodyEn:str(m.bodyEn,3000),countries:[...new Set(m.countries)],active:m.active===true,startsAt,endsAt};
 });
 return {version:1,courses,agents,nav,books,messages};
}
export async function rateLimit(db,request){
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 // Hash the client IP so the database does not store raw identifying network addresses.
 const digest=toHex(await crypto.subtle.digest('SHA-256',enc.encode(ip)));
 const key=digest.slice(0,32),now=Math.floor(Date.now()/1000);
 const row=await db.prepare('SELECT attempts, window_start FROM cms_login_attempts WHERE subject=?').bind(key).first();
 const remaining=row&&now-row.window_start<900?row.attempts:0;
 if(remaining>=6)return true;
 await db.prepare('INSERT INTO cms_login_attempts(subject,attempts,window_start) VALUES(?,?,?) ON CONFLICT(subject) DO UPDATE SET attempts=excluded.attempts,window_start=excluded.window_start').bind(key,remaining+1,remaining?row.window_start:now).run();
 return false;
}
