import { Mastra } from '@mastra/core/mastra'
import { PinoLogger } from '@mastra/loggers'
import { LibSQLStore } from '@mastra/libsql'
import { goalWorkflow } from './workflows/goalWorkflow'
import { generalAgent } from './agents/generalAgent'

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is not set. LegianOS agent will not be able to process requests.')
}

export const mastra = new Mastra({
    workflows: {
        "goal-workflow": goalWorkflow
    },
    agents: {
        "generalAgent": generalAgent
    },
    storage: new LibSQLStore({
        // stores observability, scores, and goal data - persistent storage for goal management
        url: "file:../mastra_storage.db",
    }),
    logger: new PinoLogger({
        name: 'LegianOS',
        level: 'info',
    }),
    telemetry: {
        // Telemetry is deprecated and will be removed in the Nov 4th release
        enabled: false,
    },
    observability: {
        // Enables DefaultExporter and CloudExporter for AI tracing
        default: { enabled: false },
    },
})
