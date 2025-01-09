document.addEventListener('DOMContentLoaded', function() {
    const cities = [
        { name: 'Adana', id: 'TR-01' },  
        { name: 'Adıyaman', id: 'TR-02' },
        { name: 'Afyonkarahisar', id: 'TR-03' },
        { name: 'Ağrı', id: 'TR-04' },
        { name: 'İstanbul', id: 'TR-34' },
        { name: 'Ankara', id: 'TR-06' },
        { name: 'İzmir', id: 'TR-35' },
        { name: 'Bursa', id: 'TR-16' },
        { name: 'Antalya', id: 'TR-07' },
        { name: 'Konya', id: 'TR-42' },
        { name: 'Trabzon', id: 'TR-61' },
        { name: 'Diyarbakır', id: 'TR-21' },
        { name: 'Van', id: 'TR-65' },
        { name: 'Erzurum', id: 'TR-25' }
    ];

    let currentCity;
    let lives = 3;
    let score = 0;
    let usedCities = [];
    let hints = 3; 
    let isInfiniteMode = false;
    let currentStreak = 0;
    let perfectGame = true;
    let timeLeft = 15; // Her soru için 15 saniye
    let timerInterval; // Timer'ı kontrol etmek için

    function initGame() {
        clearInterval(timerInterval);
        lives = 3;
        score = 0;
        currentStreak = 0;
        perfectGame = true;
        usedCities = [];
        updateUI();
        nextQuestion();
    }

    function nextQuestion() {
        if (usedCities.length === cities.length) {
            endGame(true);
            return;
        }
        
        let availableCities = cities.filter(city => !usedCities.includes(city));
        currentCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        usedCities.push(currentCity);

        document.querySelectorAll('path').forEach(path => {
            path.style.fill = '#eee';
        });

        const cityElement = document.getElementById(currentCity.id);
        if (cityElement) {
            cityElement.style.fill = '#3498db';
        }

        createOptions();
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('result').textContent = '';
        document.getElementById('timer').style.color = ''; // Timer rengini sıfırla
        enableOptions();
        startTimer(); // Timer'ı başlat
    }

    function createOptions() {
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'options-grid';
        optionsContainer.appendChild(gridContainer);

        let options = [currentCity.name];
        while (options.length < 4) {
            let randomCity = cities[Math.floor(Math.random() * cities.length)].name;
            if (!options.includes(randomCity)) {
                options.push(randomCity);
            }
        }
        options.sort(() => Math.random() - 0.5);

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-btn';
            button.onclick = () => selectAnswer(option, button);
            gridContainer.appendChild(button);
        });

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Onayla';
        confirmButton.className = 'confirm-btn';
        confirmButton.style.display = 'none';
        confirmButton.onclick = () => checkAnswer();
        optionsContainer.appendChild(confirmButton);
    }

    let selectedButton = null;
    let selectedAnswer = null;

    function selectAnswer(answer, button) {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected-option');
        });
        
        button.classList.add('selected-option');
        selectedButton = button;
        selectedAnswer = answer;
        
        document.querySelector('.confirm-btn').style.display = 'block';
    }

    const sounds = {
        correct: new Audio('correct.mp3'),
        wrong: new Audio('wrong.mp3'),
        click: new Audio('click.mp3')
    };

    function checkAnswer() {
        if (!selectedAnswer) return;
        
        clearInterval(timerInterval); // Timer'ı durdur
        
        disableOptions();
        const resultDiv = document.getElementById('result');
        
        if (selectedAnswer === currentCity.name) {
            sounds.correct.play();
            resultDiv.style.color = 'green';
            selectedButton.classList.add('correct');
            
            currentStreak++;
            let timeBonus = Math.floor(timeLeft / 3); // Her 3 saniye için 1 bonus puan
            let currentPoints = 10 + Math.floor((currentStreak - 1) / 5);
            score += currentPoints + timeBonus;
            
            let streakMsg = currentStreak % 5 === 0 ? 
                `\n🎯 ${currentStreak}. doğru! Puanlar artık ${currentPoints + 1} olacak!` : 
                `(${currentStreak} seri)`;
            
            resultDiv.textContent = `Doğru! +${currentPoints} puan! +${timeBonus} süre bonusu! ${streakMsg}`;
        } else {
            sounds.wrong.play();
            resultDiv.textContent = `Yanlış! Doğru cevap: ${currentCity.name}`;
            resultDiv.style.color = 'red';
            selectedButton.classList.add('wrong');
            currentStreak = 0;
            perfectGame = false;
            lives--;
        }

        updateUI();
        document.querySelector('.confirm-btn').style.display = 'none';

        if (lives === 0) {
            endGame(false);
        } else {
            document.getElementById('next-btn').style.display = 'block';
        }
    }

    function updateUI() {
        document.getElementById('lives').textContent = lives;
        document.getElementById('score').textContent = score;
    }

    function endGame(completed) {
        clearInterval(timerInterval);
        const resultDiv = document.getElementById('result');
        let finalMessage = '';

        if (completed) {
            if (perfectGame) {
                score += 1000;
                finalMessage = `Muhteşem! Hiç hata yapmadan bitirdiniz!\nPuanınız: ${score} (+1000 mükemmel oyun bonusu)`;
                
                for(let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }, i * 300);
                }
            } else {
                finalMessage = `Tebrikler! Oyunu ${score} puanla bitirdiniz!`;
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            finalMessage = `Oyun bitti! Puanınız: ${score}`;
        }

        resultDiv.textContent = finalMessage;
        resultDiv.style.color = completed ? 'green' : 'red';
        
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('restart-btn').style.display = 'block';
    }

    function disableOptions() {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(button => button.disabled = true);
    }

    function enableOptions() {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(button => button.disabled = false);
    }

    function showHint() {
        if (hints > 0) {
            const wrongOptions = Array.from(document.querySelectorAll('.option-btn'))
                .filter(btn => btn.textContent !== currentCity.name);
            
            for (let i = 0; i < 2; i++) {
                const index = Math.floor(Math.random() * wrongOptions.length);
                wrongOptions[index].disabled = true;
                wrongOptions.splice(index, 1);
            }
            
            hints--;
            updateUI();
        }
    }

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', () => {
        document.getElementById('restart-btn').style.display = 'none';
        initGame();
    });

    initGame();

    function setLimitedMode() {
        isInfiniteMode = false;
        initGame();
    }

    function setInfiniteMode() {
        isInfiniteMode = true;
        initGame();
    }

    function updateMapSize() {
        const container = document.getElementById('map-container');
        const svg = container.querySelector('svg');
        
        if (window.innerWidth <= 768) {
            svg.setAttribute('viewBox', '25 0 750 500');
        } else {
            svg.setAttribute('viewBox', '25 0 750 400');
        }
    }

    window.addEventListener('load', updateMapSize);
    window.addEventListener('resize', updateMapSize);

    function startTimer() {
        clearInterval(timerInterval); // Önceki timer'ı temizle
        timeLeft = 15;
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 5) {
                document.getElementById('timer').style.color = 'red';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeExpired();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        document.getElementById('timer').textContent = timeLeft;
    }

    function timeExpired() {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = `Süre doldu! Doğru cevap: ${currentCity.name}`;
        resultDiv.style.color = 'red';
        
        disableOptions();
        currentStreak = 0; // Streak'i sıfırla
        perfectGame = false;
        lives--;
        
        updateUI();
        
        if (lives === 0) {
            endGame(false);
        } else {
            document.getElementById('next-btn').style.display = 'block';
        }
    }
}); 