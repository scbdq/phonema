function initSoberiGribi(){
  const sounds=[ 'а','ау','ан','о','оу','он','э','за','эи','у','уда','уз','и','иа','иу' ];
  const typeOf=(s)=> (s.length===1?1:2);
  const grid=document.getElementById('gb-mushrooms');
  const b1=document.getElementById('gb-b1');
  const b2=document.getElementById('gb-b2');
  const feedback=document.getElementById('gb-feedback');
  const speak=t=> window.Voice ? window.Voice.speak(t.replace(/иу/g,'и у').replace(/ау/g,'а у')) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t.replace(/иу/g,'и-у').replace(/ау/g,'а-у')); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  const pool=sounds.slice().sort(()=>Math.random()-0.5);
  pool.forEach(s=>{ const el=document.createElement('div'); el.className='gb-mushroom'; el.textContent='🍄'; el.draggable=true; el.dataset.sound=s; el.addEventListener('click',()=>speak(s)); el.addEventListener('dragstart',e=> e.dataTransfer.setData('text/plain', s)); grid.appendChild(el); });
  ;[b1,b2].forEach(b=>{
    b.addEventListener('dragover',e=>{ e.preventDefault(); b.classList.add('dragover'); });
    b.addEventListener('dragleave',()=> b.classList.remove('dragover'));
    b.addEventListener('drop',e=>{ e.preventDefault(); b.classList.remove('dragover'); const s=e.dataTransfer.getData('text/plain'); const el=[...grid.children].find(x=>x.dataset.sound===s)||[...b1.children,...b2.children].find(x=>x.dataset&&x.dataset.sound===s); if(!el) return; const correct = (b.dataset.type==typeOf(s)); b.appendChild(el); feedback.textContent = correct? 'Правильно!' : 'Не та корзина'; feedback.style.color = correct? '#065f46':'#7f1d1d'; });
  });
}
