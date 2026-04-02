'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import type { Note } from '@/data/notes'

function CodeBlock({ lang, content }: { lang: string; content: string }) {
    const [copied, setCopied] = useState(false)

    function copy() {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        })
    }

    return (
        <div className="codeBlock">
            <div className="codeHeader">
                <span className="mono codeLang">{lang}</span>
                <button className="codeCopy" onClick={copy} aria-label="Copy code">
                    {copied ? <Check className="icon" style={{ color: 'rgba(100,220,120,0.9)' }} /> : <Copy className="icon" />}
                </button>
            </div>
            <pre className="codePre"><code>{content}</code></pre>
        </div>
    )
}

export function NotesSection({ notes }: { notes: Note[] }) {
    const [expanded, setExpanded] = useState<string | null>(null)

    return (
        <div className="notesList">
            {notes.map((note, i) => {
                const isOpen = expanded === note.date + note.title
                return (
                    <motion.div
                        key={note.date + note.title}
                        className="glass noteCard"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
                    >
                        <button
                            className="noteHead"
                            onClick={() => setExpanded(isOpen ? null : note.date + note.title)}
                            aria-expanded={isOpen}
                        >
                            <span className="mono noteDate">{note.date}</span>
                            <span className="noteTitle">{note.title}</span>
                            <span className={`noteChevron${isOpen ? ' open' : ''}`}>›</span>
                        </button>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    key="body"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="noteBody">
                                        <p>{note.body}</p>
                                        {note.code && (
                                            <CodeBlock lang={note.code.lang} content={note.code.content} />
                                        )}
                                        {note.tags?.length ? (
                                            <div className="noteTags">
                                                {note.tags.map((t) => (
                                                    <span key={t} className="noteTag">{t}</span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
        </div>
    )
}
