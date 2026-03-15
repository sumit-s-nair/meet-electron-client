import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

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
  return (
    <main
      className={cn(
        "flex min-h-screen w-full overflow-hidden bg-background p-4 sm:p-6",
        centerContent && "items-center justify-center",
        containerClassName
      )}
    >
      {children}
    </main>
  )
}
