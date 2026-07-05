import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  Play, 
  Check, 
  ChevronRight, 
  PauseCircle, 
  PlayCircle, 
  User, 
  Clock, 
  SkipForward,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { 
    tickets, 
    departments,
    callNext, 
    completeTicket, 
    skipTicket, 
    serveTicket,
    isQueuePaused, 
    pauseQueue, 
    resumeQueue 
  } = useQueue();

  const [selectedDept, setSelectedDept] = useState('General Consulting');

  const staffDept = selectedDept;
  const staffName = user?.name || 'Sophia Patel';

  // Get department tickets
  const deptTickets = tickets.filter(t => t.department === staffDept);
  
  // Find current serving ticket for this staff
  const currentServing = deptTickets.find(t => t.status === 'serving' && t.staff === staffName);
  
  // Find next pending ticket in line for this department
  const nextInLine = deptTickets.find(t => t.status === 'pending');

  // Pending queue list
  const pendingQueue = deptTickets.filter(t => t.status === 'pending');

  const handleCallNext = () => {
    if (isQueuePaused) {
      toast.error('Queue is currently paused. Resume first.');
      return;
    }
    const next = callNext(staffDept, staffName);
    if (next) {
      toast.success(`Called token ${next.queueId}`, {
        style: {
          borderRadius: '12px',
          background: '#1E293B',
          color: '#FFF',
        }
      });
    } else {
      toast.error('No customers waiting in queue');
    }
  };

  const handleComplete = (id) => {
    completeTicket(id);
    toast.success('Service marked as completed', {
      style: {
        borderRadius: '12px',
        background: '#22C55E',
        color: '#FFF',
      }
    });
  };

  const handleSkip = (id) => {
    skipTicket(id);
    toast.error('Customer marked as skipped');
  };

  const handleToggleQueue = () => {
    if (isQueuePaused) {
      resumeQueue();
      toast.success('Queue resumed successfully');
    } else {
      pauseQueue();
      toast.error('Queue paused. No new calls can be made.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Desk Console - {staffName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-450">Active Desk:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleToggleQueue}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-xs transition-all shadow-md ${
            isQueuePaused 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10' 
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10'
          }`}
        >
          {isQueuePaused ? (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Resume Queue</span>
            </>
          ) : (
            <>
              <PauseCircle className="h-4 w-4" />
              <span>Pause Queue</span>
            </>
          )}
        </button>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left serving column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current serving card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Now Serving Customer</h3>
              {isQueuePaused && (
                <span className="flex items-center gap-1.5 text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <AlertTriangle className="h-3 w-3" />
                  Paused
                </span>
              )}
            </div>

            {currentServing ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/30 p-6 rounded-xl">
                  <div className="text-center sm:text-left space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Token ID</span>
                    <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                      {currentServing.queueId}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Service: {currentServing.service}
                    </p>
                  </div>
                  <div className="text-center sm:text-right mt-4 sm:mt-0 space-y-1">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm mx-auto sm:ml-auto">
                      {currentServing.customerName.charAt(0)}
                    </div>
                    <strong className="text-sm text-slate-900 dark:text-white block">{currentServing.customerName}</strong>
                    <span className="text-[10px] text-slate-400 font-medium block">Checked-in via Mobile</span>
                  </div>
                </div>

                {/* Operations Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSkip(currentServing.id)}
                    className="w-full flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg py-3 text-xs transition-colors shadow-sm"
                  >
                    <SkipForward className="h-4 w-4" />
                    <span>Skip Turn</span>
                  </button>
                  <button
                    onClick={() => handleComplete(currentServing.id)}
                    className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-3 text-xs transition-all shadow"
                  >
                    <Check className="h-4 w-4" />
                    <span>Complete</span>
                  </button>
                  <button
                    onClick={handleCallNext}
                    className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-3 text-xs transition-all shadow"
                  >
                    <span>Call Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-950 text-slate-400 flex items-center justify-center rounded-xl mx-auto mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Active Customer</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your desk is currently idle. Click "Call Next" to serve the next customer in queue.
                </p>
                <button
                  onClick={handleCallNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2.5 text-xs mt-5 transition-all shadow"
                >
                  Call Next Customer
                </button>
              </div>
            )}
          </div>

          {/* Next Customer Preview card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Next In Line</h3>
            
            {nextInLine ? (
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                    {nextInLine.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{nextInLine.customerName}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Service: {nextInLine.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                    {nextInLine.queueId}
                  </span>
                  <p className="text-[9px] text-slate-400 font-medium mt-1">Wait: ~15 mins</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 font-medium">
                No customers waiting in line.
              </div>
            )}
          </div>
        </div>

        {/* Right pending list column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Waiting Lobby ({pendingQueue.length})</h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Lobby</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[420px] flex-1">
            {pendingQueue.map((t, index) => (
              <div key={t.id} className="flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-slate-800 pb-3 last:pb-0">
                <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold font-mono">{index + 1}.</span>
                    <strong className="text-xs text-slate-900 dark:text-white font-bold truncate">{t.customerName}</strong>
                  </div>
                  <p className="text-[9px] text-slate-400 truncate">{t.service}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                    {t.queueId}
                  </span>
                  <div className="flex items-center gap-0.5 bg-slate-55/30 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => {
                        serveTicket(t.id, staffName);
                        toast.success(`Serving token ${t.queueId} now`);
                      }}
                      title="Serve Now"
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleComplete(t.id)}
                      title="Complete Service"
                      className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-905/30 rounded transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleSkip(t.id)}
                      title="Skip Turn"
                      className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded transition-colors"
                    >
                      <SkipForward className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pendingQueue.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-400 font-medium">
                Lobby is currently empty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
