"use client"

import React from "react"
import { cn } from "@/lib/utils"

type ToolState = "input-streaming" | "input-available" | "output-streaming" | "output-available" | "output-error"

export interface ToolPart {
  type: string
  state: ToolState
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  errorText?: string
}

interface ToolProps extends React.HTMLAttributes<HTMLDivElement> {
  toolPart: ToolPart
}

const stateLabels: Record<ToolState, string> = {
  "input-streaming": "Streaming input",
  "input-available": "Input ready",
  "output-streaming": "Streaming output",
  "output-available": "Output ready",
  "output-error": "Error"
}

const stateStyles: Record<ToolState, { bg: string; text: string; border: string }> = {
  "input-streaming": { bg: "rgba(255,255,255,0.04)", text: "#e4e4e7", border: "rgba(255,255,255,0.08)" },
  "input-available": { bg: "rgba(255,255,255,0.04)", text: "#e4e4e7", border: "rgba(255,255,255,0.08)" },
  "output-streaming": { bg: "rgba(255,255,255,0.04)", text: "#e4e4e7", border: "rgba(255,255,255,0.08)" },
  "output-available": { bg: "rgba(255,255,255,0.08)", text: "#ffffff", border: "rgba(255,255,255,0.14)" },
  "output-error": { bg: "rgba(244,63,94,0.08)", text: "#fda4af", border: "rgba(248,113,113,0.4)" }
}

const stateDot: Record<ToolState, string> = {
  "input-streaming": "#a1a1aa",
  "input-available": "#a1a1aa",
  "output-streaming": "#60a5fa",
  "output-available": "#22c55e",
  "output-error": "#f87171"
}

const prettyJson = (data?: Record<string, unknown>) => {
  if (!data || Object.keys(data).length === 0) return null
  return JSON.stringify(data, null, 2)
}

export const Tool = React.forwardRef<HTMLDivElement, ToolProps>(
  ({ className, toolPart, ...props }, ref) => {
    const { type, state, input, output, errorText } = toolPart
    const jsonInput = prettyJson(input)
    const jsonOutput = prettyJson(output)
    const styles = stateStyles[state]

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border p-4 bg-[#141414] text-white shadow-[0_15px_45px_rgba(0,0,0,0.35)]",
          className
        )}
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
        {...props}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: stateDot[state] }}
            />
            <div className="text-sm font-medium uppercase tracking-wide text-[#d4d4d8]">
              {type}
            </div>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full border"
            style={{
              backgroundColor: styles.bg,
              color: styles.text,
              borderColor: styles.border
            }}
          >
            {stateLabels[state]}
          </span>
        </div>

        {jsonInput && (
          <div className="mb-3">
            <div className="text-xs uppercase tracking-wide text-[#a1a1aa] mb-1">Input</div>
            <pre className="text-xs bg-[#1e1e1e] text-[#e4e4e7] rounded-xl p-3 border border-[rgba(255,255,255,0.05)] overflow-auto">
              {jsonInput}
            </pre>
          </div>
        )}

        {state === "output-error" && errorText && (
          <div
            className="text-sm rounded-xl p-3 border"
            style={{
              backgroundColor: "rgba(244,63,94,0.12)",
              borderColor: "rgba(248,113,113,0.35)",
              color: "#fecdd3"
            }}
          >
            {errorText}
          </div>
        )}

        {jsonOutput && state !== "output-error" && (
          <div>
            <div className="text-xs uppercase tracking-wide text-[#a1a1aa] mb-1">Output</div>
            <pre className="text-xs bg-[#1e1e1e] text-[#e4e4e7] rounded-xl p-3 border border-[rgba(255,255,255,0.05)] overflow-auto">
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>
    )
  }
)

Tool.displayName = "Tool"
