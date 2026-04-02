'use client'

import { motion } from 'framer-motion'
import { MapPin, Download } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { i18n } from '@/data/i18n'

export function Hero({
  name,
  handle,
  bio,
  location,
  available,
}: {
  name: string
  handle: string
  bio: string
  location: string
  available?: boolean
}) {
  const { lang } = useLang()
  const t = (k: keyof typeof i18n) => i18n[k][lang]
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
            <img src="/dev/profile.webp" alt={name} />
          </div>

          <p className="kicker">{handle}</p>
          <h1 className="heroTitle">{name}</h1>
          <p className="heroSubtitle">{bio}</p>

          <div className="heroMeta">
            <span className="pill">
              <MapPin className="icon" />
              <span>{location}</span>
            </span>
            <span className={`pill availBadge${available ? ' avail' : ' unavail'}`}>
              <span className="availDot" aria-hidden="true" />
              <span>{available ? t('hero.available') : t('hero.unavailable')}</span>
            </span>
            <a className="pill" href="/dev/cv.pdf" download aria-label={t('nav.cv')}>
              <Download className="icon" />
              <span>{t('nav.cv')}</span>
            </a>
          </div>
        </motion.div>

        <motion.aside
          className="glass sidePanel"
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.18, duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
        >
          <div>
            <p className="kicker">{t('hero.focus.title')}</p>
            <div className="sep" />
            <p style={{ margin: 0, color: 'var(--fg)', lineHeight: 1.55 }}>
              {t('hero.focus.text1')}
              <br />
              <span style={{ color: 'var(--muted2)' }}>
                {t('hero.focus.text2')}
              </span>
            </p>
          </div>

          <div>
            <p className="kicker">{t('hero.sig.title')}</p>
            <div className="sep" />
            <p className="mono" style={{ margin: 0, color: 'var(--muted)' }}>
              {t('hero.sig.text')}
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
