'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Star, GitFork, Code2 } from 'lucide-react'
import type { GitHubRepo } from '@/lib/github'

function langDot(language: string | null) {
  // Monochrome dot (we avoid color). We still show language text.
  return <span className="metaDot" aria-hidden="true" />
}

export function Projects({ repos }: { repos: GitHubRepo[] }) {
  if (!repos.length) {
    return (
      <div className="glass card">
        <p className="cardTitle" style={{ margin: 0 }}>
          GitHub data unavailable
        </p>
        <p className="cardDesc" style={{ marginTop: 8 }}>
          Rate limit or offline build. Try again later — the layout stays intact.
        </p>
      </div>
    )
  }

  return (
    <div className="grid">
      {repos.map((r) => (
        <motion.a
          key={r.id}
          href={r.html_url}
          target="_blank"
          rel="noreferrer"
          className="glass card"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="cardHead">
            <div style={{ minWidth: 0 }}>
              <p className="cardTitle">{r.name}</p>
              <p className="cardDesc">{r.description ?? '—'}</p>
            </div>
            <ArrowUpRight className="icon" aria-hidden="true" />
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
              {langDot(r.language)}
              <Code2 className="icon" aria-hidden="true" />
              {r.language ?? '—'}
            </span>
            <span className="metaItem">
              <span className="mono" style={{ opacity: 0.9 }}>
                {new Date(r.pushed_at).toISOString().slice(0, 10)}
              </span>
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  )
}
