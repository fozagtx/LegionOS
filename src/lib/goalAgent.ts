"use server"

import { mastra } from "../mastra"
import { CoreMessage } from "@mastra/core"
import { Goal, GoalProfile, ExportFormat, goalSchema } from "./goalTypes"
import { ImageAttachment } from "./attachments"

// Main function to interact with LegianOS goal agent
export async function runGoalAgent(
  prompt: string,
  threadId: string,
  userId: string,
  attachments: ImageAttachment[] = []
): Promise<{
  text: string
  goalProfile?: Goal
  exportContent?: string
  nextSteps?: string[]
  confidence?: number
  needsMoreInfo?: boolean
}> {
  // Validate API key is set
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set. Please configure your API key.")
  }

  try {
    const agent = mastra.getAgent("legianosAgent")

    if (!agent) {
      throw new Error("LegianOS agent not found. Please check Mastra configuration.")
    }

    // Use the goal workflow for structured goal creation
    const workflow = mastra.getWorkflow("goal-workflow")
    const attachmentNote = attachments.length > 0
      ? `\n\n[Attached images: ${attachments.map(att => att.name || att.mimeType).join(', ')}]`
      : ''
    const promptWithAttachments = `${prompt}${attachmentNote}`

    // Try workflow first; fall back to direct generation on failure
    let workflowError: Error | null = null
    if (workflow) {
      try {
        const workflowResult = await workflow.execute({
          userMessage: promptWithAttachments,
          userId,
          preferences: {
            defaultExportFormat: ExportFormat.MARKDOWN,
            autoGenerate: true,
            includeTemplates: true
          }
        })

        return {
          text: workflowResult.conversationalResponse,
          goalProfile: workflowResult.goalProfile,
          exportContent: workflowResult.exportedContent,
          nextSteps: workflowResult.nextSteps,
          confidence: workflowResult.confidence,
          needsMoreInfo: workflowResult.needsMoreInfo
        }
      } catch (err) {
        workflowError = err instanceof Error ? err : new Error(String(err))
        console.error("Workflow execution failed, falling back to agent.generate:", workflowError.message)
      }
    }

    // Fallback to direct agent interaction
    try {
      const content = attachments.length > 0
        ? [
            { type: "text", text: prompt },
            ...attachments.map((img) => ({
              type: "image",
              mimeType: img.mimeType,
              image: img.data
            }))
          ]
        : undefined

      const result = await agent.generate(content ? [
        {
          role: "user",
          content
        }
      ] : prompt, {
        memory: {
          thread: threadId,
          resource: userId
        }
      })

      if (result.error) {
        throw new Error(result.error.toString())
      }

      return {
        text: result.text,
        confidence: 0.5,
        needsMoreInfo: true
      }
    } catch (agentError) {
      const agentErrorMsg = agentError instanceof Error ? agentError.message : String(agentError)
      console.error("Agent generate failed:", agentErrorMsg)

      // If both workflow and agent failed, combine the error messages
      if (workflowError) {
        throw new Error(`Workflow failed: ${workflowError.message}. Agent fallback also failed: ${agentErrorMsg}`)
      }
      throw new Error(agentErrorMsg)
    }
  } catch (error) {
    console.error("Goal agent error:", error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    throw new Error(errorMsg)
  }
}

