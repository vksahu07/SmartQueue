import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Monitor, Clock, PlayCircle, Users } from 'lucide-react';

export default function LiveQueue() {
  const { tickets, departments } = useQueue();

  // Get currently serving and next pending for each department
  const getDeptStatus = (depName) => {
    const depTickets = tickets.filter(t => t.department === depName);
    const serving = depTickets.find(t => t.status === 'serving');
    const waiting = depTickets.filter(t => t.status === 'pending');
    return {
      serving: serving ? serving.queueId : '---',
      staff: serving ? serving.staff : 'Counter Free',
      next: waiting.length > 0 ? waiting[0].queueId : 'None',
      waitingCount: waiting.length
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6 sm:p-10 flex flex-col justify-between select-none">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-blue-500/20">
            Q
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Lobby Queue Board</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Downtown Central Branch</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono font-bold">20:25:35</span>
        </div>
      </header>

      {/* Main Display Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10 flex-1">
        {departments.map((dep) => {
          const status = getDeptStatus(dep.name);
          const isOccupied = status.serving !== '---';
          
          return (
            <div 
              key={dep.id} 
              className={`border rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 ${
                isOccupied 
                  ? 'bg-slate-950/70 border-slate-800 shadow-xl' 
                  : 'bg-slate-950/20 border-slate-800/40 opacity-70'
              }`}
            >
              <div>
                {/* Department code badge */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-slate-800 text-slate-350 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {dep.code} Counter
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1 font-semibold">
                    <Users className="h-3.5 w-3.5" />
                    {status.waitingCount} waiting
                  </span>
                </div>
                <h2 className="text-lg font-bold mt-4 text-slate-200">{dep.name}</h2>
              </div>

              {/* Serving Number */}
              <div className="my-8 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Now Serving</span>
                <div className={`text-6xl font-extrabold font-mono tracking-tight my-3 ${
                  isOccupied ? 'text-blue-500 animate-pulse glow-blue' : 'text-slate-600'
                }`}>
                  {status.serving}
                </div>
                <span className="text-xs text-slate-400 font-semibold italic bg-slate-900 border border-slate-800/80 px-3.5 py-1 rounded-full">
                  {status.staff}
                </span>
              </div>

              {/* Next In Line */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Next Token:</span>
                <strong className="font-mono text-slate-200">{status.next}</strong>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer ticker info */}
      <footer className="border-t border-slate-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Clock className="h-4.5 w-4.5 text-blue-500 animate-spin-slow" />
          <span className="font-medium text-slate-300">
            Please watch this screen. Prepare your virtual QR token when your ID is listed under "Next Token".
          </span>
        </div>
        <div className="text-slate-500 font-medium">
          Powered by Q-Flow
        </div>
      </footer>
    </div>
  );
}
