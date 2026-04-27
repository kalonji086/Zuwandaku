"use client";

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { Building2, Users, Award, MapPin, Phone, Mail, Clock, Shield, TrendingUp, Home, Car, FileText } from 'lucide-react';

const STATS = [
  { value: '500+', label: 'Biens disponibles', icon: Home },
  { value: '250+', label: 'Véhicules', icon: Car },
  { value: '98%', label: 'Satisfaction client', icon: Award },
  { value: '10+', label: "Ans d'expérience", icon: Clock },
];

const TEAM = [
  { name: 'Jean Kabila', role: 'Fondateur & CEO', image: '/designer.png', specialty: 'Immobilier haut de gamme' },
  { name: 'Marie Mputu', role: 'Directrice Commerciale', image: '/logo.png', specialty: 'Véhicules premium' },
  { name: 'Paul Tshibangu', role: 'CTO & Tech Lead', image: '/bg.png', specialty: 'Plateforme digitale' },
];

export default function AproposPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              À propos de
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">ZUWAndaku</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10">
              Leader de l'immobilier et véhicules au congo depuis 2014. Votre partenaire de confiance pour tous vos projets immobiliers et automobiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/biens" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
              >
                <Building2 size={24} />
                Découvrir nos biens
              </Link>
              <Link 
                href="/#contact" 
                className="border-2 border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <Phone size={20} />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, index) => {
              const Icon = stat.icon as any;
              return (
                <div key={index} className="group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-lg text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">Notre Mission</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Simplifier l'immobilier et la mobilité
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> à Kinshasa</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                ZUWAndaku révolutionne le marché immobilier et automobile de Kinshasa en offrant une plateforme transparente, sécurisée et innovante. 
                Nous connectons propriétaires, locataires, vendeurs et acheteurs avec efficacité et confiance.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <Shield className="w-10 h-10 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Sécurité garantie</h3>
                    <p className="text-gray-600">Vérification des documents et transactions sécurisées</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <TrendingUp className="w-10 h-10 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Meilleurs prix</h3>
                    <p className="text-gray-600">Tarification transparente sans intermédiaires</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image 
                src="/designer.png" 
                alt="Kinshasa skyline" 
                width={600} 
                height={400}
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">Notre Équipe</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Rencontrez nos experts</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Une équipe passionnée et expérimentée dédiée à votre succès</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member, index) => (
              <div key={index} className="group text-center hover:scale-[1.02] transition-all duration-300">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-6 overflow-hidden shadow-xl group-hover:shadow-2xl">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold text-lg mb-3">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Prêt à commencer votre projet ?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des milliers de clients satisfaits. Contactez notre équipe dès aujourd'hui.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <MapPin size={48} className="mx-auto mb-6 text-blue-400" />
              <h3 className="text-2xl font-bold mb-4">Adresse</h3>
              <p>Gombe, Kinshasa RDC</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <Phone size={48} className="mx-auto mb-6 text-green-400" />
              <h3 className="text-2xl font-bold mb-4">Téléphone</h3>
              <p>+243 975186643</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <Mail size={48} className="mx-auto mb-6 text-purple-400" />
              <h3 className="text-2xl font-bold mb-4">Email</h3>
              <p>contact@zuwandaku.com</p>
            </div>
          </div>

          <div className="mt-16">
            <Link 
              href="/register"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
            >
              Rejoindre la plateforme
              <TrendingUp size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
