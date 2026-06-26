import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import API from '../api/client';
import { 
  ArrowLeft, Scan, CheckCircle2, AlertCircle, RefreshCw, 
  UserCheck, XCircle, Check, Utensils, LogOut, ChevronDown 
} from 'lucide-react';

const QRScannerView = () => {
  const navigate = useNavigate();
  const [scannedId, setScannedId] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [scannedToken, setScannedToken] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scannerRef = useRef(null);
  
  // 🎯 FIX: Pull the exact same database string saved by the dashboard page
  const adminDisplayName = localStorage.getItem('name') || localStorage.getItem('username') || 'Admin';

  const initScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      },
      false
    );

    scanner.render(onScanDetected, onScanFailure);
    scannerRef.current = scanner;
  };

  useEffect(() => {
    initScanner();

    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);

    return () => {
      document.removeEventListener('mousedown', closeDropdown);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed clearing scanner", err));
      }
    };
  }, []);

  const onScanDetected = (decodedText) => {
    if (processing || scannedToken || scanResult || errorMessage) return;

    try {
      const parsedData = JSON.parse(decodedText);
      if (!parsedData.studentId || !parsedData.timestamp) {
        throw new Error("Missing cryptographic token attributes.");
      }

      if (scannerRef.current) {
        scannerRef.current.clear().then(() => {
          setScannedToken(parsedData);
          setScannedId(parsedData.studentId);
        }).catch(err => console.error("Error pausing scanner feed", err));
      }
    } catch (err) {
      setErrorMessage("Invalid format: Not a recognized MessSmart verification token.");
    }
  };

  const handleConfirmAttendance = async () => {
    setProcessing(true);
    setErrorMessage(null);

    try {
      const response = await API.post('/attendance/scan', {
        studentId: Number(scannedToken.studentId),
        timestamp: Number(scannedToken.timestamp)
      });

      setScanResult({ message: response.data.message });
      setScannedId(null);
    } catch (err) {
      const backendError = err.response?.data?.error || err.message || "Failed verifying token.";
      setErrorMessage(backendError);
      setScannedId(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelConfirmation = () => {
    setScannedId(null);
    setScannedToken(null);
    setScanResult(null);
    setErrorMessage(null);
    setTimeout(() => {
      initScanner();
    }, 50);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const onScanFailure = (error) => {};

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#EFDECD] to-[#3D3029] text-[#FDFBF7] font-sans flex flex-col antialiased">
      
      {/* HEADER SECTION */}
      <header className="bg-[#EFDECD] px-6 py-2.5 flex items-center justify-between shadow-md shrink-0 text-[#4A3B32]">
        <div className="flex items-center gap-3">
          <div className="bg-[#D95D39] p-2 rounded-xl text-white shadow-md cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#D95D39] cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            MessSmart
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F2ECE1] border border-[#4A3B32]/10 hover:bg-[#E6DEC9]/50 transition-all font-bold"
          >
            <div className="w-7 h-7 rounded-full bg-[#D95D39] text-white flex items-center justify-center font-black shadow-md text-xs">
              {adminDisplayName.charAt(0)}
            </div>
            <span className="font-bold text-xs hidden sm:inline text-[#4A3B32]">{adminDisplayName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#4A3B32]/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E6DEC9] rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden text-[#4A3B32]">
              <div className="px-4 py-2 bg-[#F2ECE1]/50 border-b border-[#4A3B32]/10">
                <p className="text-[9px] font-black text-[#4A3B32]/40 uppercase tracking-widest">Account Operator</p>
                <p className="font-black text-xs text-[#4A3B32] truncate">{adminDisplayName}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* SCAFFOLD VIEWFINDER WINDOW CONTAINER */}
      <main className="flex-1 max-w-sm w-full mx-auto px-4 py-2 flex flex-col justify-center text-[#4A3B32] min-h-0 space-y-2">
        
        

        {/* STEP A: SHOW INTERMEDIATE INTERACTION CONFIRMATION BUTTONS */}
        {scannedId && (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] p-5 text-center space-y-4 shadow-2xl shrink max-h-[80vh] overflow-hidden">
            <div className="w-10 h-10 bg-[#D95D39]/10 rounded-full flex items-center justify-center mx-auto text-[#D95D39] border border-[#D95D39]/25">
              <Scan className="w-4 h-4 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-base text-[#4A3B32]">Confirm Token Identification</h3>
              <p className="text-xs font-bold text-[#D95D39] font-mono mt-1 bg-[#F2ECE1]/40 py-1.5 rounded-lg border border-[#4A3B32]/5">
                Target Student Reference ID: #{scannedId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button onClick={handleCancelConfirmation} disabled={processing} className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-bold py-2.5 rounded-xl transition-all text-xs shadow-sm">
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={handleConfirmAttendance} disabled={processing} className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all text-xs shadow-md">
                <Check className="w-3.5 h-3.5" /> {processing ? "Marking..." : "Mark Attendance"}
              </button>
            </div>
          </div>
        )}

        {/* STEP B: SUCCESS TRANSACTION SCREEN */}
        {scanResult && (
          <div className="bg-white rounded-3xl border border-emerald-600/20 p-5 text-center space-y-4 shadow-2xl shrink max-h-[80vh] overflow-hidden">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-emerald-800">Attendance Log Committed</h3>
              <p className="text-xs font-bold text-[#4A3B32]/80 mt-1.5 bg-[#F2ECE1]/50 p-2.5 rounded-xl border border-[#4A3B32]/5">
                {scanResult.message}
              </p>
            </div>
            <button onClick={handleCancelConfirmation} className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-md text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Resume Stream Scanning
            </button>
          </div>
        )}

        {/* STEP C: SERVER FAIL REJECTION MODULE */}
        {errorMessage && (
          <div className="bg-white rounded-3xl border border-red-600/20 p-5 text-center space-y-4 shadow-2xl shrink max-h-[80vh] overflow-hidden">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-200">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-red-800">Scan Action Blocked</h3>
              <p className="text-[11px] font-bold text-red-600 mt-1.5 bg-red-50/50 p-2.5 rounded-xl border border-red-200/40">
                {errorMessage}
              </p>
            </div>
            <button onClick={handleCancelConfirmation} className="w-full inline-flex items-center justify-center gap-2 bg-[#D95D39] hover:bg-[#BF4E2E] text-white font-bold py-2.5 rounded-xl transition-colors shadow-md text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Reset Scanner View
            </button>
          </div>
        )}

        {/* STEP D: DEFAULT LIVE VIEWPORT FIELD */}
        {!scannedId && !scanResult && !errorMessage && (
          <div className="bg-white border border-[#E6DEC9] rounded-3xl p-3 shadow-2xl space-y-3 overflow-hidden shrink max-h-[82vh] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/50 border-b border-[#4A3B32]/5 pb-1.5 shrink-0">
              <span className="flex items-center gap-1"><Scan className="w-3 h-3 text-[#D95D39]" /> Viewfinder Active</span>
              <span className="text-emerald-600 tracking-wide">WAITING FOR STUDENT TOKEN</span>
            </div>

            <div 
              id="reader" 
              className="overflow-hidden rounded-2xl border border-[#4A3B32]/10 bg-black shadow-inner flex flex-col items-center justify-center p-1.5 flex-1 min-h-0
                [&>video]:w-full [&>video]:max-h-[40vh] [&>video]:object-cover 
                [&>canvas]:hidden 
                [&_span]:text-[#FDFBF7] [&_span]:font-bold [&_span]:text-xs
                [&_a]:text-[#D95D39] [&_a]:underline [&_a]:font-bold [&_a]:text-xs
                [&_button]:bg-[#D95D39] [&_button]:text-white [&_button]:font-black [&_button]:px-3 [&_button]:py-1.5 [&_button]:rounded-xl [&_button]:my-1 [&_button]:text-xs shadow-md"
            ></div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#4A3B32]/60 text-center px-2 pt-0.5 shrink-0">
              <UserCheck className="w-3 h-3 text-[#D95D39]" />
              <span>Camera halts tracking automatically upon payload receipt context</span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default QRScannerView;