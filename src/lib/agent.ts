"use server"

import { mastra } from "../mastra"
import Speaker from "@mastra/node-speaker"
import { getMicrophoneStream } from "@mastra/node-audio"
import { CoreMessage } from "@mastra/core"
import { memo } from "react"

export async function runAgent(prompt: string, threadId: string, userId: string): Promise<string> {
    const agent = mastra.getAgent("generalAgent")

    // The .network() method enables multi-agent collaboration and routing
    // HOWEVER, I found that generate gives the same results, ie: use those tools, agents and workflows defined within the agent
    // const result1 = await agent.network(prompt)
    // for await (const chunk of result1) {
    //     console.log(chunk.type)
    //     if (chunk.type === "network-execution-event-step-finish") {
    //         console.log(chunk.payload.result)
    //     }
    // }

    const result = await agent.generate(prompt, {
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



export async function speak(prompt: string): Promise<void | NodeJS.ReadableStream> {
    const agent = mastra.getAgent("generalAgent")
    const audioStream: void | NodeJS.ReadableStream = await agent.voice.speak(prompt)
    return audioStream
}


export async function transcribe(audio: NodeJS.ReadableStream): Promise<string | void | NodeJS.ReadableStream> {
    const agent = mastra.getAgent("generalAgent")
    const transcription = await agent.voice.listen(audio)
    return transcription
}


export async function runAgentVoice(audio: NodeJS.ReadableStream | Int16Array): Promise<string> {
    const agent = mastra.getAgent("generalAgent")
    await agent.voice.connect()
    // Set up event listeners for responses
    let finalText = ""
    const speaker = new Speaker({
        sampleRate: 24100, // Audio sample rate in Hz - standard for high-quality audio on MacBook Pro
        channels: 1, // Mono audio output (as opposed to stereo which would be 2)
        bitDepth: 16, // Bit depth for audio quality - CD quality standard (16-bit resolution)
    })

    agent.voice.on("writing", ({ text, role }) => {
        console.log(`${role}: ${text}`)
        if (role === "assistant") {
            finalText += text
        }
    })

    agent.voice.on("speaker", (stream) => {
        stream.pipe(speaker)
    })
    // The send() method streams audio data in real-time to voice providers for continuous processing.
    await agent.voice.send(audio)
    // Trigger the AI to respond
    await agent.voice.answer()
    agent.voice.close()

    return finalText
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
