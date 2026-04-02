'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Star, GitFork, Code2, ChevronDown } from 'lucide-react'
import type { GitHubRepo } from '@/lib/github'

export function Projects({ repos }: { repos: GitHubRepo[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  if (!repos.length) {
    return (
      <div className="glass card">
        <p className="cardTitle" style={{ margin: 0 }}>
          GitHub data unavailable
        </p>
        <p className="cardDesc" style={{ marginTop: 8 }}>
          Rate limit or offline build. Try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid">
      {repos.map((r) => {
        const isOpen = expanded === r.id
        return (
          <motion.div
            key={r.id}
            className="glass card"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {/* Clickable header row */}
            <button
              className="cardExpandBtn"
              onClick={() => setExpanded(isOpen ? null : r.id)}
              aria-expanded={isOpen}
            >
              <div className="cardHead">
                <div style={{ minWidth: 0, textAlign: 'left' }}>
                  <p className="cardTitle">{r.name}</p>
                  <p className="cardDesc">{r.description ?? '—'}</p>
                </div>
                <ChevronDown
                  className="icon cardChevron"
                  aria-hidden="true"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 220ms ease', flexShrink: 0 }}
                />
              </div>

              <div className="cardMeta">
                <span className="metaItem">
                  <Star className="icon" aria-hidden="true" />
                  {r.stargazers_count}
                </span>
                <span className="metaItem">
                  <GitFork className="icon" aria-hidden="true" />
                  {r.forks_count}
                </span>
                <span className="metaItem">
                  <span className="metaDot" aria-hidden="true" />
                  <Code2 className="icon" aria-hidden="true" />
                  {r.language ?? '—'}
                </span>
                <span className="metaItem">
                  <span className="mono">{new Date(r.pushed_at).toISOString().slice(0, 10)}</span>
                </span>
              </div>
            </button>

            {/* Expandable detail */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="cardDetail">
                    <div className="sep" style={{ margin: '0 0 14px 0' }} />
                    {r.homepage && (
                      <p className="cardDetailRow">
                        <span className="kicker">Live</span>
                        <a href={r.homepage} target="_blank" rel="noreferrer" className="cardDetailLink">
                          {r.homepage}
                        </a>
                      </p>
                    )}
                    <p className="cardDetailRow">
                      <span className="kicker">Repo</span>
                      <a href={r.html_url} target="_blank" rel="noreferrer" className="cardDetailLink">
                        {r.full_name} <ArrowUpRight style={{ width: 12, height: 12, display: 'inline' }} />
                      </a>
                    </p>
                    <p className="cardDetailRow">
                      <span className="kicker">Updated</span>
                      <span className="mono" style={{ color: 'var(--muted)' }}>
                        {new Date(r.updated_at).toISOString().slice(0, 10)}
                      </span>
                    </p>
                    {r.archived && (
                      <p className="cardDetailRow">
                        <span className="kicker" style={{ color: 'rgba(255,200,100,0.7)' }}>Archived</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
