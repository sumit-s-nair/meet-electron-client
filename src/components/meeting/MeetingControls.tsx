import {
  useLocalParticipant,
  useMediaDeviceSelect,
  useRoomContext,
} from "@livekit/components-react"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import {
  Check,
  ChevronDown,
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
      ? "border-primary/70 bg-primary/20 text-foreground hover:bg-primary/30"
      : "border-border bg-muted text-foreground hover:bg-card"

  return (
    <button type="button" title={title} className={`${baseClass} ${styleClass}`} onClick={onClick}>
      {children}
    </button>
  )
}

type DevicePickerProps = {
  devices: MediaDeviceInfo[]
  activeDeviceId: string
  onSelect: (deviceId: string) => Promise<void>
  label: string
}

function DevicePicker({ devices, activeDeviceId, onSelect, label }: DevicePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  if (devices.length === 0) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="ml-0.5 inline-flex h-6 w-5 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground focus:outline-none"
        onClick={() => setIsOpen((v) => !v)}
      >
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 z-50 mb-3 w-[260px] -translate-x-1/2 rounded-lg border border-border bg-card p-1 shadow-xl shadow-black/40">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{label}</div>
          {devices.map((device) => (
            <button
              key={device.deviceId}
              type="button"
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
                device.deviceId === activeDeviceId
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={async () => {
                await onSelect(device.deviceId)
                setIsOpen(false)
              }}
            >
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                {device.deviceId === activeDeviceId && <Check className="h-3 w-3 text-primary" />}
              </span>
              <span className="truncate">{device.label || label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MeetingControls({ chatOpen, onToggleChat, onLeave }: MeetingControlsProps) {
  const room = useRoomContext()
  const [shareError, setShareError] = useState<string | null>(null)
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
  })

  const {
    devices: cameras,
    activeDeviceId: activeCameraId,
    setActiveMediaDevice: setActiveCamera,
  } = useMediaDeviceSelect({
    kind: "videoinput",
    room,
    requestPermissions: true,
  })

  const toggleMicrophone = async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
  }

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!isCameraEnabled)
  }

  const toggleScreenShare = async () => {
    setShareError(null)

    if (isScreenShareEnabled) {
      await localParticipant.setScreenShareEnabled(false)
      return
    }

    try {
      await localParticipant.setScreenShareEnabled(true)
    } catch {
      setShareError("Unable to start screen share. Please try again.")
    }
  }

  const leaveMeeting = () => {
    room.disconnect()
    onLeave()
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        {shareError ? (
          <div className="max-w-[560px] rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            {shareError}
          </div>
        ) : null}

        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 shadow-lg shadow-black/30">
          {/* Mic toggle + device picker */}
          <div className="flex items-center">
            <IconButton active={isMicrophoneEnabled} title="Microphone" onClick={toggleMicrophone}>
              {isMicrophoneEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </IconButton>
            <DevicePicker
              devices={microphones}
              activeDeviceId={activeMicrophoneId}
              onSelect={setActiveMicrophone}
              label="Microphone"
            />
          </div>

          {/* Camera toggle + device picker */}
          <div className="flex items-center">
            <IconButton active={isCameraEnabled} title="Camera" onClick={toggleCamera}>
              {isCameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </IconButton>
            <DevicePicker
              devices={cameras}
              activeDeviceId={activeCameraId}
              onSelect={setActiveCamera}
              label="Camera"
            />
          </div>

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
