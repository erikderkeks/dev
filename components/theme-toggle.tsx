'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
    const [dark, setDark] = useState(true)

    useEffect(() => {
        // Read what the inline script already applied
        const current = document.documentElement.getAttribute('data-theme')
        setDark(current !== 'light')
    }, [])

    const toggle = () => {
        const next = !dark
        setDark(next)
        const theme = next ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme)
        try { localStorage.setItem('theme', theme) } catch { /* noop */ }
    }

    return (
        <button
            onClick={toggle}
            className="pill themeToggle"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ padding: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
            {dark ? <Sun className="icon" /> : <Moon className="icon" />}
        </button>
    )
}
