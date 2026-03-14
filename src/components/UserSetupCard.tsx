import { useState } from "react"
import type { FormEvent } from "react"
import { UserRound } from "lucide-react"
import Button from "./Button"
import Card from "./Card"
import Input from "./Input"

type UserSetupCardProps = {
  isLoading: boolean
  error: string | null
  onSubmitName: (name: string) => Promise<void>
}

export default function UserSetupCard({
  isLoading,
  error,
  onSubmitName,
}: UserSetupCardProps) {
  const [name, setName] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      return
    }

    await onSubmitName(trimmedName)
  }

  return (
    <Card>
      <div className="mb-5 flex items-center gap-3">
        <span className="app-panel app-border app-text-secondary inline-flex h-10 w-10 items-center justify-center rounded-lg border">
          <UserRound size={18} />
        </span>
        <h2 className="app-text-primary text-lg font-semibold">Enter your display name</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          maxLength={64}
          required
        />

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <Button
          type="submit"
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? "Continuing..." : "Continue"}
        </Button>
      </form>
    </Card>
  )
}
