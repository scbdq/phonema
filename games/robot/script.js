function initRobot(){
  const sets=[ ['на','на','но'], ['пу','пу','по'], ['во','ва','во'], ['ду','ду','да'], ['ку','ку','ка'], ['ма','мо','мо'], ['то','то','ту'], ['ва','ва','ву'] ];
  const play=document.getElementById('rb-play');
  const feedback=document.getElementById('rb-feedback');
  const buttons=[...document.querySelectorAll('.rb-answers .btn')];
  let cur=['на','на','но']; let oddIndex=2;
  const speak=t=> window.Voice ? window.Voice.speak(t) : ( ()=>{ try{window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ru-RU'; window.speechSynthesis.speak(u);}catch(e){} } )();
  function newRound(){ const s=sets[Math.floor(Math.random()*sets.length)]; cur=s; oddIndex = s.findIndex((x,i,arr)=> arr.filter(y=>y===x).length===1 ); feedback.textContent=''; }
  play.addEventListener('click',()=>{ cur.forEach((s,i)=> setTimeout(()=>speak(s), i*500)); });
  buttons.forEach((b,i)=> b.addEventListener('click',()=>{ const ok=i===oddIndex; feedback.textContent= ok? 'Правильно!':'Нет'; feedback.style.color= ok?'#065f46':'#7f1d1d'; setTimeout(()=>{ newRound(); }, 800); }));
  newRound();
  // Lottie robot
  try{
    if(window.lottie){
      window.lottie.loadAnimation({ container: document.getElementById('rb-lottie'), renderer:'svg', loop:true, autoplay:true, path:'https://assets2.lottiefiles.com/packages/lf20_mvb7c9.json' });
    }
  }catch(_){ }
}
