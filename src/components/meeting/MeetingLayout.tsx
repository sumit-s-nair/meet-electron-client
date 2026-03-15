import { useEffect, useMemo, useRef, useState } from "react"
import { RoomAudioRenderer, useChat, useLocalParticipant } from "@livekit/components-react"
import type { FormEvent } from "react"
import { Check, ChevronDown, Copy, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import ChatPanel from "./ChatPanel"
import MeetingControls from "./MeetingControls"
import VideoGrid from "./VideoGrid"

type MeetingLayoutProps = {
  roomId: string
  onLeave: () => void
}

export default function MeetingLayout({ roomId, onLeave }: MeetingLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [copyLabel, setCopyLabel] = useState<"link" | "id" | null>(null)
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState("")
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const { chatMessages, send, isSending } = useChat()
  const { localParticipant } = useLocalParticipant()

  const ownDisplayName =
    localStorage.getItem("username")?.trim() || localParticipant.name || localParticipant.identity

  const messages = useMemo(
    () => [...chatMessages].sort((a, b) => a.timestamp - b.timestamp),
    [chatMessages],
  )

  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message) {
      return
    }

    await send(message)
    setDraft("")
  }

  const copyMeetingLink = async () => {
    const meetingLink = `${window.location.origin}/meetings/${roomId}`
    await navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    setCopyLabel("link")
    setShareMenuOpen(false)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    setCopyLabel("id")
    setShareMenuOpen(false)
    window.setTimeout(() => setCopied(false), 1400)
  }

  useEffect(() => {
    if (!shareMenuOpen) {
      return
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", onDocumentClick)
    return () => document.removeEventListener("mousedown", onDocumentClick)
  }, [shareMenuOpen])

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-background">
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="pointer-events-none absolute left-4 top-3 z-20 flex items-center gap-2">
          <div className="pointer-events-auto relative" ref={shareMenuRef}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 text-xs"
              onClick={() => setShareMenuOpen((open) => !open)}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              <span>{roomId}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>

            {shareMenuOpen ? (
              <div className="absolute left-0 top-full z-30 mt-1 w-40 rounded-md border border-border bg-card p-1 shadow-xl shadow-black/40">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted"
                  onClick={copyMeetingLink}
                >
                  {copied && copyLabel === "link" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy Link
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted"
                  onClick={copyRoomId}
                >
                  {copied && copyLabel === "id" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy ID
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div className="h-full w-full overflow-hidden p-3 pb-28 pt-12 sm:p-4 sm:pb-28 sm:pt-12">
          <VideoGrid />
        </div>

        <MeetingControls
          chatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen((value) => !value)}
          onLeave={onLeave}
        />
      </section>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex h-[100dvh] max-h-[100dvh] w-[340px] flex-col gap-0 overflow-hidden border-border bg-card p-0 sm:max-w-[340px]"
        >
          <SheetHeader className="border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-sm font-semibold text-foreground">
                Chat
              </SheetTitle>
              <button
                type="button"
                className="text-xs text-muted-foreground transition hover:text-foreground"
                onClick={() => setIsChatOpen(false)}
              >
                Close
              </button>
            </div>
          </SheetHeader>
          <ChatPanel
            messages={messages}
            draft={draft}
            isSending={isSending}
            ownIdentity={localParticipant.identity}
            ownDisplayName={ownDisplayName}
            onDraftChange={setDraft}
            onSubmit={handleChatSubmit}
          />
        </SheetContent>
      </Sheet>

      <RoomAudioRenderer />
    </div>
  )
}
