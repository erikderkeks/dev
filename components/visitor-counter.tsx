'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

/** Simple page-view counter using counterapi.dev (free, no auth needed) */
export function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null)

    useEffect(() => {
        fetch('https://api.counterapi.dev/v1/erikderkeks-dev/visits/up')
            .then(r => r.json())
            .then(d => { if (typeof d?.count === 'number') setCount(d.count) })
            .catch(() => { /* silent fail */ })
    }, [])

    if (count === null) return null

    return (
        <div className="glass visitorCounter">
            <Eye size={13} className="visitorIcon" />
            <span className="visitorCount">{count.toLocaleString()}</span>
            <span className="visitorLabel">views</span>
        </div>
    )
}
