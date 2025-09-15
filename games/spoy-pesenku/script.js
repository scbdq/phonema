function initSpoyPesenku(){
  const patterns=['та-та-та','па-па-па','ка-ка-ка','на-на-на','та-то-ту','му-мы-ма','ва-ву-во','но-ну-ны','ка-ко-ку','та-ка-па','мо-но-то','ду-ну-ку','по-во-но','ты-пы-кы'];
  const patEl=document.getElementById('sg-pattern');
  const play=document.getElementById('sg-play');
  const next=document.getElementById('sg-next');
  const speak=t=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t.replace(/-/g,' ')); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} };
  let idx=0;
  function render(){ patEl.textContent=patterns[idx]; }
  play.addEventListener('click',()=> speak(patterns[idx]));
  next.addEventListener('click',()=>{ idx=(idx+1)%patterns.length; render(); });
  render();
}
