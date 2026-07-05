import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { ScanQrCode, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRScanner() {
  const { tickets, callNext } = useQueue();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'error' | null
  const [scannedToken, setScannedToken] = useState(null);

  const handleStartScan = () => {
    setScanning(true);
    setResult(null);
    setScannedToken(null);

    // Simulate camera scanning delay
    setTimeout(() => {
      // Find a pending token to simulate a successful check-in
      const pendingTicket = tickets.find(t => t.status === 'pending');
      
      setScanning(false);
      if (pendingTicket) {
        setResult('success');
        setScannedToken(pendingTicket);
        toast.success(`Verified: ${pendingTicket.queueId} - Check-in successful!`, {
          style: {
            borderRadius: '12px',
            background: '#1E293B',
            color: '#FFF',
          }
        });
      } else {
        setResult('error');
        toast.error('Scan Error: No active pending token found');
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          QR Token Scanner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Simulate receptionist desk check-in by scanning customer virtual receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Scanner Terminal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest self-start mb-6">Camera Scanner Frame</h3>
          
          <div className="relative h-60 w-60 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">


            {scanning ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Scanner Laser beam animation */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-md shadow-blue-500 animate-scan z-10" />
                <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
                <span className="text-[10px] text-slate-400 font-semibold mt-3">Aligning barcode receipt...</span>
              </div>
            ) : result === 'success' ? (
              <div className="text-center space-y-2 animate-scale">
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Validation Success</h4>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">Verified</span>
              </div>
            ) : result === 'error' ? (
              <div className="text-center space-y-2 animate-scale">
                <XCircle className="h-14 w-14 text-red-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Validation Failed</h4>
                <span className="text-[10px] bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded uppercase">No Token</span>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <ScanQrCode className="h-12 w-12 text-slate-400 mx-auto" />
                <span className="text-[10px] text-slate-400 font-semibold block">Click below to start simulation</span>
              </div>
            )}
          </div>

          <button
            onClick={handleStartScan}
            disabled={scanning}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-xs transition-all shadow-md shadow-blue-500/20"
          >
            {scanning ? 'Scanning...' : 'Trigger Mock Scan'}
          </button>
        </div>

        {/* Verification Result details panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm h-full flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Verification Metadata</h3>
            
            {scannedToken ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Token ID</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">{scannedToken.queueId}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Customer</span>
                    <p className="font-bold text-slate-900 dark:text-white">{scannedToken.customerName}</p>
                  </div>
                  <div className="space-y-0.5 mt-2">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Service</span>
                    <p className="font-bold text-slate-900 dark:text-white">{scannedToken.service}</p>
                  </div>
                  <div className="space-y-0.5 mt-2">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Branch</span>
                    <p className="font-bold text-slate-900 dark:text-white">{scannedToken.branch}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block">Scan Status</span>
                  <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed mt-1">
                    Receipt scanned successfully. Spot check validated: {scannedToken.customerName} is checked-in for {scannedToken.department} queue.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h4 className="text-xs font-bold text-slate-950 dark:text-white">Idle State</h4>
                <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Start scanning to pull client registration details, active department codes, and receipt data.
                </p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-4">
            * Scanner uses mock inputs. To test, make sure a client token has been booked in the dashboard first.
          </div>
        </div>
      </div>
    </div>
  );
}
