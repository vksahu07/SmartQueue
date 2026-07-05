import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { History, Search, Filter, Calendar, FileDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QueueHistory() {
  const { user } = useAuth();
  const { tickets } = useQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter history for the current logged-in customer
  const customerHistory = tickets.filter(t => t.customerName === user?.name);

  const filteredHistory = customerHistory.filter(t => {
    const matchesSearch = t.queueId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadReceipt = (ticketId) => {
    toast.success(`Receipt for ${ticketId} downloaded`, {
      style: {
        borderRadius: '12px',
        background: '#1E293B',
        color: '#FFF',
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Queue History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review past visits, completed sessions, and cancel requests.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
            placeholder="Search history..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="skipped">Skipped</option>
          </select>
        </div>
      </div>

      {/* Timeline UI */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm">
        {filteredHistory.length > 0 ? (
          <div className="relative border-l border-slate-100 dark:border-slate-800 ml-3.5 pl-6 space-y-8">
            {filteredHistory.map((t) => {
              const isCompleted = t.status === 'completed';
              const isCancelled = t.status === 'cancelled';
              const isServing = t.status === 'serving';

              return (
                <div key={t.id} className="relative group">
                  {/* Timeline point */}
                  <span className="absolute -left-[35px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 ring-4 ring-white dark:ring-slate-950">
                    {isCompleted && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />}
                    {isCancelled && <XCircle className="h-4.5 w-4.5 text-red-500" />}
                    {isServing && <Clock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />}
                    {!isCompleted && !isCancelled && !isServing && <Clock className="h-4.5 w-4.5 text-blue-500" />}
                  </span>

                  {/* Timeline content block */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 border border-slate-150/40 dark:border-slate-850/50 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{t.queueId}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          isCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                          isCancelled ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                          isServing ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' :
                          'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.service}</h4>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {t.date} at {t.timeSlot}
                        </span>
                        <span>Branch: {t.branch}</span>
                        <span>Desk: {t.staff}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadReceipt(t.queueId)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold border border-blue-100 dark:border-blue-950 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 px-3 py-2 rounded-xl transition-colors"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            <History className="h-8 w-8 text-slate-450 mx-auto mb-3" />
            No history entries found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