// Function to export goals in various formats
export async function exportGoals(
  goals: Goal[],
  format: ExportFormat,
  options: {
    includeProgress?: boolean
    includeMilestones?: boolean
    includeReflections?: boolean
    userContext?: {
      name?: string
      timezone?: string
    }
    customization?: {
      title?: string
      subtitle?: string
      theme?: 'default' | 'minimal' | 'detailed'
    }
  } = {}
): Promise<{
  content: string
  filename: string
  mimeType: string
  size: number
}> {
  try {
    const agent = mastra.getAgent("legianosAgent")

    // Use the export tool through agent
    const result = await agent.generate(`Export ${goals.length} goals in ${format} format`, {
      tools: {
        goalExportTool: true
      },
      structuredOutput: {
        schema: {
          type: "object",
          properties: {
            content: { type: "string" },
            filename: { type: "string" },
            mimeType: { type: "string" },
            size: { type: "number" }
          }
        }
      }
    })

    // Fallback to simple export if tool execution fails
    const timestamp = new Date().toISOString().split('T')[0]
    let content: string
    let filename: string
    let mimeType: string

    switch (format) {
      case ExportFormat.JSON:
        const goalProfile: GoalProfile = {
          userContext: options.userContext,
          goals,
          insights: [],
          recommendations: [],
          generatedAt: new Date().toISOString(),
          version: '1.0'
        }
        content = JSON.stringify(goalProfile, null, 2)
        filename = `legianos-goals-${timestamp}.json`
        mimeType = 'application/json'
        break

      case ExportFormat.MARKDOWN:
        content = generateMarkdownExport(goals, options)
        filename = `legianos-goals-${timestamp}.md`
        mimeType = 'text/markdown'
        break

      case ExportFormat.CSV:
        content = generateCSVExport(goals)
        filename = `legianos-goals-${timestamp}.csv`
        mimeType = 'text/csv'
        break

      case ExportFormat.PDF:
        content = generateHTMLExport(goals, options)
        filename = `legianos-goals-${timestamp}.html`
        mimeType = 'text/html'
        break

      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    return {
      content,
      filename,
      mimeType,
      size: Buffer.byteLength(content, 'utf8')
    }
  } catch (error) {
    console.error("Export error:", error)
    throw new Error(`Failed to export goals: ${error}`)
  }
}

// Function to get conversation history for goal context
export async function getGoalConversationHistory(
  threadId: string,
  userId: string
): Promise<CoreMessage[]> {
  try {
    const agent = mastra.getAgent("legianosAgent")
    const memories = await agent.fetchMemory({
      resourceId: userId,
      threadId: threadId
    })
    return memories.messages
  } catch (error) {
    console.error("Failed to fetch goal conversation history:", error)
    return []
  }
}

// Function to update goal progress
export async function updateGoalProgress(
  goalId: string,
  userId: string,
  updates: {
    currentValue?: number
    milestoneUpdates?: {
      id: string
      status?: string
      progress?: number
      notes?: string
    }[]
    reflection?: string
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const agent = mastra.getAgent("legianosAgent")

    // Generate a progress update prompt
    const prompt = `Update progress for goal ${goalId}:
    ${updates.currentValue !== undefined ? `Current value: ${updates.currentValue}` : ''}
    ${updates.milestoneUpdates ? `Milestone updates: ${JSON.stringify(updates.milestoneUpdates)}` : ''}
    ${updates.reflection ? `Reflection: ${updates.reflection}` : ''}

    Please acknowledge this progress update and provide encouragement.`

    const result = await agent.generate(prompt, {
      memory: {
        thread: `goal_${goalId}`,
        resource: userId
      }
    })

    if (result.error) {
      throw new Error(result.error.toString())
    }

    return {
      success: true,
      message: result.text
    }
  } catch (error) {
    console.error("Failed to update goal progress:", error)
    return {
      success: false,
      message: `Failed to update progress: ${error}`
    }
  }
}

// Function to get goal recommendations
export async function getGoalRecommendations(
  goals: Goal[],
  userId: string
): Promise<{
  insights: string[]
  recommendations: string[]
  riskAssessment: string[]
}> {
  try {
    const agent = mastra.getAgent("legianosAgent")

    const prompt = `Analyze the following goals and provide insights, recommendations, and risk assessment:

    Goals: ${JSON.stringify(goals, null, 2)}

    Please provide:
    1. Key insights about goal patterns and progress
    2. Specific recommendations for improvement
    3. Risk assessment for goal achievement

    Format as JSON with insights, recommendations, and riskAssessment arrays.`

    const result = await agent.generate(prompt, {
      structuredOutput: {
        schema: {
          type: "object",
          properties: {
            insights: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            riskAssessment: { type: "array", items: { type: "string" } }
          }
        }
      }
    })

    if (result.error) {
      throw new Error(result.error.toString())
    }

    try {
      const parsed = JSON.parse(result.text)
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        riskAssessment: parsed.riskAssessment || []
      }
    } catch (parseError) {
      // Fallback to basic recommendations
      return {
        insights: [`You have ${goals.length} goals in progress`],
        recommendations: ['Continue working consistently toward your goals'],
        riskAssessment: ['Monitor progress regularly to stay on track']
      }
    }
  } catch (error) {
    console.error("Failed to get goal recommendations:", error)
    return {
      insights: [],
      recommendations: [],
      riskAssessment: []
    }
  }
}

