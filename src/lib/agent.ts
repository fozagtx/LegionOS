"use server"

import { mastra } from "../mastra"
import { CoreMessage } from "@mastra/core"
import { ImageAttachment } from "./attachments"

export async function runAgent(
    prompt: string,
    threadId: string,
    userId: string,
    options: { images?: ImageAttachment[] } = {}
): Promise<string> {
    const agent = mastra.getAgent("generalAgent")
    const images = options.images || []

    const content = images.length > 0
        ? [
            { type: "text", text: prompt },
            ...images.map((img) => ({
                type: "image",
                mimeType: img.mimeType,
                image: img.data
            }))
        ]
        : undefined

    // The .network() method enables multi-agent collaboration and routing
    // HOWEVER, I found that generate gives the same results, ie: use those tools, agents and workflows defined within the agent
    // const result1 = await agent.network(prompt)
    // for await (const chunk of result1) {
    //     console.log(chunk.type)
    //     if (chunk.type === "network-execution-event-step-finish") {
    //         console.log(chunk.payload.result)
    //     }
    // }

    const result = await agent.generate(content ? [
        {
            role: "user",
            content
        }
    ] : prompt, {
        // Even with memory configured, agents won’t store or recall information unless both thread and resource are provided.
        memory: {
            thread: threadId,
            resource: userId
        },
        // to use a specific tool
        // toolChoice: { type: 'tool', toolName: "toolname" }
        // structuredOutput: {
        //     schema: z.object({
        //         response: z.string(),
        //     })
        // },
    })
    // - multi-modal input
    // await agent.generate([
    //     { role: "user", content: "Help me organize my day" },
    //     {
    //         role: "user", content: [
    //             { type: "text", text: "string" },
    //             { type: "file", filename: "somefile.txt", mimeType: "text/plain", data: "a base64-encoded string, a Uint8Array, an ArrayBuffer, a Buffer, or a URL" },
    //             { type: "image", mimeType: "image/png", image: "a base64-encoded string, a Uint8Array, an ArrayBuffer, a Buffer, or a URL" },
    //         ]
    //     },
    // ])

    // - streaming
    // await agent.stream(...)

    if (result.error) {
        throw new Error(result.error.toString())
    }

    return result.text
}





// get full conversation history for a specific conversation
export async function getConversationHistory(threadId: string, userId: string): Promise<CoreMessage[]> {
    const agent = mastra.getAgent("generalAgent")
    const memories = await agent.fetchMemory({
        resourceId: userId,
        threadId: threadId
    })
    return memories.messages
}


// get all conversations available for a specific user
export async function getThreadIds(userId: string): Promise<string[]> {
    const agent = mastra.getAgent("generalAgent")
    const memory = await agent.getMemory()
    if (memory === undefined) {
        return []
    }
    const threads = await memory.getThreadsByResourceId({ resourceId: userId })
    const ids = threads.map((t) => t.id)
    return ids
}
