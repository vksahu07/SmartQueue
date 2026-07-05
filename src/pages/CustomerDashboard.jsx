import React from 'react';
import { Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { Ticket, Users, Clock, PlayCircle, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { tickets, cancelToken } = useQueue();

  // Find today's active ticket for the logged-in customer
  const customerTickets = tickets.filter(t => t.customerName === user?.name);
  const activeTicket = customerTickets.find(t => t.status === 'pending' || t.status === 'serving');

  // Compute metrics if there is an active ticket
  let peopleAhead = 0;
  let currentServing = 'None';
  let queueProgress = 100;

  if (activeTicket) {
    // Find all pending tickets in the same department created before this ticket
    const depTickets = tickets.filter(t => t.department === activeTicket.department);
    const pendingBefore = depTickets.filter(
      t => t.status === 'pending' && new Date(t.createdAt) < new Date(activeTicket.createdAt)
    );
    peopleAhead = pendingBefore.length;

    // Find the currently serving ticket for this department
    const servingTicket = depTickets.find(t => t.status === 'serving');
    currentServing = servingTicket ? servingTicket.queueId : 'None';

    // Calculate progress percentage (e.g., if there are 4 people ahead, progress is 20%; 0 people ahead, progress is 100%)
    const totalInDept = depTickets.filter(t => t.status === 'pending' || t.status === 'serving').length;
    queueProgress = totalInDept > 0 ? Math.round(((totalInDept - peopleAhead) / totalInDept) * 100) : 100;
  }

  const handleCancel = (id) => {
    cancelToken(id);
    toast.error('Token cancelled successfully', {
      style: {
        borderRadius: '12px',
        background: '#1E293B',
        color: '#FFF',
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your queue status and manage appointments.
          </p>
        </div>
        {!activeTicket && (
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 font-semibold text-xs transition-all shadow-md shadow-blue-500/10"
          >
            <span>Book New Token</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {activeTicket ? (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Today's Token */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Your Token</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  activeTicket.status === 'serving' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                }`}>
                  {activeTicket.status}
                </span>
              </div>
              <div className="mt-3.5 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {activeTicket.queueId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 truncate font-medium">
                {activeTicket.department}
              </p>
            </div>

            {/* Current serving */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Now Serving</span>
                <PlayCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3.5">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {currentServing}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {activeTicket.staff}
              </p>
            </div>

            {/* Waiting Time */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Est. Wait Time</span>
                <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
              <div className="mt-3.5">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {activeTicket.status === 'serving' ? '0' : activeTicket.estimatedWaitTime} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">mins</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Arrive 5 mins prior
              </p>
            </div>

            {/* People Ahead */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">People Ahead</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-3.5">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {peopleAhead}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                In General Desk queue
              </p>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress ring card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white self-start mb-6">Queue Position Status</h3>
              
              <div className="relative flex items-center justify-center h-48 w-48">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - queueProgress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    className="text-blue-600 transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{queueProgress}%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                    {activeTicket.status === 'serving' ? 'Serving Now' : `${peopleAhead} ahead`}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {activeTicket.status === 'serving' ? 'Please proceed to your assigned counter' : 'Stay nearby. We will notify you when you are next.'}
                </span>
                {activeTicket.status !== 'serving' && (
                  <button
                    onClick={() => handleCancel(activeTicket.id)}
                    className="text-red-500 hover:text-red-600 text-xs font-semibold mt-4 transition-colors"
                  >
                    Cancel Token
                  </button>
                )}
              </div>
            </div>

            {/* Token details card */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Token Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Branch</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{activeTicket.branch}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Service</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{activeTicket.service}</p>
                  </div>
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Date & Time</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{activeTicket.date} at {activeTicket.timeSlot}</p>
                  </div>
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Desk</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{activeTicket.staff}</p>
                  </div>
                </div>
              </div>

              {/* QR Simulator */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mt-5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/50">
                <div className="h-28 w-28 bg-white p-2 rounded-xl flex items-center justify-center border border-slate-200/50">
                  {/* Clean CSS QR Simulator representation */}
                  <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                    <div></div>
                    <div className="bg-slate-950 rounded-sm"></div>
                  </div>
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">QR Code Verified</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Scan at Welcome Counter</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-sm">
                    Hold this QR code under the counter scanner upon arrival to instantly check-in and notify staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty Dashboard State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 text-center max-w-2xl mx-auto my-10 shadow-sm">
          <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-2xl mx-auto mb-6">
            <Ticket className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">No Active Token Booked</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            You don't have any pending queue token for today. Book one now to secure your spot at our branches.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 font-semibold text-xs mt-6 transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01]"
          >
            <span>Book Your Token Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Recent History Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Your Recent Tickets</h3>
        
        {customerTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                  <th className="pb-3">Token ID</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {customerTickets.slice(0, 4).map((t) => (
                  <tr key={t.id} className="text-slate-700 dark:text-slate-300 font-medium">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{t.queueId}</td>
                    <td className="py-3">{t.branch}</td>
                    <td className="py-3">{t.department}</td>
                    <td className="py-3">{t.service}</td>
                    <td className="py-3">{t.date}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        t.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                        t.status === 'cancelled' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                        t.status === 'serving' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 animate-pulse' :
                        'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No booking history found.
          </div>
        )}
      </div>
    </div>
  );
}
