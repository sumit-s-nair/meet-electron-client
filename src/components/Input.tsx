import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className = "", ...props }: InputProps) {
  return <input className={`app-input app-text-primary ${className}`} {...props} />
}
