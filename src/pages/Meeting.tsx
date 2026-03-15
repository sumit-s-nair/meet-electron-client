import { useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, RotateCw } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import {
    LiveKitRoom,
} from "@livekit/components-react"
import Button from "../components/Button"
import Card from "../components/Card"
import MeetingLayout from "../components/meeting/MeetingLayout"

export default function Meeting() {
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [reloadKey, setReloadKey] = useState(0)
    const navigate = useNavigate()
    const { roomId } = useParams<{ roomId: string }>()
    const hasRoomId = Boolean(roomId)

    useEffect(() => {
        if (!roomId) {
            setIsLoading(false)
            return
        }

        let disposed = false

        const loadToken = async () => {
            setError(null)
            setIsLoading(true)
            setToken(null)

            const userIdentity =
                localStorage.getItem("username") ??
                localStorage.getItem("userId") ??
                crypto.randomUUID()

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/meetings/${encodeURIComponent(roomId)}/token?userId=${encodeURIComponent(userIdentity)}`,
                )

                if (!res.ok) {
                    throw new Error("Failed to get meeting token")
                }

                const contentType = res.headers.get("content-type") ?? ""
                const rawBody = (await res.text()).trim()

                let nextToken = ""

                if (rawBody) {
                    if (contentType.includes("application/json")) {
                        try {
                            const data = JSON.parse(rawBody)
                            nextToken = data?.token ?? data?.accessToken ?? data?.data?.token ?? ""
                        } catch {
                            nextToken = rawBody
                        }
                    } else {
                        nextToken = rawBody
                    }
                }

                if (!nextToken) {
                    throw new Error("Token response was empty. Please try again.")
                }

                if (!disposed) {
                    setToken(nextToken)
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Unable to connect"
                if (!disposed) {
                    setToken(null)
                    setError(message)
                }
            } finally {
                if (!disposed) {
                    setIsLoading(false)
                }
            }
        }

        loadToken()

        return () => {
            disposed = true
        }
    }, [roomId, reloadKey])

    if (!hasRoomId) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden px-4 sm:px-6">
                <Card className="w-full max-w-[460px] space-y-4 p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <h1 className="app-text-primary text-lg font-semibold">Meeting room is missing</h1>
                    </div>

                    <p className="app-text-secondary text-sm">The meeting URL is incomplete. Go back to Home and try again.</p>

                    <Button
                        type="button"
                        variant="secondary"
                        className="inline-flex items-center justify-center gap-2"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden px-4 sm:px-6">
                <Card className="w-full max-w-[460px] space-y-5 p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <h1 className="app-text-primary text-lg font-semibold">Unable to join meeting</h1>
                    </div>

                    <p className="app-text-secondary text-sm">{error}</p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button
                            type="button"
                            className="inline-flex items-center justify-center gap-2"
                            onClick={() => setReloadKey((current) => current + 1)}
                        >
                            <RotateCw className="h-4 w-4" />
                            Retry
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="inline-flex items-center justify-center gap-2"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    if (isLoading || !token) {
        return (
            <div className="app-text-secondary flex h-[100dvh] w-full items-center justify-center overflow-hidden">
                Connecting to meeting...
            </div>
        )
    }

    return (
        <div className="h-[100dvh] w-full overflow-hidden">
            <LiveKitRoom
                connect={true}
                video={true}
                audio={true}
                token={token}
                serverUrl={import.meta.env.VITE_LIVEKIT_URL}
                onDisconnected={() => navigate("/", { replace: true })}
                style={{ height: "100%", width: "100%" }}
            >
                <MeetingLayout
                    roomId={roomId!}
                    onLeave={() => navigate("/", { replace: true })}
                />
            </LiveKitRoom>
        </div>
    )
}