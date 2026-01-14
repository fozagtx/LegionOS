import { z } from 'zod'

// Core Goal Types
export enum GoalType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  HABIT = 'habit',
  PROJECT = 'project',
  LEARNING = 'learning',
  FITNESS = 'fitness',
  FINANCIAL = 'financial',
  CAREER = 'career',
  PERSONAL = 'personal',
  CREATIVE = 'creative'
}

export enum GoalStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

// Zod Schemas for Validation
export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Milestone title is required'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.nativeEnum(MilestoneStatus).default(MilestoneStatus.NOT_STARTED),
  progress: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  completedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Goal title is required'),
  description: z.string().optional(),
  type: z.nativeEnum(GoalType),
  status: z.nativeEnum(GoalStatus).default(GoalStatus.DRAFT),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().default(0),
  unit: z.string().optional(), // e.g., "kg", "hours", "dollars"
  milestones: z.array(milestoneSchema).default([]),
  tags: z.array(z.string()).default([]),
  reflection: z.string().optional(),
  motivation: z.string().optional(),
  obstacles: z.array(z.string()).default([]),
  resources: z.array(z.string()).default([]),
  accountability: z.string().optional(), // Who will help hold you accountable
  reward: z.string().optional(), // Reward for completion
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const goalProfileSchema = z.object({
  userContext: z.object({
    name: z.string().optional(),
    timezone: z.string().optional(),
    preferences: z.record(z.any()).optional()
  }).optional(),
  goals: z.array(goalSchema),
  insights: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  generatedAt: z.string().datetime(),
  version: z.string().default('1.0')
})

// TypeScript Types (inferred from Zod schemas)
export type Milestone = z.infer<typeof milestoneSchema>
export type Goal = z.infer<typeof goalSchema>
export type GoalProfile = z.infer<typeof goalProfileSchema>

// Goal Creation Context (for AI agent)
export interface GoalCreationContext {
  userInput: string
  conversationHistory: string[]
  extractedContext: {
    timeframe?: string
    category?: GoalType
    priority?: Priority
    specificTarget?: string
    motivation?: string
    constraints?: string[]
  }
  questionsAsked: string[]
  completeness: number // 0-1 scale
}

// AI Agent Response Types
export interface AgentQuestion {
  id: string
  question: string
  context: string
  expectedAnswerType: 'text' | 'number' | 'date' | 'choice' | 'multiple_choice'
  choices?: string[]
  required: boolean
  category: 'basic' | 'motivation' | 'strategy' | 'metrics' | 'obstacles'
}

export interface GoalDiscoverySession {
  sessionId: string
  userId: string
  startedAt: string
  currentStep: 'discovery' | 'refinement' | 'planning' | 'finalization' | 'complete'
  context: GoalCreationContext
  currentGoal: Partial<Goal>
  nextQuestions: AgentQuestion[]
  confidence: number // 0-1 scale of how complete the goal is
  estimatedTimeRemaining: number // minutes
}

// Export Formats
export enum ExportFormat {
  JSON = 'json',
  PDF = 'pdf',
  MARKDOWN = 'markdown',
  CSV = 'csv'
}

export interface ExportRequest {
  goalId: string
  format: ExportFormat
  includeProgress: boolean
  includeMilestones: boolean
  includeReflections: boolean
  template?: string
}

// Progress Tracking
export interface ProgressUpdate {
  goalId: string
  currentValue: number
  milestoneUpdates?: {
    id: string
    status: MilestoneStatus
    progress: number
    notes?: string
  }[]
  reflection?: string
  timestamp: string
}

// Goal Recommendation Engine Types
export interface GoalRecommendation {
  type: 'milestone' | 'adjustment' | 'resource' | 'motivation'
  title: string
  description: string
  priority: Priority
  reasoning: string
  actionable: boolean
}

export interface GoalInsight {
  type: 'progress' | 'risk' | 'opportunity' | 'pattern'
  title: string
  description: string
  confidence: number
  data?: Record<string, any>
}

// Template System
export interface GoalTemplate {
  id: string
  name: string
  description: string
  type: GoalType
  category: string
  template: Partial<Goal>
  questionnaire: AgentQuestion[]
  popularity: number
  tags: string[]
}

// Common Goal Templates
export const commonGoalTemplates: GoalTemplate[] = [
  {
    id: 'weekly_exercise',
    name: 'Weekly Exercise Routine',
    description: 'Establish a consistent weekly exercise routine',
    type: GoalType.WEEKLY,
    category: 'fitness',
    template: {
      title: 'Exercise 3 times per week',
      type: GoalType.WEEKLY,
      priority: Priority.MEDIUM,
      targetValue: 3,
      unit: 'sessions',
      milestones: []
    },
    questionnaire: [],
    popularity: 85,
    tags: ['fitness', 'health', 'routine']
  },
  {
    id: 'monthly_reading',
    name: 'Monthly Reading Goal',
    description: 'Read a specific number of books each month',
    type: GoalType.MONTHLY,
    category: 'learning',
    template: {
      title: 'Read books monthly',
      type: GoalType.MONTHLY,
      priority: Priority.MEDIUM,
      unit: 'books'
    },
    questionnaire: [],
    popularity: 72,
    tags: ['reading', 'learning', 'personal development']
  },
  {
    id: 'habit_tracker',
    name: 'Daily Habit Formation',
    description: 'Build a new daily habit',
    type: GoalType.HABIT,
    category: 'personal',
    template: {
      title: 'Daily habit',
      type: GoalType.HABIT,
      priority: Priority.HIGH,
      targetValue: 21,
      unit: 'days'
    },
    questionnaire: [],
    popularity: 91,
    tags: ['habits', 'daily', 'routine', 'self-improvement']
  }
]

// Utility Functions
export function createGoalId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createMilestoneId(): string {
  return `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function calculateGoalProgress(goal: Goal): number {
  if (goal.targetValue && goal.currentValue !== undefined) {
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100)
  }

  if (goal.milestones.length > 0) {
    const completedMilestones = goal.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length
    return (completedMilestones / goal.milestones.length) * 100
  }

  return 0
}

export function getGoalStatusColor(status: GoalStatus): string {
  switch (status) {
    case GoalStatus.ACTIVE:
      return 'light-green'
    case GoalStatus.COMPLETED:
      return 'india-green'
    case GoalStatus.PAUSED:
      return 'medium-jungle'
    case GoalStatus.CANCELLED:
      return 'black-forest'
    case GoalStatus.DRAFT:
    default:
      return 'frosted-mint'
  }
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case Priority.CRITICAL:
      return 'red-500'
    case Priority.HIGH:
      return 'india-green-600'
    case Priority.MEDIUM:
      return 'medium-jungle-500'
    case Priority.LOW:
      return 'frosted-mint-400'
    default:
      return 'gray-400'
  }
}

export function formatGoalDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'}`
  } else if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months === 1 ? '' : 's'}`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years === 1 ? '' : 's'}`
  }
}