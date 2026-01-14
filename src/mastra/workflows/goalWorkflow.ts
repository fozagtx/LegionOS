import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { goalCreationTool } from '../tools/goalCreationTool'
import { goalExportTool } from '../tools/goalExportTool'
import { GoalType, Priority, ExportFormat } from '../../lib/goalTypes'

// Schema for the workflow input
const goalWorkflowInputSchema = z.object({
  userMessage: z.string().describe('User input about their goal aspiration'),
  conversationContext: z.array(z.string()).optional().describe('Previous conversation messages for context'),
  userId: z.string().describe('User identifier for personalization'),
  preferences: z.object({
    defaultExportFormat: z.nativeEnum(ExportFormat).default(ExportFormat.MARKDOWN),
    autoGenerate: z.boolean().default(true).describe('Automatically generate goal profile'),
    includeTemplates: z.boolean().default(true).describe('Suggest goal templates when applicable')
  }).optional()
})

// Schema for the workflow output
const goalWorkflowOutputSchema = z.object({
  conversationalResponse: z.string().describe('Natural language response for the user'),
  goalProfile: z.any().optional().describe('Generated goal structure if complete'),
  exportedContent: z.string().optional().describe('Exported goal profile if ready'),
  nextSteps: z.array(z.string()).describe('Recommended next actions for the user'),
  confidence: z.number().min(0).max(1).describe('Confidence in goal completeness'),
  needsMoreInfo: z.boolean().describe('Whether more information is needed from user'),
  suggestedQuestions: z.array(z.string()).optional().describe('Questions to ask for more details'),
  insights: z.array(z.string()).optional().describe('AI-generated insights about the goal')
})

// Step 1: Analyze user input and conversation context
const analyzeUserInput = createStep({
  id: 'analyze-user-input',
  description: 'Analyze user input to understand their goal aspirations and extract context',
  inputSchema: goalWorkflowInputSchema,
  outputSchema: z.object({
    intent: z.enum(['goal_creation', 'goal_refinement', 'progress_update', 'general_inquiry']),
    extractedInfo: z.object({
      goalType: z.nativeEnum(GoalType).optional(),
      timeframe: z.string().optional(),
      priority: z.nativeEnum(Priority).optional(),
      specificTarget: z.string().optional(),
      motivation: z.string().optional(),
      obstacles: z.array(z.string()).default([]),
      context: z.record(z.any()).optional()
    }),
    confidence: z.number().min(0).max(1),
    needsMoreInfo: z.boolean(),
    missingElements: z.array(z.string())
  }),
  execute: async ({ inputData }) => {
    const { userMessage, conversationContext } = inputData

    // Simple intent classification based on keywords
    let intent: 'goal_creation' | 'goal_refinement' | 'progress_update' | 'general_inquiry' = 'general_inquiry'

    const goalCreationKeywords = ['goal', 'want to', 'achieve', 'weekly', 'monthly', 'habit', 'learn', 'improve']
    const refinementKeywords = ['adjust', 'modify', 'change', 'update']
    const progressKeywords = ['progress', 'completed', 'finished', 'done']

    const lowerMessage = userMessage.toLowerCase()

    if (goalCreationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'goal_creation'
    } else if (refinementKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'goal_refinement'
    } else if (progressKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'progress_update'
    }

    // Extract information from user message
    let extractedInfo: any = {
      obstacles: []
    }

    // Extract goal type
    if (lowerMessage.includes('weekly')) extractedInfo.goalType = GoalType.WEEKLY
    else if (lowerMessage.includes('monthly')) extractedInfo.goalType = GoalType.MONTHLY
    else if (lowerMessage.includes('yearly') || lowerMessage.includes('year')) extractedInfo.goalType = GoalType.YEARLY
    else if (lowerMessage.includes('habit') || lowerMessage.includes('daily')) extractedInfo.goalType = GoalType.HABIT
    else if (lowerMessage.includes('fitness') || lowerMessage.includes('exercise')) extractedInfo.goalType = GoalType.FITNESS
    else if (lowerMessage.includes('learn') || lowerMessage.includes('study')) extractedInfo.goalType = GoalType.LEARNING
    else if (lowerMessage.includes('money') || lowerMessage.includes('save') || lowerMessage.includes('financial')) extractedInfo.goalType = GoalType.FINANCIAL
    else if (lowerMessage.includes('career') || lowerMessage.includes('job')) extractedInfo.goalType = GoalType.CAREER

    // Extract timeframe
    if (lowerMessage.includes('week')) extractedInfo.timeframe = 'weekly'
    else if (lowerMessage.includes('month')) extractedInfo.timeframe = 'monthly'
    else if (lowerMessage.includes('quarter')) extractedInfo.timeframe = 'quarterly'
    else if (lowerMessage.includes('year')) extractedInfo.timeframe = 'yearly'

    // Extract priority indicators
    if (lowerMessage.includes('urgent') || lowerMessage.includes('critical') || lowerMessage.includes('asap')) {
      extractedInfo.priority = Priority.CRITICAL
    } else if (lowerMessage.includes('important') || lowerMessage.includes('high')) {
      extractedInfo.priority = Priority.HIGH
    } else if (lowerMessage.includes('low priority') || lowerMessage.includes('eventually')) {
      extractedInfo.priority = Priority.LOW
    }

    // Extract motivation indicators
    const motivationIndicators = ['because', 'want to', 'need to', 'hope to', 'desire to']
    for (const indicator of motivationIndicators) {
      if (lowerMessage.includes(indicator)) {
        const parts = lowerMessage.split(indicator)
        if (parts.length > 1) {
          extractedInfo.motivation = parts[1].trim()
          break
        }
      }
    }

    // Calculate confidence based on extracted information
    let confidence = 0.2 // Base confidence
    if (extractedInfo.goalType) confidence += 0.2
    if (extractedInfo.timeframe) confidence += 0.2
    if (extractedInfo.motivation) confidence += 0.2
    if (extractedInfo.priority) confidence += 0.1
    if (userMessage.length > 50) confidence += 0.1 // More detailed messages

    // Determine missing elements
    const missingElements: string[] = []
    if (!extractedInfo.goalType) missingElements.push('goal_type')
    if (!extractedInfo.timeframe) missingElements.push('timeframe')
    if (!extractedInfo.motivation) missingElements.push('motivation')
    if (!extractedInfo.priority) missingElements.push('priority')

    const needsMoreInfo = confidence < 0.7 || missingElements.length > 2

    return {
      intent,
      extractedInfo,
      confidence,
      needsMoreInfo,
      missingElements
    }
  }
})

