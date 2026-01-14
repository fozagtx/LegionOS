"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string
}

function renderMarkdown(markdown: string): string {
  let html = markdown

  // Code blocks ```
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
    const safeCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    return `<pre class="rounded-xl bg-[#0f0f0f] text-[#e4e4e7] p-4 border border-[rgba(255,255,255,0.06)] overflow-auto"><code class="language-${lang || "text"}">${safeCode}</code></pre>`
  })

  // Inline code `
  html = html.replace(/`([^`]+)`/g, (_m, code) => `<code class="px-1 rounded bg-[#1f1f1f] text-[#e4e4e7] border border-[rgba(255,255,255,0.08)]">${code}</code>`)

  // Headings
  html = html.replace(/^###### (.*)$/gm, "<h6>$1</h6>")
  html = html.replace(/^##### (.*)$/gm, "<h5>$1</h5>")
  html = html.replace(/^#### (.*)$/gm, "<h4>$1</h4>")
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>")
  html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>")
  html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>")

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer">$1</a>`)

  // Unordered lists
  html = html.replace(/(?:^|\n)(- .+(?:\n- .+)*)/g, (m) => {
    const items = m.trim().split("\n").map(line => `<li>${line.replace(/^- /, "")}</li>`).join("")
    return `<ul class="list-disc ml-5 space-y-1">${items}</ul>`
  })

  // Ordered lists
  html = html.replace(/(?:^|\n)(\d+\. .+(?:\n\d+\. .+)*)/g, (m) => {
    const items = m.trim().split("\n").map(line => `<li>${line.replace(/^\d+\. /, "")}</li>`).join("")
    return `<ol class="list-decimal ml-5 space-y-1">${items}</ol>`
  })

  // Paragraphs
  html = html.replace(/(?:^|\n)([^<\n].+)(?=\n|$)/g, "<p>$1</p>")

  return html
}

export const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  ({ children, className, ...props }, ref) => {
    const html = React.useMemo(() => renderMarkdown(children), [children])
    return (
      <div
        ref={ref}
        className={cn("prose dark:prose-invert max-w-none", className)}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    )
  }
)

Markdown.displayName = "Markdown"
