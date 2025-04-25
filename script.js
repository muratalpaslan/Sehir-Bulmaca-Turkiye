// Ses efektleri için değişkenler
const sounds = {
    background: new Audio('sounds/background.mp3'),
    correct: new Audio('sounds/success.mp3'),
    wrong: new Audio('sounds/fail.mp3'),
    gameover: new Audio('sounds/gameover.mp3'),
    youwon: new Audio('sounds/youwon.mp3'),
    click: new Audio('sounds/click.mp3'),
    intro: new Audio('sounds/intro.mp3')
};

// Arka plan müziği ayarları
sounds.background.loop = true;
sounds.background.volume = 0.3;

document.addEventListener('DOMContentLoaded', function() {
    const usernameScreen = document.getElementById('username-screen');
    const gameScreen = document.getElementById('game-screen');
    const usernameInput = document.getElementById('username-input');
    const startGameBtn = document.getElementById('start-game-btn');
    const playerNameSpan = document.getElementById('player-name');
    
    // Ses kontrolü için buton
    const soundToggleBtn = document.createElement('button');
    soundToggleBtn.id = 'sound-toggle';
    soundToggleBtn.innerHTML = '🔊';
    soundToggleBtn.style.position = 'fixed';
    soundToggleBtn.style.top = '10px';
    soundToggleBtn.style.right = '10px';
    soundToggleBtn.style.padding = '10px';
    soundToggleBtn.style.fontSize = '20px';
    soundToggleBtn.style.cursor = 'pointer';
    soundToggleBtn.style.backgroundColor = '#fff';
    soundToggleBtn.style.border = '2px solid #ccc';
    soundToggleBtn.style.borderRadius = '50%';
    document.body.appendChild(soundToggleBtn);
    
    // Ses açma - kapama kontrolü
    let isSoundOn = true;
    soundToggleBtn.addEventListener('click', function() {
        isSoundOn = !isSoundOn;
        soundToggleBtn.innerHTML = isSoundOn ? '🔊' : '🔇';
        sounds.background.volume = isSoundOn ? 0.3 : 0;
        Object.values(sounds).forEach(sound => {
            if (sound !== sounds.background) {
                sound.volume = isSoundOn ? 1 : 0;
            }
        });
    });
    
    let username = '';

    usernameInput.addEventListener('input', function() {
        const isValid = this.value.trim().length >= 3;
        startGameBtn.disabled = !isValid;
        
        this.value = this.value.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]/g, '').slice(0, 20);
    });

    startGameBtn.addEventListener('click', function() {
        username = usernameInput.value.trim();
        if (username.length >= 3) {
            usernameScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            playerNameSpan.textContent = username;
            
            // Kullanıcı etkileşimi olduğunda arka plan müziğini çal
            playSoundSafely(sounds.background);
            
            initGame();
        }
    });

    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !startGameBtn.disabled) {
            startGameBtn.click();
        }
    });
    
