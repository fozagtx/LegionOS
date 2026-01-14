import { Mastra } from '@mastra/core/mastra'
import { PinoLogger } from '@mastra/loggers'
import { LibSQLStore } from '@mastra/libsql'
import { goalWorkflow } from './workflows/goalWorkflow'
import { generalAgent } from './agents/generalAgent'
import { legianosAgent } from './agents/legianosAgent'

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is not set. LegianOS agent will not be able to process requests.')
}

// Use in-memory storage for serverless environments (Vercel)
// For persistent storage, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
const storageUrl = process.env.TURSO_DATABASE_URL || ':memory:'

export const mastra = new Mastra({
    workflows: {
        "goal-workflow": goalWorkflow
    },
    agents: {
        "generalAgent": generalAgent,
        "legianosAgent": legianosAgent
    },
    storage: new LibSQLStore({
        url: storageUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
    }),
    logger: new PinoLogger({
        name: 'LegianOS',
        level: 'info',
    }),
})
