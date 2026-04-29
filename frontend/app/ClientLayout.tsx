'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreenNew';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Affiche la page de chargement seulement au premier accès
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      setIsLoading(false);
    } else {
      // Montre le splash screen 3-4 secondes max
      const timer = setTimeout(() => {
        sessionStorage.setItem('hasVisited', 'true');
        setIsLoading(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, []);

  return isLoading ? <LoadingScreen /> : <>{children}</>;
}
