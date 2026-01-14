"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import ChatInput from "@/components/ui/chatInput"
import { AgentAvatar } from "@/components/agentAvatar"
import { Message, MessageAvatar, MessageContent } from "@/components/promptKit/Message"
import { Markdown } from "@/components/promptKit/Markdown"
import { PromptSuggestion } from "@/components/promptKit/promptSuggestion"
import { Tool, ToolPart } from "@/components/promptKit/Tool"
import { ImageAttachment } from "@/lib/attachments"
import { Goal } from "@/lib/goalTypes"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  format?: "markdown" | "text"
  attachments?: { name: string }[]
}

type ToolEvent = ToolPart & { id: string; label?: string }

const defaultMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Welcome back to LegianOS. Share a goal or drop an image and I will build milestones, track tools, and keep everything in sync.",
    format: "markdown"
  }
]

const baseToolEvents: ToolEvent[] = [
  {
    id: "tool-goal-check",
    type: "checkGoals",
    state: "output-available",
    input: { action: "check goals", scope: "active" },
    output: { activeGoals: 3, nextMilestone: "Upload portfolio case study" }
  },
  {
    id: "tool-milestone",
    type: "planMilestones",
    state: "output-available",
    input: { cadence: "weekly", horizon: "30 days" },
    output: { milestones: 4, risk: "timeline stretch if no weekly check-in" }
  },
  {
    id: "tool-export",
    type: "exportProfile",
    state: "output-streaming",
    input: { format: "markdown", include: ["progress", "risks"] }
  }
]

const promptPresets = [
  "Draft a 4-week fitness goal with milestones",
  "Create a career progression plan with checkpoints",
  "Summarize my goals and export a markdown profile"
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
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>(baseToolEvents)
  const [sessionId, setSessionId] = useState(() => `legianos-${Date.now()}`)
  const [assistantDraft, setAssistantDraft] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
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

  const resetSession = () => {
    setMessages(defaultMessages)
    setToolEvents(baseToolEvents)
    setAssistantDraft("")
    setGoals([])
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
    setIsStreaming(true)

    const activeToolId = `tool-${Date.now()}`
    setToolEvents(prev => [
      { id: activeToolId, type: "goalIntake", state: "input-streaming", input: { message, attachments: allAttachments.length, extendedThinking: isThinkingEnabled } },
      ...prev
    ])

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
      const goalProfile = data.goalProfile as Goal | undefined
      const nextSteps = (data.nextSteps as string[]) || []

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        format: "markdown"
      }

      setMessages(prev => [...prev, assistantMessage])
      setAssistantDraft("")

      if (goalProfile) {
        setGoals(prevGoals => [...prevGoals.filter(g => g.id !== goalProfile.id), goalProfile])
      }

      setToolEvents(prev =>
        prev.map(tool =>
          tool.id === activeToolId
            ? {
                ...tool,
                state: "output-available",
                output: {
                  goalProfile: goalProfile ? goalProfile.title || "Goal captured" : "Conversation updated",
                  nextSteps
                }
              }
            : tool
        )
      )
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
      setToolEvents(prev =>
        prev.map(tool =>
          tool.id === activeToolId
            ? { ...tool, state: "output-error", errorText: errorMessage || "Failed to reach LegianOS agent" }
            : tool
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AgentAvatar agentType="legianos" size="sm" className="shadow-[0_10px_30px_rgba(0,0,0,0.35)] border-none" />
            <div>
              <p className="text-sm text-gray-300">LegianOS</p>
              <p className="font-semibold text-lg leading-tight">Goal Operations Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetSession}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-white/15 text-white/80 hover:text-white hover:bg-white/5 transition"
            >
              Clear Session
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:-translate-y-[1px] transition"
            >
              Back to Landing
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] min-h-[60vh] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Live session • {sessionId}
                  </div>
                  <div className="text-xs text-gray-400">LegianOS will auto-scroll while responses stream.</div>
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
                          className="w-12 h-12 border-none shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                        />
                      )}
                      <MessageContent
                        markdown={msg.format === "markdown"}
                        className={
                          msg.role === "assistant"
                            ? "bg-transparent border border-white/12 text-white max-w-3xl"
                            : "bg-white text-black border-[rgba(0,0,0,0.08)] max-w-3xl"
                        }
                      >
                        {msg.format === "markdown" ? <Markdown>{msg.content}</Markdown> : msg.content}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {msg.attachments.map((att, idx) => (
                              <span key={`${att.name}-${idx}`} className="px-2 py-1 rounded-full border border-white/20 text-white/80 bg-white/5">
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
                        className="w-12 h-12 border-none shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                      />
                      <MessageContent markdown className="bg-transparent border border-white/12 text-white max-w-3xl">
                        <Markdown>{assistantDraft}</Markdown>
                      </MessageContent>
                    </Message>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {promptPresets.map(prompt => (
                  <PromptSuggestion
                    key={prompt}
                    onClick={() => handleSendMessage({ message: prompt, files: [], pastedContent: [], isThinkingEnabled: false })}
                  >
                    {prompt}
                  </PromptSuggestion>
                ))}
              </div>

              <ChatInput onSendMessage={handleSendMessage} />
            </div>

            <aside className="flex flex-col gap-4">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.35)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AgentAvatar agentType="legianos" size="sm" className="border-none shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
                    <div>
                      <p className="text-sm text-gray-300">Tool Calls</p>
                      <p className="text-base font-semibold">Live execution</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Images supported</span>
                </div>
                <div className="space-y-3">
                  {toolEvents.map(event => (
                    <Tool key={event.id} toolPart={event} className="w-full" />
                  ))}
                </div>
              </div>

              {goals.length > 0 && (
                <div className="rounded-3xl border border-white/15 bg-white/5 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.35)] space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">Active Goals</p>
                    <span className="text-xs text-gray-400">Session scoped</span>
                  </div>
                  {goals.map(goal => (
                    <div key={goal.id} className="border border-white/10 rounded-2xl px-3 py-2 bg-white/5">
                      <p className="font-semibold">{goal.title}</p>
                      <p className="text-xs text-gray-400">{goal.description || "LegianOS captured this goal."}</p>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
