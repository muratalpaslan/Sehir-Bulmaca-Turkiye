import React, { useState, useEffect } from 'react';
import { TurkeyMap } from './TurkeyMap';
import { cities } from './data/cities';
import { calculateDistance } from './utils/distance';
import confetti from 'canvas-confetti';
import { db, auth } from './firebase';
import { doc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Rastgele bir şehir sorusu oluştur
const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

// Rastgele 4 şık oluştur (1 doğru, 3 yanlış)
const generateOptions = (correctCity) => {
  const options = [correctCity];
  
  while (options.length < 4) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    if (!options.includes(randomCity)) {
      options.push(randomCity);
    }
  }
  
  // Şıkları karıştır
  return options.sort(() => Math.random() - 0.5);
};

const Game = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(60);
  // Şehir tipi tanımı
  interface City {
    name: string;
    province: string;
    lat: number;
    lng: number;
  }
  const [currentQuestion, setCurrentQuestion] = useState<City>(getRandomQuestion());
  const [options, setOptions] = useState<City[]>(generateOptions(currentQuestion));
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Oyuncu');
  const [isMuted, setIsMuted] = useState(localStorage.getItem('isMuted') === 'true');
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [timeBonusUsed, setTimeBonusUsed] = useState(false);
  
  // Lider tablosunu yükle
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const leaderboardData = [];
        querySnapshot.forEach((doc) => {
          leaderboardData.push(doc.data());
        });
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Lider tablosu yüklenirken hata:", error);
      }
    };
    
    fetchLeaderboard();
  }, [gameOver]);
  
  // Süre sayacı
  useEffect(() => {
    if (time > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (time === 0 && !gameOver) {
      // Süre bittiğinde müziği durdur
      const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setGameOver(true);
      saveScore(); // Skoru kaydet
    }
  }, [time, gameOver]);
  
  // Oyun başladığında müziği çal
  useEffect(() => {
    const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
    
    if (audio) {
      if (!gameOver && !isMuted) {
        audio.play();
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [gameOver, isMuted]);
  
  // Ses ayarlarını localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('isMuted', isMuted.toString());
  }, [isMuted]);
  
  // Kullanıcı adını localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);
  
  // Şehir seçildiğinde kontrol et
  const handleCitySelect = (city: City) => {
    if (gameOver || selectedCity) return;
    
    setSelectedCity(city);
    
    if (city.name === currentQuestion.name) {
      // Doğru cevap
      playSound('correct');
      setScore(score + 10);
      
      // Konfeti efekti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Kısa bir süre sonra yeni soru
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    } else {
      // Yanlış cevap
      playSound('wrong');
      setLives(lives - 1);
      
      if (lives <= 1) {
        // Oyun bitti
        const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setGameOver(true);
        saveScore();
      } else {
        // Kısa bir süre sonra yeni soru
        setTimeout(() => {
          handleNextQuestion();
        }, 1500);
      }
    }
  };
  
  // Yeni soru yükle
  const handleNextQuestion = () => {
    // Yeni soru başladığında müziği başlat
    const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
    if (audio && !isMuted) {
      audio.play();
    }
    
    const newQuestion = getRandomQuestion();
    setCurrentQuestion(newQuestion);
    setOptions(generateOptions(newQuestion));
    setSelectedCity(null);
  };
  
  // Skoru kaydet
  const saveScore = async () => {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, "leaderboard", auth.currentUser.uid), {
          username: username,
          score: score,
          timestamp: new Date().getTime()
        });
      } else {
        // Anonim skor kaydı
        const randomId = Math.random().toString(36).substring(2, 15);
        await setDoc(doc(db, "leaderboard", randomId), {
          username: username,
          score: score,
          timestamp: new Date().getTime()
        });
      }
    } catch (error) {
      console.error("Skor kaydedilirken hata:", error);
    }
  };
  
  // Oyunu yeniden başlat
  const restartGame = () => {
    setScore(0);
    setLives(3);
    setTime(60);
    setGameOver(false);
    setFiftyFiftyUsed(false);
    setTimeBonusUsed(false);
    handleNextQuestion();
  };
  
  // Ses çal
  const playSound = (type: string) => {
    if (isMuted) return;
    
    const sound = new Audio(`src/assets/sounds/${type}.mp3`);
    sound.play().catch(error => console.error("Ses çalma hatası:", error));
  };
  
  // Sesi aç/kapat
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
    if (audio) {
      if (isMuted) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };
  
  // 50/50 ipucu kullan
  const useFiftyFifty = () => {
    if (fiftyFiftyUsed) return;
    
    const correctCity = currentQuestion;
    const newOptions = [correctCity];
    
    // Rastgele bir yanlış şık ekle
    const incorrectOptions = options.filter(city => city.name !== correctCity.name);
    const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
    newOptions.push(randomIncorrect);
    
    // Şıkları karıştır
    setOptions(newOptions.sort(() => Math.random() - 0.5));
    setFiftyFiftyUsed(true);
  };
  
  // Ekstra süre ipucu kullan
  const useTimeBonus = () => {
    if (timeBonusUsed) return;
    
    setTime(time + 10);
    setTimeBonusUsed(true);
  };
  
  // Skoru sosyal medyada paylaş
  const shareScore = () => {
    const text = `Türkiye Şehir Tahmin Oyunu'nda ${score} puan yaptım! 🎉 Sen de oyna!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`);
  };
  
  // Oyun bittiğinde gösterilecek ekran
  if (gameOver) {
    return (
      <div className="game-container">
        <div className="game-over">
          <h2>Oyun Bitti!</h2>
          <p>Skorunuz: {score}</p>
          
          <div className="flex flex-col gap-4 mt-6">
            <button className="restart-btn" onClick={restartGame}>
              Yeniden Oyna
            </button>
            
            <button className="share-btn" onClick={shareScore}>
              Skoru Paylaş
            </button>
          </div>
        </div>
        
        <div className="leaderboard">
          <h3>Lider Tablosu</h3>
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={index} className="flex justify-between">
                <span>{index + 1}. {entry.username}</span>
                <span>{entry.score} puan</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-container">
      <audio id="backgroundMusic" src="src/assets/sounds/background.mp3" loop />
      
      <div className="game-info">
        <span>Puan: {score}</span>
        <span>Kalan Hak: {lives}</span>
        <span>Süre: {time}s</span>
        <button onClick={toggleMute} className="p-2">
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      
      <div className="game-controls">
        <button 
          className="hint-btn" 
          onClick={useFiftyFifty} 
          disabled={fiftyFiftyUsed}
        >
          50/50 İpucu
        </button>
        
        <button 
          className="time-bonus-btn" 
          onClick={useTimeBonus} 
          disabled={timeBonusUsed}
        >
          +10s Süre
        </button>
        
        <button 
          className="share-btn" 
          onClick={shareScore}
        >
          Paylaş
        </button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-center mb-2">
          Bu şehir hangi ilde bulunur?
        </h2>
        <h3 className="text-xl font-bold text-center text-blue-600">
          {currentQuestion.name}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((city, index) => (
          <button
            key={index}
            onClick={() => handleCitySelect(city)}
            disabled={selectedCity !== null}
            className={`p-3 rounded-lg font-medium transition-all ${
              selectedCity?.name === city.name
                ? city.name === currentQuestion.name
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-red-100 text-red-700 border-red-300'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {city.province}
          </button>
        ))}
      </div>
      
      <TurkeyMap currentCity={currentQuestion} />
    </div>
  );
};

export default Game;