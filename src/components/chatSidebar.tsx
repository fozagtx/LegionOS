"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Bot, ChevronLeft, ChevronRight, Download, MessageSquare, Settings, Sparkles, Target, ListChecks, Rocket, RotateCcw, Home } from "lucide-react"
import clsx from "clsx"

type SidebarItem = {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  active?: boolean
  hint?: string
  onClick?: () => void
}

interface ChatSidebarProps {
  sessionId: string
  goalsCount: number
  onResetSession: () => void
}

export function ChatSidebar({ sessionId, goalsCount, onResetSession }: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const primaryNav: SidebarItem[] = useMemo(
    () => [
      { label: "New session", href: "/chat", icon: MessageSquare, active: true, hint: "Conversations and goal prompts" },
      { label: "Goals", href: "#goals", icon: Target, badge: goalsCount > 0 ? String(goalsCount) : undefined, hint: "Latest tracked goals" },
      { label: "Milestones", href: "#milestones", icon: ListChecks, hint: "Track the steps that unlock each goal" },
      { label: "Exports", href: "#exports", icon: Download, hint: "Download goal profiles" }
    ],
    [goalsCount]
  )

  const secondaryNav: SidebarItem[] = [
    { label: "Clear Session", icon: RotateCcw, onClick: onResetSession, hint: "Reset the current chat session" },
    { label: "Back to Landing", href: "/", icon: Home, hint: "Return to the landing page" }
  ]

  return (
    <aside
      className={clsx(
        "hidden md:flex self-start flex-col border border-white/50 bg-white/80 backdrop-blur-md transition-[width] duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-3xl shrink-0",
        "ml-4",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ position: "sticky", top: "50%", transform: "translateY(-50%)" }}
      data-collapsed={collapsed}
    >
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="flex items-center gap-2 flex-1">
          <img
            src="/logoi.png"
            alt="LegianOS"
            className="h-10 w-10 rounded-2xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-white"
          />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-xs text-[#6b7280]">LegianOS</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(prev => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-xl border border-[#e3e5ef] bg-white p-2 text-[#4b5563] hover:text-[#111827] hover:border-[#d6d9e6] transition shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
        <SidebarSection title="Navigation" collapsed={collapsed}>
          {primaryNav.map(item => (
            <SidebarButton key={item.label} item={item} collapsed={collapsed} />
          ))}
        </SidebarSection>

        {secondaryNav.length > 0 && (
          <SidebarSection title="Actions" collapsed={collapsed}>
            {secondaryNav.map(item => (
              <SidebarButton key={item.label} item={item} collapsed={collapsed} />
            ))}
          </SidebarSection>
        )}
      </nav>
    </aside>
  )
}

function SidebarSection({ title, collapsed, children }: { title: string; collapsed: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {!collapsed && <p className="px-3 text-[11px] uppercase tracking-[0.08em] text-[#9ca3af]">{title}</p>}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function SidebarButton({ item, collapsed }: { item: SidebarItem; collapsed: boolean }) {
  const Icon = item.icon
  const content = (
    <div
      className={clsx(
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        "border border-[#e5e7eb] bg-white hover:bg-[#f7f8fb]",
        item.active ? "shadow-sm text-[#111827]" : "text-[#4b5563]"
      )}
      title={item.hint || item.label}
    >
      <Icon className={clsx("h-4 w-4 shrink-0", item.active ? "text-[#111827]" : "text-[#6b7280]")} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#111827] border border-[#e5e7eb]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </div>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    )
  }

  if (item.onClick) {
    return (
      <button onClick={item.onClick} className="block w-full text-left">
        {content}
      </button>
    )
  }

  return content
}
