export {}

type MeetLiteDisplaySource = {
  id: string
  name: string
  thumbnailDataUrl: string
}

declare global {
  interface Window {
    meetLiteDesktop?: {
      listDisplaySources: () => Promise<MeetLiteDisplaySource[]>
      selectDisplaySource: (sourceId: string) => Promise<void>
    }
  }
}
