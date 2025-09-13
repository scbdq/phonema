// DOM элементы
const objectImage = document.getElementById('object-image');
const greenButton = document.getElementById('green-button');
const redButton = document.getElementById('red-button');
const resultMessage = document.getElementById('result-message');

// Звуки обратной связи (по желанию)
const correctSound = new Audio('../sounds/krasniy-zeleniy/correct.mp3');
const incorrectSound = new Audio('../sounds/krasniy-zeleniy/incorrect.mp3');

// Данные игры
const gameData = [
    {
        image: "../images/krasniy-zeleniy/banana.png",
        correctWord: "банан",
        wrongWords: ["кабан", "наган", "ладан", "набан"]
    },
    {
        image: "../images/krasniy-zeleniy/apple.png",
        correctWord: "яблоко",
        wrongWords: ["яблако", "яблока"]
    },
    {
        image: "../images/krasniy-zeleniy/pear.png",
        correctWord: "груша",
        wrongWords: ["гуша", "груза", "груся"]
    }
    // Добавляй свои карточки
];

// Внутренние переменные
let currentIndex = 0;
let isCurrentWordCorrect = true; // Будет true если в этот раз проигран правильный вариант
let currentWord = "";

// Перемешивание данных (чтобы круг был случайным)
function shuffleArray(array) {
    return array.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
}

// Инициализация игры
let questions = shuffleArray(gameData);
showRound();

function showRound() {
    // Берем текущий вопрос
    const data = questions[currentIndex];

    // Показываем картинку
    objectImage.src = data.image;
    objectImage.alt = data.correctWord;

    // Решаем, правильный или неправильный вариант аудио будет
    if (Math.random() < 0.5) {
        // Правильный
        isCurrentWordCorrect = true;
        currentWord = data.correctWord;
    } else {
        // Неправильный
        isCurrentWordCorrect = false;
        const wrongs = data.wrongWords;
        currentWord = wrongs[Math.floor(Math.random() * wrongs.length)];
    }

    // Проигрываем слово (через аудиофайл или синтез речи)
    playWord(currentWord);

    // Очищаем текст обратной связи
    resultMessage.textContent = "";
    resultMessage.className = "";
}

// Воспроизведение слова
function playWord(word) {
    const audioPath = `../sounds/krasniy-zeleniy/${word}.mp3`;

    fetch(audioPath, {method:"HEAD"}).then(res => {
        if(res.ok) {
            let audio = new Audio(audioPath);
            audio.play();
        } else {
            speakWord(word);
        }
    }).catch(() => {
        speakWord(word);
    });
}

// Озвучка, если нет файла
function speakWord(word) {
    if ('speechSynthesis' in window) {
        let u = new SpeechSynthesisUtterance(word);
        u.lang = 'ru-RU';
        u.rate = 1.05;
        u.pitch = 1.18;
        window.speechSynthesis.speak(u);
    }
}

// Проверка ответа пользователя
function checkAnswer(userThinksCorrect) {
    greenButton.disabled = true;
    redButton.disabled = true;

    let isCorrect = (userThinksCorrect === isCurrentWordCorrect);

    if (isCorrect) {
        resultMessage.textContent = "Верно! 👍";
        resultMessage.className = "correct";
        correctSound && correctSound.play();
    } else {
        resultMessage.textContent = "Неверно! 👎";
        resultMessage.className = "incorrect";
        incorrectSound && incorrectSound.play();
    }

    // Следующий вопрос через 1.5 сек
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % questions.length;
        showRound();
        greenButton.disabled = false;
        redButton.disabled = false;
    }, 1500);
}

// Обработчики кликов
greenButton.onclick = () => checkAnswer(true);
redButton.onclick = () => checkAnswer(false);
