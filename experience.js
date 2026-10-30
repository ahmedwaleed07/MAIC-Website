'use strict';
(()=>{
const screen=document.createElement('dialog');screen.id='maicIntro';
screen.innerHTML='<div class="intro-landmark"></div><div class="intro-content"><div class="intro-emblems"><img src="./assets/maic-official-crest.png" alt="" width="180" height="180"><img src="./assets/us-great-seal.svg" alt="" width="180" height="180"></div><h1 id="introAcademy" lang="en" dir="ltr">MAIC</h1><p class="intro-motto" id="introMotto" lang="en" dir="ltr"></p><div class="intro-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><p id="introStatus" role="status"></p><button class="btn btn-gold" id="enterAcademy" type="button" disabled>…</button></div>';
document.body.append(screen);screen.showModal();
const close=()=>{screen.close();screen.remove();$('#mainContent').focus({preventScroll:true})};
$('#enterAcademy').addEventListener('click',close);
screen.addEventListener('cancel',e=>{if(!window.MAIC_READY)e.preventDefault()});
const images=Promise.allSettled([...screen.querySelectorAll('img')].map(img=>img.decode()));
const ready=()=>{screen.setAttribute('aria-label',t('welcome'));$('#introAcademy').textContent=t('academy');$('#introMotto').textContent=t('motto');$('#introStatus').textContent=t('welcome');const bar=screen.querySelector('[role="progressbar"]');bar.setAttribute('aria-label',t('loading'));bar.setAttribute('aria-valuenow','100');bar.firstElementChild.style.width='100%';$('#enterAcademy').textContent=t('enter');$('#enterAcademy').disabled=false;const logos=screen.querySelectorAll('img');logos[0].alt=t('crestAlt');logos[1].alt=t('sealAlt');$('#enterAcademy').focus()};
if(window.MAIC_READY)images.then(ready);else window.addEventListener('maic-ready',()=>images.then(ready),{once:true});
})();
