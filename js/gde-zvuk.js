const {
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  initSpeechWarmup,
} = window.GameUtils;

const targetLetter = document.getElementById('target-letter');
const currentWordEl = document.getElementById('current-word');
const playButton = document.getElementById('play-word');
const startButton = document.getElementById('btn-start');
const endButton = document.getElementById('btn-end');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const dataset = shuffle([
  { sound: 'А', word: 'аист' },
  { sound: 'А', word: 'рука' },
  { sound: 'О', word: 'осы' },
  { sound: 'О', word: 'ослик' },
  { sound: 'У', word: 'утка' },
  { sound: 'У', word: 'улей' },
  { sound: 'И', word: 'ива' },
  { sound: 'И', word: 'пни' },
  { sound: 'М', word: 'дом' },
  { sound: 'М', word: 'мак' },
  { sound: 'Б', word: 'бык' },
  { sound: 'Б', word: 'бак' },
  { sound: 'Т', word: 'кот' },
  { sound: 'Т', word: 'рот' },
  { sound: 'Д', word: 'дуб' },
  { sound: 'Д', word: 'дом' },
  { sound: 'К', word: 'бык' },
  { sound: 'К', word: 'рак' },
  { sound: 'Г', word: 'гусь' },
  { sound: 'Г', word: 'гол' },
  { sound: 'П', word: 'пар' },
  { sound: 'П', word: 'суп' },
  { sound: 'В', word: 'волк' },
  { sound: 'В', word: 'воск' },
  { sound: 'Ж', word: 'жук' },
  { sound: 'Ж', word: 'жар' },
  { sound: 'З', word: 'зуб' },
  { sound: 'З', word: 'зонт' },
  { sound: 'Н', word: 'нос' },
  { sound: 'Н', word: 'сон' },
  { sound: 'Р', word: 'рак' },
  { sound: 'Р', word: 'пар' },
  { sound: 'Ш', word: 'шар' },
  { sound: 'Ш', word: 'шум' },
  { sound: 'Ч', word: 'чай' },
  { sound: 'Ч', word: 'мяч' },
]);

let currentIndex = 0;
let score = 0;

function showRound() {
  if (currentIndex >= dataset.length) {
    finishGame();
    return;
  }
  const { sound, word } = dataset[currentIndex];
  targetLetter.textContent = sound;
  currentWordEl.textContent = word.charAt(0).toUpperCase() + word.slice(1);
  updateProgress(progress, currentIndex + 1, dataset.length);
  setFeedback(feedback, 'Где слышится звук? Нажмите кнопку в начале или в конце слова.', 'info');
  playWord();
}

function determinePosition(sound, word) {
  const soundLower = sound.toLowerCase();
  const normalizedWord = word.toLowerCase();
  const atStart = normalizedWord.startsWith(soundLower);
  const atEnd = normalizedWord.endsWith(soundLower);
  if (atStart && !atEnd) return 'start';
  if (!atStart && atEnd) return 'end';
  if (atStart && atEnd) return 'start';
  // Если звук в середине, сравниваем по близости
  return atStart ? 'start' : 'end';
}

async function handleAnswer(position) {
  const { sound, word } = dataset[currentIndex];
  const correctPosition = determinePosition(sound, word);
  const isCorrect = position === correctPosition;
  if (isCorrect) {
    score += 1;
    setFeedback(feedback, 'Отлично! Вы правильно определили место звука.', 'success');
    currentIndex += 1;
    await wait(1200);
    showRound();
  } else {
    setFeedback(feedback, 'Попробуйте снова. Где звучит этот звук?', 'error');
  }
}

function playWord() {
  const { word } = dataset[currentIndex];
  speak(word, { rate: 1.05 });
}

function finishGame() {
  setFeedback(feedback, `Задача выполнена! Верных ответов: ${score} из ${dataset.length}.`, 'success');
  updateProgress(progress, dataset.length, dataset.length);
  playButton.textContent = '🔁 Сыграть снова';
}

startButton.addEventListener('click', () => handleAnswer('start'));
endButton.addEventListener('click', () => handleAnswer('end'));

playButton.addEventListener('click', () => {
  if (currentIndex >= dataset.length) {
    restartGame();
  } else {
    playWord();
  }
});

function restartGame() {
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(dataset);
  dataset.splice(0, dataset.length, ...reshuffled);
  playButton.textContent = '▶️ Проиграть слово';
  showRound();
}

showRound();
