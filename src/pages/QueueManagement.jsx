import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  SlidersHorizontal,
  XCircle,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function QueueManagement() {
  const { tickets, departments, cancelToken, completeTicket, skipTicket } = useQueue();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.queueId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    const matchesDept = deptFilter ? t.department === deptFilter : true;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCancel = (id) => {
    cancelToken(id);
    toast.error('Token cancelled');
  };

  const handleComplete = (id) => {
    completeTicket(id);
    toast.success('Token marked completed');
  };

  const handleSkip = (id) => {
    skipTicket(id);
    toast.error('Token marked skipped');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Queue Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed breakdown of all active, serving, and completed queue slots.
        </p>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
            placeholder="Search Token, Customer, or Service..."
          />
        </div>

        {/* Filters Select */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Dept filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-44 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="serving">Serving</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 font-semibold">
                <th className="p-4">Queue ID</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Service</th>
                <th className="p-4">Assigned Desk</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginatedTickets.map((t) => (
                <tr 
                  key={t.id} 
                  className="text-slate-700 dark:text-slate-350 font-medium hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-slate-950 dark:text-white">{t.queueId}</td>
                  <td className="p-4">{t.customerName}</td>
                  <td className="p-4">{t.department}</td>
                  <td className="p-4">{t.service}</td>
                  <td className="p-4">{t.staff}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      t.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                      t.status === 'cancelled' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                      t.status === 'serving' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 animate-pulse' :
                      t.status === 'skipped' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                      'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {t.status === 'pending' && (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleComplete(t.id)}
                          className="text-emerald-500 hover:text-emerald-600 hover:underline text-[10px] font-semibold"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleSkip(t.id)}
                          className="text-amber-500 hover:text-amber-600 hover:underline text-[10px] font-semibold"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => handleCancel(t.id)}
                          className="text-red-500 hover:text-red-600 hover:underline text-[10px] font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {t.status === 'serving' && (
                      <>
                        <button
                          onClick={() => handleSkip(t.id)}
                          className="text-slate-500 hover:text-slate-600 hover:underline text-[10px] font-semibold"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => handleComplete(t.id)}
                          className="text-emerald-500 hover:text-emerald-600 hover:underline text-[10px] font-semibold"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {t.status === 'completed' && <span className="text-[10px] text-slate-400">Archived</span>}
                    {t.status === 'cancelled' && <span className="text-[10px] text-slate-400">Cancelled</span>}
                    {t.status === 'skipped' && <span className="text-[10px] text-slate-400">Skipped</span>}
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No matching booking records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-slate-500 text-xs">
          <span>
            Showing <strong className="font-semibold text-slate-800 dark:text-slate-200">{filteredTickets.length > 0 ? startIndex + 1 : 0}</strong> to <strong className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(startIndex + itemsPerPage, filteredTickets.length)}</strong> of <strong className="font-semibold text-slate-800 dark:text-slate-200">{filteredTickets.length}</strong> items
          </span>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-850 dark:text-slate-200 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/50 dark:border-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
