import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-md w-full px-4">
        {toasts.map((toast) => {
          const isAdd = toast.type === 'add' || toast.type === 'success';
          const isRemove = toast.type === 'remove' || toast.type === 'delete' || toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-semibold backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
                isAdd
                  ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-950/40'
                  : isRemove
                  ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-950/40'
                  : 'bg-gray-900/90 border-gray-700 text-gray-200 shadow-gray-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isAdd
                      ? 'bg-emerald-500 text-gray-950'
                      : isRemove
                      ? 'bg-rose-500 text-white'
                      : 'bg-sky-500 text-gray-950'
                  }`}
                >
                  {isAdd ? '✓' : isRemove ? '✕' : 'ℹ'}
                </span>
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-3 px-1 py-0.5"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
