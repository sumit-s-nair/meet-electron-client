import {
  useLocalParticipant,
  useMediaDeviceSelect,
  useRoomContext,
} from "@livekit/components-react"
import type { ReactNode } from "react"
import { useState } from "react"
import {
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react"

type MeetingControlsProps = {
  chatOpen: boolean
  onToggleChat: () => void
  onLeave: () => void
}

type IconButtonProps = {
  active?: boolean
  danger?: boolean
  onClick: () => void | Promise<void>
  title: string
  children: ReactNode
}

function IconButton({ active, danger, onClick, title, children }: IconButtonProps) {
  const baseClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-200"

  const styleClass = danger
    ? "border-red-500/60 bg-red-600 text-white hover:bg-red-500"
    : active
      ? "border-[#3b82f6]/70 bg-[#3b82f6]/20 text-[#e5e7eb] hover:bg-[#3b82f6]/30"
      : "app-border app-panel app-text-primary border hover:bg-[#111827]"

  return (
    <button type="button" title={title} className={`${baseClass} ${styleClass}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function MeetingControls({ chatOpen, onToggleChat, onLeave }: MeetingControlsProps) {
  const room = useRoomContext()
  const [shareError, setShareError] = useState<string | null>(null)
  const [deviceError, setDeviceError] = useState<string | null>(null)
  const {
    localParticipant,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
  } = useLocalParticipant()

  const {
    devices: microphones,
    activeDeviceId: activeMicrophoneId,
    setActiveMediaDevice: setActiveMicrophone,
  } = useMediaDeviceSelect({
    kind: "audioinput",
    room,
    requestPermissions: true,
    onError: (error) => setDeviceError(error.message),
  })

  const {
    devices: cameras,
    activeDeviceId: activeCameraId,
    setActiveMediaDevice: setActiveCamera,
  } = useMediaDeviceSelect({
    kind: "videoinput",
    room,
    requestPermissions: true,
    onError: (error) => setDeviceError(error.message),
  })

  const toggleMicrophone = async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
  }

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!isCameraEnabled)
  }

  const toggleScreenShare = async () => {
    setShareError(null)

    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled)
    } catch {
      const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
      const isWindows = /Windows/i.test(navigator.userAgent)

      if (isMac) {
        setShareError(
          "Screen share permission is blocked. Enable Screen Recording for this app in macOS System Settings, then retry.",
        )
        return
      }

      if (isWindows) {
        setShareError(
          "Unable to start screen share. Grant desktop capture permission in the system prompt, then retry.",
        )
        return
      }

      setShareError("Unable to start screen share. Check permission prompts and try again.")
    }
  }

  const leaveMeeting = () => {
    room.disconnect()
    onLeave()
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <div className="grid w-full max-w-[680px] grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="app-card app-border flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
            <span className="app-text-secondary shrink-0">Mic</span>
            <select
              value={activeMicrophoneId}
              onChange={async (event) => {
                setDeviceError(null)
                await setActiveMicrophone(event.target.value)
              }}
              className="app-panel app-border app-text-primary w-full rounded-md border px-2 py-1 outline-none"
            >
              {microphones.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || "Microphone"}
                </option>
              ))}
            </select>
          </label>

          <label className="app-card app-border flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
            <span className="app-text-secondary shrink-0">Camera</span>
            <select
              value={activeCameraId}
              onChange={async (event) => {
                setDeviceError(null)
                await setActiveCamera(event.target.value)
              }}
              className="app-panel app-border app-text-primary w-full rounded-md border px-2 py-1 outline-none"
            >
              {cameras.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || "Camera"}
                </option>
              ))}
            </select>
          </label>
        </div>

        {deviceError ? (
          <div className="app-card app-border app-text-secondary max-w-[560px] rounded-lg border px-3 py-2 text-xs">
            {deviceError}
          </div>
        ) : null}

        {shareError ? (
          <div className="app-card app-border app-text-secondary max-w-[560px] rounded-lg border px-3 py-2 text-xs">
            {shareError}
          </div>
        ) : null}

        <div className="app-card app-border flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg shadow-black/30">
        <IconButton active={isMicrophoneEnabled} title="Microphone" onClick={toggleMicrophone}>
          {isMicrophoneEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </IconButton>

        <IconButton active={isCameraEnabled} title="Camera" onClick={toggleCamera}>
          {isCameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </IconButton>

        <IconButton active={isScreenShareEnabled} title="Share Screen" onClick={toggleScreenShare}>
          <Monitor className="h-4 w-4" />
        </IconButton>

        <IconButton active={chatOpen} title="Toggle Chat" onClick={onToggleChat}>
          <MessageSquare className="h-4 w-4" />
        </IconButton>

        <IconButton danger title="Leave Meeting" onClick={leaveMeeting}>
          <PhoneOff className="h-4 w-4" />
        </IconButton>
        </div>
      </div>
    </div>
  )
}
