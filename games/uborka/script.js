function initUborka(){
  const sets={
    'UA': { left:'А', right:'У', wordsLeft:['аист','астра','ананас','арбуз'], wordsRight:['улей','утка','урна','уж'] },
    'MP': { left:'М', right:'П', wordsLeft:['мак','мука','мышка','миска'], wordsRight:['палка','пакет','пони','паук','пират'] }
  };
  const icons={ 'аист':'🕊️','астра':'🌼','ананас':'🍍','арбуз':'🍉','улей':'🐝','утка':'🦆','урна':'🗑️','уж':'🐍','мак':'🌺','мука':'🌾','мышка':'🐭','миска':'🥣','палка':'🪵','пакет':'🛍️','пони':'🐴','паук':'🕷️','пират':'🏴‍☠️' };
  let mode='UA';
  const pool=document.getElementById('ub-pool');
  const leftBox=document.getElementById('ub-left');
  const rightBox=document.getElementById('ub-right');
  const feedback=document.getElementById('ub-feedback');
  const btnUA=document.getElementById('ub-mode-au');
  const btnMP=document.getElementById('ub-mode-mp');
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  btnUA.addEventListener('click',()=>{ mode='UA'; render(); });
  btnMP.addEventListener('click',()=>{ mode='MP'; render(); });
  function render(){
    pool.innerHTML=''; leftBox.textContent=sets[mode].left; rightBox.textContent=sets[mode].right; feedback.textContent='';
    const words=[...sets[mode].wordsLeft, ...sets[mode].wordsRight].sort(()=>Math.random()-0.5);
    words.forEach(w=>{ const el=document.createElement('div'); el.className='ub-item'; el.textContent=icons[w]||'🔹'; el.draggable=true; el.dataset.word=w; el.addEventListener('click',()=>speak(w)); el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain', w)); pool.appendChild(el); });
  }
  function setupBox(box, side){
    box.addEventListener('dragover',e=>e.preventDefault());
    box.addEventListener('drop',e=>{ e.preventDefault(); const w=e.dataTransfer.getData('text/plain'); const el=[...pool.children].find(x=>x.dataset.word===w)||[...leftBox.children,...rightBox.children].find(x=>x.dataset&&x.dataset.word===w); if(!el) return; const ok = (side==='left'? sets[mode].wordsLeft:sets[mode].wordsRight).includes(w); box.appendChild(el); feedback.textContent= ok? 'Верно!':'Неверно'; feedback.style.color= ok?'#065f46':'#7f1d1d'; });
  }
  setupBox(leftBox,'left'); setupBox(rightBox,'right');
  render();
}
