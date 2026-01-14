import { Mastra } from '@mastra/core/mastra'
import { legianosAgent } from './agents/legianosAgent'
import { goalWorkflow } from './workflows/goalWorkflow'

export const mastra = new Mastra({
    agents: {
        "legianosAgent": legianosAgent
    },
    workflows: {
        "goal-workflow": goalWorkflow
    }
})
