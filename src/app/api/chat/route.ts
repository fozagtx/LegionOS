import { NextRequest, NextResponse } from "next/server"
import { runGoalAgent } from "@/lib/goalAgent"
import { ImageAttachment } from "@/lib/attachments"

// Handle GET requests with informative response
export async function GET() {
  return NextResponse.json(
    {
      error: "Method not allowed",
      message: "This endpoint only accepts POST requests",
      usage: "POST /api/chat with { message: string, threadId?: string, userId?: string }"
    },
    { status: 405 }
  )
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

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
