function initUgadaiImya(){
  const pairs=[['па','пя'],['ма','мя'],['ва','вя'],['та','тя'],['ба','бя'],['да','дя'],['по','пё'],['мо','мё'],['во','вё'],['то','тё'],['бо','бё'],['до','дё'],['пу','пю'],['му','мю'],['ву','вю'],['ту','тю'],['бу','бю'],['ду','дю'],['пы','пи'],['мы','ми'],['вы','ви'],['ты','ти'],['бы','би'],['ды','ди']];
  let i=0; const order=pairs.sort(()=>Math.random()-0.5);
  const feedback=document.getElementById('ui-feedback');
  const hard=document.getElementById('ui-hard');
  const soft=document.getElementById('ui-soft');
  const listen=document.getElementById('ui-listen');
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  function render(){ feedback.textContent=''; }
  function next(){ i=(i+1)%order.length; render(); }
  listen.addEventListener('click',()=>{ const p=order[i]; speak(p[0]); setTimeout(()=>speak(p[1]),500); });
  hard.addEventListener('click',()=>{ check(false); });
  soft.addEventListener('click',()=>{ check(true); });
  function check(choseSoft){ const ok = choseSoft; feedback.textContent = ok? 'Верно!':'Нет, мягкий — младший'; feedback.style.color= ok?'#065f46':'#7f1d1d'; setTimeout(next,900); }
  render();
}
