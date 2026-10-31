import {json,validOrigin,isAdmin} from './cms.js';
export {json,validOrigin,isAdmin};
const enc=new TextEncoder();
export const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
export const hash=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
export const randomHex=n=>hex(crypto.getRandomValues(new Uint8Array(n)));
export async function derive(password,salt,pepper){
 if(!pepper)throw Error('Password protection unavailable');
 const pepperKey=await crypto.subtle.importKey('raw',enc.encode(pepper),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const protectedPassword=await crypto.subtle.sign('HMAC',pepperKey,enc.encode('MAIC learner password v1:'+password));
 const key=await crypto.subtle.importKey('raw',protectedPassword,'PBKDF2',false,['deriveBits']);
 return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:Uint8Array.from(salt.match(/../g),x=>parseInt(x,16)),iterations:100000,hash:'SHA-256'},key,256));
}
export function same(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}
export const cookie=t=>'__Host-maic_learner='+t+'; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800';
export const clearCookie='__Host-maic_learner=; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=0';
export async function session(request,env){
 const token=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)__Host-maic_learner=([a-f0-9]{64})(?:;|$)/)?.[1];
 if(!token)return null;
 return env.MAIC_DB.prepare('SELECT s.id,s.email,s.first_name,s.last_name,s.country FROM learning_sessions t JOIN learning_students s ON s.id=t.student_id WHERE t.token_hash=? AND t.expires_at>? AND s.enabled=1').bind(await hash(token),Math.floor(Date.now()/1000)).first();
}
export async function createSession(db,id){const token=randomHex(32);await db.batch([db.prepare('DELETE FROM learning_sessions WHERE student_id=? AND expires_at<=?').bind(id,Math.floor(Date.now()/1000)),db.prepare('INSERT INTO learning_sessions(token_hash,student_id,expires_at) VALUES(?,?,?)').bind(await hash(token),id,Math.floor(Date.now()/1000)+28800)]);return token;}
export async function limited(request,db,kind,limit){const now=Math.floor(Date.now()/1000),key=await hash(kind+':'+(request.headers.get('CF-Connecting-IP')||'unknown'));const row=await db.prepare('INSERT INTO learning_rate_limits(subject,attempts,window_start) VALUES(?,1,?) ON CONFLICT(subject) DO UPDATE SET attempts=CASE WHEN window_start<=? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<=? THEN excluded.window_start ELSE window_start END RETURNING attempts').bind(key,now,now-900,now-900).first();return row.attempts>limit;}
export async function body(request){
 if(Number(request.headers.get('Content-Length')||0)>12000)throw Error('Invalid body');
 const reader=request.body?.getReader();if(!reader)throw Error('Invalid body');const chunks=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();throw Error('Invalid body');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.byteLength;}return JSON.parse(new TextDecoder().decode(bytes));
}
export function profile(d){
 const str=(k,max)=>typeof d[k]==='string'?d[k].trim().slice(0,max):'';
 const firstName=str('firstName',80),middleName=str('middleName',80),lastName=str('lastName',80),email=str('email',254).toLowerCase(),dob=str('dob',10),country=str('country',2).toUpperCase(),phone=str('phone',40),education=str('education',160),password=d.password;
 if(!firstName||!lastName||!/^\S+@\S+\.\S+$/.test(email)||!/^\d{4}-\d{2}-\d{2}$/.test(dob)||!/^\+?[\d ()-]{7,40}$/.test(phone)||!education||typeof password!=='string'||password.length<12||password.length>200)throw Error('Invalid profile');
 const date=new Date(dob+'T00:00:00Z');if(isNaN(date)||date.toISOString().slice(0,10)!==dob||date>=new Date()||date.getUTCFullYear()<1900)throw Error('Invalid birth date');
 try{if(!new Intl.DisplayNames(['en'],{type:'region',fallback:'none'}).of(country)||!/^[A-Z]{2}$/.test(country))throw Error();}catch{throw Error('Invalid country');}
 return {firstName,middleName,lastName,email,dob,country,phone,education,password};
}
export async function catalog(db){const row=await db.prepare("SELECT content FROM cms_documents WHERE id='published'").first();return JSON.parse(row.content);}
export async function allowed(db,studentId,courseId){const row=await db.prepare("SELECT 1 AS yes FROM learning_enrollments WHERE student_id=? AND course_id=? AND status='active'").bind(studentId,courseId).first();return !!row;}
export function rangeFor(header,size){if(!header)return null;const m=/^bytes=(\d*)-(\d*)$/.exec(header);if(!m||(!m[1]&&!m[2]))return false;let start,end;if(!m[1]){const suffix=Number(m[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return false;start=Math.max(0,size-suffix);end=size-1;}else{start=Number(m[1]);end=m[2]?Number(m[2]):size-1;}if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||start>end)return false;return {start,end:Math.min(end,size-1)};}
