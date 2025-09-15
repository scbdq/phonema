const {
  speak,
  shuffle,
  setFeedback,
  initSpeechWarmup,
} = window.GameUtils;

const field = document.getElementById('mushroom-field');
const basketOne = document.getElementById('basket-one');
const basketTwo = document.getElementById('basket-two');
const resetButton = document.getElementById('reset-game');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');

initSpeechWarmup();

const mushrooms = [
  { sound: 'а', double: false },
  { sound: 'ау', double: true },
  { sound: 'ан', double: true },
  { sound: 'о', double: false },
  { sound: 'оу', double: true },
  { sound: 'он', double: true },
  { sound: 'э', double: false },
  { sound: 'за', double: true },
  { sound: 'эи', double: true },
  { sound: 'у', double: false },
  { sound: 'уда', double: true },
  { sound: 'уз', double: true },
  { sound: 'и', double: false },
  { sound: 'иа', double: true },
  { sound: 'иу', double: true },
];

let currentMushrooms = [];
let selected = null;

function initGame() {
  currentMushrooms = shuffle(mushrooms.slice());
  field.innerHTML = '';
  basketOne.innerHTML = createBasketContent('Корзина «1 звук»', 'Для одиночных звуков');
  basketTwo.innerHTML = createBasketContent('Корзина «2 звука»', 'Для звукокомплексов');
  selected = null;

  currentMushrooms.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'word-card';
    card.dataset.index = String(index);
    card.dataset.double = item.double ? 'true' : 'false';
    const emoji = document.createElement('span');
    emoji.className = 'emoji';
    emoji.textContent = '🍄';
    emoji.setAttribute('aria-hidden', 'true');
    card.appendChild(emoji);
    const label = document.createElement('strong');
    label.textContent = `Грибок ${index + 1}`;
    card.appendChild(label);
    card.addEventListener('click', () => selectMushroom(card, item));
    field.appendChild(card);
  });
  updateProgress();
  setFeedback(feedback, 'Выберите грибок, чтобы послушать звук.', 'info');
}

function createBasketContent(title, subtitle) {
  const wrapper = document.createElement('div');
  wrapper.className = 'stack';
  wrapper.style.alignItems = 'center';
  const titleEl = document.createElement('strong');
  titleEl.textContent = title;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = subtitle;
  wrapper.appendChild(titleEl);
  wrapper.appendChild(tag);
  return wrapper;
}

function selectMushroom(card, item) {
  if (card.classList.contains('placed')) return;
  if (selected) {
    selected.card.classList.remove('selected');
  }
  selected = { card, item };
  card.classList.add('selected');
  speak(item.sound, { rate: 1.05 });
  setFeedback(feedback, 'Теперь выберите корзину, куда положить грибок.', 'info');
}

function placeInBasket(basket, expectsDouble) {
  if (!selected) {
    setFeedback(feedback, 'Сначала выберите грибок.', 'error');
    return;
  }
  const isCorrect = selected.item.double === expectsDouble;
  if (isCorrect) {
    selected.card.classList.remove('selected');
    selected.card.classList.add('placed');
    selected.card.disabled = true;
    basket.appendChild(selected.card);
    setFeedback(feedback, 'Грибок в правильной корзине!', 'success');
    selected = null;
    updateProgress();
    checkCompletion();
  } else {
    selected.card.classList.add('wrong');
    setFeedback(feedback, 'Попробуйте другую корзину.', 'error');
    setTimeout(() => {
      selected.card.classList.remove('wrong');
    }, 800);
  }
}

function updateProgress() {
  const remaining = field.querySelectorAll('.word-card:not(.placed)').length;
  progress.textContent = `Осталось ${remaining} грибов`;
}

function checkCompletion() {
  const remaining = field.querySelectorAll('.word-card:not(.placed)').length;
  if (remaining === 0) {
    setFeedback(feedback, 'Все грибы собраны! Отличная работа.', 'success');
  }
}

basketOne.addEventListener('click', () => placeInBasket(basketOne, false));
basketTwo.addEventListener('click', () => placeInBasket(basketTwo, true));
resetButton.addEventListener('click', () => {
  initGame();
});

initGame();
