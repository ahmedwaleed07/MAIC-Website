#!/usr/bin/env node
/* MAIC private bank quality gate. No keys are sent to the browser or network. */
'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');

function normalize(value){return String(value).normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();}
function trigrams(value){const s=normalize(value),grams=new Set();for(let i=0;i<=s.length-3;i++)grams.add(s.slice(i,i+3));return grams;}
function score(a,b){const x=trigrams(a),y=trigrams(b);if(!x.size&&!y.size)return 1;let intersection=0;for(const v of x)if(y.has(v))intersection++;return 2*intersection/(x.size+y.size);}
function audit(bank,sourcePdf){
 const errors=[],warnings=[],summary={course:bank?.courseId||null,questions:0,sourceMatch:null,pages:[],answerCount:{},nearSimilarStems:[],repeatedOptionPairs:[]};
 if(!bank||bank.format!=='maic-mcq-v1'||!Array.isArray(bank.questions)){errors.push('A MAIC bank must have format=maic-mcq-v1 and a questions array');return {errors,warnings,summary}}
 const q=bank.questions;summary.questions=q.length;
 if(q.length!==100)errors.push('Exactly 100 questions are required');
 if(typeof bank.sourceSha256!=='string'||!/^[a-f0-9]{64}$/i.test(bank.sourceSha256))errors.push('A valid sourceSha256 is required');
 if(sourcePdf){
  const pdf=fs.readFileSync(sourcePdf);
  if(pdf.toString('latin1',0,5)!=='%PDF-')errors.push('The source file must be a real PDF');
  const hash=crypto.createHash('sha256').update(pdf).digest('hex');
  summary.sourceMatch=bank.sourceSha256?.toLowerCase()===hash;
  if(!summary.sourceMatch)errors.push('PDF SHA-256 does not match the bank');
 }
 const pages=new Set(), seen=new Map();
 const safe=[];
 for(let i=0;i<q.length;i++){
  const item=q[i],num=i+1;
  if(!item||typeof item!=='object'){errors.push('Question '+num+' missing');continue;}
  if(typeof item.stem!=='string'||item.stem.trim().length<30)errors.push('Question '+num+' requires a meaningful stem of 30+ characters');
  const text=normalize(item.stem||'');
  if(seen.has(text))errors.push('Duplicate stem at question '+num+' and '+seen.get(text));else seen.set(text,num);
  if(!Array.isArray(item.options)||item.options.length!==4){errors.push('Question '+num+' requires exactly four options');continue;}
  const opts=item.options;
  if(opts.some(x=>typeof x!=='string'||x.trim().length<2))errors.push('Question '+num+' has an empty or too short option');
  if(new Set(opts.map(normalize)).size!==4)errors.push('Question '+num+' has duplicate options');
  const answers=item.correct;
  if(!Array.isArray(answers)||!answers.length||answers.length>4||new Set(answers).size!==answers.length||answers.some(x=>!Number.isInteger(x)||x<0||x>3))errors.push('Question '+num+' has invalid multi-select answer keys');
  else summary.answerCount[answers.length]=(summary.answerCount[answers.length]||0)+1;
  if(!Number.isInteger(item.page)||item.page<1||item.page>12)errors.push('Question '+num+' has invalid page reference');else pages.add(item.page);
  if(typeof item.rationale!=='string'||item.rationale.trim().length<15)errors.push('Question '+num+' lacks a source-linked explanation');
  safe.push({index:num,stem:item.stem,options:opts});
 }
 summary.pages=[...pages].sort((a,b)=>a-b);
 for(let i=0;i<safe.length;i++){
  for(let j=i+1;j<safe.length;j++){
   const a=safe[i],b=safe[j],similarity=score(a.stem,b.stem);
   if(similarity>=0.85)summary.nearSimilarStems.push([a.index,b.index,Number(similarity.toFixed(3))]);
   const left=new Set(a.options.map(normalize)),right=new Set(b.options.map(normalize));
   let overlap=0;for(const option of left)if(right.has(option))overlap++;
   if(overlap>=3)summary.repeatedOptionPairs.push([a.index,b.index,overlap]);
  }
 }
 if(summary.nearSimilarStems.length>12)warnings.push('Excessive near-duplicate stems: '+summary.nearSimilarStems.length+' pairs (manual academic rewrite required)');
 if(summary.repeatedOptionPairs.length>12)warnings.push('Numerous items reuse at least three identical options: '+summary.repeatedOptionPairs.length+' pairs; review concept-level redundancy');
 if(summary.pages.length<7)warnings.push('Question coverage is concentrated in too few pages: '+summary.pages.join(', '));
 if(bank.academicReviewed!==true)warnings.push('This bank is not independently academically approved');
 if(bank.releaseBlocked===true)warnings.push('Release blocked in source metadata; never activate without reviewer approval');
 return {errors,warnings,summary};
}
if(require.main===module){
 const args=process.argv.slice(2),strict=args.includes('--strict'),index=args.indexOf('--pdf'),file=args.find(x=>!x.startsWith('--')&&(index<0||args[index+1]!==x));
 if(!file||!fs.existsSync(file)){process.stderr.write('Usage: node tools/audit_course_bank.cjs BANK.json [--pdf matching-material.pdf] [--strict]\n');process.exitCode=2;}
 else{
  try{
   const pdf=index<0?null:args[index+1],bank=JSON.parse(fs.readFileSync(file,'utf8'));
   const result=audit(bank,pdf);
   process.stdout.write(JSON.stringify({filename:path.basename(file),...result},null,2)+'\n');
   if(result.errors.length||(strict&&result.warnings.some(w=>w.startsWith('Excessive'))))process.exitCode=1;
  }catch(e){process.stderr.write('Audit failed: '+e.message+'\n');process.exitCode=2;}
 }
}
module.exports={audit,score,normalize};
