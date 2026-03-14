import type { ReactNode } from "react"

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = "" }: CardProps) {
  return <div className={`app-card app-border app-card-shadow rounded-xl border p-8 ${className}`}>{children}</div>
}
