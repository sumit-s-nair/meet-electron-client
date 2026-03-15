import type { ReceivedChatMessage } from "@livekit/components-react"

type ChatMessageProps = {
  message: ReceivedChatMessage
  isOwnMessage: boolean
  ownDisplayName?: string
}

export default function ChatMessage({ message, isOwnMessage, ownDisplayName }: ChatMessageProps) {
  const sender =
    (isOwnMessage ? ownDisplayName : undefined) ||
    message.from?.name ||
    message.from?.identity ||
    "Unknown"
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <article className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        <p className="app-text-secondary mb-1 px-1 text-xs">{sender}</p>
        <div className="app-border rounded-xl border bg-[#111827] px-3 py-2">
          <p className="app-text-primary whitespace-pre-wrap break-words text-sm">{message.message}</p>
        </div>
        <p className="app-text-secondary mt-1 px-1 text-[10px]">{timestamp}</p>
      </div>
    </article>
  )
}