// Step 2: Generate intelligent questions to gather missing information
const generateQuestions = createStep({
  id: 'generate-questions',
  description: 'Generate contextual questions to gather missing goal information',
  inputSchema: z.object({
    userMessage: z.string(),
    analysis: z.any(),
    conversationContext: z.array(z.string()).optional()
  }),
  outputSchema: z.object({
    questions: z.array(z.string()),
    questionPriority: z.array(z.enum(['high', 'medium', 'low'])),
    conversationalResponse: z.string()
  }),
  execute: async ({ inputData }) => {
    const { userMessage, analysis } = inputData
    const { extractedInfo, missingElements, confidence } = analysis

    const questions: string[] = []
    const questionPriority: ('high' | 'medium' | 'low')[] = []

    // Generate questions based on missing elements
    if (missingElements.includes('goal_type')) {
      questions.push("What area of your life is this goal focused on? (fitness, learning, career, personal habits, etc.)")
      questionPriority.push('high')
    }

    if (missingElements.includes('timeframe')) {
      questions.push("What timeframe are you thinking about for this goal? (weekly, monthly, quarterly, yearly)")
      questionPriority.push('high')
    }

    if (missingElements.includes('motivation')) {
      questions.push("What's driving this goal for you? What would achieving it mean to you?")
      questionPriority.push('high')
    }

    if (!extractedInfo.specificTarget) {
      questions.push("How will you know when you've succeeded? What specific outcome are you aiming for?")
      questionPriority.push('medium')
    }

    if (missingElements.includes('priority')) {
      questions.push("How important is this goal compared to other things in your life right now?")
      questionPriority.push('medium')
    }

    // Add follow-up questions based on goal type
    if (extractedInfo.goalType === GoalType.FITNESS) {
      questions.push("What's your current activity level, and what would you like it to be?")
      questionPriority.push('medium')
    } else if (extractedInfo.goalType === GoalType.LEARNING) {
      questions.push("What's your current knowledge level in this area, and how do you prefer to learn?")
      questionPriority.push('medium')
    } else if (extractedInfo.goalType === GoalType.HABIT) {
      questions.push("What time of day or situation would work best for building this habit?")
      questionPriority.push('medium')
    }

    // Generate conversational response
    let conversationalResponse = ""

    if (confidence > 0.5) {
      conversationalResponse = `I can see you're interested in ${extractedInfo.goalType ? `a ${extractedInfo.goalType}` : 'setting a'} goal${extractedInfo.timeframe ? ` with a ${extractedInfo.timeframe} focus` : ''}. That's great! `
    } else {
      conversationalResponse = `I'd love to help you create a meaningful goal! `
    }

    if (questions.length > 0) {
      const primaryQuestion = questions.find((_, index) => questionPriority[index] === 'high') || questions[0]
      conversationalResponse += `To make sure we create something that really works for you, ${primaryQuestion.toLowerCase()}`
    } else {
      conversationalResponse += `It sounds like you have a clear vision. Let me help you structure this into an actionable goal profile.`
    }

    return {
      questions,
      questionPriority,
      conversationalResponse
    }
  }
})

