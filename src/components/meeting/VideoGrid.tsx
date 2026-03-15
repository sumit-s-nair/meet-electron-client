import {
  isTrackReference,
  useTracks,
  VideoTrack,
} from "@livekit/components-react"
import { useMemo, useState } from "react"
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { Track } from "livekit-client"
import ParticipantTile from "./ParticipantTile"

function getTrackKey(trackRef: TrackReferenceOrPlaceholder) {
  const publicationId = isTrackReference(trackRef)
    ? trackRef.publication.trackSid || trackRef.publication.track?.sid || "track"
    : "placeholder"

  return `${trackRef.participant.identity}-${trackRef.source}-${publicationId}`
}

export default function VideoGrid() {
  const cameraTracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }])
  const screenShareTracks = useTracks([{ source: Track.Source.ScreenShare, withPlaceholder: false }])
  const [selectedShareKey, setSelectedShareKey] = useState<string | null>(null)

  const screenShareKeys = useMemo(
    () => screenShareTracks.map((trackRef) => getTrackKey(trackRef)),
    [screenShareTracks],
  )

  const effectiveSelectedShareKey =
    selectedShareKey && screenShareKeys.includes(selectedShareKey)
      ? selectedShareKey
      : screenShareKeys[0] ?? null

  const hasScreenShare = screenShareTracks.length > 0

  if (hasScreenShare) {
    const primaryScreenShare =
      screenShareTracks.find((trackRef) => getTrackKey(trackRef) === effectiveSelectedShareKey) || screenShareTracks[0]

    const primaryShareKey = getTrackKey(primaryScreenShare)
    const additionalTiles = [...screenShareTracks.filter((trackRef) => getTrackKey(trackRef) !== primaryShareKey), ...cameraTracks]

    return (
      <div className="flex h-full gap-3">
        <div className="min-w-0 flex-1">
          <ScreenShareTile trackRef={primaryScreenShare} />
        </div>

        {additionalTiles.length > 0 && (
          <div className="no-scrollbar flex w-[220px] shrink-0 flex-col gap-2 overflow-y-auto">
            {additionalTiles.map((trackRef) => {
              const tileKey = getTrackKey(trackRef)
              const isScreenShareTile = trackRef.source === Track.Source.ScreenShare

              if (isScreenShareTile) {
                return (
                  <button
                    key={tileKey}
                    type="button"
                    className="aspect-video w-full overflow-hidden rounded-xl border border-border text-left transition hover:border-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setSelectedShareKey(tileKey)}
                    title="Bring shared screen to focus"
                  >
                    <ParticipantTile trackRef={trackRef} />
                  </button>
                )
              }

              return (
                <div key={tileKey} className="aspect-video w-full">
                  <ParticipantTile trackRef={trackRef} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const columnsClass =
    cameraTracks.length <= 1
      ? "grid-cols-1"
      : cameraTracks.length <= 4
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"

  return (
    <section className={`grid h-full gap-3 ${columnsClass}`}>
      {cameraTracks.map((trackRef) => (
        <ParticipantTile
          key={getTrackKey(trackRef)}
          trackRef={trackRef}
        />
      ))}
    </section>
  )
}

function ScreenShareTile({ trackRef }: { trackRef: TrackReferenceOrPlaceholder }) {
  return (
    <article className="relative h-full min-h-0 w-full overflow-hidden rounded-xl border border-border bg-card">
      {isTrackReference(trackRef) ? (
        <VideoTrack trackRef={trackRef} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          Screen share ended
        </div>
      )}
      <footer className="absolute inset-x-0 bottom-0 flex items-center bg-black/50 px-3 py-2 backdrop-blur-sm">
        <span className="truncate text-sm font-medium text-foreground">
          {trackRef.participant.name || trackRef.participant.identity || "Unknown"} — Screen
        </span>
      </footer>
    </article>
  )
}
