'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

/** Wraps a page section with a staggered fade-in-up on first viewport entry */
export function SectionReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay, ease: [0.2, 0.9, 0.2, 1] }}
        >
            {children}
        </motion.div>
    )
}
