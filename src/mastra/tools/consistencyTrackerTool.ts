import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const consistencyTrackerTool = createTool({
  id: 'consistency-tracker',
  description: 'Logs daily execution/rest and returns streak plus micro-adjustments.',
  inputSchema: z.object({
    day: z.string().describe('ISO date of the entry'),
    status: z.enum(['done', 'skipped', 'rest']).describe('Execution status for the day'),
    blockers: z.string().optional().describe('What got in the way, if anything'),
    rest: z.string().optional().describe('Rest or recovery note'),
    streak: z.number().default(0).describe('Current streak prior to this entry')
  }),
  outputSchema: z.object({
    streak: z.number().describe('Updated streak count'),
    note: z.string().describe('Short feedback or encouragement'),
    adjustment: z.string().describe('Micro-adjustment for tomorrow')
  }),
  execute: async ({ context }) => {
    const { status, blockers, rest } = context
    let streak = context.streak || 0
    let note = ''
    let adjustment = ''

    if (status === 'done') {
      streak += 1
      note = `Logged a win. Streak: ${streak}.`
      adjustment = blockers ? `Solve blocker: ${blockers}` : 'Repeat the same action tomorrow.'
    } else if (status === 'rest') {
      note = 'Rest logged. Recovery is fuel.'
      adjustment = rest ? `Protect this rest pattern: ${rest}` : 'Keep rest intentional tomorrow.'
    } else {
      streak = 0
      note = 'Skipped today. Reset streak and restart tomorrow.'
      adjustment = blockers ? `Remove blocker: ${blockers}` : 'Schedule the single must-do first thing.'
    }

    return { streak, note, adjustment }
  }
})
