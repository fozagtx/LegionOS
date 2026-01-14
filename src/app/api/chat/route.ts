"use server"

import { NextRequest, NextResponse } from "next/server"
import { runGoalAgent } from "@/lib/goalAgent"
import { ImageAttachment } from "@/lib/attachments"

export async function POST(request: NextRequest) {
  try {
    const { message, threadId, userId, attachments = [] } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await runGoalAgent(
      message,
      threadId || "legianos-thread",
      userId || "legianos-user",
      attachments as ImageAttachment[]
    )

    return NextResponse.json({
      reply: response.text,
      goalProfile: response.goalProfile,
      exportContent: response.exportContent,
      nextSteps: response.nextSteps
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process goal request" }, { status: 500 })
  }
}
