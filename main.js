// phonema/main.js (САМАЯ СТАБИЛЬНАЯ ВЕРСИЯ)
document.addEventListener('DOMContentLoaded', () => {
    // ... (конфигурация games и получение элементов DOM остаются такими же)
    const games = [
        { id: 'krasniy-zeleniy', name: 'Красный — зелёный', path: 'games/krasniy-zeleniy/', initFunction: 'initKrasniyZeleniy' },
        { id: 'naydi-paru', name: 'Найди похожую пару', path: 'games/naydi-paru/', initFunction: 'initNaydiParu' },
        { id: 'sosedi', name: 'Соседи', path: 'games/sosedi/', initFunction: 'initSosedi' },
        { id: 'druzya', name: 'Друзья', path: 'games/druzya/', initFunction: 'initDruzya' },
        { id: 'chetvertiy-lishniy', name: 'Четвёртый лишний', path: 'games/chetvertiy-lishniy/', initFunction: 'initChetvertiyLishniy' },
        { id: 'naydi-mesto', name: 'Найди место картинке', path: 'games/naydi-mesto/', initFunction: 'initNaydiMesto' },
        { id: 'samiy-vnimatelniy', name: 'Самый внимательный', path: 'games/samiy-vnimatelniy/', initFunction: 'initSamiyVnimatelniy' },
        { id: 'ugaday-imya', name: 'Угадай имя', path: 'games/ugaday-imya/', initFunction: 'initUgadaiImya' },
        { id: 'privetstvie', name: 'Приветствие', path: 'games/privetstvie/', initFunction: 'initPrivetstvie' },
        { id: 'robot', name: 'Робот', path: 'games/robot/', initFunction: 'initRobot' },
        { id: 'naydi-zvuk', name: 'Найди звук', path: 'games/naydi-zvuk/', initFunction: 'initNaydiZvuk' },
        { id: 'soberi-gribi', name: 'Собери грибы', path: 'games/soberi-gribi/', initFunction: 'initSoberiGribi' },
        { id: 'uborka', name: 'Уборка', path: 'games/uborka/', initFunction: 'initUborka' },
        { id: 'gde-zvuk', name: 'Где звук?', path: 'games/gde-zvuk/', initFunction: 'initGdeZvuk' },
        { id: 'poschitay', name: 'Посчитай', path: 'games/poschitay/', initFunction: 'initPoschitay' },
        { id: 'spoy-pesenku', name: 'Спой песенку', path: 'games/spoy-pesenku/', initFunction: 'initSpoyPesenku' },
    ];

    const gamesMenu = document.getElementById('games-menu');
    const gameContainer = document.getElementById('game-container');
    const gameSpecificStyles = document.getElementById('game-specific-styles');
    const homeLink = document.getElementById('home-link');

    // ... (функция createGamesMenu остается такой же)
    function createGamesMenu() {
        const ul = document.createElement('ul');
        games.forEach(game => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = game.name;
            btn.dataset.gameId = game.id;
            li.appendChild(btn); ul.appendChild(li);
        });
        gamesMenu.innerHTML = '';
        gamesMenu.appendChild(ul);
    }

    async function loadGame(gameId) {
        const game = games.find(g => g.id === gameId);
        if (!game) {
            console.error(`Игра с ID "${gameId}" не найдена.`);
            return;
        }

        if(window.UI){ UI.clearToasts?.(); UI.clearOverlays?.(); }
        gameContainer.innerHTML = '<div class="loader">Загрузка...</div>';
        gameSpecificStyles.innerHTML = '';

        try {
        const [htmlRes, cssRes, jsRes] = await Promise.all([
                fetch(`${game.path}index.html`),
                fetch(`${game.path}style.css`),
                fetch(`${game.path}script.js`)
            ]);

            if (!htmlRes.ok) throw new Error(`Не найден файл: ${htmlRes.url}`);
            if (!cssRes.ok) throw new Error(`Не найден файл: ${cssRes.url}`);
            if (!jsRes.ok) throw new Error(`Не найден файл: ${jsRes.url}`);

            const [html, css, js] = await Promise.all([
                htmlRes.text(),
                cssRes.text(),
                jsRes.text()
            ]);

            // ШАГ 1: Сначала вставляем HTML и CSS.
            gameContainer.classList.remove('home');
            const shell = document.createElement('div');
            shell.className = 'game-shell';
            shell.innerHTML = `
              <div class="game-toolbar">
                <div class="toolbar-left">
                  <button class="icon-btn" id="btn-back"><span class="iconify" data-icon="solar:arrow-left-linear"></span>Назад</button>
                </div>
                <div class="toolbar-right">
                  <button class="icon-btn" id="btn-restart"><span class="iconify" data-icon="solar:refresh-linear"></span>Сброс</button>
                </div>
              </div>
              <div class="game-stage animate__animated animate__fadeIn">${html}</div>`;
            gameContainer.innerHTML = '';
            gameContainer.appendChild(shell);
            gameSpecificStyles.innerHTML = css;

            // ШАГ 2: Создаем и выполняем скрипт ПОСЛЕ того, как HTML уже на странице.
            // Это гарантирует, что getElementById найдет нужные элементы.
            const script = document.createElement('script');
            script.textContent = js;
            document.body.appendChild(script); // Добавляем скрипт в тело документа

            // ШАГ 3: Вызываем функцию инициализации игры.
            if (typeof window[game.initFunction] === 'function') {
                window[game.initFunction]();
            } else {
                throw new Error(`Функция инициализации "${game.initFunction}" не найдена.`);
            }

            // ШАГ 4: Удаляем временный скрипт.
            document.body.removeChild(script);

            // Toolbar actions
            const backBtn = document.getElementById('btn-back');
            const restartBtn = document.getElementById('btn-restart');
            backBtn?.addEventListener('click', (e)=>{ e.preventDefault(); showHomeScreen(); });
            restartBtn?.addEventListener('click', (e)=>{ e.preventDefault(); loadGame(gameId); });

        } catch (error) {
            console.error(`Ошибка при загрузке игры "${game.name}":`, error);
            gameContainer.innerHTML = `<div class="error-message">Не удалось загрузить игру. Проверьте консоль разработчика (F12) для деталей.</div>`;
        }
    }
    
    // ... (остальные функции showHomeScreen, обработчики событий и вызов createGamesMenu() без изменений)
    function showHomeScreen() {
        if(window.UI){ UI.clearToasts?.(); UI.clearOverlays?.(); }
        const cards = games.map(g => `
          <div class="home-card card" data-game-id="${g.id}">
            <div class="home-emoji">${g.emoji || '🎮'}</div>
            <div class="home-title">${g.name}</div>
          </div>`).join('');
        gameContainer.innerHTML = `<div class="grid home-grid">${cards}</div>`;
        gameSpecificStyles.innerHTML = '';
        gameContainer.classList.add('home');
        const grid = gameContainer.querySelector('.home-grid');
        // Плавное появление карточек
        [...grid.children].forEach((card, i)=>{
            card.classList.add('animate__animated','animate__fadeInUp');
            card.style.setProperty('--animate-duration','600ms');
            card.style.animationDelay = `${i*40}ms`;
        });
        grid.addEventListener('click', (e)=>{
            const card = e.target.closest('.home-card');
            if(card) loadGame(card.dataset.gameId);
        });
    }

    gamesMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            loadGame(event.target.dataset.gameId);
        }
    });

    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        showHomeScreen();
    });

    // Enrich items with emojis for cards
    const emojiMap = {
        'krasniy-zeleniy':'🍏', 'naydi-paru':'🧩', 'sosedi':'🏠', 'druzya':'👧👦',
        'chetvertiy-lishniy':'4️⃣', 'naydi-mesto':'🧭', 'samiy-vnimatelniy':'🧠',
        'ugaday-imya':'👽', 'privetstvie':'👋', 'robot':'🤖', 'naydi-zvuk':'🔎',
        'soberi-gribi':'🍄', 'uborka':'🧺', 'gde-zvuk':'🚂', 'poschitay':'🔢', 'spoy-pesenku':'🎵'
    };
    games.forEach(g => g.emoji = emojiMap[g.id] || '🎮');

    createGamesMenu();
    // Показываем сразу каталог игр
    showHomeScreen();
});
