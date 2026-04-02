'use client'

import { useEffect, useState, useRef } from 'react'
import type { GitHubProfile, GitHubRepo } from '@/lib/github'
import { pickFeatured, buildStats, type Stat } from '@/lib/github'

const USERNAME = 'erikderkeks'
const INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

async function fetchProfile(username: string): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'liquid-ghoul-devpage' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as GitHubProfile
  } catch {
    return null
  }
}

async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'liquid-ghoul-devpage' },
        cache: 'no-store',
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? (data as GitHubRepo[]) : []
  } catch {
    return []
  }
}

export type GitHubData = {
  profile: GitHubProfile | null
  featured: GitHubRepo[]
  stats: Stat[]
  loading: boolean
  lastUpdated: Date | null
}

export function useGitHub(initialProfile: GitHubProfile | null, initialRepos: GitHubRepo[]): GitHubData {
  const [profile, setProfile] = useState<GitHubProfile | null>(initialProfile)
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function refresh() {
    setLoading(true)
    const [newProfile, newRepos] = await Promise.all([
      fetchProfile(USERNAME),
      fetchRepos(USERNAME),
    ])
    if (newProfile) setProfile(newProfile)
    if (newRepos.length) setRepos(newRepos)
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    intervalRef.current = setInterval(refresh, INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return {
    profile,
    featured: pickFeatured(repos),
    stats: buildStats(profile, repos),
    loading,
    lastUpdated,
  }
}
