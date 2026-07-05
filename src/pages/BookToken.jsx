import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  UserCheck, 
  Clock, 
  Calendar, 
  Check, 
  Download, 
  XCircle,
  Ticket,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function BookToken() {
  const { user } = useAuth();
  const { branches, departments, services, staff, bookToken } = useQueue();
  const navigate = useNavigate();

  // Booking states
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-07-04'); // default to today
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);

  // Filtered selections
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);

  // Dynamically update services and staff when department or list data changes
  useEffect(() => {
    if (selectedDept) {
      const deptObj = departments.find(d => d.name === selectedDept);
      if (deptObj) {
        setFilteredServices(services.filter(s => s.depId === deptObj.id));
        setFilteredStaff(staff.filter(st => st.depId === deptObj.id));
      }
    } else {
      setFilteredServices([]);
      setFilteredStaff([]);
    }
  }, [selectedDept, departments, services, staff]);

  // Reset selected service and staff ONLY when the department itself changes
  useEffect(() => {
    setSelectedService('');
    setSelectedStaff('');
  }, [selectedDept]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedBranch || !selectedDept || !selectedService || !selectedTimeSlot) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      const ticket = await bookToken({
        branch: selectedBranch,
        departmentName: selectedDept,
        serviceName: selectedService,
        staffName: selectedStaff,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customerName: user?.name || 'Guest User'
      });
      if (ticket) {
        setBookedTicket(ticket);
        toast.success('Token Booked Successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast.success('Digital receipt downloaded', {
      style: {
        borderRadius: '12px',
        background: '#1E293B',
        color: '#FFF',
      }
    });
  };

  if (bookedTicket) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-6">
        {/* Navigation back */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Digital Ticket Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md">
          
          <div className="flex justify-between items-start mt-2">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Virtual Receipt
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">Booking Confirmed</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Estimated Wait</span>
              <p className="text-lg font-extrabold text-amber-500 font-mono mt-0.5">{bookedTicket.estimatedWaitTime} <span className="text-xs">mins</span></p>
            </div>
          </div>

          {/* Token Box */}
          <div className="my-6 text-center border-y border-dashed border-slate-200 dark:border-slate-800 py-6">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Your Queue Token</span>
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight my-2 animate-bounce-slow">
              {bookedTicket.queueId}
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold px-3 py-1 rounded-full border border-slate-200/30">
              {bookedTicket.branch}
            </span>
          </div>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Department</span>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{bookedTicket.department}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Service Requested</span>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{bookedTicket.service}</p>
            </div>
            <div className="space-y-1 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Scheduled Time</span>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{bookedTicket.date} at {bookedTicket.timeSlot}</p>
            </div>
            <div className="space-y-1 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Assigned Staff</span>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{bookedTicket.staff}</p>
            </div>
          </div>

          {/* QR Scan Simulation */}
          <div className="mt-6 flex flex-col items-center bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/50">
            <div className="h-28 w-28 bg-white p-2 rounded-xl flex items-center justify-center border border-slate-200/50">
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
            <span className="text-[10px] text-slate-400 mt-2 font-medium">Scannable check-in code</span>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl py-2.5 text-xs transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Token</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-xs transition-all shadow-md shadow-blue-500/10"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Got it</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Book Token
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select branch, department, and time to issue a digital queue receipt.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm">
        <form onSubmit={handleBook} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Select Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Select Branch <strong className="text-red-500">*</strong>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-all font-semibold"
                  required
                >
                  <option value="">Choose a branch...</option>
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Select Department <strong className="text-red-500">*</strong>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Building className="h-4 w-4" />
                </span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-all font-semibold"
                  required
                >
                  <option value="">Choose a department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Service */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Select Service <strong className="text-red-500">*</strong>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Ticket className="h-4 w-4" />
                </span>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-all font-semibold disabled:opacity-50"
                  disabled={!selectedDept}
                  required
                >
                  <option value="">Choose a service...</option>
                  {filteredServices.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Staff */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Preferred Staff / Doctor (Optional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <UserCheck className="h-4 w-4" />
                </span>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-all font-semibold disabled:opacity-50"
                  disabled={!selectedDept}
                >
                  <option value="">Any Available Staff</option>
                  {filteredStaff.map(st => (
                    <option key={st.id} value={st.name}>{st.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Choose Date <strong className="text-red-500">*</strong>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Calendar className="h-4 w-4" />
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Choose Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Choose Time Slot <strong className="text-red-500">*</strong>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Clock className="h-4 w-4" />
                </span>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-all font-semibold"
                  required
                >
                  <option value="">Select slot...</option>
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Book Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-6 py-3 font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Issue Queue Token</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
