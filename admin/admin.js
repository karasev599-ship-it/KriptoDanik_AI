(() => {
  const views = [...document.querySelectorAll('.view')];
  const nav = [...document.querySelectorAll('.nav-item')];
  const title = document.getElementById('viewTitle');
  const titles = {overview:'Обзор',users:'Пользователи',subscriptions:'Подписки',ai:'AI',market:'Market Pulse',system:'Система'};
  function show(name){
    views.forEach(v=>v.classList.toggle('active',v.id===name));
    nav.forEach(n=>n.classList.toggle('active',n.dataset.view===name));
    title.textContent=titles[name]||name;
    history.replaceState(null,'','#'+name);
  }
  nav.forEach(n=>n.addEventListener('click',()=>show(n.dataset.view)));
  show(location.hash.slice(1) || 'overview');
  async function health(){
    const api=document.getElementById('apiHealth'), coach=document.getElementById('coachHealth'), market=document.getElementById('marketHealth');
    try{
      const r=await fetch('../api/coach',{method:'OPTIONS',cache:'no-store'});
      api.textContent=r.ok?'● доступен':'● ответ '+r.status; api.className=r.ok?'ok':'';
      coach.textContent=r.ok?'● endpoint доступен':'● проверь API'; coach.className=r.ok?'ok':'';
    }catch(e){api.textContent='● ошибка';coach.textContent='● ошибка';}
    market.textContent='● клиентский feed';
  }
  document.getElementById('refreshBtn')?.addEventListener('click',health);
  health();
})();