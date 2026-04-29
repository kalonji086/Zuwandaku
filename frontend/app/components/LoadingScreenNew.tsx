"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function TypingText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

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
  const [showPresentation, setShowPresentation] = useState(true); // Afficher la présentation dès le début
  const router = useRouter();

  useEffect(() => {
    // Progression très lente qui atteint 100% en exactement 60 secondes
    let currentProgress = 0;
    const totalUpdates = 600; // 60 secondes / 0.1 seconde = 600 mises à jour
    const incrementPerUpdate = 100 / totalUpdates; // 100 / 600 = 0.1667% par mise à jour

    const interval = setInterval(() => {
      currentProgress += incrementPerUpdate;

      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(currentProgress);
      }
    }, 100); // 100ms entre chaque mise à jour

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Logo avec progression circulaire améliorée */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* SVG Cercle de progression avec effet de brillance */}
        <svg
          className="absolute w-48 h-48 -rotate-90"
          viewBox="0 0 160 160"
        >
          {/* Cercle arrière-plan avec effet de brillance */}
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            opacity="0.15"
          />
          {/* Cercle de progression avec gradient et brillance */}
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${471.2 * (progress / 100)} 471.2`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.1s ease-out" }}
            className="drop-shadow-lg"
          />
          {/* Gradient amélioré */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Logo central avec animation de pulsation */}
        <div className="absolute w-36 h-36 flex items-center justify-center bg-white rounded-full shadow-2xl animate-pulse">
          <Image
            src="/logo.png"
            alt="Zuwandaku Logo"
            width={130}
            height={130}
            className="object-contain"
          />
        </div>

        {/* Pourcentage au centre avec animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mt-28 animate-bounce">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Message de bienvenue avec animation améliorée */}
      {!showPresentation && (
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-3">
            Bienvenue à Zuwandaku
          </h1>
          <p className="text-xl text-gray-300">
            Votre plateforme immobilière de confiance
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {/* Présentation du site (effet typing) */}
      {showPresentation && (
        <div className="max-w-3xl px-6 text-left space-y-6 animate-fade-in">
          <div className="text-white text-lg leading-relaxed">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              <TypingText text="Présentation – Zuwandaku" delay={50} />
            </h2>

            <p className="mb-4 text-gray-200">
              <TypingText
                text="Bienvenue sur Zuwandaku, la plateforme immobilière pensée pour faciliter la recherche, la vente et la location de biens en toute confiance."
                delay={20}
              />
            </p>

            <p className="mb-4 text-gray-200">
              <TypingText
                text="Zuwandaku connecte particuliers et professionnels de l'immobilier pour offrir un accès simple et fiable aux maisons, parcelles, appartements et espaces commerciaux. Notre objectif est de rendre l'immobilier plus accessible, plus transparent et mieux organisé."
                delay={20}
              />
            </p>

            <p className="mb-4 text-gray-200">
              <TypingText
                text="Que vous soyez à la recherche d'un logement, d'un terrain ou d'une opportunité d'investissement, Zuwandaku vous accompagne à chaque étape, avec des informations claires et des annonces vérifiées."
                delay={20}
              />
            </p>

            <p className="mb-4 text-gray-200">
              <TypingText
                text="Zuwandaku, c'est plus qu'un site immobilier : c'est un pont entre vos projets et la réalité."
                delay={20}
              />
            </p>

            <p className="mt-8 text-center text-blue-300 italic text-sm animate-pulse">
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
