import type { ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary" ? "app-button" : "app-button-secondary"

  return <button className={`${variantClass} ${className}`} {...props} />
}
