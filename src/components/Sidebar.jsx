import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  History,
  Settings,
  Shield,
  Briefcase,
  Monitor,
  ScanQrCode,
  Sliders,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  // Define navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Queue Manager', path: '/manage', icon: Sliders },
          { name: 'QR Scanner', path: '/scanner', icon: ScanQrCode },
          { name: 'System Settings', path: '/settings', icon: Settings }
        ];
      case 'staff':
        return [
          { name: 'Staff Panel', path: '/dashboard', icon: Briefcase },
          { name: 'Queue List', path: '/manage', icon: Sliders }
        ];
      case 'customer':
      default:
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Book Token', path: '/book', icon: CalendarDays },
          { name: 'My Queue', path: '/my-queue', icon: Clock },
          { name: 'History', path: '/history', icon: History }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full md:h-[calc(100vh-4rem)] p-4 justify-between">
          <div className="space-y-1.5">
            {/* Section title and Close Button for Mobile */}
            <div className="flex items-center justify-between px-3 mb-4">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {role} portal
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                aria-label="Close sidebar"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    target={item.external ? '_blank' : undefined}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive && !item.external
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer info card */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                System Connected
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
              Live queue synchronization is active. Changes refresh instantly.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
