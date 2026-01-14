"use client"

import { getConversationHistory, runAgent } from "@/lib/agent"
import { runGoalAgent, exportGoals } from "@/lib/goalAgent"
import { Avatar } from "@heroui/avatar"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { Divider } from "@heroui/divider"
import { Badge } from "@heroui/badge"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GoalProfileDisplay from "@/components/goalProfileDisplay"
import { Goal, ExportFormat } from "@/lib/goalTypes"
import ClaudeChatInput from "@/components/ui/claude-style-chat-input"

type ROLE = "AGENT" | "USER"

const USER_ID = "machina_user"
const THREAD_ID = "main_conversation"

interface AttachedFile {
    id: string;
    file: File;
    type: string;
    preview: string | null;
    uploadStatus: string;
    content?: string;
}

export default function Home() {
    const [error, setError] = useState<string | null>(null)
    const [messages, setMessages] = useState<[ROLE, string][]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [goals, setGoals] = useState<Goal[]>([])
    const [isGoalProfileExpanded, setIsGoalProfileExpanded] = useState(false)
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)

    useEffect(() => {
        const fetchExistingMemory = async () => {
            try {
                const coreMessages = await getConversationHistory(THREAD_ID, USER_ID)
                let converted: [ROLE, string][] = []

                for (const core of coreMessages) {
                    if (core.role === "assistant" || core.role === "user") {
                        converted.push([core.role === "assistant" ? "AGENT" : "USER", core.content.toString()])
                    }
                }

                if (converted.length > 0) {
                    setMessages(converted)
                    setShowWelcomeMessage(false)
                }
            } catch (error) {
                console.error("Failed to fetch conversation history:", error)
            }
        }

        fetchExistingMemory()
    }, [])

    const handleSendMessage = async (data: {
        message: string;
        files: AttachedFile[];
        pastedContent: AttachedFile[];
        model: string;
        isThinkingEnabled: boolean;
    }) => {
        if (!data.message.trim() && data.files.length === 0 && data.pastedContent.length === 0) return

        const prompt = data.message.trim() || "Analyzing uploaded content..."
        setIsLoading(true)
        setError(null)
        setShowWelcomeMessage(false)

        const newMessages: [ROLE, string][] = [...messages, ["USER", prompt]]
        setMessages(newMessages)

        try {
            // Include file and content context in the prompt
            let fullPrompt = prompt
            if (data.files.length > 0) {
                fullPrompt += `\n\nFiles attached: ${data.files.map(f => f.file.name).join(', ')}`
            }
            if (data.pastedContent.length > 0) {
                fullPrompt += `\n\nPasted content: ${data.pastedContent.map(c => c.content).join('\n\n')}`
            }

            // Determine if this is a goal-related query
            const isGoalQuery = /\b(goal|achieve|want to|weekly|monthly|habit|improve|plan)\b/i.test(fullPrompt)

            if (isGoalQuery) {
                // Use the goal agent for goal-related queries
                const response = await runGoalAgent(fullPrompt, THREAD_ID, USER_ID)

                setMessages([...newMessages, ["AGENT", response.text]])

                // Add goal to profile if created
                if (response.goalProfile) {
                    setGoals(prevGoals => {
                        const updatedGoals = [...prevGoals, response.goalProfile!]
                        if (!isGoalProfileExpanded) {
                            setIsGoalProfileExpanded(true)
                        }
                        return updatedGoals
                    })
                }
            } else {
                // Use general agent for other queries
                const response = await runAgent(fullPrompt, THREAD_ID, USER_ID)
                setMessages([...newMessages, ["AGENT", response]])
            }
        } catch (e) {
            console.error("Agent error:", e)
            setError(`Failed to get response: ${e}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleExportGoals = async (format: ExportFormat) => {
        try {
            const result = await exportGoals(goals, format, {
                includeProgress: true,
                includeMilestones: true,
                userContext: {
                    name: "Goal Achiever"
                }
            })

            // Create download
            const blob = new Blob([result.content], { type: result.mimeType })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = result.filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Export failed:", error)
            setError("Failed to export goals")
        }
    }

    const handleDeleteGoal = (goalId: string) => {
        setGoals(prevGoals => prevGoals.filter(g => g.id !== goalId))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black-forest-100 via-black-forest-200 to-medium-jungle-100">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                    {/* Main Chat Interface */}
                    <div className="lg:col-span-2 flex flex-col h-[calc(100vh-3rem)]">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-medium-jungle-500 to-india-green-500 rounded-xl p-6 mb-6 text-white shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">🎯 Machina</h1>
                                    <p className="text-light-green-200">Your AI-powered goal achievement partner</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant="flat" className="bg-white/20 text-white">
                                        {goals.length} Goals
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>

                        {/* Chat Container */}
                        <Card className="flex-1 bg-frosted-mint-900 border-medium-jungle-200 shadow-xl flex flex-col">
                            <CardBody className="flex flex-col h-full p-0">

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <AnimatePresence>
                                        {showWelcomeMessage && messages.length === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="text-center py-12"
                                            >
                                                <div className="text-6xl mb-4">🌟</div>
                                                <h2 className="text-xl font-semibold text-medium-jungle-600 mb-3">
                                                    Welcome to Machina!
                                                </h2>
                                                <p className="text-medium-jungle-500 mb-6 max-w-md mx-auto">
                                                    I'm here to help you set meaningful goals, create actionable plans, and achieve what matters most to you.
                                                </p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {[
                                                        "I want to build a weekly exercise routine",
                                                        "Help me learn Spanish this year",
                                                        "I need to improve my productivity habits"
                                                    ].map((suggestion, index) => (
                                                        <Button
                                                            key={index}
                                                            size="sm"
                                                            variant="flat"
                                                            className="bg-light-green-100 text-light-green-700 hover:bg-light-green-200"
                                                            onPress={() => handleSendMessage({
                                                                message: suggestion,
                                                                files: [],
                                                                pastedContent: [],
                                                                model: "sonnet-4.5",
                                                                isThinkingEnabled: false
                                                            })}
                                                        >
                                                            {suggestion}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {messages.map(([role, message], index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-4 ${role === "USER" ? "flex-row-reverse" : ""}`}
                                            >
                                                <Avatar
                                                    name={role === "AGENT" ? "M" : "U"}
                                                    className={`flex-shrink-0 ${
                                                        role === "AGENT"
                                                            ? "bg-gradient-to-br from-medium-jungle-500 to-india-green-500 text-white"
                                                            : "bg-gradient-to-br from-light-green-500 to-frosted-mint-400 text-medium-jungle-700"
                                                    }`}
                                                />
                                                <div
                                                    className={`max-w-[80%] p-4 rounded-2xl ${
                                                        role === "USER"
                                                            ? "bg-light-green-100 text-light-green-800 border border-light-green-200"
                                                            : "bg-white text-medium-jungle-700 border border-medium-jungle-200 shadow-sm"
                                                    }`}
                                                >
                                                    <div className="prose prose-sm max-w-none">
                                                        {message.split('\n').map((line, lineIndex) => (
                                                            <p key={lineIndex} className="mb-2 last:mb-0">
                                                                {line || '\u00A0'}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex gap-4"
                                            >
                                                <Avatar
                                                    name="M"
                                                    className="bg-gradient-to-br from-medium-jungle-500 to-india-green-500 text-white"
                                                />
                                                <div className="bg-white text-medium-jungle-700 border border-medium-jungle-200 shadow-sm p-4 rounded-2xl">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex space-x-1">
                                                            <div className="w-2 h-2 bg-medium-jungle-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                            <div className="w-2 h-2 bg-medium-jungle-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                            <div className="w-2 h-2 bg-medium-jungle-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        </div>
                                                        <span className="text-sm text-medium-jungle-500">Thinking...</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Claude-style Input Area */}
                                <div className="p-6">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Loading overlay for Claude input */}
                                    <div className={`transition-all duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <ClaudeChatInput onSendMessage={handleSendMessage} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Goal Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <GoalProfileDisplay
                                goals={goals}
                                isExpanded={isGoalProfileExpanded}
                                onToggleExpand={() => setIsGoalProfileExpanded(!isGoalProfileExpanded)}
                                onExport={handleExportGoals}
                                onDelete={handleDeleteGoal}
                                className="max-h-[calc(100vh-3rem)] overflow-y-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
