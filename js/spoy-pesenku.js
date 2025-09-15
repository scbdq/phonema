const {
  speakSequence,
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  clearChildren,
  initSpeechWarmup,
} = window.GameUtils;

const slotsContainer = document.getElementById('melody-slots');
const buttonsContainer = document.getElementById('syllable-buttons');
const playButton = document.getElementById('play-melody');
const clearButton = document.getElementById('clear-melody');
const checkButton = document.getElementById('check-melody');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const melodies = shuffle([
  ['та', 'та', 'та'],
  ['па', 'па', 'па'],
  ['ка', 'ка', 'ка'],
  ['на', 'на', 'на'],
  ['та', 'то', 'ту'],
  ['му', 'мы', 'ма'],
  ['ва', 'ву', 'во'],
  ['но', 'ну', 'ны'],
  ['ка', 'ко', 'ку'],
  ['та', 'ка', 'па'],
  ['мо', 'но', 'то'],
  ['ду', 'ну', 'ку'],
  ['по', 'во', 'но'],
  ['ты', 'пы', 'кы'],
]);

let currentIndex = 0;
let score = 0;
let currentMelody = null;
let selection = [];

function setupRound() {
  if (currentIndex >= melodies.length) {
    finishGame();
    return;
  }

  currentMelody = melodies[currentIndex];
  selection = Array(currentMelody.length).fill(null);
  updateProgress(progress, currentIndex + 1, melodies.length);
  setFeedback(feedback, 'Послушайте песенку и повторите её, нажимая на слоги.', 'info');

  clearChildren(slotsContainer);
  clearChildren(buttonsContainer);

  selection.forEach((_, idx) => {
    const slot = document.createElement('div');
    slot.className = 'sequence-slot';
    slot.dataset.index = String(idx);
    slot.textContent = '♪';
    slot.addEventListener('click', () => clearSlot(idx));
    slotsContainer.appendChild(slot);
  });

  const uniqueSyllables = [...new Set(currentMelody)];
  uniqueSyllables.forEach(syllable => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary';
    button.textContent = syllable.toUpperCase();
    button.addEventListener('click', () => addSyllable(syllable));
    buttonsContainer.appendChild(button);
  });

  updateCheckState();
  playMelody();
}

function playMelody() {
  speakSequence(currentMelody, { speechOptions: { rate: 1.05 }, pause: 320 });
}

function addSyllable(syllable) {
  const emptyIndex = selection.findIndex(value => value === null);
  if (emptyIndex === -1) {
    setFeedback(feedback, 'Все ноты заполнены. Нажмите на слот, чтобы очистить его.', 'info');
    return;
  }
  selection[emptyIndex] = syllable;
  const slot = slotsContainer.querySelector(`.sequence-slot[data-index="${emptyIndex}"]`);
  slot.textContent = syllable.toUpperCase();
  slot.classList.add('filled');
  speak(syllable, { rate: 1.05 });
  updateCheckState();
}

function clearSlot(index) {
  if (selection[index] === null) return;
  selection[index] = null;
  const slot = slotsContainer.querySelector(`.sequence-slot[data-index="${index}"]`);
  slot.textContent = '♪';
  slot.classList.remove('filled');
  updateCheckState();
}

function clearSelection() {
  selection = selection.map(() => null);
  slotsContainer.querySelectorAll('.sequence-slot').forEach(slot => {
    slot.textContent = '♪';
    slot.classList.remove('filled');
  });
  updateCheckState();
}

function updateCheckState() {
  const complete = selection.every(value => value !== null);
  checkButton.disabled = !complete;
}

async function handleCheck() {
  if (selection.includes(null)) return;
  const correct = selection.every((syllable, idx) => syllable === currentMelody[idx]);
  if (correct) {
    score += 1;
    setFeedback(feedback, 'Вы воспроизвели песенку точно!', 'success');
    currentIndex += 1;
    await wait(1300);
    setupRound();
  } else {
    setFeedback(feedback, 'Песенка звучала иначе. Попробуйте ещё раз.', 'error');
  }
}

function finishGame() {
  setFeedback(feedback, `Браво! Вы повторили ${score} мелодий из ${melodies.length}.`, 'success');
  updateProgress(progress, melodies.length, melodies.length);
  playButton.textContent = '🔁 Сыграть снова';
  checkButton.disabled = true;
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(melodies);
  melodies.splice(0, melodies.length, ...reshuffled);
  playButton.textContent = '▶️ Проиграть мелодию';
  setupRound();
}

playButton.addEventListener('click', () => {
  if (currentIndex >= melodies.length) {
    restartGame();
  } else {
    playMelody();
  }
});

clearButton.addEventListener('click', clearSelection);
checkButton.addEventListener('click', handleCheck);

setupRound();
