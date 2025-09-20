function initNaydiMesto(){
  const rounds=[
    {a:'лак',b:'сок',c:'рак',match:'a',icons:{a:'🧴',b:'🥤',c:'🦞'}},
    {a:'мышка',b:'кошка',c:'мишка',match:'b',icons:{a:'🖱️',b:'🐱',c:'🐻'}},
    {a:'дом',b:'мак',c:'сом',match:'a',icons:{a:'🏠',b:'🌺',c:'🐟'}},
    {a:'дулка',b:'вагон',c:'утка',match:'a',icons:{a:'🧪',b:'🚃',c:'🦆'}},
    {a:'бантик',b:'бинк',c:'фантик',match:'a',icons:{a:'🎀',b:'🔹',c:'🍬'}},
  ];
  const topA=document.getElementById('nm-top-a');
  const topB=document.getElementById('nm-top-b');
  const bottom=document.getElementById('nm-bottom');
  const feedback=document.getElementById('nm-feedback');
  const listen=document.getElementById('nm-listen');
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  let i=0;
  function render(){ const r=rounds[i]; topA.textContent=r.icons.a; topB.textContent=r.icons.b; bottom.textContent=r.icons.c; feedback.textContent=''; if(window.UI) UI.clearToasts(); }
  function next(){ i=(i+1)%rounds.length; render(); }
  function choose(which){ const r=rounds[i]; const ok=(which===r.match); if(window.UI){ UI.toast(ok? 'Правильно!':'Неверно', ok?'success':'error'); if(ok) UI.celebrate(); } else { feedback.textContent= ok? 'Правильно!':'Неверно'; feedback.style.color= ok? '#065f46':'#7f1d1d'; } setTimeout(next,900); }
  topA.addEventListener('click',()=>choose('a'));
  topB.addEventListener('click',()=>choose('b'));
  listen.addEventListener('click',()=>{ const r=rounds[i]; speak(r.a); setTimeout(()=>speak(r.b),500); setTimeout(()=>speak(r.c),1000); });
  render();
}
