import React from "react"
import { cn } from "@/lib/utils"

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
}

export function TextShimmer({ children, className }: TextShimmerProps) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #a1a1aa 0%, #ffffff 50%, #a1a1aa 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
      <span
        className={cn("shimmer-text", className)}
      >
        {children}
      </span>
    </>
  )
}