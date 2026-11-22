// Keep unapproved academic source manuscripts and exam drafts out of
// public Pages static-asset responses. This is defense in depth; it does NOT
// make the existing public GitHub commits private. Rotate any leaked exam keys.
export async function onRequest(context){
 let path=new URL(context.request.url).pathname;
 try{path=decodeURIComponent(path)}catch{}
 path=path.toLowerCase();
 if(/^\/data\/(?:exam-drafts|course-manuscripts)(?:\/|$)/.test(path)){
  return new Response('Not Found',{status:404,headers:{
   'Content-Type':'text/plain; charset=utf-8',
   'Cache-Control':'no-store',
   'X-Content-Type-Options':'nosniff'
  }});
 }
 return context.next();
}
