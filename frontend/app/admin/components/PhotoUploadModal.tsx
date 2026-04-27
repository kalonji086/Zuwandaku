'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
}

export default function PhotoUploadModal({ isOpen, onClose, onUpload }: PhotoUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/') && selectedFile.size < 5 * 1024 * 1024) { // 5MB
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
      setError('');
    } else {
      setError('Veuillez sélectionner une image valide (moins de 5MB).');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const timestamp = Date.now();
      const fileName = `avatars/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
      resetModal();
    } catch (err) {
      setError('Erreur lors du téléchargement. Réessayez.');
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setPreview('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Photo de profil</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-dashed border-gray-700 mx-auto overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-full" />
            ) : (
              <ImageIcon size={32} className="text-gray-500" />
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            <Upload size={18} />
            Choisir une photo
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={resetModal}
            disabled={uploading}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 px-4 rounded-lg font-medium transition-all border border-gray-700 disabled:opacity-50"
          >
            Annuler
          </button>
          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : 'Télécharger'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

