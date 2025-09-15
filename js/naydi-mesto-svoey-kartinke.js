const {
  speakSequence,
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  initSpeechWarmup,
} = window.GameUtils;

const optionLeft = document.getElementById('option-left');
const optionRight = document.getElementById('option-right');
const optionLeftText = document.getElementById('option-left-text');
const optionRightText = document.getElementById('option-right-text');
const bottomCard = document.getElementById('bottom-card');
const bottomWord = document.getElementById('bottom-word');
const playButton = document.getElementById('play-all');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const emojiMap = {
  лак: '🎨',
  сок: '🥤',
  рак: '🦞',
  мышка: '🐭',
  кошка: '🐱',
  мишка: '🧸',
  дом: '🏠',
  мак: '🌺',
  сом: '🐟',
  дулка: '🧁',
  вагон: '🚃',
  утка: '🦆',
  бантик: '🎀',
  бинк: '🔤',
  фантик: '🍬',
};

const baseRounds = [
  { options: ['лак', 'сок'], target: 'рак', similar: 'лак' },
  { options: ['мышка', 'кошка'], target: 'мишка', similar: 'мышка' },
  { options: ['дом', 'мак'], target: 'сом', similar: 'дом' },
  { options: ['дулка', 'вагон'], target: 'утка', similar: 'дулка' },
  { options: ['бантик', 'бинк'], target: 'фантик', similar: 'бантик' },
];

const rounds = shuffle(baseRounds.slice()).map(round => {
  const options = shuffle(round.options.slice());
  return {
    options,
    target: round.target,
    similar: round.similar,
    correctIndex: options.indexOf(round.similar),
  };
});

let currentIndex = 0;
let score = 0;
let finished = false;

function showRound() {
  if (currentIndex >= rounds.length) {
    finishGame();
    return;
  }
  const round = rounds[currentIndex];
  optionLeftText.textContent = capitalize(round.options[0]);
  optionRightText.textContent = capitalize(round.options[1]);
  optionLeft.querySelector('.emoji').textContent = emojiMap[round.options[0]] || '🔤';
  optionRight.querySelector('.emoji').textContent = emojiMap[round.options[1]] || '🔤';
  bottomWord.textContent = capitalize(round.target);
  bottomCard.querySelector('.emoji').textContent = emojiMap[round.target] || '🎯';
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Слушайте и выберите карточку, звучащую похоже на нижнее слово.', 'info');
  speakAll();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function speakAll() {
  const round = rounds[currentIndex];
  speakSequence([...round.options, round.target], { speechOptions: { rate: 1.05 } });
}

async function handleChoice(index) {
  if (finished) return;
  const round = rounds[currentIndex];
  optionLeft.disabled = true;
  optionRight.disabled = true;
  const cards = [optionLeft, optionRight];
  const chosenCard = cards[index];
  if (index === round.correctIndex) {
    score += 1;
    chosenCard.classList.add('correct');
    setFeedback(feedback, 'Правильно! Эти слова звучат похоже.', 'success');
  } else {
    chosenCard.classList.add('wrong');
    cards[round.correctIndex].classList.add('correct');
    setFeedback(feedback, 'Попробуйте ещё раз: нижнее слово звучало иначе.', 'error');
  }
  currentIndex += 1;
  await wait(1400);
  cards.forEach(card => {
    card.classList.remove('correct', 'wrong');
    card.disabled = false;
  });
  showRound();
}

function finishGame() {
  finished = true;
  setFeedback(feedback, `Отлично! Вы подобрали ${score} пар из ${rounds.length}. Нажмите «Сыграть снова», чтобы повторить.`, 'success');
  updateProgress(progress, rounds.length, rounds.length);
  playButton.textContent = '🔁 Сыграть снова';
  optionLeft.disabled = true;
  optionRight.disabled = true;
}

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(baseRounds.slice()).map(round => {
    const options = shuffle(round.options.slice());
    return {
      options,
      target: round.target,
      similar: round.similar,
      correctIndex: options.indexOf(round.similar),
    };
  });
  rounds.splice(0, rounds.length, ...reshuffled);
  playButton.textContent = '▶️ Озвучить все слова';
  optionLeft.disabled = false;
  optionRight.disabled = false;
  showRound();
}

optionLeft.addEventListener('click', () => handleChoice(0));
optionRight.addEventListener('click', () => handleChoice(1));
playButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    speakAll();
  }
});

bottomCard.addEventListener('click', () => speak(rounds[currentIndex].target, { rate: 1.05 }));

showRound();
