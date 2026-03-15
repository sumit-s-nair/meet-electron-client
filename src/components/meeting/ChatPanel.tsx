import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useChat, useLocalParticipant } from "@livekit/components-react"
import { SendHorizontal } from "lucide-react"
import ChatMessage from "./ChatMessage"

type ChatPanelProps = {
  onClose?: () => void
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [draft, setDraft] = useState("")
  const { chatMessages, send, isSending } = useChat()
  const { localParticipant } = useLocalParticipant()
  const ownDisplayName =
    localStorage.getItem("username")?.trim() || localParticipant.name || localParticipant.identity

  const messages = useMemo(() => {
    return [...chatMessages].sort((a, b) => a.timestamp - b.timestamp)
  }, [chatMessages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message) {
      return
    }

    await send(message)
    setDraft("")
  }

  return (
    <aside className="app-border flex h-full w-[320px] flex-col border-l bg-[#0f172a]">
      <header className="app-border flex items-center justify-between border-b px-4 py-3">
        <h2 className="app-text-primary text-sm font-semibold">Chat</h2>
        {onClose ? (
          <button
            type="button"
            className="app-text-secondary hover:app-text-primary text-xs transition"
            onClick={onClose}
          >
            Close
          </button>
        ) : null}
      </header>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <p className="app-text-secondary px-1 text-sm">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={`${message.from?.identity ?? "unknown"}-${message.timestamp}-${message.message}`}
              message={message}
              isOwnMessage={message.from?.identity === localParticipant.identity}
              ownDisplayName={ownDisplayName}
            />
          ))
        )}
      </div>

      <form className="app-border border-t p-3" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message"
            className="app-input h-10 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6] text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  )
}
