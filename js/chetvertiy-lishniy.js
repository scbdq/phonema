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

const wordsGrid = document.getElementById('words-grid');
const playButton = document.getElementById('play-words');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const emojiMap = {
  мак: '🌺',
  бак: '🛢️',
  рак: '🦞',
  банан: '🍌',
  сок: '🧃',
  ком: '🪨',
  индюк: '🦃',
  дом: '🏠',
  ветка: '🌿',
  клетка: '🪺',
  диван: '🛋️',
  сетка: '🪢',
  ложки: '🥄',
  рожки: '🥐',
  ваза: '🏺',
  ножки: '🦶',
};

const rounds = shuffle([
  { words: ['мак', 'бак', 'рак', 'банан'], oddIndex: 3 },
  { words: ['сок', 'ком', 'индюк', 'дом'], oddIndex: 2 },
  { words: ['ветка', 'клетка', 'диван', 'сетка'], oddIndex: 2 },
  { words: ['ложки', 'рожки', 'ваза', 'ножки'], oddIndex: 2 },
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
  clearChildren(wordsGrid);
  round.words.forEach((word, idx) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'word-card';
    card.dataset.index = String(idx);
    card.dataset.word = word;
    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = emojiMap[word] || '🔤';
    emoji.setAttribute('aria-hidden', 'true');
    card.appendChild(emoji);
    const label = document.createElement('strong');
    label.textContent = word.charAt(0).toUpperCase() + word.slice(1);
    card.appendChild(label);
    card.addEventListener('click', () => handleAnswer(card));
    wordsGrid.appendChild(card);
  });

  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Найдите слово, которое отличается по звучанию.', 'info');
  playSequence();
}

function playSequence() {
  const round = rounds[currentIndex];
  speakSequence(round.words, { speechOptions: { rate: 1.05 } });
}

async function handleAnswer(card) {
  if (finished) return;
  const round = rounds[currentIndex];
  const chosenIndex = Number(card.dataset.index);
  const cards = Array.from(wordsGrid.querySelectorAll('.word-card'));
  cards.forEach(btn => (btn.disabled = true));

  if (chosenIndex === round.oddIndex) {
    score += 1;
    card.classList.add('correct');
    setFeedback(feedback, 'Отлично! Это слово действительно звучит иначе.', 'success');
  } else {
    card.classList.add('wrong');
    const correctCard = cards[round.oddIndex];
    correctCard.classList.add('correct');
    setFeedback(feedback, 'Лишнее слово было другим. Послушайте внимательно ещё раз.', 'error');
  }

  currentIndex += 1;
  await wait(1500);
  cards.forEach(btn => btn.classList.remove('correct', 'wrong'));
  cards.forEach(btn => (btn.disabled = false));
  showRound();
}

function finishGame() {
  finished = true;
  clearChildren(wordsGrid);
  setFeedback(feedback, `Готово! Вы нашли ${score} лишних слов из ${rounds.length}. Нажмите «Сыграть снова», чтобы повторить.`, 'success');
  updateProgress(progress, rounds.length, rounds.length);
  playButton.textContent = '🔁 Сыграть снова';
}

playButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    playSequence();
  }
});

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(rounds);
  rounds.splice(0, rounds.length, ...reshuffled);
  playButton.textContent = '▶️ Проиграть ряд';
  showRound();
}

showRound();
