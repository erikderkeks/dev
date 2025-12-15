import { TopNav } from '@/components/top-nav'
import { Hero } from '@/components/hero'
import { Stats } from '@/components/stats'
import { Projects } from '@/components/projects'
import { Stack } from '@/components/stack'
import { Footer } from '@/components/footer'
import { getProfile, getRepos, pickFeatured, buildStats } from '@/lib/github'

export default async function Home() {
  const username = 'erikderkeks'

  const [profile, repos] = await Promise.all([getProfile(username), getRepos(username)])
  const featured = pickFeatured(repos)
  const stats = buildStats(profile, repos)

  return (
    <div className="page">
      <div className="container">
        <TopNav username={username} />

        <Hero
          name={profile?.name ?? 'Erik Oberbillig'}
          handle={`@${username}`}
          bio={
            profile?.bio ??
            'I build calm, maintainable software — with an eye for systems, clarity and craft.'
          }
          location={profile?.location ?? 'Switzerland'}
        />

        <div className="section" id="work">
          <div className="sectionTitle">
            <h2>Signals</h2>
            <p>Minimal stats, maximum clarity</p>
          </div>
          <Stats stats={stats} />
        </div>

        <div className="section" id="projects">
          <div className="sectionTitle">
            <h2>Projects</h2>
            <p>Selected from GitHub</p>
          </div>
          <Projects repos={featured} />
        </div>

        <div className="section" id="stack">
          <div className="sectionTitle">
            <h2>Stack</h2>
            <p>Tools I like to ship with</p>
          </div>
          <Stack />
        </div>

        <Footer />
      </div>
    </div>
  )
}
