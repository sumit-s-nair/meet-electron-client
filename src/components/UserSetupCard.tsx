import { useState } from "react"
import type { FormEvent } from "react"
import { UserRound } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
    <Card className="w-full max-w-[460px] border-border bg-card shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <UserRound size={18} />
          </span>
          <CardTitle className="text-lg font-semibold text-foreground">
            Enter your display name
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={64}
            required
            className="h-12 rounded-xl bg-muted px-4 text-foreground placeholder:text-muted-foreground"
          />

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="h-12 w-full text-base font-semibold"
            size="lg"
          >
            {isLoading ? "Continuing..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
