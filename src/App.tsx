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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="loading-spinner">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Türkiye Şehir Tahmin Oyunu
      </h1>
      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <Auth onAuthStateChange={setUser} />
        {user && <Game user={user} />}
      </div>
    </div>
  );
}

export default App;
