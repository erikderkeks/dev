'use client'

import { useEffect, useState } from 'react'

export function ScrollProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        function onScroll() {
            const el = document.documentElement
            const scrolled = el.scrollTop
            const total = el.scrollHeight - el.clientHeight
            setProgress(total > 0 ? scrolled / total : 0)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                zIndex: 100,
                background: 'var(--border2)',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress * 100}%`,
                    background: 'var(--muted)',
                    transition: 'width 60ms linear',
                }}
            />
        </div>
    )
}
