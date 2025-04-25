import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { Auth } from './components/Auth';
import { Game } from './components/Game';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="loading-spinner text-primary animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center p-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
        Türkiye Şehir Tahmin Oyunu
      </h1>
      
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4">
        <Auth onAuthStateChange={setUser} />
        {user && <Game user={user} />}
      </div>
    </div>
  );
}

export default App;
