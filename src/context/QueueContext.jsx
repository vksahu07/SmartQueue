import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [isQueuePaused, setIsQueuePaused] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    businessHours: '09:00 AM - 05:00 PM',
    avgHandlingTime: '15 mins',
    maxCapacity: '200 per day',
    autoNotification: true,
    emailConfig: 'smtp.smartqueue.com'
  });

  // Fetch all initial data from backend
  const fetchData = async () => {
    try {
      const branchesRes = await fetch('http://localhost:8080/api/queue/branches');
      if (branchesRes.ok) setBranches(await branchesRes.json());

      const depsRes = await fetch('http://localhost:8080/api/queue/departments');
      if (depsRes.ok) setDepartments(await depsRes.json());

      const servicesRes = await fetch('http://localhost:8080/api/queue/services');
      if (servicesRes.ok) setServices(await servicesRes.json());

      const staffRes = await fetch('http://localhost:8080/api/queue/staff');
      if (staffRes.ok) setStaff(await staffRes.json());

      const ticketsRes = await fetch('http://localhost:8080/api/queue/tickets');
      if (ticketsRes.ok) setTickets(await ticketsRes.json());

      const announcementsRes = await fetch('http://localhost:8080/api/queue/announcements');
      if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());

      const settingsRes = await fetch('http://localhost:8080/api/queue/settings');
      if (settingsRes.ok) setSystemSettings(await settingsRes.json());
    } catch (err) {
      console.error('Error fetching queue data from backend:', err);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds for real-time synchronization simulation
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Methods
  const bookToken = async (details) => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      if (response.ok) {
        const newTicket = await response.json();
        setTickets(prev => [...prev, newTicket]);
        return newTicket;
      } else {
        toast.error(`Booking failed: Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error booking token:', err);
      toast.error('Network Error: Cannot connect to server');
    }
  };

  const cancelToken = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/queue/tickets/${id}/cancel`, {
        method: 'PUT'
      });
      if (response.ok) {
        const updated = await response.json();
        setTickets(prev => prev.map(t => t.id === id ? updated : t));
      } else {
        toast.error(`Cancellation failed: Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error cancelling token:', err);
      toast.error('Network Error: Cannot connect to server');
    }
  };

  const callNext = async (departmentName, staffName) => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentName, staffName })
      });
      if (response.ok) {
        const data = await response.json();
        fetchData();
        return data.status === 'idle' ? null : data;
      } else {
        toast.error(`Call Next failed: Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error calling next ticket:', err);
      toast.error('Network Error: Cannot connect to server');
    }
    return null;
  };

  const completeTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/queue/tickets/${id}/complete`, {
        method: 'PUT'
      });
      if (response.ok) {
        const updated = await response.json();
        setTickets(prev => prev.map(t => t.id === id ? updated : t));
      } else {
        toast.error(`Failed to complete ticket: Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error completing ticket:', err);
      toast.error('Network Error: Cannot connect to server');
    }
  };

  const skipTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/queue/tickets/${id}/skip`, {
        method: 'PUT'
      });
      if (response.ok) {
        const updated = await response.json();
        setTickets(prev => prev.map(t => t.id === id ? updated : t));
      } else {
        toast.error(`Failed to skip ticket: Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error skipping ticket:', err);
      toast.error('Network Error: Cannot connect to server');
    }
  };

  const serveTicket = async (id, staffName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/queue/tickets/${id}/serve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffName })
      });
      if (response.ok) {
        const updated = await response.json();
        setTickets(prev => prev.map(t => t.id === id ? updated : t));
      } else {
        toast.error(`Failed to serve ticket: Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error serving ticket:', err);
      toast.error('Network Error: Cannot connect to server');
    }
  };

  const addDepartment = async (name, code) => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code })
      });
      if (response.ok) {
        const newDep = await response.json();
        setDepartments(prev => [...prev, newDep]);
        return newDep;
      }
    } catch (err) {
      console.error('Error adding department:', err);
    }
  };

  const addStaff = async (name, depId) => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, depId })
      });
      if (response.ok) {
        const newStaff = await response.json();
        setStaff(prev => [...prev, newStaff]);
        return newStaff;
      }
    } catch (err) {
      console.error('Error adding staff:', err);
    }
  };

  const postAnnouncement = async (text, type = 'info') => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type })
      });
      if (response.ok) {
        const newAnn = await response.json();
        setAnnouncements(prev => [newAnn, ...prev]);
      }
    } catch (err) {
      console.error('Error posting announcement:', err);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:8080/api/queue/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        const updated = await response.json();
        setSystemSettings(updated);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  return (
    <QueueContext.Provider value={{
      branches,
      departments,
      services,
      staff,
      tickets,
      isQueuePaused,
      announcements,
      systemSettings,
      bookToken,
      cancelToken,
      callNext,
      completeTicket,
      skipTicket,
      serveTicket,
      pauseQueue: () => setIsQueuePaused(true),
      resumeQueue: () => setIsQueuePaused(false),
      addDepartment,
      addStaff,
      postAnnouncement,
      updateSettings
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
