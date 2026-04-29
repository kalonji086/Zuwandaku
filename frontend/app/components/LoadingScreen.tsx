'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function TypingText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return <>{displayedText}</>;
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showPresentation, setShowPresentation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Progression lente qui atteint garantie 100% avec vitesse 5
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5 + 1; // +1 pour garantir progression
      
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setShowPresentation(true);
        }, 500);
      } else {
        setProgress(currentProgress);
      }
    }, 1000); // 1 seconde entre chaque mise à jour

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Logo avec progression circulaire */}
      <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
        {/* SVG Cercle de progression */}
        <svg
          className="absolute w-40 h-40 -rotate-90"
          viewBox="0 0 160 160"
        >
          {/* Cercle arrière-plan */}
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
            opacity="0.2"
          />
          {/* Cercle de progression */}
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeDasharray={`${471.2 * (progress / 100)} 471.2`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
          />
          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo central */}
        <div className="absolute w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-2xl">
          <Image
            src="/logo.png"
            alt="Zuwandaku Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Pourcentage au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 mt-24">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Message de bienvenue (visible avant la présentation) */}
      {!showPresentation && (
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bienvenue à Zuwandaku
          </h1>
          <p className="text-lg text-gray-300">
            Votre plateforme immobilière de confiance
          </p>
          <p className="text-gray-400 text-sm mt-6 animate-pulse">
            Initialisation en cours...
          </p>
        </div>
      )}

      {/* Présentation du site (effet typing) */}
      {showPresentation && (
        <div className="max-w-2xl px-6 text-left space-y-4 animate-fade-in">
          <div className="text-white text-lg leading-relaxed">
            <p className="mb-4 text-blue-400 font-semibold">
              ✨ <TypingText text="Découvrez Zuwandaku" delay={50} />
            </p>

            <p className="mb-3 text-gray-200">
              📍 <TypingText 
                text="Explorez les meilleures propriétés immobilières à Kinshasa" 
                delay={30} 
              />
            </p>

            <p className="mb-3 text-gray-200">
              🚗 <TypingText 
                text="Trouvez votre véhicule idéal parmi nos annonces vérifiées" 
                delay={30} 
              />
            </p>

            <p className="mb-3 text-gray-200">
              🏡 <TypingText 
                text="Maisons, appartements, parcelles - tous les types de biens" 
                delay={30} 
              />
            </p>

            <p className="mb-3 text-gray-200">
              ✅ <TypingText 
                text="Transactions sécurisées et transparentes avec nos experts" 
                delay={30} 
              />
            </p>

            <p className="mt-6 text-center text-blue-300 italic text-sm animate-pulse">
              Redirection vers l'accueil...
            </p>
          </div>
        </div>
      )}

      {/* Footer Légal */}
      <div className="absolute bottom-6 w-full flex justify-center px-6">
        <div className="flex gap-4 text-xs text-gray-400 flex-wrap justify-center">
          <a href="/mentions-legales" className="hover:text-blue-400 transition-colors">
            Mentions légales
          </a>
          <span className="text-gray-600">•</span>
          <a href="/politique-confidentialite" className="hover:text-blue-400 transition-colors">
            Politique de confidentialité
          </a>
          <span className="text-gray-600">•</span>
          <a href="/parametres-confidentialite" className="hover:text-blue-400 transition-colors">
            Paramètres de confidentialité
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
