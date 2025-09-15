function initChetvertiyLishniy(){
  const rounds=[
    {words:['мак','бак','рак','банан'], odd:'банан', icons:['🌺','🛢️','🦞','🍌']},
    {words:['сок','ком','индюк','дом'], odd:'индюк', icons:['🥤','🪨','🦃','🏠']},
    {words:['ветка','клетка','диван','сетка'], odd:'диван', icons:['🌿','🕊️','🛋️','🕸️']},
    {words:['ложки','рожки','вяза','ножки'], odd:'вяза', icons:['🥄','🐮','🌳','🦵']},
  ];
  const grid=document.getElementById('ch-grid');
  const feedback=document.getElementById('ch-feedback');
  const listen=document.getElementById('ch-listen');
  let i=0;
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  function render(){ grid.innerHTML=''; const r=rounds[i]; r.words.forEach((w,idx)=>{ const el=document.createElement('div'); el.className='ch-card'; el.dataset.word=w; el.textContent=r.icons[idx]||'🔷'; el.addEventListener('click',()=>select(w)); grid.appendChild(el); }); feedback.textContent=''; }
  function select(w){ const ok=w===rounds[i].odd; feedback.textContent= ok? 'Правильно!':'Попробуй ещё'; feedback.style.color= ok? '#065f46':'#7f1d1d'; setTimeout(()=>{ i=(i+1)%rounds.length; render(); }, 900); }
  listen.addEventListener('click',()=>{ const r=rounds[i]; r.words.forEach((w,idx)=> setTimeout(()=>speak(w), idx*500)); });
  render();
}
