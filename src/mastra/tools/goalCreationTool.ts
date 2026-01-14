import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import {
  Goal,
  GoalType,
  GoalStatus,
  Priority,
  MilestoneStatus,
  goalSchema,
  createGoalId,
  createMilestoneId
} from '../../lib/goalTypes'

export const goalCreationTool = createTool({
  id: 'create-goal',
  description: 'Create a structured goal profile from conversation context and user input',
  inputSchema: z.object({
    title: z.string().describe('Clear, specific goal title'),
    description: z.string().optional().describe('Detailed description of what the user wants to achieve'),
    type: z.nativeEnum(GoalType).describe('Type/category of the goal'),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM).describe('Goal priority level'),
    timeframe: z.object({
      startDate: z.string().datetime().describe('When the user wants to start working on this goal'),
      endDate: z.string().datetime().optional().describe('Target completion date if specified'),
      duration: z.string().optional().describe('Human-readable duration like "3 months" or "21 days"')
    }).describe('Timeline information for the goal'),
    metrics: z.object({
      targetValue: z.number().optional().describe('Numeric target if applicable (e.g., 10 for "read 10 books")'),
      currentValue: z.number().default(0).describe('Starting point or current progress'),
      unit: z.string().optional().describe('Unit of measurement (e.g., "books", "pounds", "hours")')
    }).optional().describe('Measurable aspects of the goal'),
    motivation: z.object({
      why: z.string().describe('Why this goal is important to the user'),
      inspiration: z.string().optional().describe('What inspired this goal'),
      values: z.array(z.string()).default([]).describe('Personal values this goal supports')
    }).describe('Motivational context'),
    strategy: z.object({
      approach: z.string().optional().describe('How the user plans to achieve this goal'),
      frequency: z.string().optional().describe('How often they plan to work on it'),
      environment: z.string().optional().describe('Where or when they plan to work on this'),
      habits: z.array(z.string()).default([]).describe('Daily or weekly habits to support this goal')
    }).optional().describe('Strategic approach to achieving the goal'),
    milestones: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      dueDate: z.string().datetime().optional(),
      estimatedEffort: z.string().optional()
    })).default([]).describe('Key milestones or checkpoints'),
    support: z.object({
      accountability: z.string().optional().describe('Who will help keep them accountable'),
      resources: z.array(z.string()).default([]).describe('Resources, tools, or materials needed'),
      mentorship: z.string().optional().describe('Who could guide or mentor them'),
      community: z.string().optional().describe('Groups or communities that could provide support')
    }).optional().describe('Support system and resources'),
    obstacles: z.object({
      anticipated: z.array(z.string()).default([]).describe('Challenges the user expects to face'),
      mitigation: z.array(z.string()).default([]).describe('Strategies to overcome obstacles'),
      backup_plans: z.array(z.string()).default([]).describe('Alternative approaches if main plan fails')
    }).optional().describe('Obstacle planning'),
    rewards: z.object({
      milestoneRewards: z.array(z.string()).default([]).describe('Small rewards for reaching milestones'),
      completionReward: z.string().optional().describe('Special reward for completing the entire goal'),
      intrinsicMotivation: z.string().optional().describe('Internal satisfaction expected from achievement')
    }).optional().describe('Reward and recognition system')
  }),
  outputSchema: z.object({
    goal: goalSchema,
    confidence: z.number().min(0).max(1).describe('Confidence level in goal completeness (0-1)'),
    recommendations: z.array(z.string()).describe('Suggestions for improving or refining the goal'),
    nextSteps: z.array(z.string()).describe('Immediate action items to get started'),
    estimatedDifficulty: z.enum(['easy', 'moderate', 'challenging', 'very_challenging']).describe('Assessment of goal difficulty'),
    successProbability: z.number().min(0).max(1).describe('Estimated likelihood of success based on goal structure')
  }),
  execute: async ({ context }) => {
    const {
      title,
      description,
      type,
      priority,
      timeframe,
      metrics,
      motivation,
      strategy,
      milestones,
      support,
      obstacles,
      rewards
    } = context

    // Generate unique ID
    const goalId = createGoalId()

    // Create milestones with proper structure
    const structuredMilestones = milestones.map((milestone, index) => ({
      id: createMilestoneId(),
      title: milestone.title,
      description: milestone.description || '',
      dueDate: milestone.dueDate,
      status: MilestoneStatus.NOT_STARTED,
      progress: 0,
      notes: milestone.estimatedEffort ? `Estimated effort: ${milestone.estimatedEffort}` : undefined,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))

    // Build tags from various sources
    const tags = [
      type.toLowerCase(),
      ...(motivation?.values || []),
      ...(strategy?.habits || []).map(habit => `habit:${habit.toLowerCase().replace(/\s+/g, '-')}`),
      priority.toLowerCase()
    ].filter(Boolean)

    // Create the goal object
    const goal: Goal = {
      id: goalId,
      title,
      description: description || '',
      type,
      status: GoalStatus.DRAFT,
      priority,
      startDate: timeframe.startDate,
      endDate: timeframe.endDate,
      targetValue: metrics?.targetValue,
      currentValue: metrics?.currentValue || 0,
      unit: metrics?.unit,
      milestones: structuredMilestones,
      tags: [...new Set(tags)], // Remove duplicates
      reflection: undefined,
      motivation: motivation.why,
      obstacles: obstacles?.anticipated || [],
      resources: support?.resources || [],
      accountability: support?.accountability,
      reward: rewards?.completionReward,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Calculate confidence based on completeness
    let confidence = 0.3 // Base confidence for having title and motivation

    if (goal.description) confidence += 0.1
    if (timeframe.endDate) confidence += 0.1
    if (metrics?.targetValue) confidence += 0.15
    if (structuredMilestones.length > 0) confidence += 0.15
    if (support?.accountability) confidence += 0.1
    if (obstacles?.anticipated && obstacles.anticipated.length > 0) confidence += 0.1

    confidence = Math.min(1, confidence)

    // Generate recommendations
    const recommendations: string[] = []

    if (!goal.description) {
      recommendations.push("Consider adding more detail about what success looks like")
    }

    if (!timeframe.endDate && type !== GoalType.HABIT) {
      recommendations.push("Setting a target completion date would help with planning")
    }

    if (!metrics?.targetValue && ['fitness', 'learning', 'financial'].includes(type)) {
      recommendations.push("Adding a specific measurable target would make progress easier to track")
    }

    if (structuredMilestones.length === 0 && timeframe.endDate) {
      const endDate = new Date(timeframe.endDate)
      const startDate = new Date(timeframe.startDate)
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff > 30) {
        recommendations.push("Consider breaking this into smaller milestones to maintain motivation")
      }
    }

    if (!support?.accountability) {
      recommendations.push("Finding someone to help keep you accountable could increase your success rate")
    }

    if (!obstacles?.anticipated || obstacles.anticipated.length === 0) {
      recommendations.push("Think about potential challenges you might face and how to overcome them")
    }

    // Generate next steps
    const nextSteps: string[] = []

    if (structuredMilestones.length > 0) {
      nextSteps.push(`Start with: ${structuredMilestones[0].title}`)
    } else {
      nextSteps.push("Define your first concrete action step")
    }

    if (support?.resources && support.resources.length > 0) {
      nextSteps.push(`Gather resources: ${support.resources.slice(0, 2).join(', ')}`)
    }

    if (strategy?.environment) {
      nextSteps.push(`Set up your environment: ${strategy.environment}`)
    }

    nextSteps.push("Set a regular check-in schedule for progress review")

    // Estimate difficulty
    let difficultyScore = 0

    // Time-based difficulty
    if (timeframe.endDate) {
      const days = Math.ceil((new Date(timeframe.endDate).getTime() - new Date(timeframe.startDate).getTime()) / (1000 * 60 * 60 * 24))
      if (days > 365) difficultyScore += 2
      else if (days > 90) difficultyScore += 1
    }

    // Complexity-based difficulty
    if (structuredMilestones.length > 5) difficultyScore += 1
    if (obstacles?.anticipated && obstacles.anticipated.length > 3) difficultyScore += 1
    if (priority === Priority.CRITICAL) difficultyScore += 1
    if (!support?.accountability) difficultyScore += 1

    const estimatedDifficulty =
      difficultyScore <= 1 ? 'easy' :
      difficultyScore <= 3 ? 'moderate' :
      difficultyScore <= 5 ? 'challenging' : 'very_challenging'

    // Calculate success probability
    let successProbability = 0.5 // Base probability

    if (support?.accountability) successProbability += 0.2
    if (structuredMilestones.length > 0) successProbability += 0.15
    if (motivation.why && motivation.why.length > 20) successProbability += 0.1
    if (obstacles?.mitigation && obstacles.mitigation.length > 0) successProbability += 0.1
    if (strategy?.frequency) successProbability += 0.05

    // Reduce probability for very ambitious goals
    if (estimatedDifficulty === 'very_challenging') successProbability -= 0.2
    else if (estimatedDifficulty === 'challenging') successProbability -= 0.1

    successProbability = Math.max(0.1, Math.min(0.95, successProbability))

    return {
      goal,
      confidence,
      recommendations,
      nextSteps,
      estimatedDifficulty,
      successProbability
    }
  }
})