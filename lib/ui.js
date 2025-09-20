;(function(){
  const state = {
    toasts: [],
    toastTimers: [],
    overlay: null
  };

  function ensureToastHost(){
    let host = document.getElementById('global-toast');
    if(!host){
      host = document.createElement('div');
      host.id = 'global-toast';
      document.body.appendChild(host);
    }
    return host;
  }

  function removeToast(el){
    if(!el) return;
    el.classList.add('animate__fadeOutDown');
    el.addEventListener('animationend',()=> el.remove(), { once:true });
  }

  function toast(message, type='info', duration=1800){
    const host = ensureToastHost();
    const item = document.createElement('div');
    item.className = `toast-item ${type} animate__animated animate__fadeInUp`;
    item.textContent = message;
    host.appendChild(item);
    const timer = setTimeout(()=> removeToast(item), duration);
    state.toastTimers.push(timer);
    state.toasts.push(item);
    return item;
  }

  function clearToasts(){
    state.toastTimers.forEach(clearTimeout);
    state.toastTimers.length = 0;
    state.toasts.forEach(removeToast);
    state.toasts.length = 0;
    const host = document.getElementById('global-toast');
    if(host) host.innerHTML = '';
  }

  function celebrate(opts={}){
    if(typeof window.confetti !== 'function') return;
    const {
      particleCount = 80,
      spread = 70,
      ticks = 50,
      scalar = 1,
      origin = { y: 0.7 }
    } = opts;
    window.confetti({ particleCount, spread, ticks, scalar, origin });
  }

  function clearOverlays(){
    if(state.overlay){
      state.overlay.remove();
      state.overlay = null;
    }
  }

  function result({ title='Результат', score=null, total=null, details='', onReplay=null, onClose=null }={}){
    clearOverlays();
    const overlay = document.createElement('div');
    overlay.id = 'result-overlay';
    overlay.innerHTML = `
      <div id="result-card" class="animate__animated animate__zoomIn">
        <h3>${title}</h3>
        ${score!=null && total!=null ? `<p><strong>${score}</strong> из <strong>${total}</strong></p>` : ''}
        ${details ? `<p>${details}</p>` : ''}
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button id="res-close" class="btn">Продолжить</button>
          ${onReplay ? '<button id="res-replay" class="btn btn-blue">Играть снова</button>' : ''}
        </div>
      </div>`;
    document.body.appendChild(overlay);
    state.overlay = overlay;
    celebrate({ particleCount: 120, scalar: 1.1 });

    overlay.querySelector('#res-close').onclick = () => {
      clearOverlays();
      if(typeof onClose === 'function') onClose();
    };
    const replayBtn = overlay.querySelector('#res-replay');
    if(replayBtn){
      replayBtn.onclick = () => {
        clearOverlays();
        if(typeof onReplay === 'function') onReplay();
      };
    }
  }

  function reset(){
    clearToasts();
    clearOverlays();
  }

  window.UI = { toast, celebrate, result, clearToasts, clearOverlays, reset };
})();
