'use strict';
(()=>{
const screen=document.createElement('dialog');screen.id='maicIntro';
screen.innerHTML='<div class="intro-landmark"></div><div class="intro-content"><div class="intro-emblems"><img src="./assets/maic-official-crest.png" alt="" width="155" height="155"><img src="./assets/us-great-seal.svg" alt="" width="155" height="155"></div><h1 id="introAcademy" lang="en" dir="ltr">MAIC</h1><p class="intro-motto" id="introMotto" lang="en" dir="ltr"></p><div class="intro-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><form id="introPreferences" class="intro-preferences"><label for="introCountry"><span id="introCountryLabel"></span><select id="introCountry" required></select></label><label for="introLanguage"><span id="introLanguageLabel"></span><select id="introLanguage" required></select></label></form><p class="intro-preference-hint" id="introPreferenceHint"></p><p id="introStatus" role="status"></p><button class="btn btn-gold" id="enterAcademy" type="submit" form="introPreferences" disabled>…</button></div>';
document.body.append(screen);screen.showModal();
let loaded=false,changing=false;
function update(){
 if(!loaded)return;screen.lang=state.lang;screen.dir=state.lang==='ar'?'rtl':'ltr';screen.setAttribute('aria-label',t('welcome'));
 $('#introAcademy').textContent=t('academy');$('#introMotto').textContent=t('motto');$('#introLanguageLabel').textContent=t('languages');$('#introCountryLabel').textContent=t('country');$('#introPreferenceHint').textContent=t('preferenceHint');
 $('#introLanguage').innerHTML=languageOptions.map(([id,name])=>'<option value="'+id+'" '+(id===state.lang?'selected':'')+'>'+escapeHTML(name)+'</option>').join('');$('#introCountry').innerHTML=residenceOptions(state.selectedCountry);
 $('#enterAcademy').textContent=t('enter');$('#enterAcademy').disabled=changing||!state.selectedCountry;$('#introLanguage').disabled=changing;$('#introCountry').disabled=changing;
 $('#introStatus').textContent=state.selectedCountry?t('welcome'):t('chooseCountry');
 const bar=screen.querySelector('[role="progressbar"]');bar.setAttribute('aria-label',t('loading'));bar.setAttribute('aria-valuenow','100');bar.firstElementChild.style.width='100%';const logos=screen.querySelectorAll('img');logos[0].alt=t('crestAlt');logos[1].alt=t('sealAlt');
}
$('#introLanguage').addEventListener('change',async e=>{const locale=e.target.value;changing=true;$('#enterAcademy').disabled=true;$('#introLanguage').disabled=true;try{await changeLang(locale)}finally{changing=false;update();$('#introLanguage').focus()}});
$('#introCountry').addEventListener('change',e=>{if(setVisitorCountry(e.target.value)){$('#enterAcademy').disabled=changing;$('#introStatus').textContent=t('welcome')}else{$('#enterAcademy').disabled=true}});
$('#introPreferences').addEventListener('submit',e=>{e.preventDefault();if(changing||!loaded||!setVisitorCountry($('#introCountry').value))return;renderAll();screen.close();screen.remove();$('#mainContent').focus({preventScroll:true})});
screen.addEventListener('cancel',e=>e.preventDefault());
const images=Promise.allSettled([...screen.querySelectorAll('img')].map(img=>img.decode()));
const ready=()=>{loaded=true;if(!(window.MAIC_COUNTRIES||[]).some(c=>c.code===state.selectedCountry))state.selectedCountry='';update();$('#introCountry').focus()};
if(window.MAIC_READY)images.then(ready);else window.addEventListener('maic-ready',()=>images.then(ready),{once:true});
})();
