"use client";

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Phone, Mail, MapPin, Send, User, MessageCircle, Building2, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              Contactez-nous
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">ZUWAndaku</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-12">
              Besoin d'informations ? Une question sur un bien ? Notre équipe est à votre disposition.
            </p>
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Téléphone</h3>
                    <p className="text-2xl font-semibold text-gray-800">+243 975 186 643</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mt-1">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-lg font-semibold text-gray-800">contact@zuwandaku.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mt-1">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Adresse</h3>
                    <p className="text-lg font-semibold text-gray-800">Gombe, Kinshasa RDC</p>
                    <p className="text-sm text-gray-600 mt-1">Lundi - Vendredi: 8h-19h</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Envoyez-nous un message</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Votre nom" 
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email" 
                        placeholder="votre@email.com" 
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea 
                        rows={5}
                        placeholder="Dites-nous en plus..." 
                        className="w-full pl-12 pt-10 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 resize-vertical" 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                  >
                    <Send className="w-6 h-6" />
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Pourquoi nous contacter ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Notre équipe experte répond à toutes vos questions en moins de 24h</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-blue-100 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Building2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Immobilier</h3>
              <p className="text-gray-600 leading-relaxed">Questions sur les locations, ventes et gestion locative</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-emerald-100 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sécurité</h3>
              <p className="text-gray-600 leading-relaxed">Vérification documents et transactions sécurisées</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-purple-100 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                <Clock className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support rapide</h3>
              <p className="text-gray-600 leading-relaxed">Réponse garantie sous 24h ouvrables</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Nous sommes ici</h2>
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl p-1 shadow-2xl mx-auto max-w-4xl h-96">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-20 h-20 mx-auto mb-6 opacity-80" />
                <p className="text-2xl font-semibold">Gombe, Kinshasa RDC</p>
                <p className="text-lg text-white/70 mt-2">Localisez-nous facilement</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