// Step 3: Create goal profile if we have enough information
const createGoalProfile = createStep({
  id: 'create-goal-profile',
  description: 'Create structured goal profile using the goal creation tool',
  inputSchema: z.object({
    userMessage: z.string(),
    analysis: z.any(),
    questions: z.any().optional(),
    shouldCreate: z.boolean()
  }),
  outputSchema: z.object({
    goalCreated: z.boolean(),
    goalProfile: z.any().optional(),
    creationResult: z.any().optional(),
    conversationalResponse: z.string()
  }),
  execute: async ({ inputData, mastra }) => {
    const { userMessage, analysis, shouldCreate } = inputData

    if (!shouldCreate) {
      return {
        goalCreated: false,
        conversationalResponse: "I need a bit more information before we can create your goal profile."
      }
    }

    const { extractedInfo } = analysis

    // Prepare goal creation context
    const now = new Date().toISOString()
    const startDate = now

    // Estimate end date based on goal type and timeframe
    let endDate: string | undefined
    if (extractedInfo.timeframe === 'weekly') {
      endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    } else if (extractedInfo.timeframe === 'monthly') {
      endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } else if (extractedInfo.timeframe === 'quarterly') {
      endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    } else if (extractedInfo.timeframe === 'yearly') {
      endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }

    try {
      // Use the goal creation tool
      const creationContext = {
        title: userMessage.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage,
        description: userMessage,
        type: extractedInfo.goalType || GoalType.PERSONAL,
        priority: extractedInfo.priority || Priority.MEDIUM,
        timeframe: {
          startDate,
          endDate,
          duration: extractedInfo.timeframe
        },
        motivation: {
          why: extractedInfo.motivation || "Personal growth and achievement",
          values: []
        },
        milestones: []
      }

      // Create goal using the tool (simulated since we can't actually call tools in workflow execution)
      const goalProfile = {
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: creationContext.title,
        description: creationContext.description,
        type: creationContext.type,
        status: 'draft',
        priority: creationContext.priority,
        startDate: creationContext.timeframe.startDate,
        endDate: creationContext.timeframe.endDate,
        motivation: creationContext.motivation.why,
        milestones: [],
        tags: [creationContext.type.toLowerCase()],
        obstacles: [],
        resources: [],
        createdAt: now,
        updatedAt: now
      }

      const conversationalResponse = `Perfect! I've created a goal profile for you. Your ${extractedInfo.goalType || 'personal'} goal "${creationContext.title}" is structured and ready to guide your journey${endDate ? ` over the next ${extractedInfo.timeframe}` : ''}. You can review it, make adjustments, and download it when you're ready!`

      return {
        goalCreated: true,
        goalProfile,
        creationResult: {
          confidence: 0.8,
          recommendations: [],
          nextSteps: ['Review your goal profile', 'Set up progress tracking', 'Identify your first action step'],
          estimatedDifficulty: 'moderate',
          successProbability: 0.7
        },
        conversationalResponse
      }
    } catch (error) {
      return {
        goalCreated: false,
        conversationalResponse: `I encountered an issue creating your goal profile. Let's try again with more specific details about what you want to achieve.`
      }
    }
  }
})

