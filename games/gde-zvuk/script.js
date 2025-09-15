function initGdeZvuk(){
  const sets={
    'А':[['аист','start'],['рука','end']],
    'О':[['осы','start'],['ослик','start']],
    'У':[['утка','start'],['улей','start']],
    'И':[['ива','start'],['пни','end']],
    'М':[['дом','end'],['мак','start']],
    'Б':[['бык','start'],['бак','start']],
    'Т':[['кот','end'],['рот','end']],
    'Д':[['дуб','start'],['дом','start']],
    'К':[['бык','end'],['рак','end']],
    'Г':[['гусь','start'],['гол','start']],
    'П':[['пар','start'],['суп','end']],
    'В':[['волк','start'],['воск','start']],
    'Ж':[['жук','start'],['жар','start']],
    'З':[['зуб','start'],['зонт','start']],
    'Н':[['нос','start'],['сон','end']],
    'Р':[['рак','start'],['пар','end']],
    'Ш':[['шар','start'],['шум','start']],
    'Ч':[['чай','start'],['мяч','end']]
  };
  const icons={ 'аист':'🕊️','рука':'✋','осы':'🐝','ослик':'🐴','утка':'🦆','улей':'🐝','ива':'🌿','пни':'🪵','дом':'🏠','мак':'🌺','бык':'🐂','бак':'🛢️','кот':'🐱','рот':'👄','дуб':'🌳','рак':'🦞','гусь':'🦢','гол':'⚽','пар':'💨','суп':'🍲','волк':'🐺','воск':'🕯️','жук':'🐞','жар':'🔥','зуб':'🦷','зонт':'🌂','нос':'👃','сон':'💤','шар':'⚽','шум':'🔊','чай':'🍵','мяч':'🏀' };
  const keys=Object.keys(sets);
  let key='А', index=0;
  const card=document.getElementById('gzv-card');
  const first=document.getElementById('gzv-first');
  const last=document.getElementById('gzv-last');
  const info=document.getElementById('gzv-info');
  const feedback=document.getElementById('gzv-feedback');
  const play=document.getElementById('gzv-play');
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  function render(){ const pair=sets[key][index]; const w=pair[0]; card.dataset.word=w; card.dataset.answer=pair[1]; card.textContent=icons[w]||'🔹'; info.textContent = 'Звук: '+key; feedback.textContent=''; }
  function next(){ if(++index>=sets[key].length){ index=0; key=keys[(keys.indexOf(key)+1)%keys.length]; } render(); }
  card.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text/plain', card.dataset.word); });
  ;[first,last].forEach(w=>{ w.addEventListener('dragover',e=>e.preventDefault()); w.addEventListener('drop',e=>{ e.preventDefault(); const pos=w.dataset.pos; const ok = pos===card.dataset.answer; feedback.textContent = ok? 'Правильно!' : 'Неверно'; feedback.style.color= ok?'#065f46':'#7f1d1d'; if(ok) next(); }); });
  play.addEventListener('click',()=>{ speak(card.dataset.word); });
  render();
}
