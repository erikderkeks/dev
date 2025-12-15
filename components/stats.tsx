'use client'

import { motion } from 'framer-motion'
import { Users, Star, Activity } from 'lucide-react'
import type { Stat } from '@/lib/github'

const icons = [Users, Star, Activity]

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className="stats">
      {stats.map((s, idx) => {
        const Icon = icons[idx] ?? Activity
        return (
          <motion.div
            key={s.label}
            className="glass statCard"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="statTop">
              <span>{s.label}</span>
              <Icon className="icon" />
            </div>
            <div className="statValue">{s.value}</div>
            <div className="statHint">{s.hint}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
