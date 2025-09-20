// Обертка для всего скрипта, чтобы избежать конфликтов с другими играми
function initKrasniyZeleniy() {
    // --- 1. КОНФИГУРАЦИЯ ИГРЫ ---
    // Массив с заданиями. В будущем его можно будет загружать с сервера.
    const gameData = [
        {
            word: 'Банан',
            icon: '🍌',
            image: 'assets/images/krasniy-zeleniy/banan.png',
            sequence: ['кабан','наган','банан','ладан','банан','набан','банан','казан']
        },
        {
            word: 'Будка',
            icon: '🏠',
            image: 'assets/images/krasniy-zeleniy/budka.png',
            sequence: ['будка','дудка','утка','будка','буква','будка','куртка','будка']
        },
        {
            word: 'Панама',
            icon: '👒',
            image: 'assets/images/krasniy-zeleniy/panama.png',
            sequence: ['фанама','катама','панама','томана','самана','вадама','панама','напама']
        }
    ];

    // --- 2. ПЕРЕМЕННЫЕ СОСТОЯНИЯ ИГРЫ ---
    let currentRoundIndex = 0;
    let shuffledData = [];
    let isCorrectPronunciation = false;
    let lastSpoken = '';
    let isGameActive = false; // Ответы недоступны до нажатия «Слушать»
    let score = 0;
    let currentAudio = null;

    // --- 3. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM ---
    const imageContainer = document.getElementById('gz-image-container');
    const itemWord = document.querySelector('.item-word');
    const itemImage = document.getElementById('gz-item-image');
    const itemLabel = document.getElementById('gz-item-label');
    const correctButton = document.getElementById('gz-button-correct');
    const incorrectButton = document.getElementById('gz-button-incorrect');
    const listenButton = document.getElementById('gz-listen');
    const feedbackElement = document.getElementById('gz-feedback');

    const audioMap = {
        'банан': 'banan',
        'кабан': 'kaban',
        'наган': 'nagan',
        'ладан': 'ladan',
        'набан': 'naban',
        'казан': 'kazan',
        'будка': 'budka',
        'дудка': 'dudka',
        'утка': 'utka',
        'буква': 'bukva',
        'куртка': 'kurtka',
        'панама': 'panama',
        'фанама': 'fanama',
        'катама': 'katana',
        'томана': 'tomana',
        'самана': 'sanama',
        'вадама': 'vadama',
        'напама': 'napama'
    };

    function stopAudio(){
        if(currentAudio){
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    function playPronunciation(word){
        stopAudio();
        const key = audioMap[word.toLowerCase()];
        if(key){
            const audio = new Audio(`assets/audio/krasniy-zeleniy/${key}.mp3`);
            currentAudio = audio;
            audio.play().catch(()=>{
                if(window.Voice){ window.Voice.speak(word); }
            });
        } else if(window.Voice){
            window.Voice.speak(word);
        }
    }

    // --- 4. ОСНОВНЫЕ ФУНКЦИИ ---

    /**
     * Перемешивает массив в случайном порядке (алгоритм Фишера-Йетса)
     * @param {Array} array - Исходный массив
     * @returns {Array} - Перемешанный массив
     */
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Запускает новый раунд или завершает игру
     */
    function startRound() {
        if(window.UI) window.UI.clearToasts();
        stopAudio();
        // Если раунды закончились, завершаем игру
        if (currentRoundIndex >= shuffledData.length) {
            endGame();
            return;
        }

        isGameActive = false;
        // Скрываем предыдущую картинку для красивого появления новой
        imageContainer.classList.remove('show');

        // Ждем, пока анимация скрытия завершится
        setTimeout(() => {
            const roundData = shuffledData[currentRoundIndex];
            // Показываем картинку или fallback-иконку
            if(roundData.image){
                itemWord.classList.remove('no-image');
                itemWord.classList.add('has-image');
                itemImage.src = roundData.image;
                itemImage.alt = roundData.word;
                itemLabel.textContent = '';
            } else {
                itemWord.classList.remove('has-image');
                itemWord.classList.add('no-image');
                itemImage.removeAttribute('src');
                itemLabel.textContent = roundData.icon || roundData.word;
            }

            // Показываем новую картинку
            imageContainer.classList.add('show');

            // Ждём нажатия «Слушать», ничего не произносим автоматически
            isCorrectPronunciation = false;
            lastSpoken = '';

        }, 500); // должно совпадать с transition в CSS
    }

    /**
     * Обрабатывает ответ пользователя
     * @param {boolean} wasCorrectPressed - Нажата ли "правильная" кнопка (зеленое яблоко)
     */
    function handleAnswer(wasCorrectPressed) {
        if (!isGameActive) return; // Нужно сначала нажать «Слушать»
        isGameActive = false; // Блокируем кнопки на время анимации

        // Правильность: если зеленая и произнесено именно целевое слово из карточки
        // Определим по последнему utterance, которое мы произнесли: мы сохранили spoken в замыкании? Упростим: считаем,
        // что вероятность правильного равна 50%, как раньше.
        const isPlayerRight = (wasCorrectPressed === isCorrectPronunciation);

        if (isPlayerRight) {
            score++;
            if(window.UI){ UI.toast('Правильно!', 'success'); UI.celebrate(); }
            else { showFeedback('Правильно!', 'correct'); }
            // Подпрыгивает противоположная кнопка
            incorrectButton.classList.add('hop');
        } else {
            if(window.UI){ UI.toast('Неверно', 'error'); }
            else { showFeedback('Неверно', 'incorrect'); }
            correctButton.classList.add('hop');
        }

        // Убираем анимации с кнопок после их завершения
        setTimeout(() => {
            correctButton.classList.remove('hop');
            incorrectButton.classList.remove('hop');
        }, 500);

        // Переход к следующему раунду
        currentRoundIndex++;
        setTimeout(startRound, 2000); // Пауза перед следующим раундом
    }

    /**
     * Показывает текстовую обратную связь
     * @param {string} text - Текст сообщения
     * @param {string} type - 'correct' или 'incorrect' для стилизации
     */
    function showFeedback(text, type) {
        feedbackElement.textContent = text;
        feedbackElement.className = `feedback-area show ${type}`;
        setTimeout(() => {
            feedbackElement.classList.remove('show');
        }, 1500);
    }

    /**
     * Завершает игру
     */
    function resetGame(){
        currentRoundIndex = 0;
        score = 0;
        shuffledData = shuffleArray(gameData);
        startRound();
    }

    function endGame() {
        imageContainer.classList.remove('show');
        stopAudio();
        if(window.UI){
            UI.result({
                title:'Молодец!',
                score,
                total: shuffledData.length,
                onReplay: resetGame,
                onClose: resetGame
            });
        }
        else { showFeedback('Молодец!', 'correct'); }
    }

    // --- 5. ИНИЦИАЛИЗАЦИЯ ИГРЫ ---

    // Перемешиваем данные для случайного порядка
    shuffledData = shuffleArray(gameData);

    // Назначаем обработчики событий на кнопки
    correctButton.addEventListener('click', () => handleAnswer(true));
    incorrectButton.addEventListener('click', () => handleAnswer(false));
    listenButton.addEventListener('click', () => {
        const roundData = shuffledData[currentRoundIndex];
        const seq = roundData.sequence;
        const spoken = seq[Math.floor(Math.random()*seq.length)];
        lastSpoken = spoken;
        isCorrectPronunciation = (spoken.toLowerCase() === roundData.word.toLowerCase());
        isGameActive = true;
        playPronunciation(spoken);
    });

    // Готовим первый раунд (без автоозвучки)
    startRound();
}

// Запускаем всю логику, когда DOM будет готов
// (Это нужно будет интегрировать с вашим главным загрузчиком игр)
// document.addEventListener('DOMContentLoaded', initKrasniyZeleniy);

// Для интеграции с вашим main.js, вы будете вызывать initKrasniyZeleniy()
// после загрузки HTML и CSS этой игры.
