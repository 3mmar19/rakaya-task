import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast, { ToastType } from '../components/UI/Toast';

export interface Notification {
  id: string;
  message: string;
  type: ToastType;
  timestamp: Date;
  read: boolean;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Show toast and add to notifications history
  const showToast = (message: string, type: ToastType) => {
    setMessage(message);
    setType(type);
    setIsVisible(true);
    
    // Add to notifications history
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      notifications, 
      markAsRead, 
      markAllAsRead, 
      clearNotifications 
    }}>
      {children}
      <Toast 
        message={message} 
        type={type} 
        isVisible={isVisible} 
        onClose={hideToast} 
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
