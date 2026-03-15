import { useTracks } from "@livekit/components-react"
import { Track } from "livekit-client"
import ParticipantTile from "./ParticipantTile"

export default function VideoGrid() {
  const trackRefs = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }])

  const columnsClass =
    trackRefs.length <= 1
      ? "grid-cols-1"
      : trackRefs.length <= 4
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"

  return (
    <section className={`grid h-full gap-3 ${columnsClass}`}>
      {trackRefs.map((trackRef) => (
        <ParticipantTile
          key={`${trackRef.participant.identity}-${trackRef.source}`}
          trackRef={trackRef}
        />
      ))}
    </section>
  )
}
