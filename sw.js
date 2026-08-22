const CACHE="kd-intelligence-v1.9.8";
const CORE=[
  "./",
  "./index.html",
  "./style.css?v=1.9.1",
  "./brand-fallback.js?v=1.9.1",
  "./kd-rebrand.js?v=1.9.0",
  "./runtime-fixes.js?v=1.1.0",
  "./app.js?v=1.9.1",
  "./auth.js?v=2.0.0",
  "./manifest.webmanifest"
];

const COACH_FIX=`
;(function(){
  try{
    const app=window.App;
    if(!app || app.__kdCoachLiveRenderFix) return;
    app.__kdCoachLiveRenderFix=true;
    const live=()=>{
      const messages=document.getElementById('aiMessages');
      const input=document.getElementById('aiInput');
      if(messages) app.aiMessages=messages;
      if(input) app.aiInput=input;
      return messages;
    };
    const render=()=>{
      const box=live();
      if(!box || !Array.isArray(app.aiHistory) || !app.aiHistory.length) return;
      if(typeof app.renderAIHistory==='function') app.renderAIHistory();
      const current=document.getElementById('aiMessages');
      if(current){
        app.aiMessages=current;
        const area=document.getElementById('aiChatArea');
        if(area) area.scrollTop=area.scrollHeight;
      }
    };
    const append=app.appendMessage;
    if(typeof append==='function') app.appendMessage=function(role,content){
      live();
      const result=append.call(this,role,content);
      render();
      return result;
    };
    const save=app.saveState;
    if(typeof save==='function') app.saveState=function(){
      const result=save.call(this);
      if(Array.isArray(this.aiHistory)&&this.aiHistory.length) render();
      return result;
    };
    const handle=app.handleAIQuery;
    if(typeof handle==='function') app.handleAIQuery=async function(){live();return handle.call(this);};
    live();
  }catch(e){console.warn('KD Coach live render fix failed',e);}
})();
`;

self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(url.origin!==location.origin||event.request.method!=="GET") return;
  event.respondWith(fetch(event.request,{cache:"no-store"}).then(async response=>{
    if(!response.ok) return response;
    let outgoing=response;
    if(url.pathname.endsWith('/app.js')){
      const source=await response.text();
      outgoing=new Response(source+'\n'+COACH_FIX,{status:response.status,headers:response.headers});
    }
    caches.open(CACHE).then(cache=>cache.put(event.request,outgoing.clone()));
    return outgoing;
  }).catch(()=>caches.match(event.request).then(response=>response||caches.match("./index.html"))));
});
