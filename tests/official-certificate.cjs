// MAIC Certificate of Completion artwork / dynamic QR regression checks.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
test('official blank-QR image is present and a valid nonempty WEBP file',()=>{
 const img=fs.readFileSync(path.join(base,'assets/maic-certificate-official-blank-qr.webp'));
 assert.ok(img.byteLength>100000,'Certificate artwork appears incomplete');
 assert.equal(img.subarray(0,4).toString('ascii'),'RIFF');
 assert.equal(img.subarray(8,12).toString('ascii'),'WEBP');
});
test('official issuer uses the exact approved asset and a record-specific token',()=>{
 const source=fs.readFileSync(path.join(base,'admin/certificate-renderer.js'),'utf8');
 new Function(source);
 assert.ok(source.includes('/assets/maic-certificate-official-blank-qr.webp'));
 assert.ok(source.includes("cert.verification_token"));
 assert.ok(source.includes("'/graduates/'"));
 assert.ok(source.includes('pdfQR(qr)'), 'QR should be crisp vector PDF output');
 assert.ok(source.includes('files.length!==3'), 'All three original signatures are required');
});
test('different certificate tokens produce different QR patterns',()=>{
 const code=fs.readFileSync(path.join(base,'vendor/qrcode.js'),'utf8');
 const make=new Function(code+';return qrcode;')();
 const url=t=>'https://www.maic-edu.org/graduates/'+t.repeat(64);
 const codes=['a','b'].map(ch=>{const qr=make(0,'M');qr.addData(url(ch));qr.make();return qr.createSvgTag({cellSize:3,margin:4})});
 assert.notEqual(codes[0],codes[1]);
 assert.ok(codes[0].startsWith('<svg'));
});
test('public and learner views gate validity on signed PDF presence',()=>{
 for(const file of ['functions/api/graduates.js','functions/api/learner/certificates.js','functions/graduates/[token].js']){
  assert.ok(fs.readFileSync(path.join(base,file),'utf8').includes('pdf_storage_key'),'Missing signed PDF gate: '+file);
 }
});

test('issued QR links use MAIC verified custom domain, not a preview hostname',()=>{for(const file of ['admin/certificate-renderer.js','admin/completions.js']){const src=fs.readFileSync(path.join(base,file),'utf8');assert.ok(src.includes("'https://www.maic-edu.org'"), 'Missing official domain: '+file)}});
