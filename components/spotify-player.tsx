'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

const PLAYLIST_URI = 'spotify:playlist:3l5ztc59d6w2zxecT8T0ML'

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void
        Spotify: typeof Spotify
    }
}

type TrackState = {
    title: string
    artist: string
    albumArt: string | null
    isPlaying: boolean
}

export function SpotifyPlayer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef<number | null>(null)
    const phaseRef = useRef(0)
    const playerRef = useRef<Spotify.Player | null>(null)
    const deviceIdRef = useRef<string | null>(null)
    const tokenRef = useRef<string | null>(null)
    const [track, setTrack] = useState<TrackState | null>(null)
    const [playing, setPlaying] = useState(false)
    const [sdkReady, setSdkReady] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [started, setStarted] = useState(false)

    // ── Canvas waveform ──────────────────────────────────────────────────────
    const drawWave = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const { width, height } = canvas
        const cx = height / 2

        const isPlaying = playing || false
        const targetAmp = isPlaying ? 38 : 5
        const speed = isPlaying ? 0.022 : 0.005

        phaseRef.current += speed

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, width, height)

        const layers = [
            { blur: 40, alpha: 0.18, width: 6, amp: targetAmp * 1.0 },
            { blur: 18, alpha: 0.45, width: 3, amp: targetAmp * 0.95 },
            { blur: 8,  alpha: 0.85, width: 1.5, amp: targetAmp * 0.9 },
            { blur: 2,  alpha: 1.0,  width: 1,   amp: targetAmp * 0.88 },
        ]

        for (const layer of layers) {
            ctx.save()
            ctx.shadowBlur = layer.blur
            ctx.shadowColor = `rgba(255,255,255,${layer.alpha})`
            ctx.strokeStyle = `rgba(255,255,255,${layer.alpha})`
            ctx.lineWidth = layer.width
            ctx.beginPath()

            const freq1 = 0.012
            const freq2 = 0.028
            const freq3 = 0.007

            for (let x = 0; x <= width; x++) {
                const t = phaseRef.current
                const y =
                    cx +
                    layer.amp * Math.sin(x * freq1 + t) +
                    layer.amp * 0.4 * Math.sin(x * freq2 + t * 1.3 + 1.2) +
                    layer.amp * 0.2 * Math.sin(x * freq3 + t * 0.7 + 2.4)

                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }

            ctx.stroke()
            ctx.restore()
        }

        rafRef.current = requestAnimationFrame(drawWave)
    }, [playing])

    // restart raf when playing state changes
    useEffect(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(drawWave)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [drawWave])

    // responsive canvas size
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ro = new ResizeObserver(() => {
            if (!canvas.parentElement) return
            canvas.width = canvas.parentElement.clientWidth
            canvas.height = canvas.parentElement.clientHeight
        })
        ro.observe(canvas.parentElement!)
        canvas.width = canvas.parentElement!.clientWidth
        canvas.height = canvas.parentElement!.clientHeight
        return () => ro.disconnect()
    }, [])

    // ── Spotify SDK ──────────────────────────────────────────────────────────
    const fetchToken = useCallback(async (): Promise<string | null> => {
        try {
            const id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
            const secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
            const refresh = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN
            if (!id || !secret || !refresh) return null

            const res = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refresh,
                }),
            })
            if (!res.ok) return null
            const data = await res.json()
            tokenRef.current = data.access_token ?? null
            return tokenRef.current
        } catch {
            return null
        }
    }, [])

    const startPlayback = useCallback(async (deviceId: string) => {
        const token = tokenRef.current
        if (!token) return
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ context_uri: PLAYLIST_URI }),
        })
    }, [])

    useEffect(() => {
        let cancelled = false

        async function init() {
            const token = await fetchToken()
            if (!token || cancelled) return

            // load SDK script
            await new Promise<void>((resolve) => {
                if (window.Spotify) { resolve(); return }
                const existing = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')
                if (existing) { existing.addEventListener('load', () => resolve()); return }
                const script = document.createElement('script')
                script.src = 'https://sdk.scdn.co/spotify-player.js'
                script.onload = () => resolve()
                document.head.appendChild(script)

                window.onSpotifyWebPlaybackSDKReady = () => resolve()
            })

            if (cancelled) return

            const player = new window.Spotify.Player({
                name: 'erikderkeks.dev',
                getOAuthToken: async (cb) => {
                    const t = await fetchToken()
                    if (t) cb(t)
                },
                volume: 0.05,
            })

            player.addListener('ready', async ({ device_id }: { device_id: string }) => {
                if (cancelled) return
                deviceIdRef.current = device_id
                setSdkReady(true)
                // auto-start playlist immediately when SDK is ready
                setStarted(true)
                await startPlayback(device_id)
            })

            player.addListener('not_ready', () => {
                deviceIdRef.current = null
                setSdkReady(false)
            })

            player.addListener('player_state_changed', (state: Spotify.PlaybackState | null) => {
                if (!state) return
                const item = state.track_window?.current_track
                if (item) {
                    setTrack({
                        title: item.name,
                        artist: item.artists.map((a: { name: string }) => a.name).join(', '),
                        albumArt: item.album.images[0]?.url ?? null,
                    } as TrackState & { isPlaying: boolean })
                }
                setPlaying(!state.paused)
            })

            player.addListener('initialization_error', ({ message }: { message: string }) => setError(message))
            player.addListener('authentication_error', ({ message }: { message: string }) => setError(message))
            player.addListener('account_error', () => setError('Spotify Premium required'))

            await player.connect()
            playerRef.current = player
        }

        init()
        return () => {
            cancelled = true
            playerRef.current?.disconnect()
        }
    }, [fetchToken])

    const handlePlayPause = useCallback(async () => {
        if (!sdkReady || !deviceIdRef.current) return
        if (!started) {
            setStarted(true)
            await startPlayback(deviceIdRef.current)
            return
        }
        playerRef.current?.togglePlay()
    }, [sdkReady, started, startPlayback])

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="glass spotifyPlayer" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            {/* Canvas visualizer fills the background */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    borderRadius: 'inherit',
                }}
            />

            {/* Content overlay */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 20px',
            }}>
                {/* Album art */}
                <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {track?.albumArt ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={track.albumArt} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="9" x2="12" y2="2" />
                        </svg>
                    )}
                </div>

                {/* Track info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono, monospace)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.46)',
                        marginBottom: 3,
                    }}>
                        {error ? 'error' : sdkReady ? (started ? (playing ? 'now playing' : 'paused') : 'ready') : 'connecting…'}
                    </div>
                    {error ? (
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{error}</div>
                    ) : track ? (
                        <>
                            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {track.title}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {track.artist}
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                            {sdkReady && !started ? 'Click play to start' : 'No track'}
                        </div>
                    )}
                </div>

                {/* Play/Pause button */}
                {!error && (
                    <button
                        onClick={handlePlayPause}
                        disabled={!sdkReady}
                        aria-label={playing ? 'Pause' : 'Play'}
                        style={{
                            flexShrink: 0,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.22)',
                            background: 'rgba(255,255,255,0.08)',
                            cursor: sdkReady ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 160ms, transform 120ms',
                            opacity: sdkReady ? 1 : 0.4,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
                    >
                        {playing ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.88)">
                                <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.88)">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
