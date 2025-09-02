import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';

// Create context
const ToastContext = createContext(null);

/**
 * Toast Provider component
 * Manages toast notifications throughout the application
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast notification
   */
  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      message,
      type,
      ...options
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  /**
   * Remove a toast notification
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Success toast shorthand
   */
  const success = useCallback((message, options = {}) => {
    return addToast(message, 'success', options);
  }, [addToast]);

  /**
   * Error toast shorthand
   */
  const error = useCallback((message, options = {}) => {
    return addToast(message, 'error', options);
  }, [addToast]);

  /**
   * Warning toast shorthand
   */
  const warning = useCallback((message, options = {}) => {
    return addToast(message, 'warning', options);
  }, [addToast]);

  /**
   * Info toast shorthand
   */
  const info = useCallback((message, options = {}) => {
    return addToast(message, 'info', options);
  }, [addToast]);

  // Context value
  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            autoClose={toast.autoClose !== false}
            duration={toast.duration || 5000}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to use the toast context
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;

