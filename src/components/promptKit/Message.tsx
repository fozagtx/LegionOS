"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-3", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Message.displayName = "Message"

interface MessageAvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

export const MessageAvatar = React.forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ src, alt, fallback = "AI", className }, ref) => {
    const [error, setError] = React.useState(false)
    return (
      <div
        ref={ref as any}
        className={cn(
          "w-10 h-10 rounded-full overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-[0_8px_18px_rgba(0,0,0,0.35)] bg-[#1f1f1f] flex items-center justify-center text-sm font-semibold text-white",
          className
        )}
      >
        {!error && src ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setError(true)}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <span>{fallback}</span>
        )}
      </div>
    )
  }
)
MessageAvatar.displayName = "MessageAvatar"

interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  markdown?: boolean
}

export const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, children, markdown = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-4 py-3 rounded-2xl border",
          markdown ? "prose prose-invert bg-transparent border-transparent" : "bg-[#f7f7f7] text-black border-[rgba(0,0,0,0.08)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MessageContent.displayName = "MessageContent"
