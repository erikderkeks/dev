'use client'

import { motion } from 'framer-motion'
import type { NowEntry } from '@/data/now'

type Props = {
    entries: NowEntry[]
    available: boolean
}

export function NowSection({ entries, available }: Props) {
    return (
        <div className="nowGrid">
            {entries.map((e, i) => (
                <motion.div
                    key={i}
                    className="glass nowCard"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                        <p className="kicker" style={{ margin: 0 }}>{e.area}</p>
                        {e.link && (
                            <a
                                href={e.link}
                                target="_blank"
                                rel="noreferrer"
                                className="nowLink"
                                aria-label="Open project"
                            >
                                ↗
                            </a>
                        )}
                    </div>
                    <p style={{ margin: 0, color: 'var(--fg)', lineHeight: 1.55, fontSize: 14 }}>
                        {e.text}
                    </p>
                </motion.div>
            ))}
        </div>
    )
}
