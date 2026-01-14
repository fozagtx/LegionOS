"use client"

import { AgentAvatar } from "@/components/agentAvatar"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-[#0f0f0f]/95 via-[#0f0f0f]/90 to-[#0f0f0f]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AgentAvatar agentType="legianos" size="sm" className="w-12 h-12 border-none shadow-[0_8px_20px_rgba(0,0,0,0.35)]" />
            <div>
              <div className="text-lg font-semibold leading-tight">LegianOS</div>
              <p className="text-xs text-gray-400">Goal achievement copilot</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a className="hover:text-white transition-colors" href="#features">Features</a>
            <a className="hover:text-white transition-colors" href="#workflows">Workflows</a>
            <a className="hover:text-white transition-colors" href="#cta">Get Started</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden md:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border border-white/15 text-white hover:bg-white/5 transition"
            >
              Learn more
            </a>
            <Link
              href="/chat"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:-translate-y-[1px] transition"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div className="space-y-6">
            <p className="uppercase tracking-[0.2em] text-xs text-gray-400">LegianOS • Goal Command</p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Transform scattered goals into a guided mission.
            </h1>
            <p className="text-gray-300 text-lg">
              LegianOS analyzes your intentions, builds actionable milestones, tracks progress, and keeps you accountable with clear exports.
            </p>
            <div className="flex flex-wrap gap-3" id="cta">
              <Link
                href="/chat"
                className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold bg-white text-black shadow-[0_14px_35px_rgba(0,0,0,0.35)] hover:-translate-y-[1px] transition"
              >
                Start a Session
              </Link>
              <a
                href="#features"
                className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold border border-white/15 text-white hover:bg-white/5 transition"
              >
                View Capabilities
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-gray-400 mb-1">Templates</p>
                <p className="font-semibold text-lg">Fitness, Career, Learning</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-gray-400 mb-1">Exports</p>
                <p className="font-semibold text-lg">Markdown / JSON / PDF</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 mb-4">
              <AgentAvatar agentType="legianos" size="md" className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.35)]" />
              <div>
                <p className="text-sm text-gray-300">LegianOS Agent</p>
                <p className="text-lg font-semibold">Artifact Preview</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-200">
              <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
                <span>Goal Creation</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-300">Completed</span>
              </div>
              <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
                <span>Milestone Planning</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300">Ready</span>
              </div>
              <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
                <span>Export Profile</span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300">Instant</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#111111] border-t border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            {[
              { title: "Goal Creation", copy: "Turn vague ideas into structured goal profiles with milestones, tags, and accountability." },
              { title: "Progress & Milestones", copy: "Track milestones, completion states, and risks with clear status indicators." },
              { title: "Exports", copy: "Download artifacts in Markdown, JSON, or HTML for sharing and record keeping." }
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflows" className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Workflows</p>
            <h2 className="text-3xl font-semibold">Goal lifecycle, end-to-end.</h2>
            <p className="text-gray-300">
              Intake → Milestones → Progress updates → Exports. LegianOS keeps the thread alive and visualizes tool activity along the way.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3 shadow-[0_14px_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
              <span>Goal Intake</span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-300">Completed</span>
            </div>
            <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
              <span>Milestone Builder</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300">In Progress</span>
            </div>
            <div className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 bg-white/5">
              <span>Export Engine</span>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300">Instant</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-400">
        LegianOS • Goal Achievement System
      </footer>
    </div>
  )
}
