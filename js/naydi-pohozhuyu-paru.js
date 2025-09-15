const {
  speak,
  speakSequence,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  initSpeechWarmup,
  cancelSpeech,
} = window.GameUtils;

const leftCard = document.getElementById('left-card');
const rightCard = document.getElementById('right-card');
const leftWord = document.getElementById('left-word');
const rightWord = document.getElementById('right-word');
const progress = document.getElementById('progress');
const feedback = document.getElementById('feedback');
const playPairBtn = document.getElementById('play-pair');
const similarBtn = document.getElementById('btn-similar');
const differentBtn = document.getElementById('btn-different');

initSpeechWarmup();

const rounds = shuffle([
  { words: ['лиса', 'коса'], emoji: ['🦊', '🌾'], similar: false },
  { words: ['конфета', 'кубик'], emoji: ['🍬', '🧊'], similar: false },
  { words: ['батон', 'бутон'], emoji: ['🍞', '🌷'], similar: true },
  { words: ['банка', 'манка'], emoji: ['🥫', '🥣'], similar: true },
  { words: ['бегемот', 'танк'], emoji: ['🦛', '🚜'], similar: false },
  { words: ['дом', 'ком'], emoji: ['🏠', '🪨'], similar: true },
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
  leftWord.textContent = capitalize(round.words[0]);
  rightWord.textContent = capitalize(round.words[1]);
  leftCard.querySelector('.emoji').textContent = round.emoji[0];
  rightCard.querySelector('.emoji').textContent = round.emoji[1];
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Слушайте слова и определите, похожи ли они по звучанию.', 'info');
  speakPair();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function speakPair() {
  const round = rounds[currentIndex];
  cancelSpeech();
  speakSequence(round.words, { speechOptions: { rate: 1.05, pitch: 1.08 }, pause: 500 });
}

async function handleAnswer(isSimilar) {
  if (finished) return;
  similarBtn.disabled = true;
  differentBtn.disabled = true;

  const round = rounds[currentIndex];
  const correct = round.similar === isSimilar;
  if (correct) {
    score += 1;
    setFeedback(feedback, 'Верно! Эти слова звучат подходяще.', 'success');
  } else if (round.similar) {
    setFeedback(feedback, 'Эти слова всё-таки звучат похоже.', 'error');
  } else {
    setFeedback(feedback, 'Слова звучат по-разному.', 'error');
  }

  currentIndex += 1;
  await wait(1300);
  similarBtn.disabled = false;
  differentBtn.disabled = false;
  showRound();
}

function finishGame() {
  finished = true;
  updateProgress(progress, rounds.length, rounds.length);
  setFeedback(feedback, `Готово! Правильных ответов: ${score} из ${rounds.length}. Нажмите кнопку «Играть снова», чтобы повторить.`, 'success');
  playPairBtn.textContent = '🔁 Играть снова';
  playPairBtn.disabled = false;
  similarBtn.disabled = true;
  differentBtn.disabled = true;
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  finished = false;
  const reshuffled = shuffle(rounds);
  rounds.splice(0, rounds.length, ...reshuffled);
  playPairBtn.textContent = '▶️ Прослушать слова';
  similarBtn.disabled = false;
  differentBtn.disabled = false;
  showRound();
}

playPairBtn.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    speakPair();
  }
});

similarBtn.addEventListener('click', () => handleAnswer(true));
differentBtn.addEventListener('click', () => handleAnswer(false));

leftCard.addEventListener('click', () => speak(rounds[currentIndex].words[0], { rate: 1.05, pitch: 1.08 }));
rightCard.addEventListener('click', () => speak(rounds[currentIndex].words[1], { rate: 1.05, pitch: 1.08 }));

showRound();
