const {
  speak,
  shuffle,
  setFeedback,
  updateProgress,
  initSpeechWarmup,
} = window.GameUtils;

const itemsContainer = document.getElementById('items-container');
const boxLeft = document.getElementById('box-left');
const boxRight = document.getElementById('box-right');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const rounds = [
  {
    leftTitle: 'Коробка «А»',
    leftTag: 'Слова на звук А',
    rightTitle: 'Коробка «У»',
    rightTag: 'Слова на звук У',
    words: [
      { word: 'улей', side: 'right' },
      { word: 'утка', side: 'right' },
      { word: 'урна', side: 'right' },
      { word: 'уж', side: 'right' },
      { word: 'аист', side: 'left' },
      { word: 'астра', side: 'left' },
      { word: 'ананас', side: 'left' },
      { word: 'арбуз', side: 'left' },
    ],
  },
  {
    leftTitle: 'Коробка «М»',
    leftTag: 'Слова на звук М',
    rightTitle: 'Коробка «П»',
    rightTag: 'Слова на звук П',
    words: [
      { word: 'мак', side: 'left' },
      { word: 'мука', side: 'left' },
      { word: 'мышка', side: 'left' },
      { word: 'миска', side: 'left' },
      { word: 'палка', side: 'right' },
      { word: 'пакет', side: 'right' },
      { word: 'пони', side: 'right' },
      { word: 'паук', side: 'right' },
      { word: 'пират', side: 'right' },
    ],
  },
];

let currentIndex = 0;
let selected = null;

function showRound() {
  if (currentIndex >= rounds.length) {
    finishGame();
    return;
  }
  const round = rounds[currentIndex];
  setBoxContent(boxLeft, round.leftTitle, round.leftTag);
  setBoxContent(boxRight, round.rightTitle, round.rightTag);
  itemsContainer.innerHTML = '';
  selected = null;

  const words = shuffle(round.words.slice());
  words.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'word-card';
    card.dataset.side = item.side;
    card.dataset.word = item.word;
    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = '🧸';
    emoji.setAttribute('aria-hidden', 'true');
    card.appendChild(emoji);
    const label = document.createElement('strong');
    label.textContent = item.word.charAt(0).toUpperCase() + item.word.slice(1);
    card.appendChild(label);
    card.addEventListener('click', () => selectItem(card, item.word));
    itemsContainer.appendChild(card);
  });

  updateProgress(progress, currentIndex + 1, rounds.length);
  setFeedback(feedback, 'Выберите предмет и положите его в подходящую коробку.', 'info');
}

function setBoxContent(box, title, tagText) {
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'stack';
  stack.style.alignItems = 'center';
  const titleEl = document.createElement('strong');
  titleEl.textContent = title;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = tagText;
  stack.appendChild(titleEl);
  stack.appendChild(tag);
  box.appendChild(stack);
}

function selectItem(card, word) {
  if (card.classList.contains('placed')) return;
  if (selected) {
    selected.classList.remove('selected');
  }
  selected = card;
  card.classList.add('selected');
  speak(word, { rate: 1.05 });
  setFeedback(feedback, 'Теперь нажмите на коробку, чтобы положить предмет.', 'info');
}

function placeInBox(box, side) {
  if (!selected) {
    setFeedback(feedback, 'Сначала выберите предмет.', 'error');
    return;
  }
  const expectedSide = selected.dataset.side;
  if (expectedSide === side) {
    selected.classList.remove('selected');
    selected.classList.add('placed');
    selected.disabled = true;
    box.appendChild(selected);
    selected = null;
    setFeedback(feedback, 'Предмет на своём месте!', 'success');
    checkCompletion();
  } else {
    selected.classList.add('wrong');
    setFeedback(feedback, 'Эта коробка не подходит. Попробуйте другую.', 'error');
    setTimeout(() => selected.classList.remove('wrong'), 800);
  }
}

function checkCompletion() {
  const remaining = itemsContainer.querySelectorAll('.word-card:not(.placed)').length;
  if (remaining === 0) {
    setFeedback(feedback, 'Коробки заполнены правильно! Переходим к следующему заданию.', 'success');
    currentIndex += 1;
    setTimeout(showRound, 1300);
  }
}

boxLeft.addEventListener('click', () => placeInBox(boxLeft, 'left'));
boxRight.addEventListener('click', () => placeInBox(boxRight, 'right'));

function finishGame() {
  setFeedback(feedback, 'Вы отлично справились с уборкой!', 'success');
  updateProgress(progress, rounds.length, rounds.length);
}

showRound();
