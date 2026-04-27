"use client";

import { useState } from "react";
import { X, Upload, User } from "lucide-react";

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName: string;
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onUpload,
  isLoading,
}: ProfilePhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
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
      setPreview(currentAvatar || null);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 16,
    }}>
      <div style={{
        background: '#0d0d14',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg,#1a6dff,#0040cc)',
          padding: '12px 16px',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <User size={16} />
            Photo de profil
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 4,
              padding: '4px 6px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 16,
        }}>
          {/* Preview */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            background: '#050508',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {preview ? (
              <img src={preview} alt="Preview" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }} />
            ) : (
              <User size={32} style={{ color: 'rgba(255,255,255,0.2)' }} />
            )}
          </div>

          {/* File Input */}
          <div style={{
            border: '2px dashed rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: 12,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'rgba(26,109,255,0.05)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.background = 'rgba(26,109,255,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.background = 'rgba(26,109,255,0.05)';
          }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="photo-input"
              disabled={isLoading}
            />
            <label htmlFor="photo-input" style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}>
              <Upload size={20} style={{ color: '#1a6dff' }} />
              <p style={{
                margin: '0 0 2px 0',
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
              }}>Télécharger une photo</p>
              <p style={{
                margin: 0,
                fontSize: 10,
                color: 'rgba(255,255,255,0.4)',
              }}>PNG, JPG (max 5MB)</p>
            </label>
          </div>

          {selectedFile && (
            <p style={{
              margin: 0,
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
            }}>
              ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: selectedFile ? 'linear-gradient(135deg,#1a6dff,#0040cc)' : 'rgba(26,109,255,0.2)',
                border: 'none',
                borderRadius: 6,
                color: selectedFile ? '#fff' : 'rgba(255,255,255,0.3)',
                fontSize: 12,
                fontWeight: 600,
                cursor: selectedFile && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: (!selectedFile || isLoading) ? 0.5 : 1,
              }}
              onMouseEnter={e => selectedFile && !isLoading && (e.currentTarget.style.background = 'linear-gradient(135deg,#2575ff,#0050db)')}
              onMouseLeave={e => selectedFile && (e.currentTarget.style.background = 'linear-gradient(135deg,#1a6dff,#0040cc)')}
            >
              {isLoading ? '...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
