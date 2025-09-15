const {
  speakSequence,
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  wait,
  initSpeechWarmup,
} = window.GameUtils;

const hardCard = document.getElementById('hard-card');
const softCard = document.getElementById('soft-card');
const hardText = document.getElementById('hard-text');
const softText = document.getElementById('soft-text');
const playButton = document.getElementById('play-syllables');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');
const container = document.getElementById('alien-names');

initSpeechWarmup();

const pairs = shuffle([
  { hard: 'па', soft: 'пя' },
  { hard: 'ма', soft: 'мя' },
  { hard: 'ва', soft: 'вя' },
  { hard: 'та', soft: 'тя' },
  { hard: 'ба', soft: 'бя' },
  { hard: 'да', soft: 'дя' },
  { hard: 'по', soft: 'пё' },
  { hard: 'мо', soft: 'мё' },
  { hard: 'во', soft: 'вё' },
  { hard: 'то', soft: 'тё' },
  { hard: 'бо', soft: 'бё' },
  { hard: 'до', soft: 'дё' },
  { hard: 'пу', soft: 'пю' },
  { hard: 'му', soft: 'мю' },
  { hard: 'ву', soft: 'вю' },
  { hard: 'ту', soft: 'тю' },
  { hard: 'бу', soft: 'бю' },
  { hard: 'ду', soft: 'дю' },
  { hard: 'пы', soft: 'пи' },
  { hard: 'мы', soft: 'ми' },
  { hard: 'вы', soft: 'ви' },
  { hard: 'ты', soft: 'ти' },
  { hard: 'бы', soft: 'би' },
  { hard: 'ды', soft: 'ди' },
]);

let currentIndex = 0;
let score = 0;
let finished = false;

function showRound() {
  if (currentIndex >= pairs.length) {
    finishGame();
    return;
  }
  const pair = pairs[currentIndex];
  hardText.textContent = pair.hard.toUpperCase();
  softText.textContent = pair.soft.toUpperCase();

  if (Math.random() > 0.5) {
    container.insertBefore(softCard, hardCard);
  } else {
    container.insertBefore(hardCard, softCard);
  }

  updateProgress(progress, currentIndex + 1, pairs.length);
  setFeedback(feedback, 'Нажмите на имя младшего брата с мягким звучанием.', 'info');
  speak(pair.hard, { rate: 1.05 });
}

function repeatPair() {
  const pair = pairs[currentIndex];
  speakSequence([pair.hard, pair.soft], { speechOptions: { rate: 1.05 }, pause: 350 });
}

async function handleAnswer(isSoft) {
  if (finished) return;
  const pair = pairs[currentIndex];
  if (isSoft) {
    score += 1;
    setFeedback(feedback, `Верно! Имя младшего брата звучит как «${pair.soft.toUpperCase()}».`, 'success');
    currentIndex += 1;
    await wait(1200);
    showRound();
  } else {
    setFeedback(feedback, `Это имя старшего брата. Младшего зовут «${pair.soft.toUpperCase()}».`, 'error');
  }
}

function finishGame() {
  finished = true;
  setFeedback(feedback, `Отлично! Вы нашли мягкие имена ${score} раз из ${pairs.length}.`, 'success');
  updateProgress(progress, pairs.length, pairs.length);
  playButton.textContent = '🔁 Сыграть снова';
}

function restartGame() {
  finished = false;
  currentIndex = 0;
  score = 0;
  const reshuffled = shuffle(pairs);
  pairs.splice(0, pairs.length, ...reshuffled);
  playButton.textContent = '▶️ Проиграть слоги';
  showRound();
}

playButton.addEventListener('click', () => {
  if (finished) {
    restartGame();
  } else {
    repeatPair();
  }
});

hardCard.addEventListener('click', () => handleAnswer(false));
softCard.addEventListener('click', () => handleAnswer(true));

showRound();
