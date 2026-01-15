import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const identityClarifierTool = createTool({
  id: 'identity-clarifier',
  description: 'Extracts a clear WHY/identity anchor with one-question-at-a-time guidance.',
  inputSchema: z.object({
    history: z.string().optional().describe('Brief personal/professional history'),
    currentGoal: z.string().describe('Goal the user wants to pursue'),
    frustrations: z.array(z.string()).optional().describe('What went wrong previously'),
    aspirations: z.array(z.string()).optional().describe('Future identity or outcomes desired')
  }),
  outputSchema: z.object({
    anchor: z.string().describe('One-sentence WHY/identity statement'),
    nextQuestion: z.string().describe('Next question to deepen clarity'),
    summary: z.string().describe('Short synthesis of what drives the user')
  }),
  execute: async ({ context }) => {
    const { history, currentGoal, frustrations = [], aspirations = [] } = context
    const base = currentGoal || 'your next goal'
    const anchor = `I am becoming the person who ${base}, because it aligns with what matters most to me.`
    const nextQuestion = `When you imagine succeeding at ${base}, who else benefits and how?`
    const summary = [
      history ? `History: ${history}` : null,
      frustrations.length ? `Frustrations: ${frustrations.join('; ')}` : null,
      aspirations.length ? `Aspirations: ${aspirations.join('; ')}` : null
    ].filter(Boolean).join(' | ') || 'Clarifying identity and purpose.'

    return { anchor, nextQuestion, summary }
  }
})
