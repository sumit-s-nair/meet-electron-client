import type { ReceivedChatMessage } from "@livekit/components-react"

type ChatMessageProps = {
  message: ReceivedChatMessage
  isOwnMessage: boolean
  ownDisplayName?: string
}

export default function ChatMessage({ message, isOwnMessage, ownDisplayName }: ChatMessageProps) {
  const identity = message.from?.identity
  const safeIdentity = identity && /^[a-f0-9-]{16,}$/i.test(identity) ? "Guest" : identity

  const sender =
    (isOwnMessage ? ownDisplayName : undefined) ||
    message.from?.name ||
    safeIdentity ||
    "Unknown"
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <article className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        <p className="mb-1 px-1 text-xs text-muted-foreground">{sender}</p>
        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <p className="whitespace-pre-wrap break-words text-sm text-foreground">{message.message}</p>
        </div>
        <p className="mt-1 px-1 text-[10px] text-muted-foreground">{timestamp}</p>
      </div>
    </article>
  )
}
