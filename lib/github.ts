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
      // Important: keep it static-friendly for Next export
      cache: 'force-cache',
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
