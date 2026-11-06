'use strict';
/* Public Michigan heritage gallery. Real, source-linked historic images only.
 * Image credits link to the file description and its author/license information.
 * No AI-generated portraits, no stock placeholders, no third-party tracking.
 */
(function(){
 const commons='https://commons.wikimedia.org/wiki/File:';
 const items=[
  {
   id:'mackinac-bridge',kind:'landmark',
   en:'Mackinac Bridge',ar:'جسر ماكيناك',
   labelEn:'Engineering & the Great Lakes',labelAr:'الهندسة والبحيرات العظمى',
   briefEn:'The landmark suspension bridge linking Michigan’s two peninsulas.',
   briefAr:'الجسر المعلّق الشهير الذي يربط شبه جزيرتي ميشيغان.',
   detailEn:'Opened to traffic in 1957, the Mackinac Bridge connects Mackinaw City with St. Ignace across the Straits of Mackinac. It made travel between the Upper and Lower Peninsulas far easier and remains a defining symbol of Michigan’s engineering heritage.',
   detailAr:'افتُتح جسر ماكيناك أمام حركة المرور عام 1957، ويربط مدينة ماكيناو بمدينة سانت إغناس فوق مضيق ماكيناك. سهّل التنقل بين شبه الجزيرتين العليا والسفلى، وأصبح أحد أبرز رموز التراث الهندسي في ميشيغان.',
   img:'https://upload.wikimedia.org/wikipedia/commons/c/cb/2004_Mackinac_Bridge_Walk.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/c/cb/2004_Mackinac_Bridge_Walk.jpg',
   photo:commons+'2004_Mackinac_Bridge_Walk.jpg',credit:'Wikimedia Commons — image author and license on file page',
   facts:'https://www.mackinacbridge.org/about-the-bridge/location/'
  },
  {
   id:'detroit',kind:'landmark',en:'Detroit Riverfront',ar:'واجهة ديترويت النهرية',
   labelEn:'Industry & Urban History',labelAr:'الصناعة والتاريخ الحضري',
   briefEn:'A skyline shaped by manufacturing, architecture and the Detroit River.',
   briefAr:'أفق عمراني ارتبط بالصناعة والعمارة ونهر ديترويت.',
   detailEn:'Detroit developed into a global center of automobile manufacturing and industrial innovation. Its skyline, including the Renaissance Center on the riverfront, reflects decades of architecture and urban reinvention. Across the Detroit River lies Windsor, Canada.',
   detailAr:'تطورت ديترويت إلى مركز عالمي لصناعة السيارات والابتكار الصناعي. ويعكس أفقها العمراني، ومنه مجمّع رينيسانس سنتر المطل على النهر، عقوداً من التطور المعماري والتحول الحضري. وتقع مدينة وندسور الكندية على الضفة المقابلة.',
   img:'https://upload.wikimedia.org/wikipedia/commons/a/a7/Detroit_Skyline_%28123143197%29.jpeg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Detroit_Skyline_%28123143197%29.jpeg/500px-Detroit_Skyline_%28123143197%29.jpeg',
   photo:commons+'Detroit_Skyline_(123143197).jpeg',credit:'Michael Tighe / Wikimedia Commons — CC0',
   facts:'https://www.detroithistorical.org/learn/online-research/encyclopedia-of-detroit/renaissance-center'
  },
  {
   id:'pictured-rocks',kind:'landmark',en:'Pictured Rocks National Lakeshore',ar:'ساحل بيكتشر روكس الوطني',
   labelEn:'Nature & Geological Heritage',labelAr:'الطبيعة والتراث الجيولوجي',
   briefEn:'Colorful sandstone cliffs rising above Lake Superior.',
   briefAr:'منحدرات حجر رملي ملوّنة تعلو مياه بحيرة سوبيريور.',
   detailEn:'On Lake Superior in Michigan’s Upper Peninsula, Pictured Rocks is celebrated for mineral-stained sandstone cliffs, beaches, waterfalls and forests. Authorized in 1966, it became the first National Lakeshore in the United States. The cliffs extend for about 15 miles along the shoreline.',
   detailAr:'يقع ساحل بيكتشر روكس على بحيرة سوبيريور في شبه جزيرة ميشيغان العليا، ويشتهر بمنحدرات الحجر الرملي الملونة بالمعادن والشواطئ والشلالات والغابات. أُنشئ عام 1966 بوصفه أول ساحل وطني محمي في الولايات المتحدة، وتمتد منحدراته لنحو 15 ميلاً.',
   img:'https://upload.wikimedia.org/wikipedia/commons/6/6f/From_Pictured_Rocks_NP%2C_Michigan.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/From_Pictured_Rocks_NP%2C_Michigan.jpg/500px-From_Pictured_Rocks_NP%2C_Michigan.jpg',
   photo:commons+'From_Pictured_Rocks_NP,_Michigan.jpg',credit:'Wikimedia Commons — image author and license on file page',
   facts:'https://www.nps.gov/places/pictured-rocks-cliffs.htm'
  },
  {
   id:'lansing',kind:'landmark',en:'Michigan State Capitol',ar:'مبنى كابيتول ولاية ميشيغان',
   labelEn:'Government & Architecture',labelAr:'الحكم والعمارة',
   briefEn:'The historic state capitol and its celebrated cast-iron dome.',
   briefAr:'مقر الحكم التاريخي للولاية وقبّته الحديدية المميزة.',
   detailEn:'Michigan’s State Capitol in Lansing opened in 1879. Designed by Elijah E. Myers, the building is known for its prominent cast-iron dome and historic legislative chambers. It was designated a National Historic Landmark in 1992.',
   detailAr:'افتُتح مبنى كابيتول ولاية ميشيغان في لانسنغ عام 1879، وصمّمه المعماري إيلايجا إي. مايرز. ويشتهر بقبته الحديدية البارزة وقاعات التشريع التاريخية، وأُدرج معلماً تاريخياً وطنياً عام 1992.',
   img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Dome%2C_Michigan_State_Capitol%2C_Capitol_Avenue%2C_Lansing%2C_MI.jpg/960px-Dome%2C_Michigan_State_Capitol%2C_Capitol_Avenue%2C_Lansing%2C_MI.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Dome%2C_Michigan_State_Capitol%2C_Capitol_Avenue%2C_Lansing%2C_MI.jpg/960px-Dome%2C_Michigan_State_Capitol%2C_Capitol_Avenue%2C_Lansing%2C_MI.jpg',
   photo:commons+'Dome,_Michigan_State_Capitol,_Capitol_Avenue,_Lansing,_MI.jpg',credit:'Wikimedia Commons — image author and license on file page',
   facts:'https://www.michigan.gov/en/About-Michigan/State-Facts-and-Symbols'
  },
  {
   id:'mackinac-island',kind:'landmark',en:'Mackinac Island',ar:'جزيرة ماكيناك',
   labelEn:'History & Victorian Architecture',labelAr:'التاريخ والعمارة الفيكتورية',
   briefEn:'An island famous for its historic forts and car-free streets.',
   briefAr:'جزيرة تشتهر بحصونها التاريخية وشوارعها الخالية من السيارات.',
   detailEn:'Mackinac Island is known for its preserved historic atmosphere, Victorian-style architecture and scenic Great Lakes views. Motor vehicles are generally prohibited, so visitors travel by foot, bicycle and horse-drawn carriage. The island also preserves important military forts and nineteenth-century heritage.',
   detailAr:'تشتهر جزيرة ماكيناك بأجوائها التاريخية المحفوظة والعمارة الفيكتورية وإطلالاتها على البحيرات العظمى. وتُحظر فيها السيارات عموماً، لذلك يتنقل الزوار سيراً أو بالدراجات أو بالعربات التي تجرها الخيول. وتضم أيضاً حصوناً تاريخية وتراثاً يعود إلى القرن التاسع عشر.',
   img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Aerial_view_of_Mackinac_Island_2020-09-04.jpg/960px-Aerial_view_of_Mackinac_Island_2020-09-04.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Aerial_view_of_Mackinac_Island_2020-09-04.jpg/960px-Aerial_view_of_Mackinac_Island_2020-09-04.jpg',
   photo:commons+'Aerial_view_of_Mackinac_Island_2020-09-04.jpg',credit:'August Schwerdfeger / Wikimedia Commons — CC BY 4.0',
   license:'https://creativecommons.org/licenses/by/4.0/',
   facts:'https://www.mackinacisland.org/do/history/'
  },
  {
   id:'henry-ford-museum',kind:'landmark',en:'Henry Ford Museum of American Innovation',ar:'متحف هنري فورد للابتكار الأمريكي',
   labelEn:'Technology & Invention',labelAr:'التقنية والاختراع',
   briefEn:'A Dearborn museum preserving major stories of American innovation.',
   briefAr:'متحف في ديربورن يوثّق محطات بارزة في الابتكار الأمريكي.',
   detailEn:'Located in Dearborn, the Henry Ford Museum of American Innovation explores transportation, industry, invention and social change through important historic objects. Its collections include the bus on which Rosa Parks took her stand and examples of pioneering American engineering.',
   detailAr:'يقع متحف هنري فورد للابتكار الأمريكي في ديربورن، ويستعرض تاريخ النقل والصناعة والاختراع والتحول الاجتماعي من خلال مقتنيات تاريخية مهمة. وتضم مجموعاته الحافلة التي اتخذت فيها روزا باركس موقفها الشهير، إلى جانب نماذج رائدة من الهندسة الأمريكية.',
   img:'https://upload.wikimedia.org/wikipedia/commons/4/4f/Dearborn_-_The_Henry_Ford_-_20201011113815.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Dearborn_-_The_Henry_Ford_-_20201011113815.jpg/500px-Dearborn_-_The_Henry_Ford_-_20201011113815.jpg',
   photo:commons+'Dearborn_-_The_Henry_Ford_-_20201011113815.jpg',credit:'CoolRockC / Wikimedia Commons — CC BY-SA 4.0',
   license:'https://creativecommons.org/licenses/by-sa/4.0/',
   facts:'https://www.thehenryford.org/visit/venues/henry-ford-museum-of-american-innovation'
  },
  {
   id:'henry-ford',kind:'person',en:'Henry Ford',ar:'هنري فورد',
   labelEn:'Business & Manufacturing · 1863–1947',labelAr:'الأعمال والصناعة · 1863–1947',
   briefEn:'Founder of Ford Motor Company and a pioneer of mass automobile production.',
   briefAr:'مؤسس شركة فورد ورائد الإنتاج الواسع للسيارات.',
   detailEn:'Born in Wayne County, Michigan, Henry Ford founded Ford Motor Company in 1903. He transformed automobile manufacturing by expanding moving-assembly-line production, helping make cars more accessible to ordinary families. His legacy is closely tied to Detroit and Dearborn’s industrial growth.',
   detailAr:'وُلد هنري فورد في مقاطعة واين بميشيغان، وأسّس شركة فورد للسيارات عام 1903. وأسهم في تحويل صناعة السيارات عبر تطوير الإنتاج بخطوط التجميع المتحركة، ما ساعد على جعل السيارات في متناول شرائح أوسع. ويرتبط إرثه بالنمو الصناعي في ديترويت وديربورن.',
   img:'https://upload.wikimedia.org/wikipedia/commons/1/18/Henry_ford_1919.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Henry_ford_1919.jpg/500px-Henry_ford_1919.jpg',
   photo:commons+'Henry_ford_1919.jpg',credit:'Fred Hartsook / Library of Congress — public domain',
   facts:'https://corporate.ford.com/corporate/corporate/articles/history/henry-ford-biography/'
  },
  {
   id:'claude-shannon',kind:'person',en:'Claude Shannon',ar:'كلود شانون',
   labelEn:'Science & Computing · 1916–2001',labelAr:'العلوم والحوسبة · 1916–2001',
   briefEn:'Michigan-born mathematician widely regarded as the father of information theory.',
   briefAr:'عالم رياضيات من مواليد ميشيغان يُعدّ مؤسس نظرية المعلومات.',
   detailEn:'Born in Petoskey and raised in Gaylord, Claude Shannon graduated from the University of Michigan in 1936 with degrees in mathematics and electrical engineering. His 1948 work established the mathematical foundation of information theory, profoundly influencing digital communications, computing and data compression.',
   detailAr:'وُلد كلود شانون في بيتوسكي ونشأ في غايلورد، وتخرج في جامعة ميشيغان عام 1936 حاملاً شهادتين في الرياضيات والهندسة الكهربائية. وقد وضع ببحثه المنشور عام 1948 الأساس الرياضي لنظرية المعلومات، مؤثراً بعمق في الاتصالات الرقمية والحوسبة وضغط البيانات.',
   img:'https://upload.wikimedia.org/wikipedia/commons/c/c2/Claude_Shannon_c1930.png',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/c/c2/Claude_Shannon_c1930.png',
   photo:commons+'Claude_Shannon_c1930.png',credit:'University of Michigan archival photo / Wikimedia Commons — public domain (U.S.)',
   facts:'https://www.itsoc.org/about/shannon'
  },
  {
   id:'gerald-ford',kind:'person',en:'Gerald R. Ford',ar:'جيرالد آر. فورد',
   labelEn:'Politics & Leadership · 1913–2006',labelAr:'السياسة والقيادة · 1913–2006',
   briefEn:'The 38th U.S. President, raised in Grand Rapids, Michigan.',
   briefAr:'الرئيس الثامن والثلاثون للولايات المتحدة، نشأ في غراند رابيدز.',
   detailEn:'Although born in Nebraska, Gerald R. Ford grew up in Grand Rapids and graduated from the University of Michigan in 1935. He represented Michigan in the U.S. House of Representatives before serving as vice president and then as the 38th President of the United States from 1974 to 1977.',
   detailAr:'على الرغم من مولده في نبراسكا، نشأ جيرالد فورد في غراند رابيدز وتخرج في جامعة ميشيغان عام 1935. ومثّل الولاية في مجلس النواب الأمريكي، ثم شغل منصب نائب الرئيس قبل أن يصبح الرئيس الثامن والثلاثين للولايات المتحدة من 1974 إلى 1977.',
   img:'https://upload.wikimedia.org/wikipedia/commons/d/d3/Gerald_Ford_presidential_portrait.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Gerald_Ford_presidential_portrait.jpg/500px-Gerald_Ford_presidential_portrait.jpg',
   photo:commons+'Gerald_Ford_presidential_portrait.jpg',credit:'David Hume Kennerly / U.S. National Archives — public domain',
   facts:'https://www.fordlibrarymuseum.gov/the-fords/gerald-ford/biography'
  },
  {
   id:'rosa-parks',kind:'person',en:'Rosa Parks',ar:'روزا باركس',
   labelEn:'Civil Rights · 1913–2005',labelAr:'الحقوق المدنية · 1913–2005',
   briefEn:'Civil-rights leader who made Detroit her home for decades.',
   briefAr:'رائدة في الحقوق المدنية اتخذت ديترويت موطناً لعقود.',
   detailEn:'Rosa Parks became a central figure of the U.S. civil-rights movement after refusing to give up her bus seat in Montgomery in 1955. She moved to Detroit in 1957, worked in Representative John Conyers’s Detroit office from 1965 to 1988 and continued to advocate for justice and opportunities for young people.',
   detailAr:'أصبحت روزا باركس رمزاً للحركة الأمريكية للحقوق المدنية بعد رفضها التخلي عن مقعدها في حافلة بمونتغمري عام 1955. وانتقلت إلى ديترويت عام 1957، وعملت في مكتب النائب جون كونيرز من 1965 إلى 1988، وواصلت الدفاع عن العدالة وتنمية فرص الشباب.',
   img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rosa_Parks_1956.jpg/960px-Rosa_Parks_1956.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rosa_Parks_1956.jpg/500px-Rosa_Parks_1956.jpg',
   photo:commons+'Rosa_Parks_1956.jpg',credit:'UPI historic photograph (1956) / Wikimedia Commons — U.S. public domain',
   facts:'https://www.loc.gov/exhibitions/rosa-parks-in-her-own-words/about-this-exhibition/detroit-1957-and-beyond/'
  },
  {
   id:'sojourner-truth',kind:'person',en:'Sojourner Truth',ar:'سوجورنر تروث',
   labelEn:'Historical Activism · c. 1797–1883',labelAr:'النضال التاريخي · نحو 1797–1883',
   briefEn:'Abolitionist and women’s-rights advocate who lived in Battle Creek.',
   briefAr:'مناضلة ضد العبودية ومدافعة عن حقوق النساء عاشت في باتل كريك.',
   detailEn:'Born into slavery in New York, Sojourner Truth became a powerful advocate for abolition and women’s rights. She moved to Michigan in 1857 and later lived in Battle Creek, where she continued her public work. Her legacy remains a vital part of Michigan’s social and political history.',
   detailAr:'وُلدت سوجورنر تروث مستعبدة في نيويورك، ثم أصبحت من أبرز المدافعات عن إلغاء العبودية وحقوق النساء. وانتقلت إلى ميشيغان عام 1857 وعاشت لاحقاً في باتل كريك، حيث واصلت نشاطها العام. ويُعدّ إرثها جزءاً مهماً من تاريخ الولاية الاجتماعي والسياسي.',
   img:'https://upload.wikimedia.org/wikipedia/commons/4/43/Sojourner_Truth_01.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Sojourner_Truth_01.jpg/500px-Sojourner_Truth_01.jpg',
   photo:commons+'Sojourner_Truth_01.jpg',credit:'Library of Congress historical photograph (1864) — public domain',
   facts:'https://www.nps.gov/people/sojourner-truth.htm'
  },
  {
   id:'aretha-franklin',kind:'person',en:'Aretha Franklin',ar:'أريثا فرانكلين',
   labelEn:'Music & Culture · 1942–2018',labelAr:'الموسيقى والثقافة · 1942–2018',
   briefEn:'The Queen of Soul, raised in Detroit and shaped by its musical community.',
   briefAr:'ملكة موسيقى السول التي نشأت في ديترويت وتأثرت بمشهدها الموسيقي.',
   detailEn:'Born in Memphis, Aretha Franklin grew up in Detroit, where she began singing in her father’s church. Her extraordinary voice made her one of the most influential singers in American music, and in 1987 she became the first woman inducted into the Rock & Roll Hall of Fame. Detroit remained central to her life and legacy.',
   detailAr:'وُلدت أريثا فرانكلين في ممفيس ونشأت في ديترويت، حيث بدأت الغناء في كنيسة والدها. جعلها صوتها الاستثنائي واحدة من أكثر الشخصيات تأثيراً في الموسيقى الأمريكية، وأصبحت عام 1987 أول امرأة تنضم إلى قاعة مشاهير الروك آند رول. وظلت ديترويت جزءاً أساسياً من حياتها وإرثها.',
   img:'https://upload.wikimedia.org/wikipedia/commons/7/70/Aretha_Franklin_April_2015.jpg',
   thumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Aretha_Franklin_April_2015.jpg/500px-Aretha_Franklin_April_2015.jpg',
   photo:commons+'Aretha_Franklin_April_2015.jpg',credit:'Pete Souza / Official White House Photograph (2015) — public domain',
   facts:'https://www.detroithistorical.org/learn/online-research/encyclopedia-of-detroit/franklin-aretha'
  }
 ];
 const byId=new Map(items.map(x=>[x.id,x]));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const dictionary={
  en:{figures:'Notable People of Michigan',intro:'Discover the innovators, leaders, scientists and cultural figures who shaped Michigan and the wider world.',view:'View photo and story',close:'Close photo',unavailable:'Image unavailable; open the photo source to view it.'},
  ar:{figures:'شخصيات بارزة في تاريخ ميشيغان',intro:'اكتشف رجال أعمال وعلماء وقادة وشخصيات ثقافية وحقوقية تركوا أثراً في ميشيغان والعالم.',view:'عرض الصورة والتفاصيل',close:'إغلاق الصورة',unavailable:'تعذّر تحميل الصورة؛ يمكنك فتح مصدرها لمشاهدتها.'}
 };
 const locale=()=>document.documentElement.lang==='ar'?'ar':'en';
 const tr=(item,key,l)=>item[key+(l==='ar'?'Ar':'En')];
 function renderCard(item,l){
  const title=item[l],brief=tr(item,'brief',l),label=tr(item,'label',l),word=dictionary[l].view;
  return `<article class="mi-gallery-card ${item.kind==='person'?'mi-person':''}">
   <button class="mi-gallery-open" type="button" data-mi-story="${esc(item.id)}" aria-label="${esc(word+': '+title)}">
    <span class="mi-gallery-photo"><img src="${esc(item.thumb||item.img)}" alt="${esc(title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>
    <span class="mi-gallery-card-content">
     <span class="mi-gallery-kicker">${esc(label)}</span>
     <strong class="mi-gallery-name" dir="auto">${esc(title)}</strong>
     <span class="mi-gallery-summary" dir="auto">${esc(brief)}</span>
     <span class="mi-gallery-view">${esc(word)} <span aria-hidden="true">＋</span></span>
    </span>
   </button>
  </article>`;
 }
 function render(l,t){
  const chosen=l==='ar'?'ar':'en',ui=dictionary[chosen];
  return `<section class="mi-heritage-gallery" aria-labelledby="miLandmarksTitle">
    <h2 class="mi-gallery-section-title" id="miLandmarksTitle">${esc(t('landmarks'))}</h2>
    <div class="mi-gallery-grid mi-landmark-grid">${items.filter(x=>x.kind==='landmark').map(i=>renderCard(i,chosen)).join('')}</div>
    <div class="mi-gallery-section-divider"></div>
    <h2 class="mi-gallery-section-title" id="miPeopleTitle">${esc(ui.figures)}</h2>
    <p class="mi-gallery-section-intro" dir="auto">${esc(ui.intro)}</p>
    <div class="mi-gallery-grid mi-people-grid" aria-labelledby="miPeopleTitle">${items.filter(x=>x.kind==='person').map(i=>renderCard(i,chosen)).join('')}</div>
   </section>
   <dialog id="miStoryDialog" class="mi-story-dialog" aria-labelledby="miDialogTitle" aria-describedby="miDialogDescription">
    <button type="button" id="miDialogClose" class="mi-story-close" aria-label="${esc(ui.close)}" data-mi-close>×</button>
    <figure class="mi-story-figure"><img id="miDialogImage" alt="" decoding="async" referrerpolicy="no-referrer"></figure>
    <div class="mi-story-copy" dir="${chosen==='ar'?'rtl':'ltr'}">
     <span class="mi-story-category" id="miDialogCategory"></span>
     <h2 id="miDialogTitle"></h2>
     <p id="miDialogDescription"></p>
     <p class="mi-story-credit" id="miDialogCredit" hidden></p>
     <p class="mi-story-image-error" id="miDialogImageError" hidden></p>
    </div>
   </dialog>`;
 }
 let lastTrigger=null;
 function close(){
  const d=document.querySelector('#miStoryDialog');
  if(d?.open)d.close();
 }
 function show(id,trigger){
  const item=byId.get(id),d=document.querySelector('#miStoryDialog');
  if(!item||!d||typeof d.showModal!=='function')return;
  const l=locale(),ui=dictionary[l],image=d.querySelector('#miDialogImage');
  lastTrigger=trigger||null;
  d.querySelector('#miDialogTitle').textContent=item[l];
  d.querySelector('#miDialogCategory').textContent=tr(item,'label',l);
  d.querySelector('#miDialogDescription').textContent=tr(item,'detail',l);
  // Keep visitors on MAIC: no outbound links in the photo viewer.
  // Display a small non-interactive byline only for photos that require attribution.
  const credit=d.querySelector('#miDialogCredit');
  if(item.license){
   const photographer=item.credit.split('/')[0].split(' — ')[0].trim();
   const licenseCode=item.license.split('/licenses/')[1]?.replace(/\/$/,'').toUpperCase().replaceAll('/',' ')||'BY';
   credit.textContent=(l==='ar'?'حقوق الصورة: ':'Photo: ')+photographer+' · CC '+licenseCode;
   credit.hidden=false;
  }else{
   credit.textContent='';
   credit.hidden=true;
  }
  const error=d.querySelector('#miDialogImageError');error.hidden=true;error.textContent='';
  image.alt=item[l];image.src=item.img;
  image.onerror=()=>{
   if(image.src===item.img&&item.thumb&&item.thumb!==item.img){image.src=item.thumb;return}
   error.textContent=ui.unavailable;error.hidden=false;
  };
  document.body.classList.add('mi-dialog-open');
  d.showModal();
 }
 document.addEventListener('click',e=>{
  const card=e.target.closest('[data-mi-story]');
  if(card){e.preventDefault();show(card.dataset.miStory,card);return}
  if(e.target.closest('[data-mi-close]')){close();return}
  const d=document.querySelector('#miStoryDialog');
  if(d?.open&&e.target===d)close();
 });
 // If Wikimedia hasn't generated a thumbnail, use the known source image instead.
 document.addEventListener('error',e=>{
  const im=e.target;
  if(!(im instanceof HTMLImageElement)||!im.closest('.mi-gallery-photo'))return;
  const card=im.closest('[data-mi-story]'),item=byId.get(card?.dataset.miStory);
  if(!item)return;
  if(im.src!==item.img){im.src=item.img;return;}
  im.hidden=true;
  const fallback=document.createElement('span');
  fallback.className='mi-gallery-unavailable';
  fallback.textContent=item[locale()];
  im.parentElement?.append(fallback);
 },true);
 document.addEventListener('close',e=>{
  if(e.target?.id!=='miStoryDialog')return;
  document.body.classList.remove('mi-dialog-open');
  const trigger=lastTrigger;lastTrigger=null;
  if(trigger?.isConnected)trigger.focus({preventScroll:true});
 },true);
 window.MAIC_MICHIGAN_GALLERY=Object.freeze({render,count:items.length});
})();
