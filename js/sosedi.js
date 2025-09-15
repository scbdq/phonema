const {
  speak,
  speakSequence,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  clearChildren,
  initSpeechWarmup,
} = window.GameUtils;

const cardsContainer = document.getElementById('cards-container');
const house = document.getElementById('house');
const houseInfo = house.querySelector('.stack');
const checkButton = document.getElementById('check-button');
const resetButton = document.getElementById('reset-button');
const listenButton = document.getElementById('listen-button');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const emojiMap = {
  дуб: '🌳',
  суп: '🍲',
  мак: '🌺',
  бак: '🛢️',
  букет: '💐',
  пакет: '🛍️',
  бок: '🥊',
  сок: '🧃',
  мука: '🌾',
  рука: '✋',
};

const pairs = [
  { words: ['дуб', 'суп'] },
  { words: ['мак', 'бак'] },
  { words: ['букет', 'пакет'] },
  { words: ['бок', 'сок'] },
  { words: ['мука', 'рука'] },
];

const rounds = shuffle(pairs.slice());
let currentIndex = 0;
let score = 0;
let finished = false;

function createCard(word, isNeighbor) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'word-card';
  card.dataset.word = word;
  card.dataset.neighbor = isNeighbor ? 'true' : 'false';
  card.setAttribute('aria-pressed', 'false');
  const emoji = document.createElement('span');
  emoji.className = 'emoji';
  emoji.textContent = emojiMap[word] || '🔤';
  emoji.setAttribute('aria-hidden', 'true');
  card.appendChild(emoji);
  const label = document.createElement('strong');
  label.textContent = word.charAt(0).toUpperCase() + word.slice(1);
  card.appendChild(label);
  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

function handleCardClick(card) {
  if (finished) return;
  const inHouse = card.parentElement === house;
  if (inHouse) {
    cardsContainer.appendChild(card);
    card.classList.remove('selected');
    card.setAttribute('aria-pressed', 'false');
  } else {
    const selectedCount = house.querySelectorAll('.word-card').length;
    if (selectedCount >= 2) {
      setFeedback(feedback, 'В домике уже два соседа. Освободите место, чтобы переселить новую карточку.', 'info');
      return;
    }
    house.appendChild(card);
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');
  }
  updateHouseInfo();
  speak(card.dataset.word, { rate: 1.05, pitch: 1.05 });
}

function updateHouseInfo() {
  const hasCards = house.querySelectorAll('.word-card').length > 0;
  houseInfo.style.display = hasCards ? 'none' : 'flex';
}

function setupRound() {
  const pair = rounds[currentIndex];
  const otherWords = pairs
    .filter(p => p !== pair)
    .flatMap(p => p.words);
  const extras = shuffle(otherWords).slice(0, 2);
  const cards = shuffle([
    { word: pair.words[0], isNeighbor: true },
    { word: pair.words[1], isNeighbor: true },
    ...extras.map(word => ({ word, isNeighbor: false })),
  ]);

  clearChildren(cardsContainer);
  const existingCards = house.querySelectorAll('.word-card');
  existingCards.forEach(card => cardsContainer.appendChild(card));
  updateHouseInfo();

  cards.forEach(({ word, isNeighbor }) => {
    const card = createCard(word, isNeighbor);
    cardsContainer.appendChild(card);
  });

  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Выберите два слова, которые звучат похоже.', 'info');
  listenButton.disabled = false;
  checkButton.disabled = false;
  resetButton.disabled = false;
}

checkButton.addEventListener('click', async () => {
  if (finished) return;
  const selected = Array.from(house.querySelectorAll('.word-card'));
  if (selected.length !== 2) {
    setFeedback(feedback, 'Чтобы проверить, поселите в домике ровно два слова.', 'error');
    return;
  }

  const success = selected.every(card => card.dataset.neighbor === 'true');
  if (success) {
    score += 1;
    setFeedback(feedback, 'Здорово! Эти слова – настоящие соседи.', 'success');
    currentIndex += 1;
    await wait(1400);
    if (currentIndex >= rounds.length) {
      finishGame();
    } else {
      setupRound();
    }
  } else {
    setFeedback(feedback, 'Попробуйте ещё раз: здесь поселились не те соседи.', 'error');
  }
});

resetButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    setupRound();
  }
});

listenButton.addEventListener('click', () => {
  if (finished) return;
  const allWords = Array.from(cardsContainer.querySelectorAll('.word-card'))
    .concat(Array.from(house.querySelectorAll('.word-card')))
    .map(card => card.dataset.word);
  speakSequence(allWords, { speechOptions: { rate: 1.05 } });
});

function finishGame() {
  finished = true;
  updateProgress(progress, rounds.length, rounds.length);
  setFeedback(feedback, `Игра завершена! Правильных подборов: ${score} из ${rounds.length}. Нажмите «Сыграть снова», чтобы повторить.`, 'success');
  listenButton.disabled = true;
  checkButton.disabled = true;
  resetButton.textContent = '🔁 Сыграть снова';
  resetButton.disabled = false;
}

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(pairs.slice());
  rounds.splice(0, rounds.length, ...reshuffled);
  resetButton.textContent = 'Сбросить';
  setupRound();
}

setupRound();
