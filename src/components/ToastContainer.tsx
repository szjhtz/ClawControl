import { useEffect, useState, useCallback } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let _listeners: Array<(toasts: Toast[]) => void> = []
let _toasts: Toast[] = []

function notify() {
  _listeners.forEach((fn) => fn([..._toasts]))
}

export function showToast(message: string, type: Toast['type'] = 'success', duration = 3000) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
  _toasts = [..._toasts, { id, message, type }]
  notify()
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id)
    notify()
  }, duration)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    _listeners.push(setToasts)
    return () => {
      _listeners = _listeners.filter((fn) => fn !== setToasts)
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    _toasts = _toasts.filter((t) => t.id !== id)
    notify()
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role="status"
          onClick={() => dismiss(toast.id)}
        >
          <span className="toast-icon">
            {toast.type === 'success' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            )}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
