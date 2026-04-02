'use client'

import { motion } from 'framer-motion'
import type { TimelineEntry } from '@/data/timeline'

const TYPE_LABEL: Record<TimelineEntry['type'], string> = {
    work: 'work',
    project: 'project',
    education: 'edu',
}

export function TimelineSection({ entries }: { entries: TimelineEntry[] }) {
    return (
        <div className="timeline">
            {entries.map((entry, i) => (
                <motion.div
                    key={entry.year + entry.title}
                    className="tlRow"
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                >
                    {/* Year + type badge */}
                    <div className="tlLeft">
                        <span className="mono tlYear">{entry.year}</span>
                        <span className={`tlBadge tlBadge--${entry.type}`}>{TYPE_LABEL[entry.type]}</span>
                    </div>

                    {/* Line + dot */}
                    <div className="tlLine">
                        <div className="tlDot" />
                        {i < entries.length - 1 && <div className="tlTrack" />}
                    </div>

                    {/* Content */}
                    <div className="tlContent glass">
                        <p className="tlTitle">{entry.title}</p>
                        {entry.org && <p className="tlOrg">{entry.org}</p>}
                        {entry.detail && <p className="tlDetail">{entry.detail}</p>}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
