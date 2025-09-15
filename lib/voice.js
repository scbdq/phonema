;(function(){
  const storeKey='phonema.voice.settings.v1';
  const S={ voiceURI:null, rate:1, pitch:1, volume:1 };
  const state={ voices:[], ready:false };

  function loadSettings(){
    try{ const s=JSON.parse(localStorage.getItem(storeKey)||'{}'); Object.assign(S,s||{}); }catch(_){ }
  }
  function saveSettings(){ try{ localStorage.setItem(storeKey, JSON.stringify(S)); }catch(_){ }
  }

  function listVoices(){
    const voices = window.speechSynthesis.getVoices();
    state.voices = voices.filter(v=> /ru/i.test(v.lang||'') || /russian/i.test(v.name||''));
    // приятные по умолчанию: Microsoft, Google, Milena (если доступна)
    const preferred=[/Svetlana|Irina|Milena/i, /Google.*Russian/i, /Microsoft.*Russian/i, /ru/i];
    if(!S.voiceURI){
      for(const p of preferred){
        const found=state.voices.find(v=>p.test(v.name)||p.test(v.voiceURI));
        if(found){ S.voiceURI=found.voiceURI||found.name; break; }
      }
    }
    state.ready = true;
  }

  function getVoice(){
    if(!state.ready) listVoices();
    const match = state.voices.find(v=> v.voiceURI===S.voiceURI || v.name===S.voiceURI);
    return match || state.voices[0] || null;
  }

  async function speak(text){
    return new Promise((resolve,reject)=>{
      try{
        const u = new SpeechSynthesisUtterance(text);
        const v = getVoice();
        if(v) u.voice=v; u.lang='ru-RU';
        u.rate=S.rate; u.pitch=S.pitch; u.volume=S.volume;
        u.onend=()=>resolve(); u.onerror=e=>reject(e.error||e);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }catch(e){ resolve(); }
    });
  }

  function initUI(){
    const modal=document.getElementById('settings-modal');
    if(!modal) return; // страница ещё не готова
    const select=document.getElementById('voice-select');
    const rate=document.getElementById('voice-rate');
    const pitch=document.getElementById('voice-pitch');
    const volume=document.getElementById('voice-volume');
    const test=document.getElementById('settings-test');
    const close=document.getElementById('settings-close');
    function populate(){
      select.innerHTML='';
      state.voices.forEach(v=>{
        const opt=document.createElement('option');
        opt.value=v.voiceURI||v.name; opt.textContent=`${v.name} (${v.lang})`;
        if(opt.value===S.voiceURI) opt.selected=true; select.appendChild(opt);
      });
      rate.value=S.rate; pitch.value=S.pitch; volume.value=S.volume;
    }
    populate();
    select.onchange=()=>{ S.voiceURI=select.value; saveSettings(); };
    rate.oninput=()=>{ S.rate=parseFloat(rate.value); saveSettings(); };
    pitch.oninput=()=>{ S.pitch=parseFloat(pitch.value); saveSettings(); };
    volume.oninput=()=>{ S.volume=parseFloat(volume.value); saveSettings(); };
    test.onclick=()=> speak('Привет! Это проверка голоса. Как слышно?');
    close.onclick=()=> modal.classList.add('hidden');
    window.addEventListener('keydown',e=>{ if(e.key==='Escape') modal.classList.add('hidden'); });
    // добавим кнопку в шапку
    const header=document.querySelector('.site-header');
    if(header){
      let actions=header.querySelector('.header-actions');
      if(!actions){ actions=document.createElement('div'); actions.className='header-actions'; header.appendChild(actions); }
      const btn=document.createElement('button'); btn.className='icon-btn'; btn.title='Настройки голоса'; btn.textContent='⚙️';
      btn.onclick=()=>{ populate(); modal.classList.remove('hidden'); };
      actions.appendChild(btn);
    }
  }

  function boot(){
    loadSettings();
    if('speechSynthesis' in window){
      listVoices();
      window.speechSynthesis.onvoiceschanged = ()=>{ listVoices(); initUI(); };
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initUI); else initUI();
  }

  window.Voice = { speak, get voice(){ return getVoice(); }, settings:S };
  boot();
})();
