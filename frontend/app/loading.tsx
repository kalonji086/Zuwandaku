"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Augmente de 2% chaque fois
      });
    }, 30); // Mise à jour toutes les 30ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        router.push("/accueil");
      }, 500); // Petite pause avant la redirection
    }
  }, [progress, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Logo */}
      <div className="mb-12 animate-pulse">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Barre de progression */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pourcentage */}
      <p className="mt-4 text-2xl font-semibold text-blue-600">
        {progress}%
      </p>

      {/* Texte de chargement */}
      <p className="mt-2 text-gray-600 animate-pulse">
        Chargement en cours...
      </p>
    </div>
  );
}
