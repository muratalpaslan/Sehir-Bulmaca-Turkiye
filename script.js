document.addEventListener('DOMContentLoaded', function() {
    const cities = [
    { name: 'Adana', id: 'TR-01' },
    { name: 'Adıyaman', id: 'TR-02' },
    { name: 'Afyonkarahisar', id: 'TR-03' },
    { name: 'Ağrı', id: 'TR-04' },
    { name: 'Amasya', id: 'TR-05' },
    { name: 'Ankara', id: 'TR-06' },
    { name: 'Antalya', id: 'TR-07' },
    { name: 'Artvin', id: 'TR-08' },
    { name: 'Aydın', id: 'TR-09' },
    { name: 'Balıkesir', id: 'TR-10' },
    { name: 'Bilecik', id: 'TR-11' },
    { name: 'Bingöl', id: 'TR-12' },
    { name: 'Bitlis', id: 'TR-13' },
    { name: 'Bolu', id: 'TR-14' },
    { name: 'Burdur', id: 'TR-15' },
    { name: 'Bursa', id: 'TR-16' },
    { name: 'Çanakkale', id: 'TR-17' },
    { name: 'Çankırı', id: 'TR-18' },
    { name: 'Çorum', id: 'TR-19' },
    { name: 'Denizli', id: 'TR-20' },
    { name: 'Diyarbakır', id: 'TR-21' },
    { name: 'Edirne', id: 'TR-22' },
    { name: 'Elazığ', id: 'TR-23' },
    { name: 'Erzincan', id: 'TR-24' },
    { name: 'Erzurum', id: 'TR-25' },
    { name: 'Eskişehir', id: 'TR-26' },
    { name: 'Gaziantep', id: 'TR-27' },
    { name: 'Giresun', id: 'TR-28' },
    { name: 'Gümüşhane', id: 'TR-29' },
    { name: 'Hakkari', id: 'TR-30' },
    { name: 'Hatay', id: 'TR-31' },
    { name: 'Isparta', id: 'TR-32' },
    { name: 'Mersin', id: 'TR-33' },
    { name: 'İstanbul', id: 'TR-34' },
    { name: 'İzmir', id: 'TR-35' },
    { name: 'Kars', id: 'TR-36' },
    { name: 'Kastamonu', id: 'TR-37' },
    { name: 'Kayseri', id: 'TR-38' },
    { name: 'Kırklareli', id: 'TR-39' },
    { name: 'Kırşehir', id: 'TR-40' },
    { name: 'Kocaeli', id: 'TR-41' },
    { name: 'Konya', id: 'TR-42' },
    { name: 'Kütahya', id: 'TR-43' },
    { name: 'Malatya', id: 'TR-44' },
    { name: 'Manisa', id: 'TR-45' },
    { name: 'Kahramanmaraş', id: 'TR-46' },
    { name: 'Mardin', id: 'TR-47' },
    { name: 'Muğla', id: 'TR-48' },
    { name: 'Muş', id: 'TR-49' },
    { name: 'Nevşehir', id: 'TR-50' },
    { name: 'Niğde', id: 'TR-51' },
    { name: 'Ordu', id: 'TR-52' },
    { name: 'Rize', id: 'TR-53' },
    { name: 'Sakarya', id: 'TR-54' },
    { name: 'Samsun', id: 'TR-55' },
    { name: 'Siirt', id: 'TR-56' },
    { name: 'Sinop', id: 'TR-57' },
    { name: 'Sivas', id: 'TR-58' },
    { name: 'Tekirdağ', id: 'TR-59' },
    { name: 'Tokat', id: 'TR-60' },
    { name: 'Trabzon', id: 'TR-61' },
    { name: 'Tunceli', id: 'TR-62' },
    { name: 'Şanlıurfa', id: 'TR-63' },
    { name: 'Uşak', id: 'TR-64' },
    { name: 'Van', id: 'TR-65' },
    { name: 'Yozgat', id: 'TR-66' },
    { name: 'Zonguldak', id: 'TR-67' },
    { name: 'Aksaray', id: 'TR-68' },
    { name: 'Bayburt', id: 'TR-69' },
    { name: 'Karaman', id: 'TR-70' },
    { name: 'Kırıkkale', id: 'TR-71' },
    { name: 'Batman', id: 'TR-72' },
    { name: 'Şırnak', id: 'TR-73' },
    { name: 'Bartın', id: 'TR-74' },
    { name: 'Ardahan', id: 'TR-75' },
    { name: 'Iğdır', id: 'TR-76' },
    { name: 'Yalova', id: 'TR-77' },
    { name: 'Karabük', id: 'TR-78' },
    { name: 'Kilis', id: 'TR-79' },
    { name: 'Osmaniye', id: 'TR-80' },
    { name: 'Düzce', id: 'TR-81' }
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
