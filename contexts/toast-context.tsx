'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
type ToastItem = { id: number; message: string; type: ToastType }
type ToastCtx = { showToast: (message: string, type?: ToastType) => void }

const Ctx = createContext<ToastCtx>({ showToast: () => { } })

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now()
        setToasts(t => [...t, { id, message, type }])
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800)
    }, [])

    const dismiss = (id: number) => setToasts(t => t.filter(x => x.id !== id))

    return (
        <Ctx.Provider value={{ showToast }}>
            {children}
            <div className="toastStack" aria-live="polite" aria-atomic="false">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => {
                        const Icon = t.type === 'success' ? Check : t.type === 'error' ? X : Info
                        return (
                            <motion.div
                                key={t.id}
                                className={`toast toast--${t.type}`}
                                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.94 }}
                                transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
                                layout
                            >
                                <span className="toastIcon">
                                    <Icon size={14} />
                                </span>
                                <span className="toastMsg">{t.message}</span>
                                <button className="toastClose" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                                    <X size={12} />
                                </button>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </Ctx.Provider>
    )
}

export const useToast = () => useContext(Ctx)
