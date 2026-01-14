"use server"

import { mastra } from "../mastra"
import { Goal } from "./goalTypes"
import { ImageAttachment } from "./attachments"

// Main function to interact with LegianOS agent
export async function runGoalAgent(
  prompt: string,
  threadId: string,
  userId: string,
  attachments: ImageAttachment[] = []
): Promise<{
  text: string
  goalProfile?: Goal
}> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
  }

  try {
    const agent = mastra.getAgent("legianosAgent")

    if (!agent) {
      throw new Error("Agent not found")
    }

    const result = await agent.generate(prompt)

    return {
      text: result.text || "I received your message.",
    }
  } catch (error) {
    console.error("Agent error:", error)
    throw error
  }
}
