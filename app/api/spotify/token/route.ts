import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function getAccessToken(): Promise<string | null> {
    const id = process.env.SPOTIFY_CLIENT_ID
    const secret = process.env.SPOTIFY_CLIENT_SECRET
    const refresh = process.env.SPOTIFY_REFRESH_TOKEN
    if (!id || !secret || !refresh) return null

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh,
        }),
        cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.access_token ?? null
}

export async function GET() {
    const accessToken = await getAccessToken()
    if (!accessToken) {
        return NextResponse.json({ error: 'No token' }, { status: 500 })
    }
    return NextResponse.json({ accessToken })
}