//Mainpage ekliyorum        
    const cities = [
        { name: 'Adana', id: 'TR-01', lat: 37.0000, lng: 35.3213 },
        { name: 'Adıyaman', id: 'TR-02', lat: 37.7648, lng: 38.2786 },
        { name: 'Afyonkarahisar', id: 'TR-03', lat: 38.7507, lng: 30.5567 },
        { name: 'Ağrı', id: 'TR-04', lat: 39.7191, lng: 43.0503 },
        { name: 'Amasya', id: 'TR-05', lat: 40.6499, lng: 35.8353 },
        { name: 'Ankara', id: 'TR-06', lat: 39.9208, lng: 32.8541 },
        { name: 'Antalya', id: 'TR-07', lat: 36.8841, lng: 30.7056 },
        { name: 'Artvin', id: 'TR-08', lat: 41.1828, lng: 41.8183 },
        { name: 'Aydın', id: 'TR-09', lat: 37.8560, lng: 27.8416 },
        { name: 'Balıkesir', id: 'TR-10', lat: 39.6484, lng: 27.8826 },
        { name: 'Bilecik', id: 'TR-11', lat: 40.1451, lng: 29.9795 },
        { name: 'Bingöl', id: 'TR-12', lat: 38.8854, lng: 40.4980 },
        { name: 'Bitlis', id: 'TR-13', lat: 38.4006, lng: 42.1095 },
        { name: 'Bolu', id: 'TR-14', lat: 40.7318, lng: 31.6082 },
        { name: 'Burdur', id: 'TR-15', lat: 37.7765, lng: 30.2903 },
        { name: 'Bursa', id: 'TR-16', lat: 40.1885, lng: 29.0610 },
        { name: 'Çanakkale', id: 'TR-17', lat: 40.1553, lng: 26.4142 },
        { name: 'Çankırı', id: 'TR-18', lat: 40.6013, lng: 33.6134 },
        { name: 'Çorum', id: 'TR-19', lat: 40.5506, lng: 34.9556 },
        { name: 'Denizli', id: 'TR-20', lat: 37.7765, lng: 29.0864 },
        { name: 'Diyarbakır', id: 'TR-21', lat: 37.9144, lng: 40.2306 },
        { name: 'Edirne', id: 'TR-22', lat: 41.6818, lng: 26.5623 },
        { name: 'Elazığ', id: 'TR-23', lat: 38.6810, lng: 39.2264 },
        { name: 'Erzincan', id: 'TR-24', lat: 39.7500, lng: 39.5000 },
        { name: 'Erzurum', id: 'TR-25', lat: 39.9000, lng: 41.2700 },
        { name: 'Eskişehir', id: 'TR-26', lat: 39.7700, lng: 30.5200 },
        { name: 'Gaziantep', id: 'TR-27', lat: 37.0597, lng: 37.3828 },
        { name: 'Giresun', id: 'TR-28', lat: 40.9000, lng: 38.3800 },
        { name: 'Gümüşhane', id: 'TR-29', lat: 40.4500, lng: 39.5500 },
        { name: 'Hakkari', id: 'TR-30', lat: 37.5800, lng: 43.0500 },
        { name: 'Hatay', id: 'TR-31', lat: 36.2000, lng: 36.1300 },
        { name: 'Isparta', id: 'TR-32', lat: 37.7667, lng: 30.5500 },
        { name: 'Mersin', id: 'TR-33', lat: 36.8000, lng: 34.6300 },
        { name: 'İstanbul', id: 'TR-34', lat: 41.0050, lng: 28.9784 },
        { name: 'İzmir', id: 'TR-35', lat: 38.4237, lng: 27.1428 },
        { name: 'Kars', id: 'TR-36', lat: 40.6000, lng: 43.0800 },
        { name: 'Kastamonu', id: 'TR-37', lat: 41.3700, lng: 33.7800 },
        { name: 'Kayseri', id: 'TR-38', lat: 38.7300, lng: 35.4800 },
        { name: 'Kırklareli', id: 'TR-39', lat: 41.7300, lng: 27.2200 },
        { name: 'Kırşehir', id: 'TR-40', lat: 39.1500, lng: 35.7500 },
        { name: 'Kocaeli', id: 'TR-41', lat: 40.7500, lng: 29.9300 },
        { name: 'Konya', id: 'TR-42', lat: 37.8700, lng: 32.4800 },
        { name: 'Kütahya', id: 'TR-43', lat: 39.3800, lng: 29.9800 },
        { name: 'Malatya', id: 'TR-44', lat: 38.3500, lng: 38.3000 },
        { name: 'Manisa', id: 'TR-45', lat: 38.6100, lng: 27.4300 },
        { name: 'Kahramanmaraş', id: 'TR-46', lat: 37.1800, lng: 37.2000 },
        { name: 'Mardin', id: 'TR-47', lat: 37.3000, lng: 40.7300 },
        { name: 'Muğla', id: 'TR-48', lat: 37.2000, lng: 28.3500 },
        { name: 'Muş', id: 'TR-49', lat: 38.7500, lng: 41.6800 },
        { name: 'Nevşehir', id: 'TR-50', lat: 38.6300, lng: 34.7200 },
        { name: 'Niğde', id: 'TR-51', lat: 37.9500, lng: 35.8300 },
        { name: 'Ordu', id: 'TR-52', lat: 40.9700, lng: 37.8800 },
        { name: 'Rize', id: 'TR-53', lat: 41.0200, lng: 40.5200 },
        { name: 'Sakarya', id: 'TR-54', lat: 40.7500, lng: 30.4000 },
        { name: 'Samsun', id: 'TR-55', lat: 41.2800, lng: 36.3300 },
        { name: 'Siirt', id: 'TR-56', lat: 37.9200, lng: 41.9200 },
        { name: 'Sinop', id: 'TR-57', lat: 42.0300, lng: 35.1500 },
        { name: 'Sivas', id: 'TR-58', lat: 39.7500, lng: 37.0300 },
        { name: 'Tekirdağ', id: 'TR-59', lat: 40.9700, lng: 27.5200 },
        { name: 'Tokat', id: 'TR-60', lat: 40.3000, lng: 36.5700 },
        { name: 'Trabzon', id: 'TR-61', lat: 41.0000, lng: 39.7200 },
        { name: 'Tunceli', id: 'TR-62', lat: 39.1000, lng: 39.5700 },
        { name: 'Şanlıurfa', id: 'TR-63', lat: 37.1700, lng: 38.7900 },
        { name: 'Uşak', id: 'TR-64', lat: 38.6800, lng: 29.4100 },
        { name: 'Van', id: 'TR-65', lat: 38.4900, lng: 43.3800 },
        { name: 'Yozgat', id: 'TR-66', lat: 39.8200, lng: 34.8200 },
        { name: 'Zonguldak', id: 'TR-67', lat: 41.4300, lng: 31.8000 },
        { name: 'Aksaray', id: 'TR-68', lat: 38.3700, lng: 34.0300 },
        { name: 'Bayburt', id: 'TR-69', lat: 40.2500, lng: 40.2000 },
        { name: 'Karaman', id: 'TR-70', lat: 37.1700, lng: 33.2200 },
        { name: 'Kırıkkale', id: 'TR-71', lat: 39.8500, lng: 32.5000 },
        { name: 'Batman', id: 'TR-72', lat: 37.8700, lng: 41.1200 },
        { name: 'Şırnak', id: 'TR-73', lat: 37.5200, lng: 42.1000 },
        { name: 'Bartın', id: 'TR-74', lat: 41.6300, lng: 40.3300 },
        { name: 'Ardahan', id: 'TR-75', lat: 41.8000, lng: 42.1700 },
        { name: 'Iğdır', id: 'TR-76', lat: 39.9200, lng: 43.0700 },
        { name: 'Yalova', id: 'TR-77', lat: 40.6500, lng: 29.2700 },
        { name: 'Karabük', id: 'TR-78', lat: 41.2000, lng: 31.5700 },
        { name: 'Kilis', id: 'TR-79', lat: 36.7200, lng: 37.1200 },
        { name: 'Osmaniye', id: 'TR-80', lat: 37.0700, lng: 36.2500 },
        { name: 'Düzce', id: 'TR-81', lat: 40.8500, lng: 31.1700 }
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
        // Arka plan müziğini başlat
        sounds.background.play();
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

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Dünya'nın yarıçapı (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function createOptions() {
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'options-grid';
        optionsContainer.appendChild(gridContainer);

        const currentLat = currentCity.lat;
        const currentLng = currentCity.lng;

        let sortedCities = cities
            .filter(city => city.name !== currentCity.name)
            .map(city => ({
                ...city,
                distance: calculateDistance(currentLat, currentLng, city.lat, city.lng)
            }))
            .sort((a, b) => a.distance - b.distance);

        let nearestCities = sortedCities.slice(0, 10);
        let options = [currentCity.name];

        while (options.length < 4) {
            let randomIndex = Math.floor(Math.random() * nearestCities.length);
            let selectedCity = nearestCities[randomIndex].name;
            
            if (!options.includes(selectedCity)) {
                options.push(selectedCity);
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
        // Seçim sesi efekti
        const clickSound = new Audio('sounds/click.mp3');
        clickSound.volume = isSoundOn ? 0.5 : 0;
        clickSound.play();

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected-option');
        });
        
        button.classList.add('selected-option');
        selectedButton = button;
        selectedAnswer = answer;
        
        document.querySelector('.confirm-btn').style.display = 'block';
    }

    // Ses efektleri için SVG elementlerini yükle
    const successSound = document.querySelector('#successSound');
    const failSound = document.querySelector('#failSound');

    // LocalStorage'dan en yüksek skoru al
    let highScore = localStorage.getItem('highScore') || 0;
    highScore = parseInt(highScore);

    // Skor tablosunu güncelle
    function updateScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        if (scoreBoard) {
            scoreBoard.innerHTML = `
                <div class="bg-indigo-50 p-3 rounded-lg">
                    <p class="text-sm text-gray-600">En Yüksek Skor</p>
                    <p class="font-semibold text-indigo-900" id="high-score">${highScore}</p>
                </div>
            `;
        }
    }

    // Güvenli ses çalma fonksiyonu
    function playSoundSafely(sound) {
        if (isSoundOn) {
            sound.currentTime = 0;
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Ses çalma hatası:", error);
                    // Kullanıcı etkileşimi olmadan ses çalınamaz, bu normal bir durum
                });
            }
        }
    }

    function checkAnswer() {
        if (!selectedAnswer) return;
        
        clearInterval(timerInterval); // Timer'ı durdur
        
        disableOptions();
        const resultDiv = document.getElementById('result');
        
        if (selectedAnswer === currentCity.name) {
            playSoundSafely(sounds.correct);
            resultDiv.style.color = '#10b981';
            selectedButton.classList.add('correct');
            
            currentStreak++;
            let timeBonus = Math.floor(timeLeft / 3); // Her 3 saniye için 1 bonus puan
            let currentPoints = 10 + Math.floor((currentStreak - 1) / 5);
            score += currentPoints + timeBonus;
            
            // En yüksek skoru güncelle
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                updateScoreBoard();
            }
            
            let streakMsg = currentStreak % 5 === 0 ? 
                `\n🎯 ${currentStreak}. doğru! Puanlar artık ${currentPoints + 1} olacak!` : 
                `(${currentStreak} seri)`;
            
            resultDiv.textContent = `Doğru! +${currentPoints} puan! +${timeBonus} süre bonusu! ${streakMsg}`;
        } else {
            playSoundSafely(sounds.wrong);
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
        updateScoreBoard();
    }

    function endGame(completed) {
        clearInterval(timerInterval);
        // Arka plan müziğini durdur
        sounds.background.pause();
        sounds.background.currentTime = 0;
        
        // Oyun sonu müziğini çal
        if (score >= 100) {
            sounds.youwon.volume = isSoundOn ? 1 : 0;
            sounds.youwon.play();
        } else {
            sounds.gameover.volume = isSoundOn ? 1 : 0;
            sounds.gameover.play();
        }
        
        const resultDiv = document.getElementById('result');
        const celebrationContainer = document.getElementById('celebration-container');
        const finalScoreMessage = document.getElementById('final-score-message');
        const celebrationText = document.getElementById('celebration-text');
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

        // Celebration text'i puana göre göster/gizle
        if (score >= 100) {
            celebrationText.style.display = 'block';
            celebrationText.textContent = 'Tebrikler! 100 puanı geçtiniz! 🎉';
        } else {
            celebrationText.style.display = 'none';
        }

        finalScoreMessage.textContent = finalMessage;
        celebrationContainer.style.display = 'block';
        
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

    document.getElementById('play-again-btn').addEventListener('click', function() {
        document.getElementById('celebration-container').style.display = 'none';
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
        timeLeft = 15; // Süreyi sıfırla
        
        const timerElement = document.getElementById('timer');
        timerElement.textContent = timeLeft;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            // Son 5 saniyede timer'ı kırmızı yap
            if (timeLeft <= 5) {
                timerElement.style.color = 'red';
                // Tick sesi çal
                if (isSoundOn) {
                    sounds.click.currentTime = 0;
                    sounds.click.play();
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Süre bittiğinde müziği durdur
                sounds.background.pause();
                sounds.background.currentTime = 0;
                
                // Yanlış cevap sesi çal
                if (isSoundOn) {
                    sounds.wrong.currentTime = 0;
                    sounds.wrong.play();
                }
                
                disableOptions();
                document.getElementById('result').textContent = 'Süre doldu! Doğru cevap: ' + currentCity.name;
                document.getElementById('result').style.color = 'red';
                lives--;
                updateUI();
                
                if (lives === 0) {
                    endGame(false);
                } else {
                    document.getElementById('next-btn').style.display = 'block';
                }
            }
        }, 1000);
    }

    // Sonraki soruya geçince müziği yeniden başlat
    document.getElementById('next-btn').addEventListener('click', function() {
        // Arka plan müziğini yeniden başlat
        if (isSoundOn && sounds.background.paused) {
            sounds.background.currentTime = 0;
            sounds.background.play();
        }
        nextQuestion();
    });

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