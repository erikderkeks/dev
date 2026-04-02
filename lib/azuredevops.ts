/** Azure DevOps — server-side only (PATs never reach the browser) */

export type AdoCommit = {
  commitId: string
  author: { date: string }
}

type AdoProject = { id: string; name: string }
type AdoRepo    = { id: string; name: string }

function basicAuth(pat: string) {
  return 'Basic ' + Buffer.from(`:${pat}`).toString('base64')
}

async function adoGet<T>(url: string, pat: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: basicAuth(pat),
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

/** Reads all configured ADO instances from env vars.
 *  Primary:   AZURE_DEVOPS_ORG  / AZURE_DEVOPS_PAT  / AZURE_DEVOPS_AUTHOR_1
 *  Secondary: AZURE_DEVOPS_ORG_2 / AZURE_DEVOPS_PAT_2 / AZURE_DEVOPS_AUTHOR_2
 *  AUTHOR is optional but strongly recommended — without it all team members' commits are counted.
 */
function getInstances(): { org: string; pat: string; author?: string }[] {
  const pairs: { org: string; pat: string; author?: string }[] = []
  const orgs = [
    { org: process.env.AZURE_DEVOPS_ORG,   pat: process.env.AZURE_DEVOPS_PAT,   author: process.env.AZURE_DEVOPS_AUTHOR_1 },
    { org: process.env.AZURE_DEVOPS_ORG_2, pat: process.env.AZURE_DEVOPS_PAT_2, author: process.env.AZURE_DEVOPS_AUTHOR_2 },
  ]
  for (const { org, pat, author } of orgs) {
    if (org && pat) pairs.push({ org, pat, author: author || undefined })
  }
  return pairs
}

async function getCommitDatesForInstance(org: string, pat: string, fromDate: string, author?: string): Promise<string[]> {
  const projectsRes = await adoGet<{ value: AdoProject[] }>(
    `https://dev.azure.com/${org}/_apis/projects?$top=50&api-version=7.0`,
    pat
  )
  if (!projectsRes?.value?.length) return []

  const dates: string[] = []

  for (const project of projectsRes.value) {
    const reposRes = await adoGet<{ value: AdoRepo[] }>(
      `https://dev.azure.com/${org}/${encodeURIComponent(project.name)}/_apis/git/repositories?api-version=7.0`,
      pat
    )
    if (!reposRes?.value?.length) continue

    for (const repo of reposRes.value) {
      const authorParam = author ? `&searchCriteria.author=${encodeURIComponent(author)}` : ''
      const commitsRes = await adoGet<{ value: AdoCommit[] }>(
        `https://dev.azure.com/${org}/${encodeURIComponent(project.name)}/_apis/git/repositories/${repo.id}/commits` +
          `?searchCriteria.fromDate=${fromDate}&searchCriteria.$top=500${authorParam}&api-version=7.0`,
        pat
      )
      if (!commitsRes?.value?.length) continue
      for (const c of commitsRes.value) {
        if (c.author?.date) dates.push(c.author.date)
      }
    }
  }

  return dates
}

/** Returns ISO date strings for all commits across all configured ADO instances. */
export async function getAdoCommitDates(days = 365): Promise<string[]> {
  const instances = getInstances()
  if (!instances.length) return []

  const fromDate = new Date(Date.now() - days * 86_400_000).toISOString()

  const results = await Promise.all(
    instances.map(({ org, pat, author }) => getCommitDatesForInstance(org, pat, fromDate, author))
  )

  return results.flat()
}

/* ── Language detection ──────────────────────────────────── */

type AdoItem = { path: string }

function inferLanguage(paths: string[]): string | null {
  const lower = paths.map((p) => (p ?? '').toLowerCase())
  if (lower.some((p) => p.endsWith('.csproj') || p.endsWith('.sln'))) return 'C#'
  if (lower.some((p) => p === '/tsconfig.json')) return 'TypeScript'
  if (lower.some((p) => p === '/package.json')) return 'JavaScript'
  if (lower.some((p) => p === '/requirements.txt' || p.endsWith('.py'))) return 'Python'
  if (lower.some((p) => p.endsWith('.lua'))) return 'Lua'
  if (lower.some((p) => p === '/go.mod' || p.endsWith('.go'))) return 'Go'
  if (lower.some((p) => p === '/cargo.toml' || p.endsWith('.rs'))) return 'Rust'
  return null
}

async function getLanguagesForInstance(org: string, pat: string): Promise<Record<string, number>> {
  const langs: Record<string, number> = {}
  const projectsRes = await adoGet<{ value: AdoProject[] }>(
    `https://dev.azure.com/${org}/_apis/projects?$top=50&api-version=7.0`,
    pat
  )
  if (!projectsRes?.value?.length) return langs

  for (const project of projectsRes.value) {
    const reposRes = await adoGet<{ value: AdoRepo[] }>(
      `https://dev.azure.com/${org}/${encodeURIComponent(project.name)}/_apis/git/repositories?api-version=7.0`,
      pat
    )
    if (!reposRes?.value?.length) continue

    for (const repo of reposRes.value) {
      const itemsRes = await adoGet<{ value: AdoItem[] }>(
        `https://dev.azure.com/${org}/${encodeURIComponent(project.name)}/_apis/git/repositories/${repo.id}/items` +
          `?scopePath=/&recursionLevel=oneLevel&api-version=7.0`,
        pat
      )
      if (!itemsRes?.value?.length) continue
      const lang = inferLanguage(itemsRes.value.map((i) => i.path))
      if (lang) langs[lang] = (langs[lang] ?? 0) + 1
    }
  }
  return langs
}

/** Returns a language → repo-count map across all configured ADO instances. */
export async function getAdoRepoLanguages(): Promise<Record<string, number>> {
  const instances = getInstances()
  if (!instances.length) return {}

  const results = await Promise.all(
    instances.map(({ org, pat }) => getLanguagesForInstance(org, pat))
  )

  const merged: Record<string, number> = {}
  for (const r of results) {
    for (const [lang, count] of Object.entries(r)) {
      merged[lang] = (merged[lang] ?? 0) + count
    }
  }
  return merged
}
