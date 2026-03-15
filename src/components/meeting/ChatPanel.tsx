import type { FormEvent } from "react"
import type { ReceivedChatMessage } from "@livekit/components-react"
import { SendHorizontal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ChatMessage from "./ChatMessage"

type ChatPanelProps = {
  messages: ReceivedChatMessage[]
  draft: string
  isSending: boolean
  ownIdentity: string
  ownDisplayName: string
  onDraftChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
}

export default function ChatPanel({
  messages,
  draft,
  isSending,
  ownIdentity,
  ownDisplayName,
  onDraftChange,
  onSubmit,
}: ChatPanelProps) {

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="px-1 text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={`${message.from?.identity ?? "unknown"}-${message.timestamp}-${message.message}`}
                message={message}
                isOwnMessage={message.from?.identity === ownIdentity}
                ownDisplayName={ownDisplayName}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <form className="shrink-0 border-t border-border p-3" onSubmit={onSubmit}>
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder="Type a message"
            className="h-10 rounded-lg bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            disabled={!draft.trim() || isSending}
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
