import { useState } from "react"
import type { FormEvent } from "react"
import { LogIn, Video } from "lucide-react"
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type MeetingActionsCardProps = {
  username: string
  isCreatingMeeting: boolean
  createError: string | null
  onCreateMeeting: () => Promise<void>
  onJoinMeeting: (meetingCode: string) => void
}

export default function MeetingActionsCard({
  username,
  isCreatingMeeting,
  createError,
  onCreateMeeting,
  onJoinMeeting,
}: MeetingActionsCardProps) {
  const [meetingCode, setMeetingCode] = useState("")

  const handleJoinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedCode = meetingCode.trim()
    if (!normalizedCode) {
      return
    }

    onJoinMeeting(normalizedCode)
  }

  return (
    <Card className="w-full max-w-[460px] border-border bg-card shadow-xl">
      <CardHeader>
        <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{username}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Video size={16} className="text-muted-foreground" />
            Create Meeting
          </div>

          <Button
            type="button"
            onClick={onCreateMeeting}
            disabled={isCreatingMeeting}
            className="h-12 w-full text-base font-semibold"
            size="lg"
          >
            {isCreatingMeeting ? "Creating..." : "Create Meeting"}
          </Button>

          {createError ? <p className="text-sm text-rose-400">{createError}</p> : null}
        </div>

        <form className="space-y-3" onSubmit={handleJoinSubmit}>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <LogIn size={16} className="text-muted-foreground" />
            Join Meeting
          </div>

          <Input
            type="text"
            value={meetingCode}
            onChange={(event) => setMeetingCode(event.target.value)}
            placeholder="Meeting code"
            required
            className="h-12 rounded-xl bg-muted px-4 text-foreground placeholder:text-muted-foreground"
          />

          <Button
            variant="outline"
            type="submit"
            disabled={!meetingCode.trim()}
            className="h-12 w-full text-base font-semibold"
            size="lg"
          >
            Join Meeting
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
