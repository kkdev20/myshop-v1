import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

let idCounter = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, options = {}) => {
    const id = idCounter++
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 3000
    }
    setToasts((t) => [toast, ...t])

    if (toast.duration > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, toast.duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div aria-live="polite" className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-2 rounded shadow-md text-sm text-white ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}>
            <div className="flex items-center justify-between gap-2">
              <div>{t.message}</div>
              <button onClick={() => removeToast(t.id)} className="text-xs opacity-80">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
