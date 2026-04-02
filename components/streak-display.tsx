'use client'

import { motion } from 'framer-motion'
import { Flame, TrendingUp, CalendarDays } from 'lucide-react'
import type { StreakData } from '@/lib/github'

export function StreakDisplay({ streak }: { streak: StreakData }) {
    const items = [
        { icon: Flame, label: 'Current streak', value: streak.current, suffix: 'd' },
        { icon: TrendingUp, label: 'Longest streak', value: streak.longest, suffix: 'd' },
        { icon: CalendarDays, label: 'Active days', value: streak.totalDays, suffix: '' },
    ]

    return (
        <div className="streakRow">
            {items.map((item, i) => {
                const Icon = item.icon
                return (
                    <motion.div
                        key={item.label}
                        className="glass streakCard"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                    >
                        <div className="streakTop">
                            <span className="kicker">{item.label}</span>
                            <Icon className="icon" style={{ opacity: 0.5 }} />
                        </div>
                        <div className="streakValue">
                            {item.value}
                            {item.suffix && <span className="streakSuffix">{item.suffix}</span>}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
