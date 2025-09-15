function initPrivetstvie(){
  const rows=['но-ну','по-пу','ко-кы','то-та','мо-му','во-ву','бо-бу','бо-ба','до-да','до-ду'];
  const targetEl=document.getElementById('pv-target');
  const start=document.getElementById('pv-start');
  const hit=document.getElementById('pv-hit');
  const feedback=document.getElementById('pv-feedback');
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  let target='до-ду'; let playing=false; let lastSpoken=''; let lastTargetAt=0; let counted=false;
  function newTarget(){ target = rows[Math.floor(Math.random()*rows.length)]; targetEl.textContent=target; }
  function playSequence(){
    playing=true; feedback.textContent=''; counted=false; lastTargetAt=0;
    const seq = shuffle(rows).slice(0,7);
    seq.forEach((w,i)=> setTimeout(()=>{
      lastSpoken=w; if(w===target){ lastTargetAt=Date.now(); }
      speak(w);
      if(i===seq.length-1) setTimeout(()=>playing=false,450);
    }, i*750));
  }
  function shuffle(a){ return a.slice().sort(()=>Math.random()-0.5); }
  start.addEventListener('click',()=>{ newTarget(); playSequence(); });
  hit.addEventListener('click',()=>{
    if(!playing || counted) return;
    const ok = lastTargetAt && (Date.now()-lastTargetAt <= 900);
    feedback.textContent= ok? 'Отлично!':'Не то приветствие';
    feedback.style.color= ok?'#065f46':'#7f1d1d';
    counted=true;
  });
  newTarget();
}
