const {
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  initSpeechWarmup,
} = window.GameUtils;

const wordEl = document.getElementById('count-word');
const playButton = document.getElementById('play-count-word');
const numbersRow = document.getElementById('numbers-row');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const words = shuffle([
  { word: 'рак', count: 3 },
  { word: 'рука', count: 4 },
  { word: 'сон', count: 3 },
  { word: 'суп', count: 3 },
  { word: 'муха', count: 4 },
  { word: 'рыба', count: 4 },
  { word: 'лук', count: 3 },
  { word: 'ваза', count: 4 },
  { word: 'дом', count: 3 },
  { word: 'лужа', count: 4 },
]);

let currentIndex = 0;
let score = 0;

function buildNumberButtons() {
  numbersRow.innerHTML = '';
  for (let i = 1; i <= 5; i += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = String(i);
    btn.addEventListener('click', () => handleAnswer(i));
    numbersRow.appendChild(btn);
  }
}

function showRound() {
  if (currentIndex >= words.length) {
    finishGame();
    return;
  }
  const { word } = words[currentIndex];
  wordEl.textContent = word.charAt(0).toUpperCase() + word.slice(1);
  updateProgress(progress, currentIndex + 1, words.length);
  setFeedback(feedback, 'Послушайте слово и выберите число звуков.', 'info');
  speakWord();
}

function speakWord() {
  const { word } = words[currentIndex];
  speak(word, { rate: 1.05 });
}

async function handleAnswer(selected) {
  const { count } = words[currentIndex];
  if (selected === count) {
    score += 1;
    setFeedback(feedback, 'Верно! Звуков именно столько.', 'success');
    currentIndex += 1;
    await wait(1200);
    showRound();
  } else {
    setFeedback(feedback, 'Попробуйте ещё раз – переслушайте слово.', 'error');
  }
}

function finishGame() {
  setFeedback(feedback, `Отлично! Правильных ответов: ${score} из ${words.length}.`, 'success');
  updateProgress(progress, words.length, words.length);
}

playButton.addEventListener('click', speakWord);

buildNumberButtons();
showRound();
