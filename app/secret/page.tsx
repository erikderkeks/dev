'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ── Retro palette ─────────────────────────────── */
const C = {
    bg: '#0a0a0a',
    screen: '#0d1117',
    bezel: '#1a1a1a',
    green: '#39ff14',
    greenDim: '#1a7a08',
    amber: '#ffb000',
    red: '#ff3b3b',
    grey: '#555',
    white: '#e8e8e8',
}

/* ── App content ───────────────────────────────── */
const APPS: Record<string, { icon: string; label: string; content: () => React.ReactNode }> = {
    terminal: {
        icon: '>_',
        label: 'Terminal',
        content: () => <TerminalApp />,
    },
    notes: {
        icon: '📄',
        label: 'notes.txt',
        content: () => (
            <div style={{ padding: 14, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, color: C.green }}>
                <p style={{ color: C.amber, marginBottom: 8 }}># private notes</p>
                <p>fivem project nearing first stable release.</p>
                <p>thinking about migrating devops pipelines to github actions.</p>
                <p>new keyboard ordered — should arrive thursday.</p>
                <p style={{ marginTop: 16, color: C.grey }}>last modified: 2026-04-01 23:18</p>
            </div>
        ),
    },
    readme: {
        icon: '📘',
        label: 'README',
        content: () => (
            <div style={{ padding: 14, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: C.green }}>
                <p style={{ color: C.amber }}>SYSTEM: LIQUID_OS v0.1 [EXPERIMENTAL]</p>
                <p style={{ color: C.grey }}>────────────────────────────────────</p>
                <p>Welcome, operator.</p>
                <p>You found this by navigating to <span style={{ color: C.amber }}>/secret</span>.</p>
                <p>Not many do.</p>
                <p style={{ marginTop: 12 }}>This system runs on:</p>
                <p>  CPU  : thought & caffeine</p>
                <p>  RAM  : perpetually low</p>
                <p>  DISK : ideas &gt; execution</p>
                <p style={{ marginTop: 12, color: C.grey }}>Keep exploring. There&apos;s more here.</p>
            </div>
        ),
    },
    whoami: {
        icon: '👤',
        label: 'whoami.sh',
        content: () => (
            <div style={{ padding: 14, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.9, color: C.green }}>
                <p><span style={{ color: C.amber }}>$</span> ./whoami.sh</p>
                <p style={{ marginTop: 8 }}>Name     : Erik</p>
                <p>Handle   : erikderkeks</p>
                <p>Location : Switzerland</p>
                <p>Role     : Software Developer</p>
                <p>Focus    : TypeScript · Azure · FiveM</p>
                <p>Motto    : &quot;Don&apos;t build one-time systems.&quot;</p>
                <p style={{ marginTop: 12, color: C.grey }}>exit code: 0</p>
            </div>
        ),
    },
    links: {
        icon: '🔗',
        label: 'links.cfg',
        content: () => (
            <div style={{ padding: 14, fontFamily: 'monospace', fontSize: 12, lineHeight: 2, color: C.green }}>
                <p style={{ color: C.amber }}># verified links</p>
                <p>
                    github   →{' '}
                    <a href="https://github.com/erikderkeks" target="_blank" rel="noreferrer"
                        style={{ color: C.green, textDecoration: 'underline' }}>
                        github.com/erikderkeks
                    </a>
                </p>
                <p>
                    email    →{' '}
                    <a href="mailto:erikderkeks@gmail.com"
                        style={{ color: C.green, textDecoration: 'underline' }}>
                        erikderkeks@gmail.com
                    </a>
                </p>
                <p style={{ marginTop: 12, color: C.grey }}># unverified</p>
                <p style={{ color: C.grey }}>twitter  → not active</p>
                <p style={{ color: C.grey }}>linkedin → not interesting</p>
            </div>
        ),
    },
    snake: {
        icon: '🐍',
        label: 'snake.exe',
        content: () => <SnakeGame />,
    },
}

