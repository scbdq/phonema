function initPoschitay(){
  const items=[ 'рак','рука','сон','суп','муха','рыба','лук','ваза','дом','лужа' ];
  const icons={ 'рак':'🦞','рука':'✋','сон':'💤','суп':'🍲','муха':'🪰','рыба':'🐟','лук':'🧅','ваза':'🏺','дом':'🏠','лужа':'💧' };
  const card=document.getElementById('pc-card');
  const feedback=document.getElementById('pc-feedback');
  const listen=document.getElementById('pc-listen');
  const btns=[...document.querySelectorAll('.pc-numbers .btn')];
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  let word='рак';
  function pick(){ word = items[Math.floor(Math.random()*items.length)]; card.textContent=icons[word]||'🔹'; feedback.textContent=''; }
  function soundsCount(w){ return w.replace(/йо|йе|йя|йю/g,'').length; }
  btns.forEach(b=> b.addEventListener('click',()=>{ const n=+b.dataset.n; const ok= n===soundsCount(word); feedback.textContent= ok?'Верно!':'Неверно'; feedback.style.color= ok?'#065f46':'#7f1d1d'; setTimeout(pick,900); }));
  listen.addEventListener('click',()=> speak(word));
  pick();
}
