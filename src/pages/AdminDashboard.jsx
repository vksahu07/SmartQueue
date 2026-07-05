import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  X,
  Plus, 
  Megaphone, 
  UserPlus, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

// Chart seed data
const dailyData = [
  { name: '09 AM', visits: 18 },
  { name: '10 AM', visits: 32 },
  { name: '11 AM', visits: 45 },
  { name: '12 PM', visits: 28 },
  { name: '01 PM', visits: 15 },
  { name: '02 PM', visits: 24 },
  { name: '03 PM', visits: 38 },
  { name: '04 PM', visits: 20 },
];

const weeklyData = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 145 },
  { name: 'Wed', visits: 180 },
  { name: 'Thu', visits: 155 },
  { name: 'Fri', visits: 190 },
  { name: 'Sat', visits: 75 },
];

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
  const { user, allUsers, fetchAllUsers, deleteUser } = useAuth();
  const { 
    tickets, 
    departments, 
    addDepartment, 
    addStaff, 
    postAnnouncement 
  } = useQueue();

  // Compute metric cards
  const totalVisitors = tickets.length;
  const completed = tickets.filter(t => t.status === 'completed').length;
  const pending = tickets.filter(t => t.status === 'pending').length;
  const cancelled = tickets.filter(t => t.status === 'cancelled').length;
  
  // Avg waiting time (simulated average: 14 mins)
  const avgWaitTime = 14;

  // Department analytics calculation
  const deptVisits = departments.map(d => {
    const visits = tickets.filter(t => t.department === d.name).length;
    return { name: d.name.split('/')[0].split(' ')[0], visits };
  });

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [modalFilter, setModalFilter] = useState('all');
  const [modalTitle, setModalTitle] = useState('Total Visitors');
  const [showUsersModal, setShowUsersModal] = useState(false);

  React.useEffect(() => {
    if (showUsersModal) {
      fetchAllUsers();
    }
  }, [showUsersModal]);

  const handleDeleteUser = async (uId, uEmail) => {
    if (uEmail === user?.email) {
      toast.error("You cannot delete your own admin account!");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${uEmail}?`)) {
      const res = await deleteUser(uId);
      if (res.success) {
        toast.success("User deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    }
  };

  // Form states
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffDeptId, setNewStaffDeptId] = useState('');
  const [annText, setAnnText] = useState('');
  const [annType, setAnnType] = useState('info');

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    addDepartment(newDeptName, newDeptCode);
    toast.success('Department created successfully!');
    setNewDeptName('');
    setNewDeptCode('');
    setShowDeptModal(false);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffDeptId) return;
    addStaff(newStaffName, newStaffDeptId);
    toast.success('Staff member registered!');
    setNewStaffName('');
    setNewStaffDeptId('');
    setShowStaffModal(false);
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!annText) return;
    postAnnouncement(annText, annType);
    toast.success('Announcement broadcasted!');
    setAnnText('');
    setShowAnnModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Administrative Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics and management operations console.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Visitors */}
        <div 
          onClick={() => {
            setModalFilter('all');
            setModalTitle('All Registered Visitors');
            setShowTicketsModal(true);
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Visitors</span>
            <Users className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{totalVisitors}</span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +12%
            </span>
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => {
            setModalFilter('completed');
            setModalTitle('Completed Tickets Details');
            setShowTicketsModal(true);
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{completed}</span>
          </div>
        </div>

        {/* Waiting */}
        <div 
          onClick={() => {
            setModalFilter('pending');
            setModalTitle('Active Pending Queue');
            setShowTicketsModal(true);
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">In Queue</span>
            <Sliders className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{pending}</span>
          </div>
        </div>

        {/* Cancelled */}
        <div 
          onClick={() => {
            setModalFilter('cancelled');
            setModalTitle('Cancelled Tickets Details');
            setShowTicketsModal(true);
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Cancelled</span>
            <XCircle className="h-4.5 w-4.5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{cancelled}</span>
          </div>
        </div>

        {/* Average Wait Time */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Wait Time</span>
            <Clock className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {avgWaitTime} <span className="text-xs font-semibold text-slate-500">mins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Visitor Volume (Hourly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#FFF', 
                    fontSize: '11px' 
                  }} 
                />
                <Area type="monotone" dataKey="visits" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Departments (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Visits by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptVisits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#FFF', 
                    fontSize: '11px' 
                  }} 
                />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                  {deptVisits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Bookings Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Management Controls</h3>
          
          <button
            onClick={() => setShowDeptModal(true)}
            className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Plus className="h-4.5 w-4.5" />
              </div>
              <span>Add Department</span>
            </div>
          </button>

          <button
            onClick={() => setShowStaffModal(true)}
            className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserPlus className="h-4.5 w-4.5" />
              </div>
              <span>Register Staff</span>
            </div>
          </button>

          <button
            onClick={() => setShowAnnModal(true)}
            className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Megaphone className="h-4.5 w-4.5" />
              </div>
              <span>Post Announcement</span>
            </div>
          </button>

          <button
            onClick={() => setShowUsersModal(true)}
            className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-650 dark:text-red-400 flex items-center justify-center">
                <Users className="h-4.5 w-4.5" />
              </div>
              <span>Manage Users</span>
            </div>
          </button>
        </div>

        {/* Recent Bookings Table */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Active Queue Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                  <th className="pb-3">Token</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {tickets.slice(-5).reverse().map((t) => (
                  <tr key={t.id} className="text-slate-700 dark:text-slate-350 font-medium">
                    <td className="py-3 font-mono font-bold text-slate-950 dark:text-white">{t.queueId}</td>
                    <td className="py-3">{t.customerName}</td>
                    <td className="py-3">{t.branch}</td>
                    <td className="py-3">{t.department}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        t.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                        t.status === 'cancelled' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                        t.status === 'serving' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' :
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      
      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Department</h3>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-medium"
                  placeholder="e.g. Loans Department"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Prefix Code (3 Letters)</label>
                <input
                  type="text"
                  maxLength={3}
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-medium"
                  placeholder="e.g. LON"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register Staff Member</h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Staff Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-medium"
                  placeholder="e.g. Dr. John Watson"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Assigned Department</label>
                <select
                  value={newStaffDeptId}
                  onChange={(e) => setNewStaffDeptId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
                  required
                >
                  <option value="">Select department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Announcement</h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Message</label>
                <textarea
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-medium h-24 resize-none"
                  placeholder="Type message here..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Alert Level</label>
                <select
                  value={annType}
                  onChange={(e) => setAnnType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="info">Information (Blue)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="error">Critical Alert (Red)</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* KPI Tickets Detail Modal */}
      {showTicketsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] max-w-4xl w-full p-6 shadow-2xl space-y-4 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{modalTitle}</h3>
              <button
                onClick={() => setShowTicketsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Queue ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Assigned Desk</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {tickets
                    .filter(t => modalFilter === 'all' ? true : t.status === modalFilter)
                    .map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors font-medium text-slate-600 dark:text-slate-355">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{t.queueId}</td>
                        <td className="py-3 px-4">{t.customerName}</td>
                        <td className="py-3 px-4">{t.department}</td>
                        <td className="py-3 px-4">{t.service}</td>
                        <td className="py-3 px-4">{t.staff || 'Not Assigned'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            t.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                            t.status === 'cancelled' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                            t.status === 'serving' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 animate-pulse' :
                            t.status === 'skipped' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                            'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {tickets.filter(t => modalFilter === 'all' ? true : t.status === modalFilter).length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end border-t border-slate-105 dark:border-slate-800 pt-3">
              <button
                onClick={() => setShowTicketsModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Manage Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] max-w-2xl w-full p-6 shadow-2xl space-y-4 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manage Users</h3>
              <button
                onClick={() => setShowUsersModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors font-medium text-slate-600 dark:text-slate-355">
                      <td className="py-3 px-4 text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 px-4 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400' :
                          u.role === 'staff' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' :
                          'bg-slate-100 dark:bg-slate-850 text-slate-650 dark:text-slate-405'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          disabled={u.email === user?.email}
                          className="text-red-500 hover:text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-[10px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-400">
                        No users loaded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
              <button
                onClick={() => setShowUsersModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
