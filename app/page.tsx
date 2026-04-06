import { TopNav } from '@/components/top-nav'
import { GitHubLive } from '@/components/github-live'
import { ActivityHeatmap } from '@/components/heatmap'
import { StreakDisplay } from '@/components/streak-display'
import { LanguageBar } from '@/components/language-bar'
import { WrappedCard } from '@/components/wrapped-card'
import { NowSection } from '@/components/now-section'
import { NotesSection } from '@/components/notes-section'
import { UsesSection } from '@/components/uses-section'
import { TimelineSection } from '@/components/timeline-section'
import { Stack } from '@/components/stack'
import { ContactCard } from '@/components/contact-card'
import { Footer } from '@/components/footer'
import { TerminalWidget } from '@/components/terminal-widget'
import { SectionReveal } from '@/components/section-reveal'
import { SpotifyPlayer } from '@/components/spotify-player'
import { WakaTimeWidget } from '@/components/wakatime-widget'
import { VisitorCounter } from '@/components/visitor-counter'
import { T } from '@/components/t'
import { getProfile, getRepos, getGitHubEventDates, buildHeatmapData, buildStreakData, buildLangStats, buildWrappedStats } from '@/lib/github'
import { getAdoCommitDates, getAdoRepoLanguages } from '@/lib/azuredevops'
import { getWakaStats } from '@/lib/wakatime'
import { nowEntries, isAvailable } from '@/data/now'
import { notes } from '@/data/notes'
import { uses } from '@/data/uses'
import { timeline } from '@/data/timeline'

const USERNAME = 'erikderkeks'

export default async function Home() {
  const [profile, repos, ghDates, adoDates, adoLangs, wakaStats] = await Promise.all([
    getProfile(USERNAME),
    getRepos(USERNAME),
    getGitHubEventDates(USERNAME),
    getAdoCommitDates(365),
    getAdoRepoLanguages(),
    getWakaStats(),
  ])

  const allDates = [...ghDates, ...adoDates]
  const heatmap = buildHeatmapData(allDates)
  const streak = buildStreakData(heatmap)
  const langs = buildLangStats(repos, adoLangs)
  const wrapped = buildWrappedStats(heatmap, streak, langs)

  return (
    <div className="page">
      <div className="pageBg" aria-hidden="true" />

      <div className="container">
        <TopNav username={USERNAME} />

        <GitHubLive initialProfile={profile} initialRepos={repos} available={isAvailable} />

        <SectionReveal>
          <section className="section" id="activity">
            <div className="sectionTitle">
              <h2><T id="activity.title" /></h2>
              <p><T id="activity.sub" /></p>
            </div>
            <ActivityHeatmap data={heatmap} />
            <StreakDisplay streak={streak} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="languages">
            <div className="sectionTitle">
              <h2><T id="langs.title" /></h2>
              <p><T id="langs.sub" /></p>
            </div>
            <LanguageBar langs={langs} />
          </section>
        </SectionReveal>

        {wakaStats && (
          <SectionReveal>
            <section className="section" id="wakatime">
              <div className="sectionTitle">
                <h2><T id="wakatime.title" /></h2>
                <p><T id="wakatime.sub" /></p>
              </div>
              <WakaTimeWidget stats={wakaStats} />
            </section>
          </SectionReveal>
        )}

        <SectionReveal>
          <section className="section" id="wrapped">
            <div className="sectionTitle">
              <h2><T id="wrapped.title" /></h2>
              <p><T id="wrapped.sub" /></p>
            </div>
            <WrappedCard stats={wrapped} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="projects">
            <div className="sectionTitle">
              <h2><T id="now.title" /></h2>
              <p><T id="now.sub" /></p>
            </div>
            <NowSection entries={nowEntries} available={isAvailable} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="notes">
            <div className="sectionTitle">
              <h2><T id="notes.title" /></h2>
              <p><T id="notes.sub" /></p>
            </div>
            <NotesSection notes={notes} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="timeline">
            <div className="sectionTitle">
              <h2><T id="timeline.title" /></h2>
              <p><T id="timeline.sub" /></p>
            </div>
            <TimelineSection entries={timeline} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="uses">
            <div className="sectionTitle">
              <h2><T id="uses.title" /></h2>
              <p><T id="uses.sub" /></p>
            </div>
            <UsesSection uses={uses} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="stack">
            <div className="sectionTitle">
              <h2><T id="stack.title" /></h2>
              <p><T id="stack.sub" /></p>
            </div>
            <Stack />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="section" id="contact">
            <div className="sectionTitle">
              <h2><T id="contact.title" /></h2>
              <p><T id="contact.sub" /></p>
            </div>
            <ContactCard />
            <div className="contactFooterRow">
              <SpotifyPlayer />
              <VisitorCounter />
            </div>
          </section>
        </SectionReveal>

        <Footer />
      </div>

      <TerminalWidget />
    </div>
  )
}

