import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MeetingActionsCard from "../components/MeetingActionsCard"
import UserSetupCard from "../components/UserSetupCard"

type StoredUser = {
  id: string
  name: string
}

export default function Home() {
  const navigate = useNavigate()

  const [user, setUser] = useState<StoredUser | null>(null)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false)
  const [onboardingError, setOnboardingError] = useState<string | null>(null)
  const [meetingError, setMeetingError] = useState<string | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("userId")
    const storedName = localStorage.getItem("username")

    if (storedId && storedName) {
      setUser({ id: storedId, name: storedName })
    }

    setIsCheckingUser(false)
  }, [])

  const handleContinue = async (name: string) => {
    setOnboardingError(null)
    setIsSubmittingUser(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Could not create guest profile")
      }

      const data = await response.json()
      const createdUser = data?.user ?? data

      if (!createdUser?.id || !createdUser?.name) {
        throw new Error("Invalid user response")
      }

      localStorage.setItem("userId", createdUser.id)
      localStorage.setItem("username", createdUser.name)
      setUser({ id: createdUser.id, name: createdUser.name })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to continue as guest"
      setOnboardingError(message)
    } finally {
      setIsSubmittingUser(false)
    }
  }

  const handleCreateMeeting = async () => {
    if (!user?.id) {
      setMeetingError("Please complete onboarding first.")
      return
    }

    setMeetingError(null)
    setIsCreatingMeeting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Unable to create meeting")
      }

      const contentType = response.headers.get("content-type") ?? ""
      const locationHeader = response.headers.get("location")
      let meetingId: string | undefined

      if (contentType.includes("application/json")) {
        const data = await response.json()
        meetingId = data?.meetingId ?? data?.meeting?.id ?? data?.id
      } else {
        const textResponse = (await response.text()).trim()

        if (textResponse) {
          meetingId = textResponse.includes("/")
            ? textResponse.split("/").pop()
            : textResponse
        }
      }

      if (!meetingId && locationHeader) {
        meetingId = locationHeader.split("/").pop() ?? undefined
      }

      if (!meetingId || typeof meetingId !== "string") {
        throw new Error("Meeting ID not found in response")
      }

      navigate(`/meetings/${meetingId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create meeting"
      setMeetingError(message)
    } finally {
      setIsCreatingMeeting(false)
    }
  }

  const handleJoinMeeting = (meetingCode: string) => {
    navigate(`/meetings/${meetingCode}`)
  }

  return (
    <section className="flex w-full flex-col items-center">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-foreground">
        MeetLite
      </h1>

      {isCheckingUser ? (
        <div className="w-full max-w-[460px] rounded-xl border border-border bg-card p-7 text-center text-sm text-muted-foreground shadow-xl">
          Loading...
        </div>
      ) : !user ? (
        <UserSetupCard
          onSubmitName={handleContinue}
          isLoading={isSubmittingUser}
          error={onboardingError}
        />
      ) : (
        <MeetingActionsCard
          username={user.name}
          isCreatingMeeting={isCreatingMeeting}
          createError={meetingError}
          onCreateMeeting={handleCreateMeeting}
          onJoinMeeting={handleJoinMeeting}
        />
      )}
    </section>
  )
}
