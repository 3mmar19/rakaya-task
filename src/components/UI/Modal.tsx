import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-md'
}) => {
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  // Handle animation states when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before starting animation
      setTimeout(() => setIsAnimating(true), 10);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      // Restore scrolling when modal is closed
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  // Create portal to render modal at the root level
  return createPortal(
    <div 
      className={`fixed inset-0 flex items-center justify-center z-[99999] transition-all duration-300 ${isAnimating ? 'bg-black/50' : 'bg-black/0'}`}
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`bg-[#ffffff5c] dark:bg-[#1f2937b3] backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out shadow-lg w-[95%] sm:w-[85%] md:w-[75%] lg:w-full ${maxWidth} ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-white/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
            </div>
            <span className="text-md text-gray-800 dark:text-white font-medium">{title}</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-current/60 dark:text-white hover:text-current dark:hover:text-white transition-colors text-xs w-4 h-4 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
