'use client'

import { useEffect, useRef } from 'react'

export function PageTitle() {
    const original = useRef<string>('')

    useEffect(() => {
        original.current = document.title

        function handleVisibility() {
            if (document.hidden) {
                document.title = "hey, don't go! 🫠"
            } else {
                document.title = original.current
            }
        }

        document.addEventListener('visibilitychange', handleVisibility)
        return () => document.removeEventListener('visibilitychange', handleVisibility)
    }, [])

    return null
}
