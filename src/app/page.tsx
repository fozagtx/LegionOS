"use client"

import { AgentAvatar } from "@/components/agentAvatar"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen text-[#0f172a] flex flex-col relative overflow-hidden bg-[#f5f7ff]">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#1f2937",
          backgroundBlendMode: "multiply"
        }}
      />

      <header className="sticky top-4 z-40 flex justify-center px-4">
        <div className="max-w-lg rounded-full border border-[#134611] bg-[#0f172a]/95 backdrop-blur shadow-[0_16px_30px_rgba(0,0,0,0.08)] h-12 px-4 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <img
              src="/logoi.png"
              alt="LegianOS logo"
              className="h-6 w-6 rounded-lg object-cover shadow-[0_8px_20px_rgba(0,0,0,0.12)] bg-white"
            />
            <div className="text-sm font-semibold leading-tight text-white">LegianOS</div>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white text-black shadow-lg hover:-translate-y-[1px] transition border border-gray-200"
          >
            Launch App
          </Link>
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

        {/* Bento Grid Comparison */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Left Side - Uncertain Character */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#134611] mb-3">Before LegianOS</h2>
                <p className="text-gray-600 text-lg">Scattered thoughts, endless loops, no clear direction</p>
              </div>

              <div className="grid grid-cols-2 gap-4 h-[600px]">
                {/* Chaotic sticky notes */}
                <div className="bg-gray-100/80 rounded-2xl p-4 transform -rotate-2 border border-gray-300 shadow-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Random Ideas</div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">Start a podcast maybe?</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">Learn Python... someday</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">Write a book???</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">Get fit (again)</div>
                  </div>
                </div>

                {/* Overwhelming todo list */}
                <div className="bg-gray-50 rounded-2xl p-4 transform rotate-1 border border-gray-200 shadow-lg overflow-hidden">
                  <div className="text-sm font-medium text-gray-700 mb-2">Endless TODOs</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Fix website</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Update resume</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Call clients</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Learn marketing</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Network more</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Read industry news</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Organize files</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 rounded-sm"></span> Plan Q1</div>
                    <div className="text-[10px] text-gray-400 mt-2">+47 more items...</div>
                  </div>
                </div>

                {/* Broken habits */}
                <div className="bg-gray-100 rounded-2xl p-4 transform -rotate-1 border border-gray-300 shadow-lg">
                  <div className="text-sm font-medium text-gray-600 mb-2">Broken Streaks</div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      <div className="font-medium">Gym: Day 3</div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-gray-400 h-1 rounded-full" style={{width: '12%'}}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div className="font-medium">Reading: Day 5</div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-gray-400 h-1 rounded-full" style={{width: '20%'}}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div className="font-medium">Coding: Day 2</div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-gray-400 h-1 rounded-full" style={{width: '8%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis paralysis */}
                <div className="bg-gray-50 rounded-2xl p-4 transform rotate-2 border border-gray-200 shadow-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Analysis Paralysis</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• Researched 47 productivity apps</div>
                    <div>• Read 23 goal-setting articles</div>
                    <div>• Watched 15 YouTube videos</div>
                    <div>• Still haven't started...</div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Clarity Character */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#134611] mb-3">After LegianOS</h2>
                <p className="text-gray-600 text-lg">Clear goals, structured progress, unstoppable momentum</p>
              </div>

              <div className="grid grid-cols-2 gap-4 h-[600px]">
                {/* Clear goal structure */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl">
                  <div className="text-sm font-bold text-[#134611] mb-3">Q1 2026 Goal</div>
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <div className="font-semibold text-[#134611] text-sm">Launch SaaS MVP</div>
                    <div className="text-xs text-[#3e8914] mt-1">Target: March 31, 2026</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-gray-700">Market research</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-gray-700">Technical architecture</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">Build core features</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-500">User testing</span>
                    </div>
                  </div>
                </div>

                {/* Progress tracking */}
                <div className="bg-white rounded-2xl p-4 border border-[#e3e5ef] shadow-xl">
                  <div className="text-sm font-bold text-[#134611] mb-3">This Week</div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-medium text-[#134611]">Development Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '73%'}}></div>
                      </div>
                      <div className="text-xs text-[#3e8914] mt-1">73% complete</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-medium text-[#134611]">User Interviews</div>
                      <div className="text-xs text-[#3e8914] mt-1">5 of 8 completed</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-medium text-[#134611]">Documentation</div>
                      <div className="text-xs text-[#3e8914] mt-1">Ready for export</div>
                    </div>
                  </div>
                </div>

                {/* Success metrics */}
                <div className="bg-white rounded-2xl p-4 border border-[#e3e5ef] shadow-xl">
                  <div className="text-sm font-bold text-[#134611] mb-3">Momentum</div>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#134611]">47</div>
                      <div className="text-xs text-gray-600">Days consistent</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(28)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm ${
                            i < 24 ? 'bg-black' :
                            i < 26 ? 'bg-gray-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-center text-gray-600">Streak visualization</div>
                  </div>
                </div>

                {/* Export ready */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl">
                  <div className="text-sm font-bold text-[#334155] mb-3">Export Ready</div>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-2 flex items-center gap-2">
                      <span className="text-blue-600 text-xs">PDF</span>
                      <span className="text-xs">Weekly_Report.pdf</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 flex items-center gap-2">
                      <span className="text-green-600 text-xs">CSV</span>
                      <span className="text-xs">Progress_Data.csv</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 flex items-center gap-2">
                      <span className="text-purple-600 text-xs">MD</span>
                      <span className="text-xs">Goals_Summary.md</span>
                    </div>
                    <button className="w-full mt-2 bg-black text-white text-xs py-2 rounded-lg shadow hover:shadow-md transition-all">
                      Share with team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="bg-black text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Which person will you be in 2026?</h3>
              <p className="text-gray-300 mb-6">Transform scattered ambitions into structured success</p>
              <Link
                href="/chat"
                className="inline-flex items-center px-6 py-3 rounded-xl text-base font-semibold bg-black text-white shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                Start Your Transformation
              </Link>
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
