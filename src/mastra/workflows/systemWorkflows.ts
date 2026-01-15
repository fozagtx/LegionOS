import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { identityClarifierTool } from '../tools/identityClarifierTool'
import { weeklyPlannerTool } from '../tools/weeklyPlannerTool'
import { consistencyTrackerTool } from '../tools/consistencyTrackerTool'

const kickoffInput = z.object({
  history: z.string().optional(),
  currentGoal: z.string(),
  frustrations: z.array(z.string()).optional(),
  aspirations: z.array(z.string()).optional()
})

const kickoffStep = createStep({
  id: 'kickoff-clarity',
  description: 'Clarify identity and anchor for the 90-day goal.',
  inputSchema: kickoffInput,
  outputSchema: identityClarifierTool.outputSchema,
  execute: ({ inputData }) => identityClarifierTool.execute({ context: inputData })
})

export const kickoffWorkflow = createWorkflow({
  id: 'kickoff-workflow',
  inputSchema: kickoffInput,
  outputSchema: identityClarifierTool.outputSchema
}).then(kickoffStep)

const weeklyPlannerInput = z.object({
  goal: z.string(),
  why: z.string(),
  tasks: z.array(z.string()),
  capacity: z.number().min(1).max(20).default(5)
})

const weeklyPlannerStep = createStep({
  id: 'weekly-plan',
  description: 'Filter the weekly task list to must-dos.',
  inputSchema: weeklyPlannerInput,
  outputSchema: weeklyPlannerTool.outputSchema,
  execute: ({ inputData }) => weeklyPlannerTool.execute({ context: inputData })
})

export const weeklyPlanningWorkflow = createWorkflow({
  id: 'weekly-planning-workflow',
  inputSchema: weeklyPlannerInput,
  outputSchema: weeklyPlannerTool.outputSchema
}).then(weeklyPlannerStep)

const dailyTrackInput = z.object({
  day: z.string(),
  status: z.enum(['done', 'skipped', 'rest']),
  blockers: z.string().optional(),
  rest: z.string().optional(),
  streak: z.number().default(0)
})

const dailyTrackStep = createStep({
  id: 'daily-track',
  description: 'Log execution and update streak.',
  inputSchema: dailyTrackInput,
  outputSchema: consistencyTrackerTool.outputSchema,
  execute: ({ inputData }) => consistencyTrackerTool.execute({ context: inputData })
})

export const dailyExecutionWorkflow = createWorkflow({
  id: 'daily-execution-workflow',
  inputSchema: dailyTrackInput,
  outputSchema: consistencyTrackerTool.outputSchema
}).then(dailyTrackStep)
