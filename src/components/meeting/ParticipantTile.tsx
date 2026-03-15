import { isTrackReference, VideoTrack } from "@livekit/components-react"
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { Mic, MicOff, UserRound } from "lucide-react"
import { Track } from "livekit-client"

type ParticipantTileProps = {
  trackRef: TrackReferenceOrPlaceholder
}

export default function ParticipantTile({ trackRef }: ParticipantTileProps) {
  const participant = trackRef.participant
  const savedUsername = localStorage.getItem("username")?.trim()
  const savedUserId = localStorage.getItem("userId")?.trim()

  const resolvedName =
    participant.name ||
    (participant.isLocal ? savedUsername : "") ||
    participant.identity ||
    "Guest"

  const name =
    participant.isLocal && savedUsername && participant.identity === savedUserId
      ? savedUsername
      : resolvedName

  const microphonePublication = participant.getTrackPublication(Track.Source.Microphone)
  const isMicMuted = !microphonePublication || microphonePublication.isMuted

  return (
    <article className="app-border relative h-full w-full overflow-hidden rounded-xl border bg-[#111827]">
      {isTrackReference(trackRef) ? (
        <VideoTrack trackRef={trackRef} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#0f172a]">
          <div className="app-border flex h-16 w-16 items-center justify-center rounded-full border bg-[#111827]">
            <UserRound className="app-text-secondary h-7 w-7" />
          </div>
        </div>
      )}

      <footer className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-3 py-2 backdrop-blur-sm">
        <span className="truncate text-sm font-medium text-[#e5e7eb]">{name}</span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-[#e5e7eb]">
          {isMicMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
        </span>
      </footer>
    </article>
  )
}
