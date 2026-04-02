export type GitHubProfile = {
  login: string
  name: string | null
  html_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
  location: string | null
}

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  archived: boolean
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  pushed_at: string
  homepage: string | null
}

const UA = 'liquid-ghoul-devpage'

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getProfile(username: string): Promise<GitHubProfile | null> {
  return await safeFetch<GitHubProfile>(`https://api.github.com/users/${username}`)
}

export async function getRepos(username: string): Promise<GitHubRepo[]> {
  const repos =
    (await safeFetch<GitHubRepo[]>(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    )) ?? []
  return Array.isArray(repos) ? repos : []
}

type GitHubEvent = {
  type: string
  created_at: string
  payload?: { commits?: unknown[] }
}

/** Returns ISO date strings for push/commit events over the last ~90 days (GitHub event limit). */
export async function getGitHubEventDates(username: string): Promise<string[]> {
  const dates: string[] = []
  for (let page = 1; page <= 10; page++) {
    const events = await safeFetch<GitHubEvent[]>(
      `https://api.github.com/users/${username}/events?per_page=100&page=${page}`
    )
    if (!events?.length) break
    for (const e of events) {
      if (e.type === 'PushEvent' && e.created_at) {
        const commits = (e.payload?.commits as unknown[])?.length ?? 1
        for (let i = 0; i < commits; i++) dates.push(e.created_at)
      }
    }
    if (events.length < 100) break
  }
  return dates
}

export function pickFeatured(repos: GitHubRepo[]): GitHubRepo[] {
  const candidates = repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    })

  // Prefer repos with a description so the grid looks premium
  const withDesc = candidates.filter((r) => (r.description ?? '').trim().length > 0)
  const chosen = (withDesc.length >= 6 ? withDesc : candidates).slice(0, 6)
  return chosen
}

export type Stat = { label: string; value: string; hint: string }

export function buildStats(profile: GitHubProfile | null, repos: GitHubRepo[]): Stat[] {
  const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
  const forks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0)

  const updated = repos
    .map((r) => r.pushed_at)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

  const updatedHint = updated ? `Last push: ${new Date(updated).toISOString().slice(0, 10)}` : '—'

  return [
    {
      label: 'Followers',
      value: String(profile?.followers ?? '—'),
      hint: `Public repos: ${profile?.public_repos ?? '—'}`,
    },
    {
      label: 'Stars',
      value: String(stars),
      hint: `Forks: ${forks}`,
    },
    {
      label: 'Activity',
      value: updated ? 'Active' : '—',
      hint: updatedHint,
    },
  ]
}

/**
 * Converts an array of ISO date strings (from GitHub + ADO) into a
 * day-bucketed map: { "2025-04-01": 3 }. Keeps all dates (no cutoff).
 */
export function buildHeatmapData(dates: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const iso of dates) {
    const ts = new Date(iso).getTime()
    if (isNaN(ts)) continue
    const key = new Date(iso).toISOString().slice(0, 10)
    map[key] = (map[key] ?? 0) + 1
  }
  return map
}

export type StreakData = {
  current: number
  longest: number
  totalDays: number
}

/** Calculates current and longest streak from a heatmap data map. */
export function buildStreakData(data: Record<string, number>): StreakData {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build sorted array of days with commits
  const days = Object.keys(data).filter((d) => (data[d] ?? 0) > 0).sort()

  let longest = 0
  let current = 0
  let streak = 0
  let prev: Date | null = null

  for (const day of days) {
    const d = new Date(day)
    if (prev) {
      const diff = (d.getTime() - prev.getTime()) / 86_400_000
      if (diff === 1) {
        streak++
      } else {
        streak = 1
      }
    } else {
      streak = 1
    }
    if (streak > longest) longest = streak
    prev = d
  }

  // Current streak: streak ending today or yesterday
  const todayStr = today.toISOString().slice(0, 10)
  const yesterday = new Date(today.getTime() - 86_400_000).toISOString().slice(0, 10)

  if (prev) {
    const prevStr = prev.toISOString().slice(0, 10)
    if (prevStr === todayStr || prevStr === yesterday) {
      current = streak
    }
  }

  return { current, longest, totalDays: days.length }
}

export type LangStat = { language: string; count: number; percent: number }

/** Calculates language usage from repos (by repo count, ignoring forks). Merges extra counts from external sources (e.g. ADO). */
export function buildLangStats(repos: GitHubRepo[], extra: Record<string, number> = {}): LangStat[] {
  const map: Record<string, number> = { ...extra }
  for (const r of repos) {
    if (r.fork || r.archived || !r.language) continue
    map[r.language] = (map[r.language] ?? 0) + 1
  }
  const total = Object.values(map).reduce((s, n) => s + n, 0)
  if (!total) return []

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([language, count]) => ({
      language,
      count,
      percent: Math.round((count / total) * 100),
    }))
}

export type WrappedStats = {
  year: number
  totalCommits: number
  topLanguage: string | null
  busiestMonthIdx: number   // 0–11, -1 if no data
  longestStreak: number
  busiestWeekday: number    // 0=Sun … 6=Sat, -1 if no data
}

/** Computes "Spotify Wrapped"-style yearly stats from existing build-time data. */
export function buildWrappedStats(
  heatmap: Record<string, number>,
  streak: StreakData,
  langs: LangStat[]
): WrappedStats {
  const year = new Date().getFullYear()
  const yearStr = String(year)

  const monthCounts = new Array(12).fill(0)
  const dayCounts   = new Array(7).fill(0)
  let totalCommits  = 0

  for (const [date, count] of Object.entries(heatmap)) {
    if (!date.startsWith(yearStr)) continue
    const month = parseInt(date.slice(5, 7)) - 1          // parse from string, no UTC shift
    const d     = new Date(date + 'T12:00:00')            // noon → safe from DST
    monthCounts[month]    += count
    dayCounts[d.getDay()] += count
    totalCommits          += count
  }

  const busiestMonthIdx = totalCommits > 0 ? monthCounts.indexOf(Math.max(...monthCounts)) : -1
  const busiestWeekday  = totalCommits > 0 ? dayCounts.indexOf(Math.max(...dayCounts))     : -1

  return {
    year,
    totalCommits,
    topLanguage:    langs[0]?.language ?? null,
    busiestMonthIdx,
    longestStreak:  streak.longest,
    busiestWeekday,
  }
}
