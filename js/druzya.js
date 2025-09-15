const {
  speak,
  speakSequence,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  initSpeechWarmup,
} = window.GameUtils;

const firstCard = document.getElementById('first-child');
const secondCard = document.getElementById('second-child');
const firstName = document.getElementById('first-name');
const secondName = document.getElementById('second-name');
const playButton = document.getElementById('play-names');
const sameButton = document.getElementById('btn-same');
const differentButton = document.getElementById('btn-different');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const rounds = shuffle([
  { names: ['Толя', 'Коля'], same: false },
  { names: ['Толя', 'Толя'], same: true },
  { names: ['Люба', 'Люда'], same: false },
  { names: ['Саша', 'Саша'], same: true },
  { names: ['Миша', 'Маша'], same: false },
  { names: ['Соня', 'Саня'], same: false },
  { names: ['Дима', 'Дина'], same: false },
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
  firstName.textContent = round.names[0];
  secondName.textContent = round.names[1];
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Слушайте, как звучат имена друзей.', 'info');
  playNames();
}

function playNames() {
  const round = rounds[currentIndex];
  speakSequence(round.names, { speechOptions: { rate: 1.05, pitch: 1.05 }, pause: 500 });
}

async function handleAnswer(isSame) {
  if (finished) return;
  sameButton.disabled = true;
  differentButton.disabled = true;

  const round = rounds[currentIndex];
  const correct = round.same === isSame;
  if (correct) {
    score += 1;
    setFeedback(feedback, 'Точно! Вы верно услышали имена.', 'success');
  } else if (round.same) {
    setFeedback(feedback, 'Имени звучали одинаково. Попробуйте ещё раз.', 'error');
  } else {
    setFeedback(feedback, 'Имена звучали по-разному.', 'error');
  }

  currentIndex += 1;
  await wait(1300);
  sameButton.disabled = false;
  differentButton.disabled = false;
  showRound();
}

function finishGame() {
  finished = true;
  updateProgress(progress, rounds.length, rounds.length);
  setFeedback(feedback, `Отличная работа! Верных ответов: ${score} из ${rounds.length}. Нажмите «Сыграть снова», чтобы повторить.`, 'success');
  playButton.textContent = '🔁 Сыграть снова';
  playButton.disabled = false;
  sameButton.disabled = true;
  differentButton.disabled = true;
}

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(rounds);
  rounds.splice(0, rounds.length, ...reshuffled);
  playButton.textContent = '▶️ Озвучить имена';
  sameButton.disabled = false;
  differentButton.disabled = false;
  showRound();
}

playButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    playNames();
  }
});

firstCard.addEventListener('click', () => speak(rounds[currentIndex].names[0], { rate: 1.05, pitch: 1.05 }));
secondCard.addEventListener('click', () => speak(rounds[currentIndex].names[1], { rate: 1.05, pitch: 1.05 }));

sameButton.addEventListener('click', () => handleAnswer(true));
differentButton.addEventListener('click', () => handleAnswer(false));

showRound();