// Step 4: Export goal profile if requested or ready
const exportGoalProfile = createStep({
  id: 'export-goal-profile',
  description: 'Export the goal profile in the requested format',
  inputSchema: z.object({
    goalProfile: z.any().optional(),
    exportFormat: z.nativeEnum(ExportFormat).default(ExportFormat.MARKDOWN),
    shouldExport: z.boolean(),
    userId: z.string()
  }),
  outputSchema: z.object({
    exported: z.boolean(),
    exportResult: z.any().optional(),
    downloadInfo: z.object({
      filename: z.string(),
      content: z.string(),
      mimeType: z.string()
    }).optional()
  }),
  execute: async ({ inputData }) => {
    const { goalProfile, exportFormat, shouldExport, userId } = inputData

    if (!shouldExport || !goalProfile) {
      return {
        exported: false
      }
    }

    try {
      // Simulate export (in real implementation, would use goalExportTool)
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `legianos-goal-${timestamp}.md`

      const content = `# ${goalProfile.title}

**Type:** ${goalProfile.type}
**Priority:** ${goalProfile.priority}
**Status:** ${goalProfile.status}

## Description
${goalProfile.description}

## Motivation
${goalProfile.motivation}

## Timeline
- **Start:** ${new Date(goalProfile.startDate).toLocaleDateString()}
${goalProfile.endDate ? `- **Target:** ${new Date(goalProfile.endDate).toLocaleDateString()}` : ''}

## Tags
${goalProfile.tags.map((tag: string) => `- ${tag}`).join('\n')}

---

*Generated by LegianOS Goal Management System*
`

      return {
        exported: true,
        exportResult: {
          success: true,
          format: exportFormat
        },
        downloadInfo: {
          filename,
          content,
          mimeType: 'text/markdown'
        }
      }
    } catch (error) {
      return {
        exported: false
      }
    }
  }
})

// Main workflow definition
const goalWorkflow = createWorkflow({
  id: 'goal-workflow',
  inputSchema: goalWorkflowInputSchema,
  outputSchema: goalWorkflowOutputSchema
})
  .then(analyzeUserInput)
  .then(async (context) => {
    // Conditional branching based on analysis
    const analysisResult = context.stepResults['analyze-user-input']

    if (analysisResult.needsMoreInfo) {
      // Generate questions if we need more info
      return generateQuestions.execute({
        inputData: {
          userMessage: context.inputData.userMessage,
          analysis: analysisResult,
          conversationContext: context.inputData.conversationContext
        }
      })
    } else {
      // Skip to goal creation if we have enough info
      return {
        questions: [],
        questionPriority: [],
        conversationalResponse: "I have enough information to create your goal profile."
      }
    }
  })
  .then(async (context) => {
    // Decide whether to create goal profile
    const analysisResult = context.stepResults['analyze-user-input']
    const questionsResult = context.stepResults[1] // Previous step result

    const shouldCreate = analysisResult.confidence > 0.6 && !analysisResult.needsMoreInfo

    return createGoalProfile.execute({
      inputData: {
        userMessage: context.inputData.userMessage,
        analysis: analysisResult,
        questions: questionsResult,
        shouldCreate
      },
      mastra: context.mastra
    })
  })
  .then(async (context) => {
    // Export if goal was created
    const creationResult = context.stepResults[2] // Previous step result
    const preferences = context.inputData.preferences || { defaultExportFormat: ExportFormat.MARKDOWN }

    return exportGoalProfile.execute({
      inputData: {
        goalProfile: creationResult.goalProfile,
        exportFormat: preferences.defaultExportFormat,
        shouldExport: creationResult.goalCreated && preferences.autoGenerate,
        userId: context.inputData.userId
      }
    })
  })
  .then(async (context) => {
    // Synthesize final response
    const analysisResult = context.stepResults['analyze-user-input']
    const questionsResult = context.stepResults[1]
    const creationResult = context.stepResults[2]
    const exportResult = context.stepResults[3]

    let conversationalResponse = ""
    let nextSteps: string[] = []
    let needsMoreInfo = false
    let suggestedQuestions: string[] = []

    if (creationResult.goalCreated) {
      conversationalResponse = creationResult.conversationalResponse
      nextSteps = creationResult.creationResult?.nextSteps || ['Review your goal', 'Take your first action step']

      if (exportResult.exported) {
        conversationalResponse += " Your goal profile is ready for download!"
        nextSteps.unshift("Download your goal profile")
      }
    } else {
      conversationalResponse = questionsResult.conversationalResponse
      needsMoreInfo = true
      suggestedQuestions = questionsResult.questions.slice(0, 2) // Limit to top 2 questions
      nextSteps = ['Answer the questions above', 'Provide more details about your goal']
    }

    return {
      conversationalResponse,
      goalProfile: creationResult.goalProfile,
      exportedContent: exportResult.downloadInfo?.content,
      nextSteps,
      confidence: analysisResult.confidence,
      needsMoreInfo,
      suggestedQuestions: needsMoreInfo ? suggestedQuestions : undefined,
      insights: [
        `Your goal appears to be ${analysisResult.extractedInfo.goalType || 'general'} focused`,
        `Confidence level: ${Math.round(analysisResult.confidence * 100)}%`
      ]
    }
  })

// Commit the workflow
goalWorkflow.commit()

export { goalWorkflow }
