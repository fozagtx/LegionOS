"use client"

import { AgentAvatar } from "@/components/agentAvatar"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen text-[#0f172a] flex flex-col relative overflow-hidden bg-[#f5f7ff]">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/background%20(1).jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f5f7ff",
          backgroundBlendMode: "lighten"
        }}
      />

      <header className="sticky top-4 z-40 flex justify-center px-4">
        <div className="max-w-5xl w-full rounded-full border border-[#e3e5ef] bg-white/92 backdrop-blur shadow-[0_16px_30px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <img
              src="/logoi.png"
              alt="LegianOS logo"
              className="h-12 w-12 rounded-2xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.12)] bg-white"
            />
            <div>
              <div className="text-lg font-semibold leading-tight">LegianOS</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#2D1DFF] text-white shadow-[0_12px_24px_rgba(45,29,255,0.3)] hover:-translate-y-[1px] transition border border-[#2D1DFF]"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[#0f172a]">
            MAKE 2026 YOUR BEST YEAR EVER
          </h1>
          <p className="text-gray-700 text-lg max-w-3xl">
            With the exact systems used to sell profitable agencies, grow accounts on X, and scale multiple businesses.
          </p>
          <img
            src="/letter-hero.png"
            alt="How to make 2026 your best year ever"
            className="w-full max-w-3xl rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.12)] border border-[#e3e5ef] bg-white"
          />
        </section>

        <section id="features" className="border-t border-b border-[#e3e5ef]/60">
          <div className="max-w-4xl mx-auto px-6 py-12 space-y-4 text-[#0f172a]">
            <p className="text-lg font-semibold">Dear builder,</p>
            <p className="text-base text-gray-700">
              You’re not lazy. You’re juggling too many plates without a system that compounds. LegianOS was built to remove that overwhelm—turning every ambition into a sequence of milestones, deadlines, and exports you can share with partners, clients, or investors.
            </p>
            <p className="text-base text-gray-700">
              Worried you’ll lose momentum? We keep a running thread of your goals, send nudges when milestones slip, and translate progress into crisp summaries you can drop into X threads, investor updates, or team standups.
            </p>
            <p className="text-base text-gray-700">
              Think you’ve “tried this before”? This time you’re backed by an agent that drafts the plan, tracks the metrics, and ships export-ready artifacts in seconds. No more half-finished docs or buried notes—just a living record of action, proof, and progress.
            </p>
            <p className="text-base text-gray-700 font-semibold">
              If you missed your 2025 targets, let’s make 2026 the year you ship, sell, and scale—on purpose.
            </p>
          </div>
        </section>

        <section id="workflows" className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-600">Workflows</p>
            <h2 className="text-3xl font-semibold text-[#0f172a]">Goal lifecycle, end-to-end.</h2>
            <p className="text-gray-700">
              Intake → Milestones → Progress updates → Exports. LegianOS keeps the thread alive and visualizes tool activity along the way.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e3e5ef] bg-white/85 p-5 space-y-3 shadow-[0_18px_36px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between border border-[#e3e5ef] rounded-xl px-3 py-2 bg-white">
              <span>Goal Intake</span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-100">Completed</span>
            </div>
            <div className="flex items-center justify-between border border-[#e3e5ef] rounded-xl px-3 py-2 bg-white">
              <span>Milestone Builder</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-100">In Progress</span>
            </div>
            <div className="flex items-center justify-between border border-[#e3e5ef] rounded-xl px-3 py-2 bg-white">
              <span>Export Engine</span>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-100">Instant</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-[#e3e5ef] mt-6">
        <div
          className="absolute inset-0 -z-10 opacity-80"
          style={{
            backgroundImage: "url('/footer-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-700 space-y-2">
          <p className="font-semibold tracking-wide text-[#0f172a]">LegianOS • Goal Achievement System</p>
          <p className="text-xs text-gray-500">Plan with clarity, execute with momentum, export with confidence.</p>
        </div>
      </footer>
    </div>
  )
}
