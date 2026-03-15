import { useState } from "react"
import { RoomAudioRenderer } from "@livekit/components-react"
import { Check, Copy, Link2 } from "lucide-react"
import ChatPanel from "./ChatPanel"
import MeetingControls from "./MeetingControls"
import VideoGrid from "./VideoGrid"

type MeetingLayoutProps = {
  roomId: string
  onLeave: () => void
}

export default function MeetingLayout({ roomId, onLeave }: MeetingLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyMeetingLink = async () => {
    const meetingLink = `${window.location.origin}/meetings/${roomId}`
    await navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="app-bg relative flex h-full w-full overflow-hidden">
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2">
          <div className="app-card app-border pointer-events-auto inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
            <Link2 className="app-text-secondary h-3.5 w-3.5" />
            <span className="app-text-primary font-medium">{roomId}</span>
          </div>
          <button
            type="button"
            className="app-button-secondary pointer-events-auto inline-flex w-auto items-center gap-2 px-3 py-2 text-xs"
            onClick={copyRoomId}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy ID"}
          </button>
          <button
            type="button"
            className="app-button-secondary pointer-events-auto inline-flex w-auto items-center gap-2 px-3 py-2 text-xs"
            onClick={copyMeetingLink}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Link
          </button>
        </header>

        <div className="h-full w-full overflow-hidden p-3 pb-24 pt-16 sm:p-4 sm:pb-24 sm:pt-16">
          <VideoGrid />
        </div>

        <MeetingControls
          chatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen((value) => !value)}
          onLeave={onLeave}
        />
      </section>

      {isChatOpen ? <ChatPanel onClose={() => setIsChatOpen(false)} /> : null}

      <RoomAudioRenderer />
    </div>
  )
}
