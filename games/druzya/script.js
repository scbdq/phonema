function initDruzya(){
  const items=[
    ['Толя','Коля',false],
    ['Толя','Толя',true],
    ['Люба','Люда',false],
    ['Саша','Саша',true],
    ['Миша','Маша',false],
    ['Соня','Саня',false],
    ['Дима','Дина',false],
  ];
  const nameA=document.getElementById('dr-name-a');
  const nameB=document.getElementById('dr-name-b');
  const feedback=document.getElementById('dr-feedback');
  const listen=document.getElementById('dr-listen');
  const same=document.getElementById('dr-same');
  const diff=document.getElementById('dr-diff');

  let order=items.slice().sort(()=>Math.random()-0.5), i=0;
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  function render(){ const p=order[i]; nameA.textContent=p[0]; nameB.textContent=p[1]; feedback.textContent=''; }
  function next(){ i=(i+1)%order.length; render(); }
  function check(ans){ const ok = ans===order[i][2]; feedback.textContent=ok?'Верно!':'Неверно'; feedback.style.color=ok?'#065f46':'#7f1d1d'; setTimeout(next,900); }
  listen.addEventListener('click',()=>{ const p=order[i]; speak(p[0]); setTimeout(()=>speak(p[1]),500); });
  same.addEventListener('click',()=>check(true));
  diff.addEventListener('click',()=>check(false));
  render();
}
