import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';

interface GameProps {
  user: User | null;
}

interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: Date;
}

export const Game: React.FC<GameProps> = ({ user }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentCity, setCurrentCity] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hints, setHints] = useState(2);
  const [timeBonus, setTimeBonus] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(leaderboardRef, orderBy('score', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as LeaderboardEntry[];
    setLeaderboard(entries);
  };

  const saveScore = async () => {
    if (!user) return;
    await addDoc(collection(db, 'leaderboard'), {
      username: user.displayName || 'Anonim',
      score,
      timestamp: new Date()
    });
    fetchLeaderboard();
  };

  const useHint = () => {
    if (hints > 0) {
      const wrongOptions = options.filter(option => option !== currentCity);
      const removedOptions = wrongOptions.slice(0, 2);
      setOptions(options.filter(option => !removedOptions.includes(option)));
      setHints(hints - 1);
    }
  };

  const addTimeBonus = () => {
    setTimeBonus(timeBonus + 10);
  };

  const shareScore = () => {
    const text = `Türkiye Şehir Tahmin Oyunu'nda ${score} puan yaptım! 🎉 Sen de oyna!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`);
  };

  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <span>Skor: {score}</span>
        <span>Kalan Can: {lives}</span>
        <span>İpucu: {hints}</span>
        <span>Ekstra Süre: {timeBonus}s</span>
      </div>

      <div className="game-controls">
        <button onClick={useHint} disabled={hints === 0} className="hint-btn">
          50/50 İpucu
        </button>
        <button onClick={addTimeBonus} className="time-bonus-btn">
          +10 Saniye
        </button>
        <button onClick={shareScore} className="share-btn">
          Skoru Paylaş
        </button>
      </div>

      <div className="leaderboard">
        <h3>Lider Tablosu</h3>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>
              {entry.username}: {entry.score} puan
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};