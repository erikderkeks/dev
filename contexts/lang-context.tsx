'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Lang = 'de' | 'en'

type LangCtx = { lang: Lang; setLang: (l: Lang) => void }

const LangContext = createContext<LangCtx>({ lang: 'de', setLang: () => { } })

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>('de')

    useEffect(() => {
        const saved = localStorage.getItem('lang') as Lang | null
        if (saved === 'de' || saved === 'en') setLangState(saved)
    }, [])

    const setLang = (l: Lang) => {
        setLangState(l)
        localStorage.setItem('lang', l)
    }

    return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
    return useContext(LangContext)
}
