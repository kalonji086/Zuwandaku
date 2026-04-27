'use client';

import Link from 'next/link';
import { Menu, X, Home, Building2, Landmark, Car, LayoutGrid, Shield, LogIn, UserPlus, Eye, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = 'bg-black border-b border-white/10 sticky top-0 z-50';
  const linkClass = 'text-white/60 hover:text-white';

  const modules = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/biens', label: 'Biens', icon: LayoutGrid },
    { href: '/appartements', label: 'Appartements', icon: Building2 },
    { href: '/maisons', label: 'Maisons', icon: Home },
    { href: '/parcelles', label: 'Parcelles', icon: Landmark },
{ href: '/vehicles', label: 'Véhicules', icon: Car },
  ];

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl lg:text-2xl text-white">
              <Image src="/logo.png" alt="ZUWAndaku" width={40} height={40} className="rounded-xl shadow-md" />
              ZUWAndaku
            </Link>
          </div>

          {/* Desktop Menu - Better aligned with even spacing */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-4">
            {modules.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-full font-medium text-sm lg:text-base transition-all duration-200 flex items-center gap-1 ${linkClass} hover:bg-white/5`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="text-white/60 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm lg:text-base flex items-center gap-1"
              >
                <LogIn size={16} />
                Connexion
              </Link>

              <Link
                href="/register"
                className="bg-white text-black px-5 py-2 rounded-xl font-semibold text-sm lg:text-base transition-all hover:bg-white/90 flex items-center gap-1"
              >
                <UserPlus size={16} />
                Inscription
              </Link>

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-lg text-white/60 hover:bg-white/5 transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full overlay aligned */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black border-t border-white/10 shadow-2xl py-2 px-4 z-40">
            <div className="grid grid-cols-2 gap-3 pt-2 pb-4 max-h-96 overflow-y-auto">
              {modules.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white/60 hover:text-white"
                >
                  <Icon size={20} />
                  <span className="text-xs">{label}</span>
                </Link>
              ))}
              <div className="col-span-2 pt-2 pb-4 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 px-6 bg-white text-black font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 mx-auto max-w-sm hover:bg-white/90"
                >
                  <LogIn size={18} />
                  Connexion
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
