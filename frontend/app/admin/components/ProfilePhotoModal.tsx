'use client';

import { useState, useRef } from 'react';
import { X, Upload, Camera } from 'lucide-react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
}

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onUpload,
}: ProfilePhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file && preview) {
      setLoading(true);
      try {
        await onUpload(file);
        onClose();
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#0d0d14',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 32,
        width: '90%',
        maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Photo de profil</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}>
          {preview ? (
            <img
              src={preview}
              alt="preview"
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #1a6dff',
              }}
            />
          ) : (
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#1a6dff,#0040cc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              fontWeight: 700,
              color: '#fff',
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: '#1a6dff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 24px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0050d8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1a6dff')}
          >
            <Camera size={16} />
            Sélectionner une photo
          </button>

          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '10px 20px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                flex: 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={!preview || loading}
              style={{
                background: preview ? '#00e5a0' : 'rgba(0,229,160,0.3)',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                color: preview ? '#000' : 'rgba(0,0,0,0.4)',
                fontSize: 14,
                fontWeight: 600,
                cursor: preview && !loading ? 'pointer' : 'not-allowed',
                flex: 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseEnter={e => preview && (e.currentTarget.style.background = '#00d98e')}
              onMouseLeave={e => preview && (e.currentTarget.style.background = '#00e5a0')}
            >
              <Upload size={16} />
              {loading ? 'Upload...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
