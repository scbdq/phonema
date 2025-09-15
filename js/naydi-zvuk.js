const {
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  clearChildren,
  initSpeechWarmup,
} = window.GameUtils;

const grid = document.getElementById('sound-grid');
const targetSound = document.getElementById('target-sound');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const rounds = shuffle([
  {
    sound: 'А',
    words: [
      { word: 'Аня', hasSound: true },
      { word: 'кот', hasSound: false },
      { word: 'рука', hasSound: true },
      { word: 'бык', hasSound: false },
      { word: 'аист', hasSound: true },
      { word: 'щека', hasSound: false },
    ],
  },
  {
    sound: 'О',
    words: [
      { word: 'Оля', hasSound: true },
      { word: 'мак', hasSound: false },
      { word: 'осы', hasSound: true },
      { word: 'дно', hasSound: true },
      { word: 'утка', hasSound: false },
      { word: 'перо', hasSound: true },
    ],
  },
  {
    sound: 'У',
    words: [
      { word: 'ухо', hasSound: true },
      { word: 'сок', hasSound: false },
      { word: 'улей', hasSound: true },
      { word: 'мак', hasSound: false },
      { word: 'утка', hasSound: true },
      { word: 'лук', hasSound: true },
    ],
  },
  {
    sound: 'Т',
    words: [
      { word: 'кот', hasSound: true },
      { word: 'рот', hasSound: true },
      { word: 'сок', hasSound: false },
      { word: 'крот', hasSound: true },
      { word: 'бык', hasSound: false },
      { word: 'дом', hasSound: false },
    ],
  },
  {
    sound: 'К',
    words: [
      { word: 'паук', hasSound: true },
      { word: 'суп', hasSound: false },
      { word: 'мак', hasSound: true },
      { word: 'рот', hasSound: false },
      { word: 'кот', hasSound: true },
      { word: 'сыр', hasSound: false },
    ],
  },
  {
    sound: 'С',
    words: [
      { word: 'сом', hasSound: true },
      { word: 'дом', hasSound: false },
      { word: 'нос', hasSound: true },
      { word: 'кот', hasSound: false },
      { word: 'сыр', hasSound: true },
      { word: 'лук', hasSound: false },
    ],
  },
  {
    sound: 'М',
    words: [
      { word: 'мак', hasSound: true },
      { word: 'лук', hasSound: false },
      { word: 'дом', hasSound: true },
      { word: 'нос', hasSound: false },
      { word: 'сом', hasSound: true },
      { word: 'рыба', hasSound: false },
    ],
  },
]);

let currentIndex = 0;
let score = 0;
let found = 0;
let totalWithSound = 0;

function showRound() {
  if (currentIndex >= rounds.length) {
    finishGame();
    return;
  }

  const round = rounds[currentIndex];
  targetSound.textContent = round.sound;
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Нажимайте на карточки со словами, в которых слышится нужный звук.', 'info');

  clearChildren(grid);
  found = 0;
  totalWithSound = round.words.filter(item => item.hasSound).length;

  shuffle(round.words.slice()).forEach(item => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'word-card';
    card.dataset.word = item.word;
    card.dataset.correct = item.hasSound ? 'true' : 'false';
    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = item.hasSound ? '✅' : '⭐️';
    emoji.setAttribute('aria-hidden', 'true');
    card.appendChild(emoji);
    const label = document.createElement('strong');
    label.textContent = item.word.charAt(0).toUpperCase() + item.word.slice(1);
    card.appendChild(label);
    card.addEventListener('click', () => handleChoice(card));
    grid.appendChild(card);
  });
}

async function handleChoice(card) {
  const isCorrect = card.dataset.correct === 'true';
  const word = card.dataset.word;
  await speak(word, { rate: 1.05 });

  if (card.classList.contains('correct')) {
    return;
  }

  if (isCorrect) {
    card.classList.add('correct');
    found += 1;
    setFeedback(feedback, `Верно! В слове «${word.toUpperCase()}» есть звук ${rounds[currentIndex].sound}.`, 'success');
    if (found >= totalWithSound) {
      score += 1;
      await wait(1200);
      currentIndex += 1;
      showRound();
    }
  } else {
    card.classList.add('wrong');
    setFeedback(feedback, `В слове «${word.toUpperCase()}» нет звука ${rounds[currentIndex].sound}.`, 'error');
    setTimeout(() => {
      card.classList.remove('wrong');
    }, 900);
  }
}

function finishGame() {
  setFeedback(feedback, `Отличная работа! Вы нашли звук в ${score} наборах из ${rounds.length}.`, 'success');
  updateProgress(progress, rounds.length, rounds.length);
}

showRound();
