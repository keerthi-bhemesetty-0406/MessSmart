import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, Utensils, Clock, Calendar, ShieldCheck, 
  RefreshCw, LogOut, ChevronDown 
} from 'lucide-react';
import API from '../api/client';

const MealQRCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const studentData = location.state || {};
  const [currentTime, setCurrentTime] = useState(new Date());
  const [qrTimestamp, setQrTimestamp] = useState(Date.now());

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const qrIntervalTimer = setInterval(() => {
      setQrTimestamp(Date.now());
    }, 1000 * 60 * 3);

    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', closeDropdown);

    return () => {
      clearInterval(clockTimer);
      clearInterval(qrIntervalTimer);
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  const getActiveMealLabel = (now) => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 360 && totalMinutes < 570) return "BREAKFAST";
    if (totalMinutes >= 690 && totalMinutes < 1050) return "LUNCH";
    if (totalMinutes >= 1140 && totalMinutes < 1320) return "DINNER";
    
    return "CLOSED";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const activeMeal = getActiveMealLabel(currentTime);
  const dateString = currentTime.toISOString().split('T')[0];
  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (!studentData.id) {
    return (
      <div className="h-screen bg-[#4A3B32] flex items-center justify-center text-[#FDFBF7] font-bold">
        <div className="text-center space-y-4">
          <p>Error: Student session state data lost.</p>
          <button onClick={() => navigate('/student/dashboard')} className="bg-[#D95D39] text-white px-4 py-2 rounded-xl">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const qrValue = JSON.stringify({
    studentId: studentData.id,
    timestamp: qrTimestamp
  });

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#EFDECD] to-[#3D3029] text-[#FDFBF7] font-sans flex flex-col antialiased">
      
      {/* HEADER */}
      <header className="bg-[#EFDECD] px-6 py-3 flex items-center justify-between shadow-md text-[#4A3B32] shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#D95D39] p-2 rounded-xl text-white shadow-md cursor-pointer" onClick={() => navigate('/student/dashboard')}>
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#D95D39] cursor-pointer" onClick={() => navigate('/student/dashboard')}>
            MessSmart
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F2ECE1] border border-[#4A3B32]/10 hover:bg-[#E6DEC9]/50 transition-all font-bold"
          >
            <div className="w-7 h-7 rounded-full bg-[#D95D39] text-white flex items-center justify-center font-black shadow-md text-xs">
              {studentData.name ? studentData.name.charAt(0) : 'U'}
            </div>
            <span className="font-bold text-xs hidden sm:inline text-[#4A3B32]">{studentData.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#4A3B32]/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E6DEC9] rounded-2xl shadow-2xl py-1 z-50 text-[#4A3B32]">
              <div className="px-4 py-2 bg-[#F2ECE1]/50 border-b border-[#4A3B32]/10">
                <p className="text-[9px] font-black text-[#4A3B32]/40 uppercase tracking-widest">Logged In Student</p>
                <p className="font-black text-xs text-[#4A3B32] truncate">{studentData.name}</p>
                <p className="text-[11px] text-[#4A3B32]/60 truncate">@{studentData.username}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CORE FRAME CONTAINER */}
      <main className="flex-1 max-w-sm w-full mx-auto px-4 py-2 flex flex-col justify-center space-y-2 min-h-0">
        
        

        {/* WHITE CORE MATTE CARD */}
        <div className="bg-white text-[#4A3B32] rounded-3xl border border-[#E6DEC9] shadow-xl p-4 text-center space-y-3 flex flex-col justify-between max-h-[80vh] overflow-hidden shrink">
          
          {/* WINDOW FLAG */}
          <div className="space-y-0.5 shrink-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#4A3B32]/40 block">Current Serving Window</span>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${
              activeMeal === "CLOSED" 
                ? "bg-red-50 text-red-600 border border-red-200" 
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              <Utensils className="w-3 h-3" />
              <span>{activeMeal === "CLOSED" ? "MESS WINDOWS CLOSED" : `${activeMeal} ACTIVE`}</span>
            </div>
          </div>

          {/* QR FRAME WINDOW */}
          <div className="bg-[#F2ECE1]/50 p-3 rounded-2xl border border-[#4A3B32]/10 flex justify-center items-center self-center shadow-inner shrink min-h-0">
            {activeMeal === "CLOSED" ? (
              <div className="w-44 h-44 flex flex-col items-center justify-center text-center text-gray-400 gap-1 bg-white rounded-xl border border-dashed border-gray-300 p-2">
                <Clock className="w-6 h-6 text-red-400 animate-pulse" />
                <p className="text-[10px] font-bold">QR Token Unavailable Outside Dining Hours</p>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100 flex flex-col items-center gap-1.5 shrink min-h-0">
                <div className="w-auto h-auto max-w-[160px] sm:max-w-[180px]">
                  <QRCodeSVG 
                    value={qrValue} 
                    size={170}
                    level={"H"}
                    includeMargin={false}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-700/70 uppercase tracking-wider animate-pulse">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Auto-Regenerating
                </div>
              </div>
            )}
          </div>

          {/* CREDENTIAL COMPARTMENT */}
          <div className="bg-[#F2ECE1]/40 rounded-xl p-3 text-left space-y-1.5 border border-[#4A3B32]/5 text-[11px] shrink-0">
            <div className="flex justify-between items-center border-b border-[#4A3B32]/5 pb-1">
              <span className="font-bold text-[#4A3B32]/50">Student Name:</span>
              <span className="font-black text-[#4A3B32] truncate max-w-[180px]">{studentData.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#4A3B32]/5 pb-1">
              <span className="font-bold text-[#4A3B32]/50">Dining Hall:</span>
              <span className="font-black text-[#D95D39] truncate max-w-[180px]">{studentData.messName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#4A3B32]/50">Timestamp:</span>
              <span className="font-mono font-bold text-[#4A3B32]/80 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-[#4A3B32]/40" /> {dateString} | {timeString}
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MealQRCode;