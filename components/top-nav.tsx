'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Mail, ArrowUpRight, Menu, X } from 'lucide-react'

function MaskMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c4.9 0 9 3.6 9 8.6 0 3.7-2.1 7.1-5.6 9.4-1 .7-2.1 1-3.4 1s-2.4-.3-3.4-1C5.1 17.7 3 14.3 3 10.6 3 5.6 7.1 2 12 2Zm-4.1 9.2c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6Zm8.2 0c-.9 0-1.6.7-1.6 1.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6ZM12 13.8c-1.9 0-3.4.8-4.3 2.1-.3.4-.2.9.2 1.2.4.3.9.2 1.2-.2.6-.8 1.6-1.3 2.9-1.3s2.3.5 2.9 1.3c.3.4.8.5 1.2.2.4-.3.5-.8.2-1.2-.9-1.3-2.4-2.1-4.3-2.1Z"
      />
    </svg>
  )
}

export function TopNav({ username }: { username: string }) {
  const [open, setOpen] = useState(false)

  const gh = `https://github.com/${username}`
  const mail = 'mailto:erikderkeks@gmail.com'

  return (
    <header className="nav">
      <div className="glass navInner">
        {/* Brand */}
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            <MaskMark />
          </div>

          <div className="brandText">
            <strong>erikderkeks</strong>
            <span className="mono">{`github.com/${username}`}</span>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="navLinks desktopOnly" aria-label="Primary">
          <a className="pill" href="#projects">
            <ArrowUpRight className="icon" />
            <span>Projects</span>
          </a>
          <a className="pill" href={gh} target="_blank" rel="noreferrer">
            <Github className="icon" />
            <span>GitHub</span>
          </a>
          <a className="pill" href={mail}>
            <Mail className="icon" />
            <span>Contact</span>
          </a>
        </nav>

        {/* Mobile burger */}
        <button
          className="burger mobileOnly"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="glass mobileMenu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <a href="#projects" onClick={() => setOpen(false)}>
              Projects
            </a>
            <a href={gh} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              GitHub
            </a>
            <a href={mail} onClick={() => setOpen(false)}>
              Contact
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
