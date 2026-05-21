import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4" style={{ background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="glass-panel w-full max-w-lg flex flex-col shadow-2xl border-white border-opacity-20" style={{ maxHeight: '90vh', background: '#1e293b' }}>
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-semibold m-0">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
