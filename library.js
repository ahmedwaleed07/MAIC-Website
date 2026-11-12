'use strict';
const MAIC_LIBRARY_CATEGORIES=[
 {id:'business',key:'libraryBusiness'},
 {id:'projects',text:'Project Management'},
 {id:'organizations',key:'libraryOrganizations'},
 {id:'hr',text:'Human Resources'},
 {id:'cybersecurity',key:'libraryCybersecurity'},
 {id:'ai',key:'libraryAI'},
 {id:'cloud-computing',key:'libraryCloudComputing'},
 {id:'advanced-programming',key:'libraryAdvancedProgramming'},
 {id:'cryptography',key:'libraryCryptography'},
 {id:'telecommunications',key:'libraryTelecommunications'},
 {id:'translation',key:'libraryTranslation'},
 {id:'marketing',key:'libraryMarketing'},
 {id:'public-relations',key:'libraryPublicRelations'},
 {id:'critical-thinking',key:'libraryCriticalThinking'},
 {id:'strategic-management',key:'libraryStrategicManagement'}
];
let maicLibraryBooks=[],maicCountryMessages=[],maicBookFilter='all';
function maicContentText(item,key){const localized=item.translations?.[state.lang]?.[key];return localized||(state.lang==='ar'?item[key+'Ar']:item[key+'En'])||item[key+'En']||item[key+'Ar']||''}
function maicBookVisible(book){return book.active===true&&MAIC_LIBRARY_CATEGORIES.some(c=>c.id===book.category)}
function maicCountryMessageVisible(item,country,now=Date.now()){
 return item.active===true&&!!country&&(!item.countries?.length||item.countries.includes(country))&&(!item.startsAt||Date.parse(item.startsAt)<=now)&&(!item.endsAt||Date.parse(item.endsAt)>now);
}
function renderCountryMessages(){const messages=maicCountryMessages.filter(m=>maicCountryMessageVisible(m,state.selectedCountry));return messages.length?'<aside class="maic-country-messages" aria-live="polite">'+messages.map(m=>'<article class="content-panel"><h2>'+escapeHTML(formatHeading(maicContentText(m,'title')))+'</h2><p dir="auto">'+escapeHTML(maicContentText(m,'body'))+'</p></article>').join('')+'</aside>':''}
function libraryCategoryName(c){return c.key?t(c.key):tx(c.text)}
function maicBookLanguage(code){
 if(code==='ar')return t('bookArabic');if(code==='en')return t('bookEnglish');
 if(typeof code!=='string'||!/^[-a-zA-Z0-9]{2,20}$/.test(code))return t('bookNotStated');
 try{const label=new Intl.DisplayNames([state.lang],{type:'language',fallback:'none'}).of(code);return label||t('bookNotStated')}catch{return t('bookNotStated')}
}
function libraryPageTitle(){if(state.page.startsWith('library:read:')){const book=maicReaderBook();return book?maicContentText(book,'title'):t('notFound')}const c=MAIC_LIBRARY_CATEGORIES.find(c=>state.page==='library:'+c.id);return c?libraryCategoryName(c):t('library')}
function maicBookCover(book,title){
 const url=/^https:\/\//i.test(book.coverUrl||'')?book.coverUrl:'';
 return '<div class="maic-book-cover" role="img" aria-label="'+escapeHTML(t('bookCover')+': '+title)+'"><div class="maic-leather-book" aria-hidden="true"><span class="maic-cover-brand">MAIC</span><span class="maic-cover-ornament">✦</span><span class="maic-cover-title" dir="auto">'+escapeHTML(title)+'</span><span class="maic-cover-ornament">✦</span><span class="maic-cover-motto">Innovate. Create. Lead.</span></div>'+(url?'<img class="maic-original-cover" src="'+escapeHTML(url)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'')+'</div>';
}
document.addEventListener('error',event=>{if(event.target?.classList?.contains('maic-original-cover'))event.target.remove()},true);
function maicReaderBook() {
 const id=state.page.slice('library:read:'.length);
 return maicLibraryBooks.find(book=>book.id===id&&maicBookVisible(book));
}
function maicHostedBook(book) {
 if (book.access!=='free'||!/^[a-z0-9-]+$/.test(book.id)) return null;
 const edition=window.MAIC_HOSTED_BOOKS?.[book.id];
 return edition?.catalogUrl===book.freeUrl?edition:null;
}
function maicReaderText(english,arabic) {
 return state.lang==='ar'?arabic:tx(english);
}
function renderBookReader() {
 const book=maicReaderBook();
 if (!book) return renderNotFound();
 const title=maicContentText(book,'title');
 const back='<div class="detail-back">'+action('library:'+book.category,'backLibrary')+'</div>';
 const edition=maicHostedBook(book);
 if (!edition) {
  const message=maicReaderText('A copy is not currently available to read on MAIC.','لا تتوفر حالياً نسخة للقراءة داخل موقع الأكاديمية.');
  return pageShell(title,maicContentText(book,'description'),back+'<p class="content-panel">'+escapeHTML(message)+'</p>');
 }
 const file='/library-files/'+book.id+'.pdf';
 const license=edition.license.replace(/^https:\/\/creativecommons\.org\/licenses\/([a-z-]+)\/([\d.]+)\/$/i,(_,name,version)=>'CC '+name.toUpperCase()+' '+version);
 const details=[book.author,book.publisher,license,edition.source].filter(Boolean).map(text=>'<bdi>'+escapeHTML(text)+'</bdi>').join(' · ');
 return pageShell(title,'',back+'<section class="content-panel maic-book-reader"><p class="maic-book-reader-credit">'+details+'</p><iframe src="'+file+'" title="'+escapeHTML(title)+'" class="maic-book-pdf"></iframe><a class="btn" href="'+file+'">'+escapeHTML(maicReaderText('Open PDF directly','فتح ملف PDF مباشرة'))+icon('book')+'</a></section>');
}
function renderLibrary(){
 if(state.page.startsWith('library:read:'))return renderBookReader();
 const category=state.page.startsWith('library:')?MAIC_LIBRARY_CATEGORIES.find(c=>c.id===state.page.slice(8)):null;
 if(state.page.startsWith('library:')&&!category)return renderNotFound();
 if(!category)return pageShell(t('library'),t('libraryIntro'),'<div class="maic-library-grid">'+MAIC_LIBRARY_CATEGORIES.map(c=>'<article class="content-panel maic-specialty"><span class="maic-library-glyph">'+icon('book')+'</span><h2>'+escapeHTML(libraryCategoryName(c))+'</h2><button class="btn" type="button" data-nav="library:'+c.id+'">'+escapeHTML(t('exploreBooks'))+icon('chevron')+'</button></article>').join('')+'</div>');
 const books=maicLibraryBooks.filter(b=>maicBookVisible(b)&&b.category===category.id&&(maicBookFilter==='all'||b.access===maicBookFilter));
 const filters=[['all','allBooks'],['free','free'],['paid','paid']].map(([id,k])=>'<button type="button" class="btn" data-book-filter="'+id+'" aria-pressed="'+(maicBookFilter===id)+'">'+escapeHTML(t(k))+'</button>').join('');
 const cards=books.map(b=>{
 const title=maicContentText(b,'title'),description=maicContentText(b,'description');
 const price=b.access==='free'?t('free'):new Intl.NumberFormat(state.lang,{style:'currency',currency:b.currency||'USD'}).format(Number(b.price));
 const href='#library:read:'+encodeURIComponent(b.id);
 const hosted=maicHostedBook(b);
 const label=hosted?t('readBook'):maicReaderText('Book details','تفاصيل الكتاب');
 const status=hosted?'':'<p class="maic-book-availability">'+escapeHTML(maicReaderText('No copy available on MAIC yet','لا تتوفر نسخة داخل الموقع حالياً'))+'</p>';
 const lang=maicBookLanguage(b.language);
 const row=(label,value)=>'<div><dt>'+escapeHTML(t(label))+'</dt><dd dir="auto">'+escapeHTML(value||t('bookNotStated'))+'</dd></div>';
 const metadata='<dl class="maic-book-metadata">'+row('bookAuthor',b.author)+row('bookYear',b.year)+row('bookSpecialty',libraryCategoryName(category))+row('bookPublisher',b.publisher)+row('bookLanguage',lang)+'</dl>';
 const bio=maicContentText(b,'authorBio')||t('bookBioUnavailable');
 return '<article class="content-panel maic-book-card"><a class="maic-book-cover-link" href="'+escapeHTML(href)+'" aria-label="'+escapeHTML(label+': '+title)+'">'+maicBookCover(b,title)+'</a><div class="maic-book-content"><span class="maic-course-badge">'+escapeHTML(price)+'</span><h2><a href="'+escapeHTML(href)+'">'+escapeHTML(formatHeading(title))+'</a></h2>'+metadata+'<p class="maic-book-summary" dir="auto">'+escapeHTML(description)+'</p><details class="maic-author-bio"><summary>'+escapeHTML(t('bookAboutAuthor'))+'</summary><p dir="auto">'+escapeHTML(bio)+'</p></details>'+status+'<a class="btn btn-gold" href="'+escapeHTML(href)+'">'+escapeHTML(label)+icon('book')+'</a></div></article>';
 }).join('');
 return pageShell(libraryCategoryName(category),'','<div class="detail-back">'+action('library','backLibrary')+'</div><div class="maic-book-filters" role="group" aria-label="'+escapeHTML(t('library'))+'">'+filters+'</div><div class="maic-library-grid" aria-live="polite">'+(cards||'<p class="content-panel">'+escapeHTML(t('noBooks'))+'</p>')+'</div>');
}
function residenceOptions(selected){return '<option value="">'+escapeHTML(t('chooseCountry'))+'</option>'+countryNames().map(c=>'<option value="'+c.code+'" '+(c.code===selected?'selected':'')+'>'+escapeHTML(c.name)+'</option>').join('')}
function setVisitorCountry(country){if(!(window.MAIC_COUNTRIES||[]).some(c=>c.code===country))return false;state.selectedCountry=country;storage.setItem('maic_country',country);window.dispatchEvent(new CustomEvent('maic-country-changed',{detail:{country}}));return true}
function renderResidencePreference(){return '<div class="content-panel maic-residence-panel"><label for="residencePreference">'+escapeHTML(t('country'))+'</label><select id="residencePreference">'+residenceOptions(state.selectedCountry)+'</select><p>'+escapeHTML(t('preferenceHint'))+'</p></div>'}
