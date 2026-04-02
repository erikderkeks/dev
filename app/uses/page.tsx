import { ArrowLeft, Monitor, Terminal, Wrench, Layers, Cloud, type LucideIcon } from 'lucide-react'
import { uses } from '@/data/uses'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Uses — erikderkeks',
    description: 'Hardware, software, and tools I use every day.',
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'Hardware': Monitor,
    'Editor & Terminal': Terminal,
    'Dev Tools': Wrench,
    'Stack': Layers,
    'Services': Cloud,
}

export default function UsesPage() {
    return (
        <div className="page">
            <div className="pageBg" aria-hidden="true" />
            <div className="container">
                <div className="usesPageHeader">
                    <a href="/dev/" className="pill usesBackBtn">
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </a>
                    <div>
                        <p className="kicker">Setup</p>
                        <h1 className="usesPageTitle">Uses</h1>
                        <p className="usesPageSub">Hardware, software &amp; tools I use every day.</p>
                    </div>
                </div>

                <div className="usesPageGrid">
                    {uses.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat.category]
                        return (
                            <div key={cat.category} className="glass usesPageCard">
                                <div className="usesPageCardHead">
                                    {Icon && <Icon size={18} className="usesPageCatIcon" />}
                                    <h2 className="usesPageCatTitle">{cat.category}</h2>
                                </div>
                                <ul className="usesPageList">
                                    {cat.items.map((item) => (
                                        <li key={item.name} className="usesPageItem">
                                            <span className="usesPageItemName">{item.name}</span>
                                            {item.detail && <span className="usesPageItemDetail">{item.detail}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
