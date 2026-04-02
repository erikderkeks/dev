import type { WakaStats } from '@/lib/wakatime'
import { Clock } from 'lucide-react'

function fmtHours(seconds: number) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h === 0) return `${m}m`
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function WakaTimeWidget({ stats }: { stats: WakaStats }) {
    const max = stats.languages[0]?.total_seconds ?? 1

    return (
        <div className="glass wakaWrap">
            <div className="wakaHeader">
                <div className="wakaLeft">
                    <Clock size={14} className="wakaIcon" />
                    <span className="kicker">WakaTime — last 7 days</span>
                </div>
                <span className="wakaTotal">{stats.humanReadable}</span>
            </div>
            <div className="wakaLangs">
                {stats.languages.map((lang) => (
                    <div key={lang.name} className="wakaLangRow">
                        <span className="wakaLangName">{lang.name}</span>
                        <div className="wakaBar">
                            <div
                                className="wakaBarFill"
                                style={{ width: `${(lang.total_seconds / max) * 100}%` }}
                            />
                        </div>
                        <span className="wakaLangTime">{fmtHours(lang.total_seconds)}</span>
                        <span className="wakaLangPct">{lang.percent.toFixed(0)}%</span>
                    </div>
                ))}
            </div>
            <p className="wakaSub">Daily avg · {fmtHours(stats.dailyAvgSeconds)}</p>
        </div>
    )
}
