"use client";

import { useState } from 'react';
import { X, Printer, Download, User, BedDouble, Calendar, DollarSign } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  booking: any;
  onClose: () => void;
}

export default function PrintPreviewModal({ isOpen, booking, onClose }: PrintPreviewModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `reservation-${booking.id}.pdf`;
    link.click();
    alert('PDF téléchargé!');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 print:hidden">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl print:shadow-none">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white print:bg-white print:text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Printer size={28} />
              <div>
                <h2 className="text-2xl font-bold">Prévisualisation</h2>
                <p>Fiche réservation #{booking.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                <Download size={20} />
                PDF
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 hover:bg-white/90 rounded-xl font-bold transition-all shadow-lg">
                <Printer size={20} />
                Imprimer
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/30 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Print Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 print:max-h-none print:overflow-visible print:p-12 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
          {/* Header */}
          <div className="text-center border-b pb-8 print:border-gray-300">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">BON DE RÉSERVATION</h1>
            <p className="text-2xl font-semibold text-blue-600">#{booking.id}</p>
            <p className="text-sm text-gray-500 mt-2">Dashboard Hotel</p>
          </div>

          {/* Client & Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} />
                CLIENT
              </h3>
              <div className="space-y-3">
                <p><span className="font-semibold">Nom:</span> {booking.guestName}</p>
                <p><span className="font-semibold">Téléphone:</span> {booking.guestPhone}</p>
                <p><span className="font-semibold">Email:</span> {booking.guestEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BedDouble size={24} />
                CHAMBRE
              </h3>
              <div className="space-y-3">
                <p><span className="font-semibold">Chambre:</span> {booking.roomNumber}</p>
                <p><span className="font-semibold">Type:</span> {booking.roomType}</p>
              </div>
            </div>
          </div>

          {/* Dates & Stay */}
          <div className="border p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={24} />
              PÉRIODE DE SÉJOUR
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Arrivée</p>
                <p className="text-2xl font-bold text-gray-900">{new Date(booking.checkInDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Nuits</p>
                <p className="text-3xl font-black text-blue-600">{booking.nights}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Départ</p>
                <p className="text-2xl font-bold text-gray-900">{new Date(booking.checkOutDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign size={24} />
              FACTURATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Prix par nuit</p>
                <p className="text-2xl font-bold text-gray-900">${booking.pricePerNight?.toLocaleString('fr-FR') || '0'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Acompte payé</p>
                <p className="text-2xl font-bold text-green-600">${booking.deposit?.toLocaleString('fr-FR') || '0'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-semibold">TOTAL TTC</p>
                <p className="text-3xl font-black text-blue-600">${booking.totalAmount?.toLocaleString('fr-FR') || '0'}</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Statut:</span>
<span className={`px-6 py-2 rounded-full text-lg font-bold ${booking.status === 'Confirmée' ? 'bg-green-100 text-green-800' : booking.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="border-l-4 border-yellow-400 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Notes importantes</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @media print {
            .print\:hidden { display: none !important; }
            body { margin: 0; }
            .no-print { display: none; }
          }
        `}</style>
      </div>
    </div>
  );
}

