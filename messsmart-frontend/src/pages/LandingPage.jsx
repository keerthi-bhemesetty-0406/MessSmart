import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, QrCode, ShieldCheck, Clock, Calendar, 
  TrendingDown, ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2A2018] text-white font-sans antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#2A2018]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#E2683C] p-2 rounded-xl text-white shadow-lg">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">MessSmart</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/login')} 
              className="rounded-lg px-4 py-2 text-sm text-white/80 transition hover:text-white"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E2683C] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#C9572E]"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Eliminate Campus Food Waste.
          <span className="mt-2 block bg-gradient-to-r from-[#F19E76] to-[#E2683C] bg-clip-text text-transparent">
            Optimize Resources.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/70">
          A secure, automated full-stack ecosystem bridging the gap between student dining preferences and kitchen operations with dynamic cryptographic scheduling.
        </p>
        <button 
          onClick={() => navigate('/login')} 
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#E2683C] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E2683C]/25 transition hover:bg-[#C9572E] hover:shadow-xl hover:-translate-y-0.5"
        >
          Launch Dashboard <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Two modules */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2 w-full">
        
        {/* Module A: Student */}
        <div className="group rounded-2xl bg-white p-7 text-[#1F1A14] shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl flex flex-col justify-between">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1F9D6B]/15 text-[#1F9D6B]">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">The Student Application</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5C5048]">
              Empower student dining freedom with time-locked, dynamic preference calendars. Toggle schedules seamlessly or check in securely.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F9D6B]" />
                <span className="font-medium text-[#1F1A14]">Time-locked lockout windows (4AM, 10AM, 5PM)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F9D6B]" />
                <span className="font-medium text-[#1F1A14]">Auto-rolling calendar state generation at 10 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F9D6B]" />
                <span className="font-medium text-[#1F1A14]">Real-time unified accounting and penalty ledgers</span>
              </li>
            </ul>
          </div>
          <div className="mt-6">
            
          </div>
        </div>

        {/* Module B: Admin */}
        <div className="group rounded-2xl bg-white p-7 text-[#1F1A14] shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl flex flex-col justify-between">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E2683C]/15 text-[#E2683C]">
              <QrCode className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Administrative Terminal</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5C5048]">
              Equip cafeteria management with advanced roster metrics and single-use hardware validation scanning terminals to neutralize attendance manipulation.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2683C]" />
                <span className="font-medium text-[#1F1A14]">Interactive streaming camera gate QR checker</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2683C]" />
                <span className="font-medium text-[#1F1A14]">Live headcount summaries and meal tracking badges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2683C]" />
                <span className="font-medium text-[#1F1A14]">Collapsible student & staff registration access queues</span>
              </li>
            </ul>
          </div>
          <div className="mt-6">
            
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-6xl px-6 pb-24 w-full">
        <div className="rounded-2xl bg-[#F5E9D6] p-8 text-[#1F1A14]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E2683C]">Under the hood architecture</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Engineered for absolute resource validation.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E2683C]/10 text-[#E2683C]">
                <Clock className="h-4 w-4" />
              </div>
              <h4 className="mt-3 text-sm font-semibold">Timed Absentee Sweepers</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5C5048]">
                Asynchronous background crons parse active rosters one minute post-serving window closures to apply constraints.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E2683C]/10 text-[#E2683C]">
                <TrendingDown className="h-4 w-4" />
              </div>
              <h4 className="mt-3 text-sm font-semibold">Dual-Penalty Fine Matrices</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5C5048]">
                Differentiates and applies skipped meal or unbooked entry flags directly onto single-row statements.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E2683C]/10 text-[#E2683C]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="mt-3 text-sm font-semibold">Anti-Proxy Token Expiry</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5C5048]">
                QR values auto-regenerate with synchronized millisecond server timestamps to lock out screenshot sharing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/50">
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Utensils className="h-4 w-4 text-[#E2683C]" />
          <span className="font-semibold text-white">MESS SMART FULL-STACK SYSTEM</span>
        </div>
        <p className="mt-2">© 2026 Institutional Production Environment Node. All rights reserved.</p>
      </footer>
    </div>
  );
}