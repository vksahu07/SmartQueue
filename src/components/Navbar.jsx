import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useQueue } from '../context/QueueContext';
import { Bell, Sun, Moon, LogOut, ChevronDown, User, Shield, Briefcase, RefreshCw, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { announcements } = useQueue();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu (Mobile Only) */}
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <span className="font-sans text-xl font-extrabold tracking-tight">Q</span>
            </div>
            <div>
              <span className="hidden sm:inline font-sans text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Q-Flow
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">


            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse glow-red" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 origin-top-right rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-40">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">Announcements & Alerts</span>
                      <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <div className="mt-1 max-h-60 overflow-y-auto">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="flex flex-col p-3 border-b last:border-0 border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{ann.text}</span>
                          <span className="text-[9px] text-slate-400 mt-1">{ann.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline font-sans text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>

                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-lg ring-1 ring-black ring-opacity-5 z-40">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
