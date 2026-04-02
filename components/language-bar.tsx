'use client'

import { motion } from 'framer-motion'
import type { LangStat } from '@/lib/github'

const LANG_COLORS: Record<string, string> = {
    TypeScript: 'rgba(49,120,198,0.85)',
    JavaScript: 'rgba(240,200,50,0.85)',
    Lua: 'rgba(100,120,220,0.85)',
    Python: 'rgba(55,170,100,0.85)',
    'C#': 'rgba(160,80,200,0.85)',
    HTML: 'rgba(220,80,60,0.85)',
    CSS: 'rgba(60,140,200,0.85)',
    Shell: 'rgba(140,200,100,0.85)',
    Go: 'rgba(100,210,220,0.85)',
    Rust: 'rgba(200,120,50,0.85)',
}

function langColor(lang: string) {
    return LANG_COLORS[lang] ?? 'rgba(255,255,255,0.35)'
}

export function LanguageBar({ langs }: { langs: LangStat[] }) {
    if (!langs.length) return null

    return (
        <motion.div
            className="glass langWrap"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Stacked bar */}
            <div className="langBar">
                {langs.map((l, i) => (
                    <motion.div
                        key={l.language}
                        className="langSegment"
                        title={`${l.language}: ${l.percent}%`}
                        style={{ width: `${l.percent}%`, background: langColor(l.language) }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="langLegend">
                {langs.map((l) => (
                    <div key={l.language} className="langItem">
                        <span className="langDot" style={{ background: langColor(l.language) }} />
                        <span className="langName">{l.language}</span>
                        <span className="langPct mono">{l.percent}%</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
