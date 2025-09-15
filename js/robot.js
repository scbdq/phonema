const {
  speakSequence,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  clearChildren,
  initSpeechWarmup,
} = window.GameUtils;

const grid = document.getElementById('syllable-grid');
const playButton = document.getElementById('play-row');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const rounds = shuffle([
  { syllables: ['на', 'на', 'но'], oddIndex: 2 },
  { syllables: ['пу', 'пу', 'по'], oddIndex: 2 },
  { syllables: ['во', 'ва', 'во'], oddIndex: 1 },
  { syllables: ['ду', 'ду', 'да'], oddIndex: 2 },
  { syllables: ['ку', 'ку', 'ка'], oddIndex: 2 },
  { syllables: ['ма', 'мо', 'мо'], oddIndex: 0 },
  { syllables: ['то', 'то', 'ту'], oddIndex: 2 },
  { syllables: ['ва', 'ва', 'ву'], oddIndex: 2 },
]);

let currentIndex = 0;
let score = 0;
let finished = false;

function showRound() {
  if (currentIndex >= rounds.length) {
    finishGame();
    return;
  }
  const round = rounds[currentIndex];
  clearChildren(grid);
  round.syllables.forEach((syllable, idx) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'word-card';
    card.dataset.index = String(idx);
    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = '🤖';
    emoji.setAttribute('aria-hidden', 'true');
    card.appendChild(emoji);
    const label = document.createElement('strong');
    label.textContent = syllable.toUpperCase();
    card.appendChild(label);
    card.addEventListener('click', () => handleAnswer(card));
    grid.appendChild(card);
  });
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Какой слог произнес робот неправильно?', 'info');
  speakRow();
}

function speakRow() {
  const round = rounds[currentIndex];
  speakSequence(round.syllables, { speechOptions: { rate: 1.05 }, pause: 280 });
}

async function handleAnswer(card) {
  if (finished) return;
  const round = rounds[currentIndex];
  const chosenIndex = Number(card.dataset.index);
  const cards = Array.from(grid.querySelectorAll('.word-card'));
  cards.forEach(btn => (btn.disabled = true));
  if (chosenIndex === round.oddIndex) {
    score += 1;
    card.classList.add('correct');
    setFeedback(feedback, 'Верно! Этот слог звучал иначе.', 'success');
  } else {
    card.classList.add('wrong');
    cards[round.oddIndex].classList.add('correct');
    setFeedback(feedback, 'Попробуйте ещё раз — другой слог отличался.', 'error');
  }
  currentIndex += 1;
  await wait(1300);
  cards.forEach(btn => {
    btn.classList.remove('correct', 'wrong');
    btn.disabled = false;
  });
  showRound();
}

function finishGame() {
  finished = true;
  clearChildren(grid);
  setFeedback(feedback, `Отлично! Вы нашли ${score} ошибок из ${rounds.length}.`, 'success');
  updateProgress(progress, rounds.length, rounds.length);
  playButton.textContent = '🔁 Сыграть снова';
}

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(rounds);
  rounds.splice(0, rounds.length, ...reshuffled);
  playButton.textContent = '▶️ Проиграть ряд';
  showRound();
}

playButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    speakRow();
  }
});

showRound();
