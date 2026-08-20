(() => {
  const $ = id => document.getElementById(id);
  const overlay=$('kdAuthOverlay'), accountBtn=$('kdAccountButton'), close=$('kdAuthClose');
  const loginForm=$('kdLoginForm'), signupForm=$('kdSignupForm'), accountPanel=$('kdAccountPanel'), error=$('kdAuthError');
  let me=null;
  const planLabel = u => u?.plan === 'pro' ? 'PRO' : 'FREE';

  // Keep the authenticated account and the Trading Profile wizard in sync.
  // The registration form already collects the user's name/username, so the
  // onboarding wizard must never ask for the same identity a second time.
  function syncAppProfile(u){
    try{
      const App = window.App;
      if(!App || !u) return;

      const identity = u.username || u.name || u.email?.split('@')[0] || 'Трейдер';
      App.userData = {
        ...(App.userData || {}),
        name: identity,
        username: u.username || identity,
        email: u.email || '',
        plan: planLabel(u),
        memberSince: u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : (App.userData?.memberSince || '')
      };

      // If this is a new account, skip the duplicate "Ваше имя" onboarding
      // step and start directly with the useful trading parameters.
      if(!App.onboardingDone && App.onboardingOverlay){
        if(App.onboardingName) App.onboardingName.value = identity;
        if(typeof App.goToWizardStep === 'function') App.goToWizardStep(2);
        App.onboardingOverlay.classList.add('active');
        App.saveState?.();
      } else {
        App.applyUserData?.();
      }
    }catch(e){ console.warn('Could not sync account with Trading Profile:',e); }
  }

  function open(){overlay.hidden=false; document.body.classList.add('kd-auth-open'); error.textContent=''; if(me){loginForm.hidden=true;signupForm.hidden=true;accountPanel.hidden=false;$('kdAuthTitle').textContent='Твой аккаунт';$('kdPanelPlan').textContent=planLabel(me);$('kdPanelUntil').textContent=me.pro_until?`Pro до ${new Date(me.pro_until).toLocaleDateString('ru-RU')}`:'Базовый доступ';}else{loginForm.hidden=false;signupForm.hidden=true;accountPanel.hidden=true;}}
  function closeModal(){overlay.hidden=true;document.body.classList.remove('kd-auth-open');}
  function update(u){me=u||null; const name=u?.username||u?.name||u?.email?.split('@')[0]||'Гость'; $('kdAccountName').textContent=name; $('kdAccountPlan').textContent=planLabel(u); $('kdAccountAvatar').textContent=name[0].toUpperCase(); $('kdAccountAvatar').classList.toggle('pro',u?.plan==='pro'); const badge=document.getElementById('settingsPlan'); if(badge){badge.textContent=planLabel(u);badge.classList.toggle('badge-pro',u?.plan==='pro');} const p=document.getElementById('settingsEmail');if(p)p.textContent=u?.email||'—'; const n=document.getElementById('settingsUsername');if(n)n.textContent=name; const ms=document.getElementById('settingsMemberSince');if(ms)ms.textContent=u?.created_at?new Date(u.created_at).toLocaleDateString('ru-RU'):'—'; const av=document.getElementById('settingsAvatar');if(av)av.textContent=name[0].toUpperCase(); if(u) syncAppProfile(u);}
  async function call(action, method='GET', body){const r=await fetch(`/api/auth?action=${action}`,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,credentials:'same-origin',cache:'no-store'});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Ошибка авторизации');return d;}
  accountBtn?.addEventListener('click',open);close?.addEventListener('click',closeModal);overlay?.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
  document.querySelectorAll('[data-auth-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-auth-tab]').forEach(b=>b.classList.toggle('active',b===btn));const signup=btn.dataset.authTab==='signup';loginForm.hidden=signup;signupForm.hidden=!signup;accountPanel.hidden=true;error.textContent='';}));
  loginForm?.addEventListener('submit',async e=>{e.preventDefault();error.textContent='';const fd=new FormData(loginForm);try{const d=await call('login','POST',Object.fromEntries(fd));update(d.user);open();}catch(x){error.textContent=x.message;}});
  signupForm?.addEventListener('submit',async e=>{e.preventDefault();error.textContent='';const fd=new FormData(signupForm);try{const d=await call('signup','POST',Object.fromEntries(fd));update(d.user);open();}catch(x){error.textContent=x.message;}});
  $('kdLogoutButton')?.addEventListener('click',async()=>{try{await call('logout','POST',{});}catch{}update(null);open();});
  $('kdUpgradeButton')?.addEventListener('click',()=>{error.textContent='PRO подключён как тариф. Оплата будет включена следующим этапом — после подключения биллинга.';});
  (async()=>{try{const d=await call('me');update(d.user);}catch{update(null);}})();
})();
