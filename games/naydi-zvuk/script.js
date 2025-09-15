function initNaydiZvuk(){
  const sets={
    'А':['Аня','кот','рука','бык','аист','щека'],
    'О':['Оля','мак','осы','дно','утка','перо'],
    'У':['ухо','сок','улей','мак','утка'],
    'Т':['кот','рот','сок','крот','бык','дом'],
    'К':['паук','суп','мак','рот','кот'],
    'С':['сом','дом','нос','кот','сыр'],
    'М':['мак','лук','дом','нос','сом']
  };
  const icons={ 'Аня':'👧','кот':'🐱','рука':'✋','бык':'🐂','аист':'🕊️','щека':'🙂','Оля':'👧','мак':'🌺','осы':'🐝','дно':'🕳️','утка':'🦆','перо':'🪶','ухо':'👂','сок':'🥤','улей':'🐝','крот':'🦫','дом':'🏠','паук':'🕷️','суп':'🍲','рот':'👄','кот':'🐱','сом':'🐟','нос':'👃','сыр':'🧀','лук':'🧅'};
  const grid=document.getElementById('nz-grid');
  const targetEl=document.getElementById('nz-target');
  const feedback=document.getElementById('nz-feedback');
  const next=document.getElementById('nz-next');
  let target='А'; let used=[];
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  function render(){ grid.innerHTML=''; const arr=sets[target]; arr.forEach(w=>{ const el=document.createElement('div'); el.className='nz-card'; el.dataset.word=w; el.textContent=icons[w]||'🔹'; const b=document.createElement('button'); b.className='btn btn-blue nz-listen'; b.textContent='Слушать'; b.addEventListener('click',e=>{ e.stopPropagation(); speak(w); }); el.appendChild(b); el.addEventListener('click',()=>choose(w, el)); grid.appendChild(el); }); feedback.textContent=''; }
  function choose(w, el){ const ok = w.toLowerCase().includes(target.toLowerCase()); el.style.outline = ok? '4px solid #10b981' : '4px solid #ef4444'; feedback.textContent = ok? 'Есть звук '+target : 'Нет звука '+target; feedback.style.color= ok? '#065f46':'#7f1d1d'; }
  function change(){ const keys=Object.keys(sets); target = keys[(keys.indexOf(target)+1)%keys.length]; targetEl.textContent=target; render(); }
  next.addEventListener('click',change);
  render();
}
