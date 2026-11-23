'use strict';
(async()=>{
 const state=document.querySelector('#state'),mount=document.querySelector('#items');
 try{
  const response=await fetch('/api/admin/manuscripts',{credentials:'same-origin',cache:'no-store'});
  const data=await response.json();if(!response.ok)throw Error(data.error||'unavailable');
  state.textContent='عدد المناهج المصدرية المسجّلة: '+data.count;
  mount.replaceChildren();
  for(const item of data.manuscripts){
   const row=document.createElement('div');row.className='row';
   const label=document.createElement('strong');label.textContent=item.course_id+' — '+item.section_count+' صفحة';
   const link=document.createElement('a');link.className='action';
   link.textContent='تحميل نسخة للتحرير';link.href='/api/admin/manuscripts?course='+encodeURIComponent(item.course_id);
   row.append(label,link);mount.append(row);
  }
 }catch(e){state.textContent='تعذر عرض النسخ. تحقق من تسجيل دخول المدير واتصال قاعدة البيانات.';}
})();
