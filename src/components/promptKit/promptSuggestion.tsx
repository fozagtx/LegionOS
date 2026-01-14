import React from "react"
import { cn } from "@/lib/utils"

interface PromptSuggestionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function PromptSuggestion({
  children,
  className,
  onClick,
  ...props
}: PromptSuggestionProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors transform-gpu duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.35)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        transform: 'scale(1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
        e.currentTarget.style.transform = 'scale(1.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
