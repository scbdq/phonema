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

const cardsContainer = document.getElementById('cards-container');
const slotsContainer = document.getElementById('slots');
const playButton = document.getElementById('play-sequence');
const clearButton = document.getElementById('clear-selection');
const checkButton = document.getElementById('check-sequence');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const sequences = shuffle([
  ['мак', 'рак', 'бак'],
  ['дом', 'ком', 'сом'],
  ['будка', 'утка', 'дулка'],
  ['монета', 'конфета', 'ракета'],
]);

let currentIndex = 0;
let score = 0;
let finished = false;
let selectedOrder = [];
let currentRound = null;

function setupRound() {
  if (currentIndex >= sequences.length) {
    finishGame();
    return;
  }

  currentRound = sequences[currentIndex];
  selectedOrder = [null, null, null];
  updateProgress(progress, currentIndex + 1, sequences.length);
  setFeedback(feedback, 'Послушайте слова и расставьте карточки в услышанном порядке.', 'info');

  const uniqueWords = shuffle([...new Set(currentRound)]);
  clearChildren(cardsContainer);
  clearChildren(slotsContainer);

  uniqueWords.forEach(word => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'word-card';
    card.dataset.word = word;
    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = pickEmoji(word);
    emoji.setAttribute('aria-hidden', 'true');
    card.appendChild(emoji);
    const label = document.createElement('strong');
    label.textContent = word.charAt(0).toUpperCase() + word.slice(1);
    card.appendChild(label);
    card.addEventListener('click', () => handleCard(card));
    cardsContainer.appendChild(card);
  });

  for (let i = 0; i < currentRound.length; i += 1) {
    const slot = document.createElement('div');
    slot.className = 'sequence-slot';
    slot.dataset.index = String(i);
    slot.textContent = i + 1;
    slot.addEventListener('click', () => clearSlot(slot));
    slotsContainer.appendChild(slot);
  }

  updateCheckState();
  speakCurrent();
}

function pickEmoji(word) {
  const map = {
    мак: '🌺',
    рак: '🦞',
    бак: '🛢️',
    дом: '🏠',
    ком: '🪨',
    сом: '🐟',
    будка: '🐶',
    утка: '🦆',
    дулка: '🧁',
    монета: '🪙',
    конфета: '🍬',
    ракета: '🚀',
  };
  return map[word] || '🔤';
}

function handleCard(card) {
  if (finished) return;
  const word = card.dataset.word;
  if (card.classList.contains('selected')) {
    removeWord(word);
    return;
  }

  const emptyIndex = selectedOrder.findIndex(item => item === null);
  if (emptyIndex === -1) {
    setFeedback(feedback, 'Все позиции заполнены. Нажмите на слот, чтобы освободить его.', 'info');
    return;
  }

  selectedOrder[emptyIndex] = word;
  card.classList.add('selected');
  const slot = slotsContainer.querySelector(`.sequence-slot[data-index="${emptyIndex}"]`);
  slot.textContent = word.charAt(0).toUpperCase() + word.slice(1);
  slot.classList.add('filled');
  updateCheckState();
  speak(word, { rate: 1.05 });
}

function removeWord(word) {
  const index = selectedOrder.findIndex(item => item === word);
  if (index === -1) return;
  selectedOrder[index] = null;
  const slot = slotsContainer.querySelector(`.sequence-slot[data-index="${index}"]`);
  slot.textContent = Number(index) + 1;
  slot.classList.remove('filled');
  const card = cardsContainer.querySelector(`.word-card[data-word="${word}"]`);
  if (card) {
    card.classList.remove('selected');
  }
  updateCheckState();
}

function clearSlot(slot) {
  if (!slot.classList.contains('filled') || finished) return;
  const index = Number(slot.dataset.index);
  const word = selectedOrder[index];
  if (word) {
    removeWord(word);
  }
}

function clearSelection() {
  selectedOrder = [null, null, null];
  slotsContainer.querySelectorAll('.sequence-slot').forEach((slot, idx) => {
    slot.textContent = idx + 1;
    slot.classList.remove('filled');
  });
  cardsContainer.querySelectorAll('.word-card').forEach(card => card.classList.remove('selected'));
  updateCheckState();
}

function updateCheckState() {
  const isComplete = selectedOrder.every(item => item !== null);
  checkButton.disabled = !isComplete || finished;
}

async function handleCheck() {
  if (finished || selectedOrder.includes(null)) return;
  const isCorrect = selectedOrder.every((word, idx) => word === currentRound[idx]);
  if (isCorrect) {
    score += 1;
    setFeedback(feedback, 'Здорово! Порядок совпал.', 'success');
    currentIndex += 1;
    await wait(1400);
    clearSelection();
    setupRound();
  } else {
    setFeedback(feedback, 'Последовательность другая. Попробуйте переставить карточки.', 'error');
  }
}

function speakCurrent() {
  speakSequence(currentRound, { speechOptions: { rate: 1.05 } });
}

function finishGame() {
  finished = true;
  setFeedback(feedback, `Вы отлично слушали! Верных последовательностей: ${score} из ${sequences.length}.`, 'success');
  updateProgress(progress, sequences.length, sequences.length);
  checkButton.disabled = true;
  playButton.textContent = '🔁 Сыграть снова';
}

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle([
    ['мак', 'рак', 'бак'],
    ['дом', 'ком', 'сом'],
    ['будка', 'утка', 'дулка'],
    ['монета', 'конфета', 'ракета'],
  ]);
  sequences.splice(0, sequences.length, ...reshuffled);
  playButton.textContent = '▶️ Проиграть последовательность';
  setupRound();
}

playButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    speakCurrent();
  }
});

clearButton.addEventListener('click', () => clearSelection());
checkButton.addEventListener('click', () => handleCheck());

setupRound();
