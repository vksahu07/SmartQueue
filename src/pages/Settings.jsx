import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Settings as SettingsIcon, Save, Clock, Sliders, BellRing, ShieldAlert, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { systemSettings, updateSettings } = useQueue();
  
  // Local form states
  const [businessHours, setBusinessHours] = useState(systemSettings.businessHours);
  const [avgHandlingTime, setAvgHandlingTime] = useState(systemSettings.avgHandlingTime);
  const [maxCapacity, setMaxCapacity] = useState(systemSettings.maxCapacity);
  const [autoNotification, setAutoNotification] = useState(systemSettings.autoNotification);
  const [emailConfig, setEmailConfig] = useState(systemSettings.emailConfig);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      businessHours,
      avgHandlingTime,
      maxCapacity,
      autoNotification,
      emailConfig
    });
    toast.success('System settings updated successfully!', {
      style: {
        borderRadius: '12px',
        background: '#1E293B',
        color: '#FFF',
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure office hours, average service limits, alerts, and mail rules.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Office & Capacity Rules
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
                  placeholder="09:00 AM - 05:00 PM"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Avg Service Time
                </label>
                <input
                  type="text"
                  value={avgHandlingTime}
                  onChange={(e) => setAvgHandlingTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
                  placeholder="15 mins"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Max Daily Capacity
                </label>
                <input
                  type="text"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
                  placeholder="200 per day"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Email Setup */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-500" />
              Mail & Notifications Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  SMTP Relay Server
                </label>
                <input
                  type="text"
                  value={emailConfig}
                  onChange={(e) => setEmailConfig(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
                  placeholder="smtp.company.com"
                  required
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 cursor-pointer select-none mt-4">
                  <input
                    type="checkbox"
                    checked={autoNotification}
                    onChange={(e) => setAutoNotification(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-350 dark:border-slate-800 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Auto SMS & Push Alerts</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Notify patients when 2 people are ahead of them</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 hover:scale-[1.01]"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
