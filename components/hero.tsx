'use client'

import { motion } from 'framer-motion'
import { Sparkles, MapPin, ShieldCheck, Terminal } from 'lucide-react'

export function Hero({
  name,
  handle,
  bio,
  location,
}: {
  name: string
  handle: string
  bio: string
  location: string
}) {
  return (
    <section className="hero">
      {/* Hintergrund-Effekte */}
      <div className="scanlines" aria-hidden="true" />
      <div className="vertMark" aria-hidden="true">
        <b>黒</b> / 白
      </div>
      <div className="ghoulOverlay" aria-hidden="true" />

      {/* Inhalt */}
      <div className="heroGrid">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1] }}
        >
          {/* OPTIONAL: Profilbild */}
          <div className="heroAvatar">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/profile.webp`} alt={name} />
          </div>

          <p className="kicker">{handle}</p>
          <h1 className="heroTitle">{name}</h1>
          <p className="heroSubtitle">{bio}</p>

          <div className="heroMeta">
            <span className="pill">
              <MapPin className="icon" />
              <span>{location}</span>
            </span>
            <span className="pill">
              <ShieldCheck className="icon" />
              <span>Clean Systems</span>
            </span>
            <span className="pill">
              <Terminal className="icon" />
              <span>Craft</span>
            </span>
            <span className="pill">
              <Sparkles className="icon" />
              <span>Liquid Glass UI</span>
            </span>
          </div>
        </motion.div>

        <motion.aside
          className="glass sidePanel"
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.18, duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
        >
          <div>
            <p className="kicker">Focus</p>
            <div className="sep" />
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)', lineHeight: 1.55 }}>
              Calm architecture. Minimal interfaces. Strong defaults.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.52)' }}>
                A monochrome, Tokyo-at-night mood — without the noise.
              </span>
            </p>
          </div>

          <div>
            <p className="kicker">Signature</p>
            <div className="sep" />
            <p className="mono" style={{ margin: 0, color: 'rgba(255,255,255,0.62)' }}>
              “Ship small. Refine relentlessly.”
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
