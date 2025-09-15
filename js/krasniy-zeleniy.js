const {
  speak,
  wait,
  shuffle,
  setFeedback,
  updateProgress,
  disableButtons,
  enableButtons,
  cancelSpeech,
  initSpeechWarmup,
} = window.GameUtils;

const objectCard = document.getElementById('object-card');
const emojiSpan = objectCard.querySelector('.emoji');
const objectName = document.getElementById('object-name');
const repeatButton = document.getElementById('repeat-word');
const correctButton = document.getElementById('answer-correct');
const incorrectButton = document.getElementById('answer-incorrect');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const objects = [
  {
    title: 'Банан',
    emoji: '🍌',
    sequence: [
      { word: 'кабан', correct: false },
      { word: 'наган', correct: false },
      { word: 'банан', correct: true },
      { word: 'ладан', correct: false },
      { word: 'банан', correct: true },
      { word: 'набан', correct: false },
      { word: 'банан', correct: true },
      { word: 'казан', correct: false },
    ],
  },
  {
    title: 'Будка',
    emoji: '🐶',
    sequence: [
      { word: 'будка', correct: true },
      { word: 'дудка', correct: false },
      { word: 'утка', correct: false },
      { word: 'будка', correct: true },
      { word: 'буква', correct: false },
      { word: 'будка', correct: true },
      { word: 'куртка', correct: false },
      { word: 'будка', correct: true },
    ],
  },
  {
    title: 'Панама',
    emoji: '👒',
    sequence: [
      { word: 'фанама', correct: false },
      { word: 'катама', correct: false },
      { word: 'панама', correct: true },
      { word: 'томана', correct: false },
      { word: 'самана', correct: false },
      { word: 'вадама', correct: false },
      { word: 'панама', correct: true },
      { word: 'напама', correct: false },
    ],
  },
];

const rounds = shuffle(objects).flatMap(item =>
  item.sequence.map(step => ({
    ...step,
    title: item.title,
    emoji: item.emoji,
  })),
);

let currentIndex = 0;
let score = 0;
let isFinished = false;

const buttons = [repeatButton, correctButton, incorrectButton];

function showRound() {
  if (currentIndex >= rounds.length) {
    finishGame();
    return;
  }

  const round = rounds[currentIndex];
  emojiSpan.textContent = round.emoji;
  objectName.textContent = round.title;
  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Слушайте слово и выберите ответ.', 'info');
  enableButtons(buttons);
  playCurrentWord();
}

function playCurrentWord() {
  const round = rounds[currentIndex];
  cancelSpeech();
  speak(round.word, { rate: 1.05, pitch: round.correct ? 1.1 : 0.95 });
}

async function checkAnswer(isCorrectAnswer) {
  if (isFinished) return;
  disableButtons(buttons);
  const round = rounds[currentIndex];
  const isRight = isCorrectAnswer === round.correct;
  if (isRight) {
    score += 1;
    setFeedback(feedback, 'Отлично! Вы услышали правильно.', 'success');
  } else {
    const hint = round.correct ? 'Это слово было произнесено верно.' : 'В слове была ошибка.';
    setFeedback(feedback, `Почти! ${hint}`, 'error');
  }

  currentIndex += 1;
  await wait(1300);
  if (currentIndex < rounds.length) {
    showRound();
  } else {
    finishGame();
  }
}

function finishGame() {
  isFinished = true;
  updateProgress(progress, rounds.length, rounds.length);
  emojiSpan.textContent = '⭐️';
  objectName.textContent = 'Вы большие молодцы!';
  setFeedback(
    feedback,
    `Игра завершена! Правильных ответов: ${score} из ${rounds.length}. Нажмите «Сыграть снова», чтобы повторить.`,
    'success',
  );
  repeatButton.textContent = '🔁 Сыграть снова';
  repeatButton.disabled = false;
  correctButton.disabled = true;
  incorrectButton.disabled = true;
}

repeatButton.addEventListener('click', () => {
  if (isFinished) {
    restartGame();
  } else {
    playCurrentWord();
  }
});

correctButton.addEventListener('click', () => checkAnswer(true));
incorrectButton.addEventListener('click', () => checkAnswer(false));

function restartGame() {
  currentIndex = 0;
  score = 0;
  isFinished = false;
  rounds.splice(0, rounds.length, ...shuffle(objects).flatMap(item =>
    item.sequence.map(step => ({ ...step, title: item.title, emoji: item.emoji })),
  ));
  repeatButton.textContent = '🔁 Послушать ещё раз';
  showRound();
}

showRound();
