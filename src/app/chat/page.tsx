"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import ChatInput from "@/components/ui/chatInput"
import { AgentAvatar } from "@/components/agentAvatar"
import { ChatSidebar } from "@/components/chatSidebar"
import { Message, MessageAvatar, MessageContent } from "@/components/promptKit/Message"
import { Markdown } from "@/components/promptKit/Markdown"
import { ImageAttachment } from "@/lib/attachments"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  format?: "markdown" | "text"
  attachments?: { name: string }[]
}

const defaultMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Welcome back to LegianOS. Share a goal or drop an image and I will build milestones, track tools, and keep everything in sync.",
    format: "markdown"
  }
]

async function fileToAttachment(file: File): Promise<ImageAttachment> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })

  const [, base64 = ""] = dataUrl.split(",")
  return {
    data: base64,
    mimeType: file.type || "application/octet-stream",
    name: file.name
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages)
  const [sessionId, setSessionId] = useState(() => `legianos-${Date.now()}`)
  const [assistantDraft, setAssistantDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const agentAvatarSrc = useMemo(() => "/machina-avatar.mp4", [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages, assistantDraft])

  const triggerKickoff = () => {
    handleSendMessage({
      message: "Run the 90-day kickoff: clarify my identity/why, set the single daily compounding action, and prepare my 90-day goal.",
      files: [],
      pastedContent: [],
      isThinkingEnabled: true
    })
  }

  const triggerWeeklyPlan = () => {
    handleSendMessage({
      message: "Start the weekly planning workflow: pull my current context and return a 5-item must-do list for this week.",
      files: [],
      pastedContent: [],
      isThinkingEnabled: false
    })
  }

  const triggerDailyLog = () => {
    handleSendMessage({
      message: "Log today in the daily execution workflow: mark status, blockers, rest, and update my streak.",
      files: [],
      pastedContent: [],
      isThinkingEnabled: false
    })
  }

  const resetSession = () => {
    setMessages(defaultMessages)
    setAssistantDraft("")
    setSessionId(`legianos-${Date.now()}`)
  }

  const handleSendMessage = async ({
    message,
    files,
    pastedContent,
    isThinkingEnabled
  }: {
    message: string
    files: { id: string; file: File; type: string; preview: string | null; uploadStatus: string }[]
    pastedContent: { id: string; content: string; timestamp: Date }[]
    isThinkingEnabled: boolean
  }) => {
    if (!message.trim() && files.length === 0 && pastedContent.length === 0) return

    const attachmentFiles = files.filter(f => f.file).map(f => f.file as File)
    const attachmentsFromFiles = await Promise.all(attachmentFiles.map(fileToAttachment))

    const attachmentsFromPastes = pastedContent
      .map(item => {
        const content = item.content || ""
        const encoded = typeof window !== "undefined" && typeof btoa === "function"
          ? btoa(unescape(encodeURIComponent(content)))
          : ""
        return {
          data: encoded,
          mimeType: "text/plain",
          name: "pasted.txt"
        }
      })

    const allAttachments: ImageAttachment[] = [...attachmentsFromFiles, ...attachmentsFromPastes]

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      format: "text",
      attachments: [
        ...files.map(item => ({ name: item.file?.name || "file" })),
        ...pastedContent.map(item => ({ name: `${item.content.slice(0, 20)}…` }))
      ]
    }

    setMessages(prev => [...prev, userMessage])
    setAssistantDraft("LegianOS is processing your request...")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          threadId: sessionId,
          userId: "legianos-user",
          attachments: allAttachments
        })
      })

      // Safely parse JSON response, handling empty or malformed responses
      let data: Record<string, unknown>
      try {
        const responseText = await response.text()
        if (!responseText || responseText.trim() === "") {
          throw new Error("Server returned an empty response")
        }
        data = JSON.parse(responseText)
      } catch (parseError) {
        const parseErrorMsg = parseError instanceof Error ? parseError.message : "Unknown parse error"
        throw new Error(`Failed to parse server response: ${parseErrorMsg}`)
      }

      if (!response.ok) {
        const errorDetail = (data.details || data.error || "Unknown error") as string
        const hint = (data.hint || "") as string
        throw new Error(`${errorDetail}${hint ? ` (${hint})` : ""}`)
      }
      const reply = (data.reply as string) || "I wasn't able to generate a response, but the request was received."

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        format: "markdown"
      }

      setMessages(prev => [...prev, assistantMessage])
      setAssistantDraft("")

    } catch (error) {
      setAssistantDraft("")
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: `I couldn't process that request. ${errorMessage.includes("API key") ? "Please check your API key configuration." : "Please try again."}`,
          format: "markdown"
        }
      ])
    }
  }

  return (
    <div className="min-h-screen bg-[#e8e8f6] text-[#111827]">
      <div className="flex gap-6 px-4 md:px-8 py-6">
        <ChatSidebar sessionId={sessionId} goalsCount={0} />

        <div className="flex-1 flex flex-col">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-end gap-3 pb-4">
            <button
              onClick={resetSession}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-[#e3e5ef] text-[#374151] hover:bg-[#f3f4f6] transition"
            >
              Clear Session
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#2D1DFF] text-white shadow-[0_12px_24px_rgba(45,29,255,0.3)] hover:-translate-y-[1px] transition border border-[#2D1DFF]"
            >
              Back to Landing
            </Link>
          </div>

          <main className="flex-1 flex justify-center">
            <div className="w-full max-w-5xl px-2 md:px-0">
              <div className="rounded-3xl border border-white/50 bg-white/85 backdrop-blur-md p-5 shadow-[0_16px_40px_rgba(0,0,0,0.08)] min-h-[60vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                    Live session • {sessionId.split('-').pop()}
                  </div>
                  <div className="text-xs text-gray-500">Auto-scroll enabled</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={triggerKickoff}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#2D1DFF] text-white shadow-[0_8px_18px_rgba(45,29,255,0.25)] hover:-translate-y-[1px] transition"
                  >
                    Kickoff 90-Day Plan
                  </button>
                  <button
                    onClick={triggerWeeklyPlan}
                    className="px-3 py-2 rounded-lg text-sm font-semibold border border-[#2D1DFF] text-[#111827] bg-white/90 hover:bg-[#f1f5ff] transition"
                  >
                    Weekly Plan
                  </button>
                  <button
                    onClick={triggerDailyLog}
                    className="px-3 py-2 rounded-lg text-sm font-semibold border border-[#d7d0ff] text-[#2D1DFF] bg-white/90 hover:bg-[#f4f1ff] transition"
                  >
                    Daily Log
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-1" ref={scrollRef}>
                  {messages.map(msg => (
                    <Message
                      key={msg.id}
                      className={`${
                        msg.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <MessageAvatar
                          src={agentAvatarSrc}
                          alt="LegianOS"
                          fallback="L"
                          className="w-12 h-12 border-none shadow-[0_10px_18px_rgba(0,0,0,0.12)]"
                        />
                      )}
                      <MessageContent
                        markdown={msg.format === "markdown"}
                        className={
                          msg.role === "assistant"
                            ? "bg-[#0f172a] text-white border border-white/20 max-w-3xl"
                            : "bg-white/80 text-[#111827] border-white/60 max-w-3xl backdrop-blur-md"
                        }
                      >
                        {msg.format === "markdown" ? <Markdown>{msg.content}</Markdown> : msg.content}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {msg.attachments.map((att, idx) => (
                              <span key={`${att.name}-${idx}`} className="px-2 py-1 rounded-full border border-[#e5e7eb] text-[#374151] bg-white">
                                {att.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </MessageContent>
                    </Message>
                  ))}

                  {assistantDraft && (
                    <Message className="justify-start">
                      <MessageAvatar
                        src={agentAvatarSrc}
                        alt="LegianOS"
                        fallback="L"
                        className="w-12 h-12 border-none shadow-[0_10px_18px_rgba(0,0,0,0.12)]"
                      />
                      <MessageContent markdown className="bg-transparent border border-[#e3e5ef] text-[#111827] max-w-3xl">
                        <Markdown>{assistantDraft}</Markdown>
                      </MessageContent>
                    </Message>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
