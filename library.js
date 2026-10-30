'use strict';
const MAIC_LIBRARY_CATEGORIES=[
 {id:'business',key:'libraryBusiness'},
 {id:'projects',text:'Project Management'},
 {id:'organizations',key:'libraryOrganizations'},
 {id:'hr',text:'Human Resources'}
];
let maicLibraryBooks=[],maicCountryMessages=[],maicBookFilter='all';
function maicContentText(item,key){const localized=item.translations?.[state.lang]?.[key];return localized||(state.lang==='ar'?item[key+'Ar']:item[key+'En'])||item[key+'En']||item[key+'Ar']||''}
function maicBookVisible(book){return book.active===true&&MAIC_LIBRARY_CATEGORIES.some(c=>c.id===book.category)}
function maicCountryMessageVisible(item,country,now=Date.now()){
 return item.active===true&&!!country&&(!item.countries?.length||item.countries.includes(country))&&(!item.startsAt||Date.parse(item.startsAt)<=now)&&(!item.endsAt||Date.parse(item.endsAt)>now);
}
function renderCountryMessages(){const messages=maicCountryMessages.filter(m=>maicCountryMessageVisible(m,state.selectedCountry));return messages.length?'<aside class="maic-country-messages" aria-live="polite">'+messages.map(m=>'<article class="content-panel"><h2>'+escapeHTML(formatHeading(maicContentText(m,'title')))+'</h2><p dir="auto">'+escapeHTML(maicContentText(m,'body'))+'</p></article>').join('')+'</aside>':''}
function libraryCategoryName(c){return c.key?t(c.key):tx(c.text)}
function libraryPageTitle(){const c=MAIC_LIBRARY_CATEGORIES.find(c=>state.page==='library:'+c.id);return c?libraryCategoryName(c):t('library')}
function renderLibrary(){
 const category=state.page.startsWith('library:')?MAIC_LIBRARY_CATEGORIES.find(c=>c.id===state.page.slice(8)):null;
 if(state.page.startsWith('library:')&&!category)return renderNotFound();
 if(!category)return pageShell(t('library'),t('libraryIntro'),'<div class="maic-library-grid">'+MAIC_LIBRARY_CATEGORIES.map(c=>'<article class="content-panel maic-specialty"><span class="maic-library-glyph">'+icon('book')+'</span><h2>'+escapeHTML(libraryCategoryName(c))+'</h2><button class="btn" type="button" data-nav="library:'+c.id+'">'+escapeHTML(t('exploreBooks'))+icon('chevron')+'</button></article>').join('')+'</div>');
 const books=maicLibraryBooks.filter(b=>maicBookVisible(b)&&b.category===category.id&&(maicBookFilter==='all'||b.access===maicBookFilter));
 const filters=[['all','allBooks'],['free','free'],['paid','paid']].map(([id,k])=>'<button type="button" class="btn" data-book-filter="'+id+'" aria-pressed="'+(maicBookFilter===id)+'">'+escapeHTML(t(k))+'</button>').join('');
 const cards=books.map(b=>{
 const title=maicContentText(b,'title'),description=maicContentText(b,'description');
 const price=b.access==='free'?t('free'):new Intl.NumberFormat(state.lang,{style:'currency',currency:b.currency||'USD'}).format(Number(b.price));
 const assigned=maicAssignAgent(state.selectedCountry),email=assigned?.agent?.email||CONTACT;
 const safeFree=b.access==='free'&&/^https:\/\//i.test(b.freeUrl||'');
 const href=safeFree?b.freeUrl:'mailto:'+email+'?subject='+encodeURIComponent('MAIC Library — '+(b.titleEn||b.titleAr));
 return '<article class="content-panel maic-book-card"><span class="maic-course-badge">'+escapeHTML(price)+'</span><h2>'+escapeHTML(formatHeading(title))+'</h2>'+(b.author?'<p dir="auto">'+escapeHTML(b.author)+'</p>':'')+'<p dir="auto">'+escapeHTML(description)+'</p><a class="btn btn-gold" href="'+escapeHTML(href)+'" '+(safeFree?'target="_blank" rel="noopener noreferrer"':'')+'>'+escapeHTML(t(safeFree?'readBook':'requestBook'))+icon(safeFree?'external':'mail')+'</a></article>';
 }).join('');
 return pageShell(libraryCategoryName(category),'','<div class="detail-back">'+action('library','backLibrary')+'</div><div class="maic-book-filters" role="group" aria-label="'+escapeHTML(t('library'))+'">'+filters+'</div><div class="maic-library-grid" aria-live="polite">'+(cards||'<p class="content-panel">'+escapeHTML(t('noBooks'))+'</p>')+'</div>');
}
function residenceOptions(selected){return '<option value="">'+escapeHTML(t('chooseCountry'))+'</option>'+countryNames().map(c=>'<option value="'+c.code+'" '+(c.code===selected?'selected':'')+'>'+escapeHTML(c.name)+'</option>').join('')}
function setVisitorCountry(country){if(!(window.MAIC_COUNTRIES||[]).some(c=>c.code===country))return false;state.selectedCountry=country;storage.setItem('maic_country',country);window.dispatchEvent(new CustomEvent('maic-country-changed',{detail:{country}}));return true}
function renderResidencePreference(){return '<div class="content-panel maic-residence-panel"><label for="residencePreference">'+escapeHTML(t('country'))+'</label><select id="residencePreference">'+residenceOptions(state.selectedCountry)+'</select><p>'+escapeHTML(t('preferenceHint'))+'</p></div>'}
