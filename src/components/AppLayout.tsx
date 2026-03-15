import type { ReactNode } from "react"

type AppLayoutProps = {
  children: ReactNode
  centerContent?: boolean
  containerClassName?: string
}

export default function AppLayout({
  children,
  centerContent = true,
  containerClassName = "",
}: AppLayoutProps) {
  const alignmentClass = centerContent ? "items-center justify-center" : ""

  return (
    <main className={`app-bg flex min-h-screen w-full overflow-hidden ${alignmentClass} p-4 sm:p-6 ${containerClassName}`}>
      {children}
    </main>
  )
}
