"use client";

import { useState } from "react";
import { X, Upload, User } from "lucide-react";

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function ProfilePhotoModal({ isOpen, onClose, onUpload, isLoading }: ProfilePhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setPreview(null);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User size={24} />
            Photo de profil
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Preview */}
          <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-300" />
            )}
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-input"
              disabled={isLoading}
            />
            <label htmlFor="photo-input" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload size={32} className="text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Cliquez pour télécharger une photo</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (max 5MB)</p>
            </label>
          </div>

          {selectedFile && (
            <p className="text-sm text-gray-600">
              ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Téléchargement..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