// Helper function to generate Markdown export
function generateMarkdownExport(goals: Goal[], options: any): string {
  const { userContext, customization } = options
  const title = customization?.title || `${userContext?.name ? userContext.name + "'s " : ""}Goal Profile`

  let content = `# ${title}\n\n`
  content += `*Generated by LegianOS Goal Management System*\n\n`
  content += `**Date:** ${new Date().toLocaleDateString()}\n`
  content += `**Goals Count:** ${goals.length}\n\n`
  content += `---\n\n`

  goals.forEach((goal, index) => {
    content += `## ${index + 1}. ${goal.title}\n\n`
    if (goal.description) {
      content += `${goal.description}\n\n`
    }
    content += `**Type:** ${goal.type} | **Priority:** ${goal.priority} | **Status:** ${goal.status}\n\n`

    if (goal.motivation) {
      content += `**💫 Motivation:** ${goal.motivation}\n\n`
    }

    if (goal.milestones.length > 0) {
      content += `**🎯 Milestones:**\n`
      goal.milestones.forEach(milestone => {
        const icon = milestone.status === 'completed' ? '✅' : milestone.status === 'in_progress' ? '🔄' : '⭕'
        content += `- ${icon} ${milestone.title}\n`
      })
      content += `\n`
    }

    if (goal.tags && goal.tags.length > 0) {
      content += `**Tags:** ${goal.tags.join(', ')}\n\n`
    }

    content += `---\n\n`
  })

  return content
}

// Helper function to generate CSV export
function generateCSVExport(goals: Goal[]): string {
  const headers = ['Title', 'Type', 'Priority', 'Status', 'Start Date', 'End Date', 'Motivation', 'Tags']
  let content = headers.join(',') + '\n'

  goals.forEach(goal => {
    const row = [
      `"${goal.title.replace(/"/g, '""')}"`,
      goal.type,
      goal.priority,
      goal.status,
      new Date(goal.startDate).toLocaleDateString(),
      goal.endDate ? new Date(goal.endDate).toLocaleDateString() : '',
      `"${(goal.motivation || '').replace(/"/g, '""')}"`,
      `"${(goal.tags || []).join('; ')}"`
    ]
    content += row.join(',') + '\n'
  })

  return content
}

// Helper function to generate HTML export
function generateHTMLExport(goals: Goal[], options: any): string {
  const { userContext, customization } = options
  const title = customization?.title || `${userContext?.name ? userContext.name + "'s " : ""}Goal Profile`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #134611; max-width: 800px; margin: 0 auto; padding: 20px; background: #fafef5; }
        .header { border-bottom: 3px solid #3da35d; margin-bottom: 30px; padding-bottom: 20px; }
        .goal { margin-bottom: 30px; padding: 20px; background: white; border-left: 4px solid #96e072; border-radius: 8px; }
        .goal h2 { color: #134611; margin-top: 0; }
        .metadata { color: #3e8914; font-size: 0.9em; }
        .tags { margin-top: 10px; }
        .tag { display: inline-block; background: #e8fccf; color: #134611; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Generated by LegianOS Goal Management System on ${new Date().toLocaleDateString()}</p>
    </div>

    ${goals.map(goal => `
    <div class="goal">
        <h2>${goal.title}</h2>
        ${goal.description ? `<p>${goal.description}</p>` : ''}
        <div class="metadata">
            <strong>Type:</strong> ${goal.type} |
            <strong>Priority:</strong> ${goal.priority} |
            <strong>Status:</strong> ${goal.status}
        </div>
        ${goal.motivation ? `<p><strong>💫 Motivation:</strong> ${goal.motivation}</p>` : ''}
        ${goal.tags && goal.tags.length > 0 ? `
        <div class="tags">
            ${goal.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ` : ''}
    </div>
    `).join('')}

    <div style="text-align: center; margin-top: 40px; color: #3e8914;">
        <p>Powered by LegianOS Goal Management System 🌟</p>
    </div>
</body>
</html>
`
}
