'use client';
import { useRef, useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  maxWidth?: number;
  onClose: () => void;
}

export default function DraggableModal({ children, maxWidth = 480, onClose }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const start = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!start.current) return;
      setPos(p => {
        if (!isDragging) return p;
        return {
          x: start.current.px + e.clientX - start.current.mx,
          y: start.current.py + e.clientY - start.current.my,
        };
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  // Separate effect for dragging movement to avoid stale closure
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      setPos({
        x: start.current.px + e.clientX - start.current.mx,
        y: start.current.py + e.clientY - start.current.my,
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const onHandleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    start.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    e.preventDefault();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflow: 'auto',
          background: '#0d0d14',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,109,255,0.08)',
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          userSelect: isDragging ? 'none' : 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — bande invisible sur le header */}
        <div
          onMouseDown={onHandleMouseDown}
          style={{
            position: 'absolute', top: 0, left: 0, right: 40, height: 56,
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: 20,
            borderRadius: '16px 0 0 0',
          }}
          title="Déplacer la fenêtre"
        />
        {children}
      </div>
    </div>
  );
}
