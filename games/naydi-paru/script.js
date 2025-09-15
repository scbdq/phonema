function initNaydiParu(){
  const pairs=[
    {a:'лиса',b:'коса',similar:true,icons:['🦊','🪚']},
    {a:'конфета',b:'кубик',similar:false,icons:['🍬','🧊']},
    {a:'батон',b:'бутон',similar:true,icons:['🥖','🌹']},
    {a:'банка',b:'манка',similar:true,icons:['🥫','🍚']},
    {a:'бегемот',b:'танк',similar:false,icons:['🦛','🛡️']},
    {a:'дом',b:'ком',similar:true,icons:['🏠','🪨']},
  ];
  const left=document.getElementById('np-left');
  const right=document.getElementById('np-right');
  const listen=document.getElementById('np-listen');
  const yesBtn=document.getElementById('np-yes');
  const noBtn=document.getElementById('np-no');
  const feedback=document.getElementById('np-feedback');

  let idx=0; let order=shuffle(pairs);

  function shuffle(arr){return arr.slice().sort(()=>Math.random()-0.5)}
  function speak(text){ return window.Voice ? window.Voice.speak(text) : ( ()=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )(); }
  function render(){ const p=order[idx]; left.textContent=p.icons[0]||'①'; right.textContent=p.icons[1]||'②'; feedback.textContent=''; }
  function next(){ idx=(idx+1)%order.length; render(); }

  listen.addEventListener('click',()=>{ const p=order[idx]; speak(p.a+' — '+p.b);});
  yesBtn.addEventListener('click',()=>check(true));
  noBtn.addEventListener('click',()=>check(false));

  function check(answer){ const ok = (answer===order[idx].similar); feedback.textContent = ok? 'Верно!':'Попробуй ещё'; feedback.style.color= ok?'#065f46':'#7f1d1d'; setTimeout(next, 900); }

  render();
}
