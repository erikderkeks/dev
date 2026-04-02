'use client'

import { useGitHub } from '@/hooks/useGitHub'
import { Stats } from '@/components/stats'
import { Projects } from '@/components/projects'
import { Hero } from '@/components/hero'
import type { GitHubProfile, GitHubRepo } from '@/lib/github'

type Props = {
    initialProfile: GitHubProfile | null
    initialRepos: GitHubRepo[]
}

export function GitHubLive({ initialProfile, initialRepos }: Props) {
    const { profile, featured, stats, loading, lastUpdated } = useGitHub(initialProfile, initialRepos)

    return (
        <>
            <Hero
                name={profile?.name ?? 'Erik'}
                handle={`@erikderkeks`}
                bio={profile?.bio ?? 'Dont build one time systems. Build echosystems.'}
                location={profile?.location ?? 'Switzerland'}
            />

            <section className="section" id="work">
                <div className="sectionTitle">
                    <h2>Signals</h2>
                    <p>
                        Minimal stats, maximum clarity
                        {lastUpdated && (
                            <span className="mono" style={{ opacity: 0.5, marginLeft: 8, fontSize: '0.75em' }}>
                                · {loading ? 'refreshing…' : `updated ${lastUpdated.toLocaleTimeString()}`}
                            </span>
                        )}
                    </p>
                </div>
                <Stats stats={stats} />
            </section>

            <section className="section" id="projects">
                <div className="sectionTitle">
                    <h2>Projects</h2>
                    <p>Selected from GitHub</p>
                </div>
                <Projects repos={featured} />
            </section>
        </>
    )
}
