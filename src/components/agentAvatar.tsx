"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AgentAvatarProps {
  agentType: "legianos" | "general" | "user"
  className?: string
  size?: "sm" | "md" | "lg"
  isActive?: boolean
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20"
}

// Avatar configurations for different agents
const avatarConfigs = {
  legianos: {
    videoUrl: "/machina-avatar.mp4",
    fallbackColor: "#2a2a2a",
    icon: "L",
    name: "LegianOS"
  },
  general: {
    videoUrl: "/machina-avatar.mp4",
    fallbackColor: "#333333",
    icon: "A",
    name: "Assistant"
  },
  user: {
    videoUrl: "/machina-avatar.mp4",
    fallbackColor: "#1e1e1e",
    icon: "U",
    name: "User"
  }
}

export function AgentAvatar({
  agentType,
  className,
  size = "md",
  isActive = false
}: AgentAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const config = avatarConfigs[agentType]

  useEffect(() => {
    const video = videoRef.current
    if (video && !videoError) {
      // Preload the video
      video.load()

      // Attempt to play the video when active
      if (isActive) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Video failed to play, but don't set error immediately
            // The video might still be loading
          })
        }
      } else {
        video.pause()
      }
    }
  }, [isActive, videoError])


  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-2 transition-all duration-300",
        sizeClasses[size],
        className
      )}
      style={{
        borderColor: isActive ? "#ffffff" : "#333333",
        boxShadow: isActive ? "0 0 15px rgba(255, 255, 255, 0.25)" : "none"
      }}
    >
      {!videoError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={handleVideoError}
          onLoadedData={() => {
            // Video loaded successfully, ensure it's playing
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Autoplay might be blocked, but video should still be visible
                console.log('Video autoplay blocked')
              })
            }
          }}
          onCanPlay={() => {
            // Video is ready to play
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                console.log('Video play failed on canplay')
              })
            }
          }}
        >
          <source src={config.videoUrl} type="video/mp4" />
        </video>
      ) : (
        // Fallback gradient avatar with icon
        <div
          className="w-full h-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: config.fallbackColor }}
        >
          <span className="text-xs">
            {config.icon}
          </span>
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3 border-2 rounded-full animate-pulse"
          style={{ backgroundColor: "#ffffff", borderColor: "#141414" }}
        />
      )}
    </div>
  )
}

// Export agent configuration for external use
export { avatarConfigs }
