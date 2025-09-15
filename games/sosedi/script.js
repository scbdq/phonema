function initSosedi(){
  const pairs=[['дуб','суп'],['мак','бак'],['букет','пакет'],['бок','сок'],['мука','рука']];
  const icons={ 'дуб':'🌳','суп':'🥣','мак':'🌺','бак':'🛢️','букет':'💐','пакет':'🛍️','бок':'➡️','сок':'🥤','мука':'🌾','рука':'✋' };
  const pool=document.getElementById('sd-pool');
  const house=document.getElementById('sd-house');
  const feedback=document.getElementById('sd-feedback');
  const speak=(t)=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  const allTokens=pairs.flat();
  const shuffled=allTokens.sort(()=>Math.random()-0.5);

  const state={ inside:[] };

  shuffled.forEach(w=>{
    const el=document.createElement('div'); el.className='sd-token'; el.draggable=true; el.dataset.word=w; el.textContent=icons[w]||'🔹';
    el.addEventListener('click',()=>speak(w));
    el.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text/plain', w); });
    pool.appendChild(el);
  });

  house.addEventListener('dragover',e=>{e.preventDefault();});
  house.addEventListener('drop',e=>{
    e.preventDefault(); const w=e.dataTransfer.getData('text/plain');
    const el=[...pool.children].find(x=>x.dataset.word===w); if(!el) return;
    house.appendChild(el); state.inside.push(w);
    check();
  });

  function check(){
    if(state.inside.length%2!==0) return; // ждём по два
    const last2=state.inside.slice(-2);
    const ok = pairs.some(p=>p.includes(last2[0]) && p.includes(last2[1]));
    feedback.textContent = ok? 'Пара собрана!' : 'Не соседи — попробуй другую.';
    feedback.style.color = ok? '#065f46' : '#7f1d1d';
    if(!ok){ // вернуть назад оба
      last2.forEach(w=>{ const el=[...house.children].find(x=>x.dataset.word===w); if(el){ pool.appendChild(el); state.inside.pop(); }});
    }
  }
}
