'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
    /** full day-bucket map across all years: { "2025-04-01": 3 } */
    data: Record<string, number>
}

/** Format a Date as YYYY-MM-DD using local time (avoids UTC-offset day shift). */
function localDateStr(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
}

function buildWeeksForYear(year: number): (string | null)[][] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isCurrentYear = year === today.getFullYear()

    const yearStart = new Date(year, 0, 1)
    const yearEnd = isCurrentYear ? today : new Date(year, 11, 31)
    yearEnd.setHours(0, 0, 0, 0)

    // begin grid on the Sunday on or before Jan 1
    const gridStart = new Date(yearStart)
    gridStart.setDate(yearStart.getDate() - yearStart.getDay())

    const weeks: (string | null)[][] = []
    const cursor = new Date(gridStart)

    while (cursor <= yearEnd) {
        const week: (string | null)[] = []
        for (let d = 0; d < 7; d++) {
            const day = new Date(cursor)
            week.push(day >= yearStart && day <= yearEnd ? localDateStr(day) : null)
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }
    return weeks
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function getHeatLevel(count: number): number {
    if (count === 0) return 0
    if (count === 1) return 1
    if (count <= 3) return 2
    if (count <= 6) return 3
    return 4
}

export function ActivityHeatmap({ data }: Props) {
    const currentYear = new Date().getFullYear()

    // years present in data + always current year, newest first
    const availableYears = useMemo(() => {
        const s = new Set<number>([currentYear])
        for (const key of Object.keys(data)) {
            const y = parseInt(key.slice(0, 4))
            if (!isNaN(y)) s.add(y)
        }
        return Array.from(s).sort((a, b) => b - a)
    }, [data, currentYear])

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const weeks = useMemo(() => buildWeeksForYear(selectedYear), [selectedYear])

    const monthMarkers = useMemo(() => {
        const markers: { label: string; col: number }[] = []
        let lastMonth = -1
        weeks.forEach((week, col) => {
            const firstDate = week.find((d) => d !== null)
            if (!firstDate) return
            // Parse month directly from string (avoids UTC timezone shift)
            const month = parseInt(firstDate.slice(5, 7)) - 1
            if (month !== lastMonth) {
                markers.push({ label: MONTH_LABELS[month], col })
                lastMonth = month
            }
        })
        return markers
    }, [weeks])

    const yearTotal = useMemo(
        () => weeks.flat().reduce((sum, d) => sum + (d ? (data[d] ?? 0) : 0), 0),
        [weeks, data]
    )

    const yearIdx = availableYears.indexOf(selectedYear)
    const canPrev = yearIdx < availableYears.length - 1
    const canNext = yearIdx > 0

    const CELL = 11
    const GAP = 2

    const btnStyle = (enabled: boolean): React.CSSProperties => ({
        background: 'transparent',
        border: 'none',
        cursor: enabled ? 'pointer' : 'default',
        color: enabled ? 'var(--muted)' : 'var(--border)',
        width: 26,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 15,
        lineHeight: 1,
        fontFamily: 'monospace',
        transition: 'color 140ms',
    })

    return (
        <motion.div
            className="glass heatmapWrap"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
        >
            <div className="heatmapHeader">
                <span className="kicker">Commit activity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Year switcher */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border2)', borderRadius: 6, overflow: 'hidden' }}>
                        <button
                            onClick={() => canPrev && setSelectedYear(availableYears[yearIdx + 1])}
                            disabled={!canPrev}
                            style={btnStyle(canPrev)}
                            aria-label="Previous year"
                        >‹</button>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--fg)', padding: '2px 8px', borderLeft: '1px solid var(--border2)', borderRight: '1px solid var(--border2)', minWidth: 40, textAlign: 'center' }}>
                            {selectedYear}
                        </span>
                        <button
                            onClick={() => canNext && setSelectedYear(availableYears[yearIdx - 1])}
                            disabled={!canNext}
                            style={btnStyle(canNext)}
                            aria-label="Next year"
                        >›</button>
                    </div>
                    <span className="mono heatmapTotal">{yearTotal} contributions</span>
                </div>
            </div>

            <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 0 }}>
                    {/* Month labels row — absolutely positioned so labels never merge */}
                    <div style={{ position: 'relative', height: 14, marginBottom: 4, minWidth: 28 + weeks.length * (CELL + GAP) }}>
                        {monthMarkers.map(({ label, col }) => (
                            <div
                                key={col}
                                style={{
                                    position: 'absolute',
                                    left: 28 + GAP + col * (CELL + GAP),
                                    top: 0,
                                    fontSize: 10,
                                    color: 'var(--muted2)',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    whiteSpace: 'nowrap',
                                    lineHeight: '14px',
                                }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Day rows */}
                    {DAY_LABELS.map((dayLabel, dayIdx) => (
                        <div key={dayIdx} style={{ display: 'flex', gap: GAP, marginBottom: GAP }}>
                            <div
                                style={{
                                    width: 28,
                                    fontSize: 9,
                                    color: 'var(--muted2)',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    textAlign: 'right',
                                    paddingRight: 4,
                                    lineHeight: `${CELL}px`,
                                }}
                            >
                                {dayLabel}
                            </div>
                            {weeks.map((week, col) => {
                                const date = week[dayIdx]
                                if (date === null) {
                                    return <div key={col} style={{ width: CELL, height: CELL }} />
                                }
                                const count = data[date] ?? 0
                                const label = `${date} · ${count} commit${count !== 1 ? 's' : ''}`
                                return (
                                    <div
                                        key={col}
                                        className={`heatCell heatLevel${getHeatLevel(count)}`}
                                        data-tip={label}
                                        style={{
                                            width: CELL,
                                            height: CELL,
                                            borderRadius: 2,
                                            transition: 'background 140ms ease',
                                        }}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="heatmapLegend">
                <span style={{ color: 'var(--muted2)', fontSize: 11 }}>Less</span>
                {[0, 1, 3, 5, 7].map((n) => (
                    <div key={n} className={`heatLevel${getHeatLevel(n)}`} style={{ width: CELL, height: CELL, borderRadius: 2 }} />
                ))}
                <span style={{ color: 'var(--muted2)', fontSize: 11 }}>More</span>
            </div>
        </motion.div>
    )
}


