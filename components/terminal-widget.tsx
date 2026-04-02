'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type Line = { type: 'input' | 'output' | 'error'; text: string }

const PROMPT = 'erikderkeks@dev:~$'

const HELP = [
    'Available commands:',
    '  whoami         — about me',
    '  ls             — list projects',
    '  skill          — tech stack',
    '  open github    — open GitHub profile',
    '  open contact   — open email client',
    '  open /secret   — ???',
    '  clear          — clear terminal',
    '  exit           — close terminal',
]

const WHOAMI = [
    'Erik — Software Developer, Fivem Developer, Hobby Engineer',
    'Location : Switzerland',
    'Focus    : TypeScript, Azure, FiveM, Systems',
    'Status   : Building things worth maintaining.',
]

const PROJECTS = [
    'dev           — this developer page (Next.js / TypeScript)',
    'esx_insurance — ESX script for vehicle insurance changes',
    'esx_multipark — FiveM parking with impound & MySQL',
]

const STACK = [
    'TypeScript / Node.js   React / Next.js   Angular / Ionic',
    'Azure Functions / IoT  Docker & Tooling   Git & CI',
    'Data & APIs            Quality & Security',
]

function evaluate(raw: string): { lines: Line[]; action?: 'open-github' | 'open-contact' | 'open-secret' | 'clear' | 'exit' } {
    const cmd = raw.trim().toLowerCase()

    if (cmd === 'help') return { lines: HELP.map((t) => ({ type: 'output', text: t })) }
    if (cmd === 'whoami') return { lines: WHOAMI.map((t) => ({ type: 'output', text: t })) }
    if (cmd === 'ls') return { lines: PROJECTS.map((t) => ({ type: 'output', text: t })) }
    if (cmd === 'skill' || cmd === 'skills') return { lines: STACK.map((t) => ({ type: 'output', text: t })) }
    if (cmd === 'open github') return { lines: [{ type: 'output', text: 'Opening GitHub…' }], action: 'open-github' }
    if (cmd === 'open contact') return { lines: [{ type: 'output', text: 'Opening email client…' }], action: 'open-contact' }
    if (cmd === 'open /secret') return { lines: [{ type: 'output', text: 'Navigating to /secret…' }], action: 'open-secret' }
    if (cmd === 'clear') return { lines: [], action: 'clear' }
    if (cmd === 'exit') return { lines: [{ type: 'output', text: 'Goodbye.' }], action: 'exit' }
    if (cmd === '') return { lines: [] }

    return { lines: [{ type: 'error', text: `command not found: ${raw}  (type 'help')` }] }
}

export function TerminalWidget() {
    const [open, setOpen] = useState(false)
    const [lines, setLines] = useState<Line[]>([
        { type: 'output', text: "Terminal — type 'help' to get started." },
    ])
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [histIdx, setHistIdx] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Keyboard shortcut: ` to toggle
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const tag = (e.target as HTMLElement).tagName
                if (tag === 'INPUT' || tag === 'TEXTAREA') return
                e.preventDefault()
                setOpen((v) => !v)
            }
            if (e.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    // Auto-focus + scroll to bottom when opening
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 80)
        }
    }, [open])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [lines])

    function submit() {
        const raw = input
        setInput('')
        setHistIdx(-1)

        const inputLine: Line = { type: 'input', text: raw }
        const { lines: newLines, action } = evaluate(raw)

        if (action === 'clear') {
            setLines([])
            return
        }
        if (action === 'exit') {
            setLines((prev) => [...prev, inputLine, ...newLines])
            setTimeout(() => setOpen(false), 600)
            return
        }
        if (action === 'open-github') {
            window.open('https://github.com/erikderkeks', '_blank', 'noopener,noreferrer')
        }
        if (action === 'open-contact') {
            window.location.href = 'mailto:erikderkeks@gmail.com'
        }
        if (action === 'open-secret') {
            setTimeout(() => { setOpen(false); router.push('/secret') }, 400)
        }

        setLines((prev) => [...prev, inputLine, ...newLines])
        if (raw.trim()) setHistory((prev) => [raw, ...prev].slice(0, 50))
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') { submit(); return }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            const next = Math.min(histIdx + 1, history.length - 1)
            setHistIdx(next)
            setInput(history[next] ?? '')
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const next = Math.max(histIdx - 1, -1)
            setHistIdx(next)
            setInput(next === -1 ? '' : history[next])
        }
    }

    return (
        <>
            {/* Floating hint */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        key="hint"
                        className="termHint"
                        onClick={() => setOpen(true)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3 }}
                        title="Open terminal (` key)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                            <polyline points="4 8 8 12 4 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="11" y1="16" x2="19" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Terminal panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="terminal"
                        className="glass termPanel"
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
                    >
                        {/* Title bar */}
                        <div className="termBar">
                            <span className="mono termTitle">terminal</span>
                            <button className="termClose" onClick={() => setOpen(false)} aria-label="Close terminal">×</button>
                        </div>

                        {/* Output */}
                        <div className="termOutput">
                            {lines.map((line, i) => (
                                <div
                                    key={i}
                                    className={`termLine ${line.type === 'input' ? 'termInput' : line.type === 'error' ? 'termError' : 'termOut'}`}
                                >
                                    {line.type === 'input' && (
                                        <span className="termPrompt mono">{PROMPT} </span>
                                    )}
                                    <span>{line.text}</span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input row */}
                        <div className="termInputRow">
                            <span className="termPrompt mono">{PROMPT}</span>
                            <input
                                ref={inputRef}
                                className="termInputField mono"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                spellCheck={false}
                                autoComplete="off"
                                aria-label="Terminal input"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
