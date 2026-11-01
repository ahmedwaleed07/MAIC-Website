/* MAIC official Completion certificate renderer (approved artwork 2026-11-01).
 * QR is generated ONLY from an issued certificate's unique verification token.
 * Real signed copies require all three authorized signatures; unsigned drafts are watermarked.
 */
'use strict';
(function(){
 const W=1536,H=1024,PW=864,PH=576,FACTOR=PW/W;
 const asset='/assets/maic-certificate-official-blank-qr.webp';
 const encode=new TextEncoder();
 const bytes=s=>typeof s==='string'?encode.encode(s):s;
 const isToken=t=>typeof t==='string'&&/^[a-f0-9]{64}$/.test(t);
 function validate(c){
  if(!c||!isToken(c.verification_token)||typeof c.graduate_full_name!=='string'||!c.graduate_full_name.trim()||
     !c.course_title||!/^MAIC-[A-Za-z0-9-]{8,}$/.test(c.certificate_number||'')||c.certificate_type!=='completion')throw Error('Invalid or unsupported issued certificate');
 }
 async function loadImage(src){
  const img=new Image();img.decoding='async';img.src=src;await img.decode();
  if(!img.naturalWidth||!img.naturalHeight)throw Error('Certificate image unavailable');return img;
 }
 async function fileImage(file){
  if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>2000000)throw Error('Three authorized signature images (PNG/JPG/WEBP, max 2MB each) are required');
  const url=URL.createObjectURL(file);
  try{return await loadImage(url)}finally{URL.revokeObjectURL(url)}
 }
 function fitText(ctx,txt,x,y,maxWidth,size,min=18){
  txt=String(txt||'').trim();if(!txt)throw Error('Certificate information incomplete');
  const rtl=/[\u0590-\u08FF]/.test(txt);
  ctx.save();ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.direction=rtl?'rtl':'ltr';ctx.fillStyle='#07172a';
  do{ctx.font='600 '+size+'px Georgia, "Times New Roman", serif';if(ctx.measureText(txt).width<=maxWidth)break;size-=1}while(size>=min);
  if(ctx.measureText(txt).width>maxWidth)throw Error('Text is too long for the approved certificate artwork');
  ctx.fillText(txt,x,y,maxWidth);ctx.restore();
 }
 async function paint(c,files,draft){
  validate(c);
  const img=await loadImage(asset);
  if(img.naturalWidth!==W||img.naturalHeight!==H)throw Error('Unexpected official template dimensions');
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const ctx=cv.getContext('2d',{alpha:false});if(!ctx)throw Error('Canvas not available');
  ctx.drawImage(img,0,0,W,H);
  fitText(ctx,c.certificate_number,298,105,166,17,11);
  const date=String(c.issued_at||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Missing official issue date');
  fitText(ctx,date,289,145,170,17,12);
  fitText(ctx,c.graduate_full_name,768,626,670,42,22);
  fitText(ctx,c.course_title,768,720,673,32,20);
  if(!draft){
   if(!Array.isArray(files)||files.length!==3)throw Error('All three authorized signatures are required');
   const centers=[380,767,1140];
   for(let i=0;i<3;i++){
    const sig=await fileImage(files[i]);const width=Math.min(225,sig.naturalWidth*51/sig.naturalHeight),height=Math.min(51,sig.naturalHeight*(width/sig.naturalWidth));
    ctx.drawImage(sig,centers[i]-width/2,892-height,width,height);
   }
  }else{
   ctx.save();ctx.translate(768,860);ctx.rotate(-0.09);ctx.textAlign='center';ctx.fillStyle='rgba(105,27,27,.72)';
   ctx.font='bold 25px Arial,sans-serif';ctx.fillText('DRAFT - SIGNATURES PENDING',0,0);ctx.restore();
  }
  return cv;
 }
 function pdfQR(qr){
  const n=qr.getModuleCount(),q=4,dimension=108,cell=dimension/(n+2*q),px=1340,py=782;
  const out=['0 0 0 rg'];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr.isDark(y,x)){
   const rx=((px+(x+q)*cell)*FACTOR).toFixed(4);
   const ry=((H-(py+(y+q+1)*cell))*FACTOR).toFixed(4);
   const rw=(cell*FACTOR+.006).toFixed(4);
   out.push(rx+' '+ry+' '+rw+' '+rw+' re f');
  }
  return out.join('\n');
 }
 function makePdf(jpeg,qr,url){
  const parts=[];let length=0,offset=[];const add=s=>{const b=bytes(s);parts.push(b);length+=b.length};
  const start=n=>{offset[n]=length;add(n+' 0 obj\n')},end=()=>add('\nendobj\n');
  add('%PDF-1.4\n% MAIC official certificate\n');
  start(1);add('<< /Type /Catalog /Pages 2 0 R >>');end();
  start(2);add('<< /Type /Pages /Count 1 /Kids [3 0 R] >>');end();
  start(3);add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+PW+' '+PH+'] /Resources << /XObject << /Im 4 0 R >> >> /Contents 5 0 R /Annots [6 0 R] >>');end();
  start(4);add('<< /Type /XObject /Subtype /Image /Width '+W+' /Height '+H+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n');
  add(jpeg);add('\nendstream');end();
  const stream=bytes('q '+PW+' 0 0 '+PH+' 0 0 cm /Im Do Q\n'+pdfQR(qr)+'\n');
  start(5);add('<< /Length '+stream.length+' >>\nstream\n');add(stream);add('endstream');end();
  const rect=[1330*FACTOR,(H-899)*FACTOR,1455*FACTOR,(H-772)*FACTOR].map(x=>x.toFixed(2)).join(' ');
  const pdfUrl=url.replace(/[\\()]/g,'\\$&');
  start(6);add('<< /Type /Annot /Subtype /Link /Rect ['+rect+'] /Border [0 0 0] /A << /S /URI /URI ('+pdfUrl+') >> >>');end();
  const xref=length;add('xref\n0 7\n0000000000 65535 f \n');
  for(let n=1;n<=6;n++)add(String(offset[n]).padStart(10,'0')+' 00000 n \n');
  add('trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n');
  return new Blob(parts,{type:'application/pdf'});
 }
 async function render(cert,files=[],draft=true){
  if(typeof qrcode!=='function')throw Error('The local QR generator is unavailable');
  const url=new URL('/graduates/'+encodeURIComponent(cert.verification_token),'https://www.maic-edu.org').href;
  const qr=qrcode(0,'M');qr.addData(url);qr.make();
  const cv=await paint(cert,files,draft);
  const raw=atob(cv.toDataURL('image/jpeg',.94).split(',')[1]);const jpg=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)jpg[i]=raw.charCodeAt(i);
  const result=makePdf(jpg,qr,url);
  if(result.size>2400000)throw Error('Certificate PDF is larger than the supported upload limit');
  return {pdf:result,verificationUrl:url,template:asset,issuerState:draft?'draft':'signed'};
 }
 function download(blob,filename){
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(u),3000);
 }
 window.MAICCertificateRenderer=Object.freeze({render,download,asset});
})();
