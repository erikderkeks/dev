'use client'

import { useGitHub } from '@/hooks/useGitHub'
import { Stats } from '@/components/stats'
import { Projects } from '@/components/projects'
import { Hero } from '@/components/hero'
import { T } from '@/components/t'
import { useLang } from '@/contexts/lang-context'
import { i18n } from '@/data/i18n'
import type { GitHubProfile, GitHubRepo } from '@/lib/github'

type Props = {
    initialProfile: GitHubProfile | null
    initialRepos: GitHubRepo[]
    available: boolean
}

export function GitHubLive({ initialProfile, initialRepos, available }: Props) {
    const { profile, featured, stats, loading, lastUpdated } = useGitHub(initialProfile, initialRepos)
    const { lang } = useLang()

    return (
        <>
            <Hero
                name={profile?.name ?? 'Erik'}
                handle={`@erikderkeks`}
                bio={profile?.bio ?? 'Dont build one time systems. Build echosystems.'}
                location={profile?.location ?? 'Switzerland'}
                available={available}
            />

            <section className="section" id="work">
                <div className="sectionTitle">
                    <h2><T id="signals.title" /></h2>
                    <p>
                        <T id="signals.sub" />
                        {lastUpdated && (
                            <span className="mono" style={{ opacity: 0.5, marginLeft: 8, fontSize: '0.75em' }}>
                                · {loading ? i18n['signals.refreshing'][lang] : `${i18n['signals.updated'][lang]} ${lastUpdated.toLocaleTimeString()}`}
                            </span>
                        )}
                    </p>
                </div>
                <Stats stats={stats} />
            </section>

            <section className="section" id="public-work">
                <div className="sectionTitle">
                    <h2><T id="projects.title" /></h2>
                    <p><T id="projects.sub" /></p>
                </div>
                <Projects repos={featured} />
            </section>
        </>
    )
}
