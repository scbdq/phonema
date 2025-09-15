(function () {
  const defaultSpeechOptions = {
    lang: 'ru-RU',
    rate: 1,
    pitch: 1.05,
    volume: 1,
  };

  function wait(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function cancelSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speak(text, options = {}) {
    if (!('speechSynthesis' in window) || !text) {
      return Promise.resolve();
    }

    const settings = { ...defaultSpeechOptions, ...options };
    return new Promise(resolve => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.lang;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }

  async function speakSequence(items = [], options = {}) {
    const {
      pause = 550,
      beforeSpeak,
      afterSpeak,
      speechOptions = {},
    } = options;

    for (const item of items) {
      if (typeof beforeSpeak === 'function') {
        beforeSpeak(item);
      }
      await speak(item, speechOptions);
      if (typeof afterSpeak === 'function') {
        afterSpeak(item);
      }
      if (pause) {
        await wait(pause);
      }
    }
  }

  function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function sample(array) {
    if (!array || !array.length) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  function setFeedback(element, text = '', type = 'info') {
    if (!element) return;
    element.textContent = text;
    element.className = `feedback${type ? ` ${type}` : ''}`;
  }

  function updateProgress(element, current, total) {
    if (!element) return;
    if (typeof current === 'number' && typeof total === 'number') {
      element.textContent = `Раунд ${current} из ${total}`;
    } else {
      element.textContent = '';
    }
  }

  function disableButtons(buttons = []) {
    buttons.forEach(btn => {
      if (btn) btn.disabled = true;
    });
  }

  function enableButtons(buttons = []) {
    buttons.forEach(btn => {
      if (btn) btn.disabled = false;
    });
  }

  function clearChildren(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createWordCard({ text, emoji, id, classes = [] }) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = ['word-card', ...classes].join(' ').trim();
    card.dataset.word = text;
    if (id) {
      card.id = id;
    }

    if (emoji) {
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'emoji';
      emojiSpan.textContent = emoji;
      emojiSpan.setAttribute('aria-hidden', 'true');
      card.appendChild(emojiSpan);
    }

    const label = document.createElement('strong');
    label.textContent = text;
    card.appendChild(label);
    return card;
  }

  function initSpeechWarmup() {
    if (!('speechSynthesis' in window)) return;
    // Warm up the speech engine once the page becomes interactive
    const warmup = () => {
      document.removeEventListener('pointerdown', warmup);
      document.removeEventListener('keydown', warmup);
      speak(' ', { rate: 1, pitch: 1, volume: 0 }).catch(() => {});
    };
    document.addEventListener('pointerdown', warmup, { once: true });
    document.addEventListener('keydown', warmup, { once: true });
  }

  window.GameUtils = {
    wait,
    speak,
    speakSequence,
    shuffle,
    sample,
    setFeedback,
    updateProgress,
    disableButtons,
    enableButtons,
    clearChildren,
    createWordCard,
    cancelSpeech,
    initSpeechWarmup,
  };
})();
