// Synthetic public QR-verification checks; never accesses a real student's record.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'functions/graduates/[token].js'),'utf8')
 .replace(/^import .*?;\s*$/gm,'').replace(/export async function/g,'async function');
const json=(body,status=200)=>new Response(JSON.stringify(body),{status});
const verify=new Function('json',src+'\nreturn onRequestGet;')(json);
const token='a'.repeat(64);
function fixture(overrides={}){
 const row={certificate_number:'MAIC-2026-SYNTHETIC',graduate_full_name:'Synthetic Test Learner',
  course_title:'Synthetic Verification Test',certificate_type:'completion',graduate_country:'US',
  agent_name:'Test Agent',issued_at:'2026-11-26T00:00:00Z',status:'issued',public_consent:1,pdf_ready:1,...overrides};
 let queryCount=0;
 const env={MAIC_DB:{prepare(){return {bind(){return {async first(){queryCount++;return row;}}}}}}};
 return {env,queryCount:()=>queryCount};
}
test('invalid certificate verification tokens are rejected without database access',async()=>{
 const fx=fixture();const r=await verify({params:{token:'bad'},env:fx.env});
 assert.equal(r.status,404);assert.equal(fx.queryCount(),0);
});
test('signed issued consented certificate displays valid status and agreed facts',async()=>{
 const fx=fixture();const r=await verify({params:{token},env:fx.env});
 assert.equal(r.status,200);const html=await r.text();
 assert.match(html,/Certificate Verification/);assert.match(html,/MAIC-2026-SYNTHETIC/);
 assert.match(html,/Synthetic Test Learner/);assert.match(html,/>Valid</);
 assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);
});
test('no publication consent keeps certificate identifier and graduate name private',async()=>{
 const fx=fixture({public_consent:0});const r=await verify({params:{token},env:fx.env});
 assert.equal(r.status,200);const html=await r.text();
 assert.doesNotMatch(html,/MAIC-2026-SYNTHETIC/);
 assert.doesNotMatch(html,/Synthetic Test Learner/);
 assert.match(html,/has not consented to public disclosure/);
});
test('unsigned and revoked certificates never display Valid status',async()=>{
 const fx1=fixture({pdf_ready:0}),fx2=fixture({status:'revoked'});
 const unsigned=await (await verify({params:{token},env:fx1.env})).text();
 const revoked=await (await verify({params:{token},env:fx2.env})).text();
 assert.match(unsigned,/Pending final signed PDF/);assert.doesNotMatch(unsigned,/>Valid</);
 assert.match(revoked,/>Revoked</);assert.doesNotMatch(revoked,/>Valid</);
});
test('two different certificate verification tokens yield different QR patterns',()=>{
 const source=fs.readFileSync(path.join(root,'vendor/qrcode.js'),'utf8');
 const generator=new Function(source+';return qrcode;')();
 const get=t=>{const qr=generator(0,'M');qr.addData('https://www.maic-edu.org/graduates/'+t);qr.make();return qr.createSvgTag({cellSize:3,margin:4});};
 assert.notEqual(get('a'.repeat(64)),get('b'.repeat(64)));
});