/* ── Terminal app inside the OS ────────────────── */
function TerminalApp() {
    const [lines, setLines] = useState<string[]>(['LIQUID_OS terminal v0.1', "type 'help'"])
    const [input, setInput] = useState('')
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => { endRef.current?.scrollIntoView() }, [lines])

    function run(cmd: string) {
        const c = cmd.trim().toLowerCase()
        let out: string[] = []
        if (c === 'help') out = ['commands: help, ls, date, uname, exit-os']
        else if (c === 'ls') out = Object.keys(APPS).map((k) => `  ${APPS[k].label}`)
        else if (c === 'date') out = [new Date().toString()]
        else if (c === 'uname') out = ['LIQUID_OS 0.1.0 x86_64 GNU/COFFEE']
        else if (c === '') out = []
        else out = [`sh: command not found: ${cmd}`]
        setLines((p) => [...p, `$ ${cmd}`, ...out])
        setInput('')
    }

    return (
        <div style={{ padding: 10, fontFamily: 'monospace', fontSize: 12, color: C.green, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
                {lines.map((l, i) => <div key={i}>{l}</div>)}
                <div ref={endRef} />
            </div>
            <div style={{ display: 'flex', gap: 6, borderTop: `1px solid ${C.greenDim}`, paddingTop: 6 }}>
                <span style={{ color: C.amber }}>$</span>
                <input
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') run(input) }}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.green, fontFamily: 'monospace', fontSize: 12 }}
                />
            </div>
        </div>
    )
}

/* ── Snake game ───────────────────────────────── */
function SnakeGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [score, setScore] = useState(0)
    const [status, setStatus] = useState<'idle' | 'playing' | 'dead'>('idle')
    const gameRef = useRef({
        snake: [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: { x: 15, y: 7 },
        score: 0,
        alive: false,
    })
    const rafRef = useRef(0)
    const lastRef = useRef(0)
    const COLS = 22, ROWS = 15, CELL = 14
    const W = COLS * CELL, H = ROWS * CELL

    function rndFood(snake: { x: number; y: number }[]) {
        let p: { x: number; y: number }
        do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) } }
        while (snake.some(s => s.x === p.x && s.y === p.y))
        return p
    }

    function draw() {
        const canvas = canvasRef.current; if (!canvas) return
        const ctx = canvas.getContext('2d'); if (!ctx) return
        const g = gameRef.current
        ctx.fillStyle = C.screen
        ctx.fillRect(0, 0, W, H)
        ctx.strokeStyle = 'rgba(57,255,20,0.05)'
        ctx.lineWidth = 0.5
        for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke() }
        for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke() }
        // food — pulsing dot
        ctx.fillStyle = C.amber
        ctx.beginPath()
        ctx.arc(g.food.x * CELL + CELL / 2, g.food.y * CELL + CELL / 2, CELL / 2 - 1, 0, Math.PI * 2)
        ctx.fill()
        // snake body
        g.snake.forEach((seg, i) => {
            const alpha = (1 - (i / g.snake.length) * 0.55).toFixed(2)
            ctx.fillStyle = `rgba(57,255,20,${alpha})`
            if (i === 0) {
                ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
            } else {
                ctx.fillRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4)
            }
        })
    }

    function step() {
        const g = gameRef.current
        g.dir = g.nextDir
        const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y }
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || g.snake.some(s => s.x === head.x && s.y === head.y)) {
            g.alive = false; setStatus('dead'); return
        }
        g.snake.unshift(head)
        if (head.x === g.food.x && head.y === g.food.y) {
            g.score++; setScore(g.score); g.food = rndFood(g.snake)
        } else {
            g.snake.pop()
        }
    }

    function loop(ts: number) {
        if (ts - lastRef.current >= 130) { lastRef.current = ts; step() }
        draw()
        if (gameRef.current.alive) rafRef.current = requestAnimationFrame(loop)
    }

    function start() {
        cancelAnimationFrame(rafRef.current)
        const snake = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }]
        gameRef.current = { snake, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: rndFood(snake), score: 0, alive: true }
        setScore(0); setStatus('playing')
        lastRef.current = 0
        rafRef.current = requestAnimationFrame(loop)
    }

    useEffect(() => {
        if (status !== 'playing') return
        function onKey(e: KeyboardEvent) {
            const g = gameRef.current
            if (e.key === 'ArrowUp' && g.dir.y !== 1) g.nextDir = { x: 0, y: -1 }
            else if (e.key === 'ArrowDown' && g.dir.y !== -1) g.nextDir = { x: 0, y: 1 }
            else if (e.key === 'ArrowLeft' && g.dir.x !== 1) g.nextDir = { x: -1, y: 0 }
            else if (e.key === 'ArrowRight' && g.dir.x !== -1) g.nextDir = { x: 1, y: 0 }
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault()
        }
        window.addEventListener('keydown', onKey)
        return () => { window.removeEventListener('keydown', onKey); cancelAnimationFrame(rafRef.current) }
    }, [status])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, background: C.screen }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: W, fontFamily: 'monospace', fontSize: 11, color: C.amber }}>
                <span>SNAKE v1.0</span>
                <span>score: {score}</span>
            </div>
            <div style={{ position: 'relative' }}>
                <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block', border: `1px solid ${C.greenDim}` }} />
                {status !== 'playing' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(13,17,23,0.88)', gap: 10 }}>
                        {status === 'dead' && <p style={{ fontFamily: 'monospace', fontSize: 14, color: C.red, margin: 0 }}>GAME OVER — {score} pts</p>}
                        <button onClick={start} style={{ fontFamily: 'monospace', fontSize: 12, color: C.green, background: 'transparent', border: `1px solid ${C.greenDim}`, borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>
                            {status === 'dead' ? '[ restart ]' : '[ start ]'}
                        </button>
                        <p style={{ fontFamily: 'monospace', fontSize: 10, color: C.grey, margin: 0 }}>arrow keys · eat dots · don&apos;t crash</p>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ── Window chrome ─────────────────────────────── */
function AppWindow({ appKey, onClose }: { appKey: string; onClose: () => void }) {
    const app = APPS[appKey]
    if (!app) return null
    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            background: C.screen,
            border: `1px solid ${C.greenDim}`,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: `0 0 40px rgba(57,255,20,0.08)`,
        }}>
            {/* title bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#111', borderBottom: `1px solid ${C.greenDim}` }}>
                <button
                    onClick={onClose}
                    style={{ width: 12, height: 12, borderRadius: '50%', background: C.red, border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-label="Close"
                />
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.amber }}>{app.icon} {app.label}</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {app.content()}
            </div>
        </div>
    )
}

/* ── Desktop ───────────────────────────────────── */
function Desktop({ onLogout }: { onLogout: () => void }) {
    const [openApp, setOpenApp] = useState<string | null>(null)
    const [time, setTime] = useState(() => new Date())

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(t)
    }, [])

    const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
            {/* Taskbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px', background: '#111', borderBottom: `1px solid ${C.greenDim}`, flexShrink: 0 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.green }}>LIQUID_OS <span style={{ color: C.greenDim }}>v0.1</span></span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.amber }}>{timeStr}</span>
                    <button onClick={onLogout} style={{ fontFamily: 'monospace', fontSize: 10, color: C.grey, background: 'transparent', border: `1px solid ${C.grey}`, borderRadius: 3, padding: '2px 6px', cursor: 'pointer' }}>logout</button>
                </div>
            </div>

            {/* Main area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {openApp ? (
                    <AppWindow appKey={openApp} onClose={() => setOpenApp(null)} />
                ) : (
                    /* Icon grid */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: 16, padding: 20 }}>
                        {Object.entries(APPS).map(([key, app]) => (
                            <button
                                key={key}
                                onDoubleClick={() => setOpenApp(key)}
                                onClick={() => { }} // single click focuses
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                    background: 'transparent', border: 'none', cursor: 'pointer', color: C.green,
                                    padding: 8, borderRadius: 6,
                                    transition: 'background 140ms',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(57,255,20,0.07)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                title={`Double-click to open ${app.label}`}
                            >
                                <div style={{ fontSize: 28, lineHeight: 1, fontFamily: 'monospace' }}>{app.icon}</div>
                                <span style={{ fontSize: 11, fontFamily: 'monospace', textAlign: 'center', wordBreak: 'break-word' }}>{app.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Scanlines overlay */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 4px)', zIndex: 10 }} />
            </div>

            <div style={{ padding: '3px 10px', background: '#0a0a0a', borderTop: `1px solid ${C.greenDim}`, fontFamily: 'monospace', fontSize: 10, color: C.grey }}>
                {openApp ? `${APPS[openApp]?.label} — double-click a blank area to return` : 'double-click an icon to open · logout to return'}
            </div>
        </div>
    )
}

/* ── Login screen ──────────────────────────────── */
const SECRET_PASSWORD = 'ghoul'

const BOOT_SEQUENCE = [
    'BIOS v1.0.0 ...... OK',
    'CPU check ......... OK',
    'MEM 32768MB ....... OK',
    'STORAGE ........... OK',
    'NET ............... OK',
    '',
    'Loading LIQUID_OS v0.1 ...',
    '',
    '> kernel loaded',
    '> mounting filesystems',
    '> starting services',
    '',
    'LIQUID_OS ready.',
]

function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [pass, setPass] = useState('')
    const [error, setError] = useState(false)
    const [hint, setHint] = useState(false)
    const [booted, setBooted] = useState(false)
    const [bootLines, setBootLines] = useState<string[]>([])

    useEffect(() => {
        let i = 0
        const t = setInterval(() => {
            if (i < BOOT_SEQUENCE.length) {
                const line = BOOT_SEQUENCE[i]
                if (line !== undefined) setBootLines((p) => [...p, line])
                i++
            } else {
                clearInterval(t)
                setTimeout(() => setBooted(true), 600)
            }
        }, 80)
        return () => clearInterval(t)
    }, [])

    function submit() {
        if (pass === SECRET_PASSWORD) {
            onLogin()
        } else {
            setError(true)
            setPass('')
            setTimeout(() => setError(false), 1200)
        }
    }

    if (!booted) {
        return (
            <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 12, color: C.green, lineHeight: 1.7 }}>
                {bootLines.map((l, i) => <div key={i} style={{ color: (l ?? '').startsWith('>') ? C.amber : C.green }}>{l || '\u00a0'}</div>)}
                <span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'monospace', color: C.green }}>
            <pre style={{ color: C.amber, fontSize: 11, lineHeight: 1.3, marginBottom: 24, textAlign: 'center' }}>{`
 ██╗     ██╗ ██████╗ ██╗   ██╗██╗██████╗      ██████╗ ███████╗
 ██║     ██║██╔═══██╗██║   ██║██║██╔══██╗    ██╔═══██╗██╔════╝
 ██║     ██║██║   ██║██║   ██║██║██║  ██║    ██║   ██║███████╗
 ██║     ██║██║▄▄ ██║██║   ██║██║██║  ██║    ██║   ██║╚════██║
 ███████╗██║╚██████╔╝╚██████╔╝██║██████╔╝    ╚██████╔╝███████║
 ╚══════╝╚═╝ ╚══▀▀═╝  ╚═════╝ ╚═╝╚═════╝      ╚═════╝ ╚══════╝`}</pre>

            <p style={{ color: C.grey, fontSize: 11, marginBottom: 24 }}>operator login required</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${error ? C.red : C.greenDim}`, paddingBottom: 4, transition: 'border-color 200ms' }}>
                    <span style={{ color: C.amber }}>pass:</span>
                    <input
                        autoFocus
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.green, fontFamily: 'monospace', fontSize: 13 }}
                    />
                </div>
                {error && <p style={{ color: C.red, fontSize: 11, margin: 0 }}>access denied</p>}
                <button
                    onClick={() => setHint(!hint)}
                    style={{ color: C.grey, background: 'transparent', border: 'none', fontFamily: 'monospace', fontSize: 10, cursor: 'pointer', textAlign: 'left' }}
                >
                    {hint ? 'hint: the ghoul is dark' : '[ hint ]'}
                </button>
            </div>
        </div>
    )
}

/* ── CRT Monitor frame ─────────────────────────── */
function CRTMonitor({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            position: 'relative',
            width: 'min(720px, 96vw)',
            aspectRatio: '4/3',
            background: C.bezel,
            borderRadius: 18,
            padding: '3.5% 4% 8%',
            boxShadow: '0 40px 120px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5)',
            border: '2px solid #222',
        }}>
            {/* Screen */}
            <div style={{
                width: '100%',
                height: '100%',
                background: C.screen,
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                border: `2px solid #000`,
                boxShadow: `inset 0 0 60px rgba(57,255,20,0.04), 0 0 20px rgba(57,255,20,0.12)`,
            }}>
                {/* Pixel noise / vignette */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, borderRadius: 6, background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 19, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />

                <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                    {children}
                </div>
            </div>

            {/* Monitor base label */}
            <div style={{ position: 'absolute', bottom: '2.5%', left: '50%', transform: 'translateX(-50%)', fontFamily: 'monospace', fontSize: 9, color: '#333', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                LIQUID SYSTEMS LS-17
            </div>
        </div>
    )
}

/* ── Page ──────────────────────────────────────── */
export default function SecretPage() {
    const [loggedIn, setLoggedIn] = useState(false)
    const router = useRouter()

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            padding: '40px 16px',
        }}>
            <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

            <CRTMonitor>
                {loggedIn
                    ? <Desktop onLogout={() => router.push('/')} />
                    : <LoginScreen onLogin={() => setLoggedIn(true)} />
                }
            </CRTMonitor>

            <button
                onClick={() => router.back()}
                style={{ fontFamily: 'monospace', fontSize: 11, color: '#333', background: 'transparent', border: '1px solid #222', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', transition: 'color 140ms, border-color 140ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#444' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#222' }}
            >
                ← back
            </button>
        </div>
    )
}
