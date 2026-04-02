import { TopNav } from '@/components/top-nav'
import { GitHubLive } from '@/components/github-live'
import { Stack } from '@/components/stack'
import { Footer } from '@/components/footer'
import { getProfile, getRepos } from '@/lib/github'

const USERNAME = 'erikderkeks'

export default async function Home() {
  const [profile, repos] = await Promise.all([
    getProfile(USERNAME),
    getRepos(USERNAME),
  ])

  return (
    <div className="page">
      {/* FIX: globaler, fixer Hintergrund */}
      <div className="pageBg" aria-hidden="true" />

      {/* Content */}
      <div className="container">
        <TopNav username={USERNAME} />

        <GitHubLive initialProfile={profile} initialRepos={repos} />

        <section className="section" id="stack">
          <div className="sectionTitle">
            <h2>Stack</h2>
            <p>Tools I like to ship with</p>
          </div>
          <Stack />
        </section>

        <Footer />
      </div>
    </div>
  )
}
