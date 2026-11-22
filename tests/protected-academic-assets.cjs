const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

test('Cloudflare Pages serves no public academic review sources or candidate exam keys',async()=>{
 const {onRequest}=await import(pathToFileURL(path.resolve(__dirname,'../functions/data/_middleware.js')).href);
 const visit=async suffix=>onRequest({
  request:new Request('https://maic-edu.org'+suffix),
  next:async()=>new Response('public allowed',{status:200})
 });
 for(const target of [
  '/data/exam-drafts/introduction-to-game-design-100mcq.json',
  '/data/course-manuscripts/introduction-to-game-design.md',
  '/data/exam-drafts/',
  '/data/exam-drafts%2Fsample.json'
 ]){
  const response=await visit(target);
  assert.equal(response.status,404,target);
  assert.match(response.headers.get('Cache-Control'),/no-store/);
 }
 assert.equal((await visit('/data/public-catalog.json')).status,200);
 assert.equal((await visit('/data/exam-drafts-catalog.json')).status,200);
});
