'use client'

import { Cpu, Boxes, Terminal, Shield, Layers, Sparkles, GitBranch, Database } from 'lucide-react'
import { motion } from 'framer-motion'

const items = [
  { icon: Terminal, label: 'TypeScript / Node.js' },
  { icon: Layers, label: 'React / Next.js' },
  { icon: Sparkles, label: 'UI Motion & Microinteractions' },
  { icon: Boxes, label: 'Docker & Tooling' },
  { icon: Database, label: 'Data & APIs' },
  { icon: GitBranch, label: 'Git & CI' },
  { icon: Shield, label: 'Quality & Security' },
  { icon: Cpu, label: 'Systems Thinking' },
]

export function Stack() {
  return (
    <div className="chips">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <motion.span
            key={it.label}
            className="chip"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Icon className="icon" aria-hidden="true" />
            <span>{it.label}</span>
          </motion.span>
        )
      })}
    </div>
  )
}
