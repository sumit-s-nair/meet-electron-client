import { useState } from "react"
import type { FormEvent } from "react"
import { LogIn, Video } from "lucide-react"
import Button from "./Button"
import Card from "./Card"
import Input from "./Input"

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
    <Card className="space-y-5">
      <div className="app-panel app-border app-text-secondary rounded-xl border px-4 py-3 text-sm">
        Signed in as <span className="app-text-primary font-medium">{username}</span>
      </div>

      <div className="space-y-3">
        <div className="app-text-primary flex items-center gap-2 text-sm font-medium">
          <Video size={16} className="app-text-secondary" />
          Create Meeting
        </div>

        <Button
          type="button"
          onClick={onCreateMeeting}
          disabled={isCreatingMeeting}
        >
          {isCreatingMeeting ? "Creating..." : "Create Meeting"}
        </Button>

        {createError ? <p className="text-sm text-rose-400">{createError}</p> : null}
      </div>

      <form className="space-y-3" onSubmit={handleJoinSubmit}>
        <div className="app-text-primary flex items-center gap-2 text-sm font-medium">
          <LogIn size={16} className="app-text-secondary" />
          Join Meeting
        </div>

        <Input
          type="text"
          value={meetingCode}
          onChange={(event) => setMeetingCode(event.target.value)}
          placeholder="Meeting code"
          required
        />

        <Button
          variant="secondary"
          type="submit"
          disabled={!meetingCode.trim()}
        >
          Join Meeting
        </Button>
      </form>
    </Card>
  )
}
