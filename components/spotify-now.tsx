import type { SpotifyTrack } from '@/lib/spotify'
import { Music2 } from 'lucide-react'

export function SpotifyNow({ track }: { track: SpotifyTrack }) {
    return (
        <a
            href={track.url}
            target="_blank"
            rel="noreferrer"
            className="glass spotifyWidget"
            aria-label={`${track.isPlaying ? 'Now playing' : 'Last played'}: ${track.title} by ${track.artist}`}
        >
            {track.albumArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.albumArt} alt={track.album} className="spotifyArt" />
            ) : (
                <div className="spotifyArtPlaceholder">
                    <Music2 size={18} />
                </div>
            )}
            <div className="spotifyBody">
                <div className="spotifyStatus">
                    <span className={`spotifyDot${track.isPlaying ? ' spotifyDot--playing' : ''}`} />
                    <span className="spotifyLabel">{track.isPlaying ? 'Now playing' : 'Last played'}</span>
                </div>
                <p className="spotifyTitle">{track.title}</p>
                <p className="spotifyArtist">{track.artist}</p>
            </div>
        </a>
    )
}
