import {Buffer} from 'node:buffer';
import {json,isAdmin,validOrigin} from '../../_lib/cms.js';
import {catalog} from '../../_lib/learning.js';

const MAX=1250000,CHUNK=32000;
export async function onRequestGet({request,env}){
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 try{
  const materials=(await env.MAIC_DB.prepare("SELECT course_id,title,language,pages,bytes,sha256,version,updated_at FROM learning_materials ORDER BY title").all()).results;
  const revisions=(await env.MAIC_DB.prepare("SELECT course_id,previous_sha256,new_sha256,reviewed_by,created_at FROM learning_material_revisions ORDER BY created_at DESC LIMIT 50").all()).results;
  return json({materials,revisions,approvedFont:'Tinos Regular / Tinos Bold, 12 pt',pageCount:12});
 }catch{return json({error:'unavailable'},503)}
}
export async function onRequestPost({request,env}){
 if(!validOrigin(request))return json({error:'origin'},403);
 if(!await isAdmin(request,env))return json({error:'unauthorized'},401);
 if((request.headers.get('Content-Type')||'').split(';')[0].trim()!=='application/pdf')return json({error:'pdf_required'},415);
 const url=new URL(request.url),course=url.searchParams.get('course')||'';
 if(!/^[-a-z0-9]{2,80}$/.test(course))return json({error:'invalid_course'},400);
 if(request.headers.get('X-MAIC-Reviewed')!=='yes'||request.headers.get('X-MAIC-Format')!=='Tinos12-BW')return json({error:'academic_review_required'},409);
 let reviewer='';try{reviewer=decodeURIComponent(request.headers.get('X-MAIC-Reviewer')||'').trim()}catch{return json({error:'reviewer_required'},400)}
 if(reviewer.length<3||reviewer.length>150||!(/^[\p{L}\p{M} .'-]+$/u).test(reviewer))return json({error:'reviewer_required'},400);
 const sizeHeader=Number(request.headers.get('Content-Length')||'0');
 if(sizeHeader>MAX)return json({error:'pdf_too_large'},413);
 try{
  const db=env.MAIC_DB,doc=await catalog(db),courseRecord=doc.courses.find(x=>x.id===course&&x.status!=='archived'&&x.mode.includes('self-paced'));
  if(!courseRecord)return json({error:'course_not_available'},404);
  const lock=await db.prepare("SELECT (SELECT COUNT(*) FROM learning_enrollments WHERE course_id=? AND status='active') AS active_enrollments,(SELECT COUNT(*) FROM learning_exam_active WHERE course_id=?) AS active_banks,(SELECT COUNT(*) FROM learning_exam_attempts WHERE course_id=? AND state='in_progress') AS open_attempts").bind(course,course,course).first();
  if(lock?.active_enrollments||lock?.active_banks||lock?.open_attempts)return json({error:'course_material_locked_due_to_active_learning'},409);
  const reader=request.body?.getReader();if(!reader)return json({error:'missing_pdf'},400);
  const parts=[];let bytes=0;
  for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>MAX){await reader.cancel();return json({error:'pdf_too_large'},413)}parts.push(value)}
  if(bytes<1000)return json({error:'invalid_pdf'},400);
  const content=new Uint8Array(bytes);let pos=0;for(const part of parts){content.set(part,pos);pos+=part.length}
  const ascii=new TextDecoder('latin1').decode(content);
  if(!ascii.startsWith('%PDF-')||!ascii.slice(-2048).includes('%%EOF'))return json({error:'invalid_pdf'},400);
  // Our 12-page MAIC generator writes an explicit page-tree count; verify it server-side.
  if(!/\/Type\s*\/Pages\b.{0,180}\/Count\s+12\b/s.test(ascii))return json({error:'expected_12_pages'},422);
  if(!ascii.includes('Tinos'))return json({error:'tinos_font_not_embedded'},422);
  const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',content)),b=>b.toString(16).padStart(2,'0')).join('');
  const existing=await db.prepare('SELECT course_id,sha256,version FROM learning_materials WHERE course_id=?').bind(course).first();
  if(existing?.sha256===sha256)return json({unchanged:true,courseId:course,sha256});
  const version=crypto.randomUUID(),now=new Date().toISOString(),count=Math.ceil(bytes/CHUNK);
  const statements=[db.prepare('DELETE FROM learning_material_chunks WHERE course_id=?').bind(course)];
  for(let n=0;n<count;n++){
    statements.push(db.prepare('INSERT INTO learning_material_chunks(course_id,version,part,payload) VALUES(?,?,?,?)').bind(course,version,n,Buffer.from(content.subarray(n*CHUNK,Math.min(bytes,(n+1)*CHUNK))).toString('base64')));
  }
  statements.push(db.prepare('INSERT INTO learning_materials(course_id,version,title,language,pages,bytes,sha256,chunk_count,updated_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(course_id) DO UPDATE SET version=excluded.version,title=excluded.title,language=excluded.language,pages=excluded.pages,bytes=excluded.bytes,sha256=excluded.sha256,chunk_count=excluded.chunk_count,updated_at=excluded.updated_at').bind(course,version,courseRecord.en,'English',12,bytes,sha256,count,now));
  statements.push(db.prepare('INSERT INTO learning_material_revisions(id,course_id,previous_sha256,new_sha256,previous_version,new_version,pages,bytes,reviewed_by,content_reviewed,black_white_tinos12_verified,created_at) VALUES(?,?,?,?,?,?,?,?,?,1,1,?)').bind(crypto.randomUUID(),course,existing?.sha256||null,sha256,existing?.version||null,version,12,bytes,reviewer,now));
  await db.batch(statements);
  return json({updated:true,courseId:course,sha256,pages:12,bytes});
 }catch{return json({error:'unavailable'},503)}
}