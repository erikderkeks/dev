/**
 * Spotify build-time fetch.
 *
 * Required env vars (add to .env):
 *   SPOTIFY_CLIENT_ID=...
 *   SPOTIFY_CLIENT_SECRET=...
 *   SPOTIFY_REFRESH_TOKEN=...
 *
 * To get a refresh token:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add redirect URI: http://localhost:3000/callback
 *   3. Authorize: https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing,user-read-recently-played
 *   4. Exchange code for token: POST https://accounts.spotify.com/api/token
 *      body: grant_type=authorization_code&code=CODE&redirect_uri=...
 *   5. Save the refresh_token into SPOTIFY_REFRESH_TOKEN
 */

export type SpotifyTrack = {
    title: string
    artist: string
    album: string
    albumArt?: string
    url: string
    isPlaying: boolean
}

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

export async function getSpotifyTrack(): Promise<SpotifyTrack | null> {
    try {
        const token = await getAccessToken()
        if (!token) return null

        // Try currently playing first
        const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        })

        if (nowRes.status === 200) {
            const data = await nowRes.json()
            if (data?.item) {
                return {
                    title: data.item.name,
                    artist: data.item.artists.map((a: { name: string }) => a.name).join(', '),
                    album: data.item.album.name,
                    albumArt: data.item.album.images?.[1]?.url,
                    url: data.item.external_urls.spotify,
                    isPlaying: data.is_playing ?? false,
                }
            }
        }

        // Fallback: recently played
        const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        })
        if (!recentRes.ok) return null
        const recent = await recentRes.json()
        const item = recent?.items?.[0]?.track
        if (!item) return null
        return {
            title: item.name,
            artist: item.artists.map((a: { name: string }) => a.name).join(', '),
            album: item.album.name,
            albumArt: item.album.images?.[1]?.url,
            url: item.external_urls.spotify,
            isPlaying: false,
        }
    } catch {
        return null
    }
}
