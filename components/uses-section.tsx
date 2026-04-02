'use client'

import { motion } from 'framer-motion'
import type { UsesCategory } from '@/data/uses'

export function UsesSection({ uses }: { uses: UsesCategory[] }) {
    return (
        <div className="usesGrid">
            {uses.map((cat, i) => (
                <motion.div
                    key={cat.category}
                    className="glass usesCard"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
                >
                    <p className="kicker" style={{ marginBottom: 12 }}>{cat.category}</p>
                    <ul className="usesList">
                        {cat.items.map((item) => (
                            <li key={item.name} className="usesItem">
                                <span className="usesName">{item.name}</span>
                                {item.detail && <span className="usesDetail">{item.detail}</span>}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            ))}
        </div>
    )
}
