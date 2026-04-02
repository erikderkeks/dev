'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/lang-context'
import { i18n } from '@/data/i18n'
import type { WrappedStats } from '@/lib/github'

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type StatCellProps = { label: string; value: string; sub?: string }
function StatCell({ label, value, sub }: StatCellProps) {
    return (
        <div className="wrappedCell">
            <div className="wrappedLabel">{label}</div>
            <div className="wrappedValue">{value}</div>
            {sub && <div className="wrappedSub">{sub}</div>}
        </div>
    )
}

export function WrappedCard({ stats }: { stats: WrappedStats }) {
    const { lang } = useLang()
    const t = (k: keyof typeof i18n) => i18n[k][lang]

    const month = stats.busiestMonthIdx >= 0
        ? (lang === 'de' ? MONTHS_DE : MONTHS_EN)[stats.busiestMonthIdx]
        : t('wrapped.noData')
    const day = stats.busiestWeekday >= 0
        ? (lang === 'de' ? DAYS_DE : DAYS_EN)[stats.busiestWeekday]
        : t('wrapped.noData')

    return (
        <motion.div
            className="glass wrappedCard"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
        >
            <div className="wrappedHeader">
                <span className="kicker">{stats.year}</span>
            </div>
            <div className="wrappedGrid">
                <StatCell
                    label={t('wrapped.commits')}
                    value={stats.totalCommits > 0 ? String(stats.totalCommits) : '—'}
                />
                <StatCell
                    label={t('wrapped.topLang')}
                    value={stats.topLanguage ?? '—'}
                />
                <StatCell
                    label={t('wrapped.streak')}
                    value={stats.longestStreak > 0 ? String(stats.longestStreak) : '—'}
                    sub={stats.longestStreak > 0 ? t('wrapped.days') : undefined}
                />
                <StatCell
                    label={t('wrapped.busiestMonth')}
                    value={month}
                />
                <StatCell
                    label={t('wrapped.busiestDay')}
                    value={day}
                />
            </div>
        </motion.div>
    )
}
