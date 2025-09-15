const {
  speak,
  wait,
  shuffle,
  setFeedback,
  updateProgress,
  initSpeechWarmup,
} = window.GameUtils;

const targetGreeting = document.getElementById('target-greeting');
const currentRow = document.getElementById('current-row');
const playButton = document.getElementById('play-rows');
const greetButton = document.getElementById('greet-button');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const rounds = shuffle([
  {
    greeting: 'до-ду',
    rows: ['но-ну', 'по-пу', 'ко-кы', 'то-та', 'мо-му', 'во-ву', 'бо-бу', 'бо-ба', 'до-да', 'до-ду'],
  },
  {
    greeting: 'по-пу',
    rows: ['ко-ку', 'мо-му', 'по-пу', 'до-да', 'во-ву', 'по-пу', 'бо-бу'],
  },
  {
    greeting: 'ты-ти',
    rows: ['мы-ми', 'вы-ви', 'ты-ти', 'ды-ди', 'пы-пи'],
  },
  {
    greeting: 'ту-тю',
    rows: ['ту-тю', 'бу-бю', 'ву-вю', 'ту-тю', 'ду-дю'],
  },
]);

let currentIndex = 0;
let score = 0;
let playing = false;
let responded = false;
let currentRound;

function showRound() {
  if (currentIndex >= rounds.length) {
    finishGame();
    return;
  }
  currentRound = rounds[currentIndex];
  targetGreeting.textContent = currentRound.greeting;
  currentRow.textContent = '—';
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Нажмите «Начать прослушивание» и будьте готовы поприветствовать гостя.', 'info');
  greetButton.disabled = true;
}

async function playSequence() {
  if (playing) return;
  responded = false;
  playing = true;
  greetButton.disabled = false;
  setFeedback(feedback, 'Слушайте внимательно!', 'info');
  for (const row of currentRound.rows) {
    if (!playing) break;
    currentRow.textContent = row;
    await speak(row, { rate: 1.05 });
    await wait(350);
  }
  playing = false;
  greetButton.disabled = true;
  if (!responded) {
    setFeedback(feedback, 'Приветствие прошло мимо. Попробуйте ещё раз!', 'error');
    currentRow.textContent = '—';
  }
}

async function handleGreet() {
  if (!playing) return;
  responded = true;
  playing = false;
  greetButton.disabled = true;
  const heard = currentRow.textContent;
  if (heard === currentRound.greeting) {
    score += 1;
    setFeedback(feedback, 'Ура! Вы поприветствовали гостя вовремя.', 'success');
    currentIndex += 1;
    await wait(1400);
    showRound();
  } else {
    setFeedback(feedback, `Это было «${heard}». Ждите приветствие «${currentRound.greeting}».`, 'error');
    await wait(1200);
    currentRow.textContent = '—';
  }
}

function finishGame() {
  setFeedback(feedback, `Путешественник доволен! Успешных приветствий: ${score} из ${rounds.length}.`, 'success');
  updateProgress(progress, rounds.length, rounds.length);
  playButton.textContent = '🔁 Сыграть снова';
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(rounds);
  rounds.splice(0, rounds.length, ...reshuffled);
  playButton.textContent = '▶️ Начать прослушивание';
  showRound();
}

playButton.addEventListener('click', () => {
  if (currentIndex >= rounds.length) {
    restartGame();
  } else {
    playSequence();
  }
});

greetButton.addEventListener('click', handleGreet);

showRound();
