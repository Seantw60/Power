"use client"

import { motion } from "framer-motion"
import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type MotionButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost"
  }
>

const variantClasses: Record<NonNullable<MotionButtonProps["variant"]>, string> = {
  primary: "border border-[#0d6d56] bg-[#0f9b78] text-white hover:bg-[#118c6d] focus-visible:outline-[#0f9b78]",
  secondary: "border border-[#1d4f91] bg-[#1f6bc1] text-white hover:bg-[#1b5ea9] focus-visible:outline-[#1f6bc1]",
  ghost: "border border-[#89aed7] bg-[#edf6ff] text-[#1d4f91] hover:bg-[#dbeeff] focus-visible:outline-[#1f6bc1]",
}

export function MotionButton({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={`inline-flex items-center justify-center px-3 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
