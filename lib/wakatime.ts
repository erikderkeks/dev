/**
 * WakaTime build-time fetch.
 *
 * Required env vars (add to .env):
 *   WAKATIME_API_KEY=...
 *
 * Get your API key at: https://wakatime.com/settings/api-key
 *
 * If your WakaTime profile is public you can also set:
 *   WAKATIME_USERNAME=erikderkeks
 * and the public endpoint will be used (no API key needed).
 */

export type WakaLang = { name: string; percent: number; total_seconds: number }
export type WakaStats = {
    totalSeconds: number
    humanReadable: string
    languages: WakaLang[]
    dailyAvgSeconds: number
}

export async function getWakaStats(): Promise<WakaStats | null> {
    const apiKey = process.env.WAKATIME_API_KEY
    const username = process.env.WAKATIME_USERNAME

    if (!apiKey && !username) return null

    try {
        let url: string
        let headers: Record<string, string> = {}

        if (apiKey) {
            url = 'https://wakatime.com/api/v1/users/current/stats/last_7_days'
            headers.Authorization = `Basic ${Buffer.from(apiKey).toString('base64')}`
        } else {
            url = `https://wakatime.com/api/v1/users/${username}/stats/last_7_days`
        }

        const res = await fetch(url, { headers, next: { revalidate: 3600 } })
        if (!res.ok) return null
        const json = await res.json()
        const data = json.data
        if (!data) return null

        return {
            totalSeconds: data.total_seconds ?? 0,
            humanReadable: data.human_readable_total ?? '0 hrs',
            languages: (data.languages ?? []).slice(0, 6).map((l: { name: string; percent: number; total_seconds: number }) => ({
                name: l.name,
                percent: l.percent,
                total_seconds: l.total_seconds,
            })),
            dailyAvgSeconds: data.daily_average ?? 0,
        }
    } catch {
        return null
    }
}
