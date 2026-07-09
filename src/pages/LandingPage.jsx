import React from 'react';
import { Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarDays, 
  Smartphone, 
  BellRing, 
  Users, 
  Clock, 
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { tickets, departments } = useQueue();
  const { user } = useAuth();

  // Get live stats for Landing Page
  const getLiveStats = (depName) => {
    const depTickets = tickets.filter(t => t.department === depName);
    const serving = depTickets.find(t => t.status === 'serving')?.queueId || 'None';
    const waiting = depTickets.filter(t => t.status === 'pending').length;
    const estWait = waiting * 12; // 12 mins per person
    return { serving, waiting, estWait };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans relative overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5 animate-pulse" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5 animate-pulse delay-100" />

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        <div className="text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 rounded-full px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Queue Management System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] hover:scale-[1.005] transition-transform">
            Wait Digitally,<br />
            <span className="text-blue-600 dark:text-blue-400 font-bold">Not in Line.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            Revolutionize customer visits at your clinics, banks, salons, or offices. Let customers book tokens online, track active queue numbers, and arrive exactly when served.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3.5 font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{user ? "Go to Dashboard" : "Book Your Token"}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>

        {/* Hero Graphic - Digital Queue */}
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-[32px] p-6 shadow-2xl backdrop-blur-md hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Virtual Lobby Screen</span>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live</span>
            </div>

            <div className="space-y-4">
              {/* Virtual Person 1 */}
              <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/20 rounded-2xl p-3.5 hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    JS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">John Smith</h4>
                    <p className="text-[10px] text-slate-500">General OPD Physician</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 px-2 py-0.5 rounded">MED-401</span>
                  <p className="text-[9px] text-emerald-500 font-semibold mt-0.5">Now Serving</p>
                </div>
              </div>

              {/* Virtual Person 2 */}
              <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-3.5 hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3 opacity-75">
                  <div className="h-9 w-9 rounded-full bg-slate-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                    RM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Robert Miller</h4>
                    <p className="text-[10px] text-slate-500">General consulting queries</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">GEN-202</span>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">1 Person Ahead</p>
                </div>
              </div>

              {/* Virtual Person 3 */}
              <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-3.5 opacity-60 hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-xs uppercase">
                    BB
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Bruce Banner</h4>
                    <p className="text-[10px] text-slate-500">Doctor Consultation</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">MED-402</span>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Est: 15 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Queue Preview Section */}
      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 py-16 px-6 relative">
        <div className="max-w-7xl mx-auto z-10">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Live Queue Status
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Real-time monitoring of active counters across different departments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map(dep => {
              const { serving, waiting, estWait } = getLiveStats(dep.name);
              return (
                <div key={dep.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-transform">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">{dep.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Now Serving:</span>
                      <strong className="font-mono text-blue-600 dark:text-blue-400">{serving}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Waiting Count:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{waiting} Customers</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Est. Wait Time:</span>
                      <strong className="text-amber-500">{estWait} mins</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Features Designed for Business Excellence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Scale operations, reduce wait stress, and boost service throughput.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Book Tokens Online</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Customers can register and book token slots via desktop or mobile before visiting your physical office.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-5">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Virtual QR Tokens</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly generates dynamic digital token cards with scannable QR Codes for swift desk validation.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
              <BellRing className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Queue Notifications</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Receives auto-triggered alerts when the turn is approaching, reducing lobby congestion.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-blue-600 py-16 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-blue-600 to-blue-800 opacity-90" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 z-10">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold font-mono">10M+</div>
            <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Tokens Booked</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold font-mono">82%</div>
            <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Lobby Wait Reduced</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold font-mono">2,500+</div>
            <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Offices Served</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold font-mono">99.9%</div>
            <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Platform Uptime</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clear answers to help you get started with the smart queue platform.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2.5">
                <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
                How do customers verify themselves when arriving?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed pl-7">
                Each booked token displays a secure QR code. Upon arrival, staff can verify the token at the scanner terminal, immediately validating their place in line.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2.5">
                <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
                Is the state synchronized across dashboards?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed pl-7">
                Yes! The application utilizes a shared React context. When staff click "Call Next" in their portal, the live lobby displays and customer devices update instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-12 px-6 bg-white dark:bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M9 5v14" strokeDasharray="3 3" />
                <circle cx="15.5" cy="12" r="3.5" />
                <path d="M18 14.5l3 3" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-sans text-sm">Q-Flow</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Contact Support</a>
          </div>
          <div>
            &copy; 2026 Q-Flow Systems, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
