import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';
import { Utensils, LogOut, ChevronDown, QrCode, CheckCircle, XCircle, Clock, Calendar, Wallet, CalendarRange } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [studentContext, setStudentContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [meals, setMeals] = useState({ breakfast: true, lunch: true, dinner: true });
  const [saveStatus, setSaveStatus] = useState('');

  const [ledger, setLedger] = useState({
    baseMealBill: 0,
    totalPenaltyCharges: 0,
    netAmountDue: 0,
    selectedMealsCount: 0,
    attendedMealsCount: 0
  });

  const getTargetAndLockoutStates = (now) => {
    const hours = now.getHours();
    const isAfter10PM = hours >= 22;
    const targetDate = new Date(now);
    if (isAfter10PM) {
      targetDate.setDate(now.getDate() + 1);
    }
    const targetDateStr = targetDate.toISOString().split('T')[0];

    if (isAfter10PM) {
      return { targetDateStr, isBfLocked: false, isLuLocked: false, isDiLocked: false };
    }

    return {
      targetDateStr,
      isBfLocked: hours >= 4,
      isLuLocked: hours >= 10,
      isDiLocked: hours >= 17
    };
  };

  const { targetDateStr, isBfLocked, isLuLocked, isDiLocked } = getTargetAndLockoutStates(currentTime);

  const loadStudentData = async () => {
    try {
      const storedUsername = localStorage.getItem('username');
      if (!storedUsername) { navigate('/login'); return; }

      const profileRes = await API.get(`/meals/profile/${storedUsername}?date=${targetDateStr}`);
      setStudentContext(profileRes.data);
      setMeals({
        breakfast: profileRes.data.breakfast,
        lunch: profileRes.data.lunch,
        dinner: profileRes.data.dinner
      });

      const ledgerRes = await API.get(`/meals/ledger/${profileRes.data.id}`);
      setLedger(prev => ({
        ...prev,
        baseMealBill: ledgerRes.data.baseMealBill,
        totalPenaltyCharges: ledgerRes.data.totalPenaltyCharges,
        netAmountDue: ledgerRes.data.netAmountDue,
        selectedMealsCount: ledgerRes.data.selectedCount,
        attendedMealsCount: ledgerRes.data.attendedCount
      }));

      setLoading(false);
    } catch (err) {
      console.error("Error launching student context mapping", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', closeDropdown);

    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, [targetDateStr]);

  const handleMealToggle = async (mealType, currentValue, isLocked) => {
    if (isLocked) return;

    const updatedMeals = { ...meals, [mealType]: !currentValue };
    setMeals(updatedMeals);

    try {
      setSaveStatus('Saving changes...');
      await API.post('/meals/select', {
        studentId: studentContext.id,
        selectionDate: targetDateStr,
        breakfast: updatedMeals.breakfast,
        lunch: updatedMeals.lunch,
        dinner: updatedMeals.dinner
      });
      setSaveStatus('Preferences saved sync.');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('Failed to save.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading || !studentContext) {
    return (
      <div className="min-h-screen bg-[#4A3B32] flex items-center justify-center text-[#E6DEC9] font-bold tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <Utensils className="w-8 h-8 text-[#D95D39] animate-spin" />
          <span>Synchronizing Student Ecosystem...</span>
        </div>
      </div>
    );
  }

  return (
    /* 🚀 CHANGED: Primary wrapper customized to premium mid-dark look */
    <div className="min-h-screen bg-gradient-to-b from-[#EFDECD] to-[#3D3029] text-[#FDFBF7] font-sans flex flex-col antialiased">
      
      {/* HEADER SECTION */}
      {/* 🚀 CHANGED: Pure white header with crisp coffee divider accents */}
      <header className="bg-[#EFDECD]  px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50 text-[#4A3B32] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="bg-[#D95D39] p-2.5 rounded-xl text-white shadow-md">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#D95D39]">MessSmart</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)} 
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F2ECE1] border border-[#4A3B32]/10 hover:bg-[#E6DEC9]/50 transition-all duration-200 font-bold"
          >
            <div className="w-8 h-8 rounded-full bg-[#D95D39] text-white flex items-center justify-center font-black shadow-md">
              {studentContext.name.charAt(0)}
            </div>
            <span className="font-bold text-sm hidden sm:inline text-[#4A3B32]">{studentContext.name}</span>
            <ChevronDown className={`w-4 h-4 text-[#4A3B32]/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6DEC9] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden transform origin-top-right transition-all text-[#4A3B32]">
              <div className="px-4 py-3 bg-[#F2ECE1]/50 border-b border-[#4A3B32]/10">
                <p className="text-[10px] font-black text-[#4A3B32]/40 uppercase tracking-widest">Logged In Student</p>
                <p className="font-black text-sm text-[#4A3B32] truncate">{studentContext.name}</p>
                <p className="text-xs text-[#4A3B32]/60 truncate">@{studentContext.username}</p>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" /> Log Out Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* BANNER ROW HERO CARD */}
        <div className="relative bg-gradient-to-r from-[#D95D39] to-[#FA724B] p-6 rounded-3xl shadow-xl text-white overflow-hidden border border-[#D95D39]/20">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
            <Utensils className="w-44 h-44" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              
              <h2 className="text-3xl font-black tracking-tight mt-2 drop-shadow-sm">Welcome Back, {studentContext.name}!</h2>
              <p className="text-sm text-white/90 mt-1 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Assigned Kitchen Facility: <strong className="text-white font-extrabold underline decoration-[#4A3B32] decoration-2">{studentContext.messName}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* QR GENERATION BLOCK ACTION CARD */}
        {/* 🚀 CHANGED: Action panel treated with crisp solid white backdrop elements */}
        <div className="bg-white text-[#4A3B32] border border-[#E6DEC9] p-6 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-200">
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-[#4A3B32]/50">Dine-In Authentication Token</p>
            <button 
              onClick={() => navigate('/student/qr', { state: studentContext })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D95D39] hover:bg-[#BF4E2E] text-white font-black px-8 py-4 rounded-xl shadow-xl shadow-[#D95D39]/30 transition-all duration-150 active:scale-[0.98] text-sm tracking-wide"
            >
              <QrCode className="w-5 h-5" /> Generate Meal Access QR
            </button>
          </div>
        </div>

        {/* MEAL ATTENDANCE SELECTION SECTIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white text-[#4A3B32] px-5 py-3.5 rounded-2xl border border-[#E6DEC9] shadow-md">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D95D39]" />
              <h3 className="font-black text-sm uppercase tracking-wider text-[#4A3B32]">
                Menu Toggles for Date: <span className="text-[#D95D39] bg-[#D95D39]/10 px-2.5 py-0.5 rounded-md font-mono border border-[#D95D39]/20">{targetDateStr}</span>
              </h3>
            </div>
            {saveStatus && (
              <span className="text-xs font-black text-[#D95D39] bg-[#D95D39]/5 border border-[#D95D39]/20 px-3 py-1 rounded-full animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  
            {/* BREAKFAST CARD */}
            <div 
              onClick={() => handleMealToggle('breakfast', meals.breakfast, isBfLocked)}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-40 relative overflow-hidden select-none shadow-xl bg-white ${
                isBfLocked 
                  ? 'opacity-60 border-gray-300/60 cursor-not-allowed text-gray-400' 
                  : meals.breakfast
                    ? 'hover:shadow-2xl cursor-pointer border-emerald-500/20 text-[#4A3B32]'
                    : 'bg-gradient-to-br from-red-50/50 to-white hover:shadow-2xl cursor-pointer border-red-500/30 text-[#4A3B32]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`font-black text-base tracking-tight ${isBfLocked ? 'text-gray-400' : 'text-[#4A3B32]'}`}>Breakfast</span>
                  {isBfLocked ? <Clock className="w-4 h-4 text-gray-400" /> : <Clock className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className={`text-[11px] font-black mt-1 px-2 py-0.5 rounded w-max ${isBfLocked ? 'bg-gray-100 text-gray-400' : 'bg-[#4A3B32]/5 text-[#4A3B32]/50'}`}>
                  Cut-off: 4:00 AM
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 border-t border-[#4A3B32]/10 pt-3">
                <span className={`text-xs font-black uppercase tracking-widest ${isBfLocked ? 'text-gray-400' : meals.breakfast ? 'text-emerald-600' : 'text-red-600'}`}>
                  {meals.breakfast ? '✓ Opted In' : '✕ Opted Out'}
                </span>
                {isBfLocked ? (
                  <Clock className="w-5 h-5 text-gray-300 fill-gray-50" />
                ) : meals.breakfast ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 fill-red-100" />
                )}
              </div>
              {isBfLocked && (
                <div className="absolute top-2 right-2 bg-gray-400 text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-sm">LOCKED</div>
              )}
            </div>

            {/* LUNCH CARD */}
            <div 
              onClick={() => handleMealToggle('lunch', meals.lunch, isLuLocked)}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-40 relative overflow-hidden select-none shadow-xl bg-white ${
                isLuLocked 
                  ? 'opacity-60 border-gray-300/60 cursor-not-allowed text-gray-400' 
                  : meals.lunch
                    ? 'hover:shadow-2xl cursor-pointer border-emerald-500/20 text-[#4A3B32]'
                    : 'bg-gradient-to-br from-red-50/50 to-white hover:shadow-2xl cursor-pointer border-red-500/30 text-[#4A3B32]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`font-black text-base tracking-tight ${isLuLocked ? 'text-gray-400' : 'text-[#4A3B32]'}`}>Lunch</span>
                  {isLuLocked ? <Clock className="w-4 h-4 text-gray-400" /> : <Clock className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className={`text-[11px] font-black mt-1 px-2 py-0.5 rounded w-max ${isLuLocked ? 'bg-gray-100 text-gray-400' : 'bg-[#4A3B32]/5 text-[#4A3B32]/50'}`}>
                  Cut-off: 10:00 AM
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 border-t border-[#4A3B32]/10 pt-3">
                <span className={`text-xs font-black uppercase tracking-widest ${isLuLocked ? 'text-gray-400' : meals.lunch ? 'text-emerald-600' : 'text-red-600'}`}>
                  {meals.lunch ? '✓ Opted In' : '✕ Opted Out'}
                </span>
                {isLuLocked ? (
                  <Clock className="w-5 h-5 text-gray-300 fill-gray-50" />
                ) : meals.lunch ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 fill-red-100" />
                )}
              </div>
              {isLuLocked && (
                <div className="absolute top-2 right-2 bg-gray-400 text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-sm">LOCKED</div>
              )}
            </div>

            {/* DINNER CARD */}
            <div 
              onClick={() => handleMealToggle('dinner', meals.dinner, isDiLocked)}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-40 relative overflow-hidden select-none shadow-xl bg-white ${
                isDiLocked 
                  ? 'opacity-60 border-gray-300/60 cursor-not-allowed text-gray-400' 
                  : meals.dinner
                    ? 'hover:shadow-2xl cursor-pointer border-emerald-500/20 text-[#4A3B32]'
                    : 'bg-gradient-to-br from-red-50/50 to-white hover:shadow-2xl cursor-pointer border-red-500/30 text-[#4A3B32]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`font-black text-base tracking-tight ${isDiLocked ? 'text-gray-400' : 'text-[#4A3B32]'}`}>Dinner</span>
                  {isDiLocked ? <Clock className="w-4 h-4 text-gray-400" /> : <Clock className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className={`text-[11px] font-black mt-1 px-2 py-0.5 rounded w-max ${isDiLocked ? 'bg-gray-100 text-gray-400' : 'bg-[#4A3B32]/5 text-[#4A3B32]/50'}`}>
                  Cut-off: 5:00 PM
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 border-t border-[#4A3B32]/10 pt-3">
                <span className={`text-xs font-black uppercase tracking-widest ${isDiLocked ? 'text-gray-400' : meals.dinner ? 'text-emerald-600' : 'text-red-600'}`}>
                  {meals.dinner ? '✓ Opted In' : '✕ Opted Out'}
                </span>
                {isDiLocked ? (
                  <Clock className="w-5 h-5 text-gray-300 fill-gray-50" />
                ) : meals.dinner ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 fill-red-100" />
                )}
              </div>
              {isDiLocked && (
                <div className="absolute top-2 right-2 bg-gray-400 text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-sm">LOCKED</div>
              )}
            </div>
          </div>
        </div>

        {/* MONTHLY METRICS CARD PANELS */}
        {/* 🚀 CHANGED: White card canvas layer to maintain robust contrast layout profiles */}
        <div className="bg-white text-[#4A3B32] border border-[#E6DEC9] p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#4A3B32]/10 pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#D95D39]" />
              <h3 className="font-black text-sm uppercase tracking-wider text-[#4A3B32]">
                Current Month Ledger Account Statement
              </h3>
            </div>
            
            <button 
              onClick={() => navigate('/student/history', { state: studentContext })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2ECE1] border border-[#4A3B32]/20 hover:bg-[#E6DEC9]/40 text-xs font-black tracking-wide text-[#4A3B32] shadow-md transition-all duration-150 active:scale-95"
            >
              <CalendarRange className="w-3.5 h-3.5 text-[#D95D39]" /> Past Month Bills
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-[#F2ECE1] p-4 rounded-xl border border-[#4A3B32]/10 shadow-sm hover:scale-[1.02] transition-transform duration-150">
              <p className="text-3xl font-black text-[#4A3B32]">{ledger.selectedMealsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/60 mt-1">Booked Meals</p>
            </div>
            
            <div className="bg-[#EDEFE9] p-4 rounded-xl border border-emerald-600/20 shadow-sm hover:scale-[1.02] transition-transform duration-150">
              <p className="text-3xl font-black text-emerald-700">{ledger.attendedMealsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600/70 mt-1">Checked-In</p>
            </div>
            
            <div className="bg-[#FCECE9] p-4 rounded-xl border border-red-600/20 shadow-sm hover:scale-[1.02] transition-transform duration-150">
              <p className="text-3xl font-black text-red-600">₹{ledger.totalPenaltyCharges}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-red-500/70 mt-1">Fines Issued</p>
            </div>
            
            <div className="bg-[#FDF3EE] p-4 rounded-xl border border-[#D95D39]/20 shadow-sm hover:scale-[1.02] transition-transform duration-150">
              <p className="text-3xl font-black text-[#D95D39]">₹{ledger.netAmountDue}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#D95D39]/70 mt-1">Net Balance</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;