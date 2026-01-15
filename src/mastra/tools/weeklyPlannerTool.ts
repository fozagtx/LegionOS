import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const weeklyPlannerTool = createTool({
  id: 'weekly-planner',
  description: 'Filters a weekly task dump into a focused list tied to the 90-day goal.',
  inputSchema: z.object({
    goal: z.string().describe('Primary 90-day goal'),
    why: z.string().describe('One-sentence anchor/WHY'),
    tasks: z.array(z.string()).describe('Raw task dump for the upcoming week'),
    capacity: z.number().min(1).max(20).default(5).describe('Number of must-dos to keep')
  }),
  outputSchema: z.object({
    mustDos: z.array(z.string()).describe('Top tasks to execute this week'),
    niceToHaves: z.array(z.string()).describe('Tasks to defer unless capacity opens'),
    reminder: z.string().describe('One-line rule to avoid negotiation')
  }),
  execute: async ({ context }) => {
    const { tasks, capacity, goal } = context
    const trimmed = (tasks || []).filter(Boolean).slice(0, capacity || 5)
    const deferred = (tasks || []).filter(Boolean).slice(capacity || 5)
    const reminder = `Only ship tasks that advance "${goal}". No renegotiation midweek.`
    return { mustDos: trimmed, niceToHaves: deferred, reminder }
  }
})
