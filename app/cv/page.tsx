import { ArrowLeft, MapPin, Mail, Github } from 'lucide-react'
import { PrintButton } from '@/components/print-button'
import { timeline } from '@/data/timeline'
import { uses } from '@/data/uses'
import { contact } from '@/data/contact'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'CV — Erik Oberbillig',
    description: 'Curriculum Vitae — Software Developer from Switzerland.',
}

const STACK = ['TypeScript / Node.js', 'React / Next.js', 'Angular / Ionic', 'Azure Functions / IoT Edge', 'Docker & Kubernetes', 'MySQL / MSSQL / Azure SQL', 'Git, GitHub, Azure DevOps']

export default function CvPage() {
    return (
        <div className="cvRoot">
            {/* Screen-only toolbar */}
            <div className="cvToolbar noPrint">
                <a href="/dev/" className="pill cvBackBtn">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </a>
                <PrintButton />
            </div>

            <main className="cvPage">
                {/* Header */}
                <header className="cvHeader">
                    <div>
                        <h1 className="cvName">Erik Oberbillig</h1>
                        <p className="cvRole">Software Developer</p>
                    </div>
                    <div className="cvMeta">
                        <span className="cvMetaItem">
                            <MapPin size={13} /> Switzerland
                        </span>
                        {contact.email && (
                            <a className="cvMetaItem cvMetaLink" href={`mailto:${contact.email}`}>
                                <Mail size={13} /> {contact.email}
                            </a>
                        )}
                        {contact.github && (
                            <a className="cvMetaItem cvMetaLink" href={contact.github} target="_blank" rel="noreferrer">
                                <Github size={13} /> github.com/erikderkeks
                            </a>
                        )}
                    </div>
                </header>

                <hr className="cvDivider" />

                {/* Summary */}
                <section className="cvSection">
                    <h2 className="cvSectionTitle">About</h2>
                    <p className="cvSummary">
                        Software developer from Switzerland building production-grade systems with TypeScript, Azure, and modern web technologies.
                        Currently employed at SISAG AG (EFZ Applikationsentwickler) and active as a freelance developer.
                        Passionate about clean architecture, DevOps, and hobby engineering.
                    </p>
                </section>

                <hr className="cvDivider" />

                {/* Experience & Education */}
                <section className="cvSection">
                    <h2 className="cvSectionTitle">Experience &amp; Education</h2>
                    <div className="cvTimeline">
                        {timeline.map((entry, i) => (
                            <div key={i} className="cvTlRow">
                                <div className="cvTlLeft">
                                    <span className="cvTlYear">{entry.year}</span>
                                    <span className={`cvTlBadge cvTlBadge--${entry.type}`}>{entry.type}</span>
                                </div>
                                <div className="cvTlRight">
                                    <p className="cvTlTitle">{entry.title}</p>
                                    {entry.org && <p className="cvTlOrg">{entry.org}</p>}
                                    {entry.detail && <p className="cvTlDetail">{entry.detail}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="cvDivider" />

                {/* Skills */}
                <section className="cvSection">
                    <h2 className="cvSectionTitle">Technical Skills</h2>
                    <ul className="cvSkillList">
                        {STACK.map(s => <li key={s} className="cvSkill">{s}</li>)}
                    </ul>
                </section>

                <hr className="cvDivider" />

                {/* Tools */}
                <section className="cvSection">
                    <h2 className="cvSectionTitle">Tools &amp; Setup</h2>
                    <div className="cvUsesGrid">
                        {uses.map(cat => (
                            <div key={cat.category} className="cvUsesGroup">
                                <p className="cvUsesGroupTitle">{cat.category}</p>
                                <ul className="cvUsesList">
                                    {cat.items.map(item => (
                                        <li key={item.name} className="cvUsesItem">
                                            {item.name}{item.detail ? ` — ${item.detail}` : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="cvFooter">
                    <p>Generated from erikderkeks.github.io/dev · {new Date().getFullYear()}</p>
                </footer>
            </main>
        </div>
    )
}
