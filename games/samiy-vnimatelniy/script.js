function initSamiyVnimatelniy(){
  const sets=[ ['мак','рак','бак'], ['дом','ком','сом'], ['будка','утка','дулка'], ['монета','конфета','ракета'] ];
  const icons={ 'мак':'🌺','рак':'🦞','бак':'🛢️','дом':'🏠','ком':'🪨','сом':'🐟','будка':'🏠','утка':'🦆','дулка':'🧪','монета':'🪙','конфета':'🍬','ракета':'🚀' };
  const grid=document.getElementById('sv-grid');
  const slots=[...document.querySelectorAll('.sv-slot')];
  const play=document.getElementById('sv-play');
  const checkBtn=document.getElementById('sv-check');
  const feedback=document.getElementById('sv-feedback');
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  let cur=sets[Math.floor(Math.random()*sets.length)], order=[];

  function render(){ grid.innerHTML=''; order = cur.slice().sort(()=>Math.random()-0.5); order.forEach(w=>{ const el=document.createElement('div'); el.className='sv-item'; el.textContent=icons[w]||'🔹'; el.draggable=true; el.dataset.word=w; el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain', w)); el.addEventListener('click',()=>speak(w)); grid.appendChild(el); }); slots.forEach(s=>{ s.innerHTML=''; }); feedback.textContent=''; if(window.UI) UI.clearToasts(); }
  slots.forEach(s=>{ s.addEventListener('dragover',e=>e.preventDefault()); s.addEventListener('drop',e=>{ e.preventDefault(); const w=e.dataTransfer.getData('text/plain'); const el=[...grid.children].find(x=>x.dataset.word===w); if(!el) return; s.innerHTML=''; s.appendChild(el); }); });
  play.addEventListener('click',()=>{ cur.forEach((w,i)=> setTimeout(()=>speak(w), i*600)); });
  checkBtn.addEventListener('click',()=>{ const got=slots.map(s=> s.firstChild && s.firstChild.dataset.word); const ok = JSON.stringify(got)===JSON.stringify(cur); if(window.UI){ UI.toast(ok?'Отлично!':'Порядок другой', ok?'success':'error'); if(ok) UI.celebrate(); } else { feedback.textContent= ok?'Отлично!':'Порядок другой'; feedback.style.color= ok? '#065f46':'#7f1d1d'; }
    if(ok){ setTimeout(()=>{ cur=sets[Math.floor(Math.random()*sets.length)]; render(); }, 900); }
  });
  render();
}
