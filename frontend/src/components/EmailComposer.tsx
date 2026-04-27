"use client";

import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Download, FileText } from 'lucide-react';
// import emailjs from '@emailjs/browser'; // npm i @emailjs/browser + configure keys


const STICKERS = [
  { id: 'thumbsup', emoji: '👍', label: 'Pouce' },
  { id: 'heart', emoji: '❤️', label: 'Cœur' },
  { id: 'star', emoji: '⭐', label: 'Étoile' },
  { id: 'fire', emoji: '🔥', label: 'Feu' },
  { id: 'rocket', emoji: '🚀', label: 'Fusée' },
];

interface Props {
  toEmail: string;
  onClose: () => void;
}

export default function EmailComposer({ toEmail, onClose }: Props) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    setSending(true);
    try {
      // EmailJS pour frontend (facile, gratuit)
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: toEmail,
        subject,
        message_html: `<div>${body.replace(/\n/g, '<br>')}</div>${selectedSticker ? `<div style="font-size: 48px; margin-top: 20px;">${STICKERS.find(s => s.id === selectedSticker)?.emoji}</div>` : ''}`,
        attachments: attachments.map(f => f.name).join(', '),
      }, 'YOUR_PUBLIC_KEY');

      alert('Email envoyé avec succès!');
      onClose();
    } catch (error) {
      console.error('Erreur envoi email:', error);
      alert('Erreur envoi. Vérifiez console.');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Nouveau message</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">À</label>
            <input 
              type="email" 
              value={toEmail}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sujet</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sujet du message"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Votre message..."
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Pièces jointes ({attachments.length})</label>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    <FileText size={16} />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button 
                      onClick={() => setAttachments(att => att.filter((_, i) => i !== index))}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stickers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sticker</label>
            <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => setSelectedSticker(selectedSticker === sticker.id ? '' : sticker.id)}
                  className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg ${
                    selectedSticker === sticker.id
                      ? 'ring-4 ring-blue-300 bg-blue-100 scale-110'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <span className="text-3xl">{sticker.emoji}</span>
                  <p className="text-xs mt-1 text-gray-600">{sticker.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 cursor-pointer hover:text-blue-600 group">
              <Paperclip size={18} className="group-hover:rotate-12 transition-transform" />
              Ajouter pièce jointe (PDF, DOC, IMG...)
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send size={18} />
            {sending ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
}
