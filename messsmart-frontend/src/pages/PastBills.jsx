import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/client';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, CalendarRange, 
  Utensils, LogOut, ChevronDown 
} from 'lucide-react';

const PastBills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = location.state || {};
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Header State Elements
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Reusing studentData fallback or adminContext interface for naming conventions
  const contextName = studentData.name || 'User'; 

  useEffect(() => {
    const fetchHistory = async () => {
      if (!studentData.id) return;
      try {
        const res = await API.get(`/billing/history/${studentData.id}`);
        setHistory(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed loading historical statements", err);
        setLoading(false);
      }
    };
    fetchHistory();

    // Dropdown handler listener blueprint
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, [studentData.id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (!studentData.id) {
    return (
      <div className="min-h-screen bg-[#4A3B32] flex items-center justify-center text-[#FDFBF7] font-bold">
        <div className="text-center space-y-3">
          <p>Session context lost. Please return home.</p>
          <button onClick={() => navigate('/student/dashboard')} className="bg-[#D95D39] text-white px-4 py-2 rounded-xl">
            Go Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    /* 🚀 CHANGED: Background updated from flat light-cream to the clean premium dark-medium coffee theme */
    <div className="min-h-screen bg-gradient-to-b from-[#EFDECD] to-[#3D3029] text-[#FDFBF7] font-sans flex flex-col antialiased">
      
      {/* INTEGRATED HEADER SECTION FROM ADMINDASHBOARD */}
      <header className="bg-[#EFDECD] px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50 text-[#4A3B32]">
        <div className="flex items-center gap-3">
          <div className="bg-[#D95D39] p-2.5 rounded-xl text-white shadow-md cursor-pointer" onClick={() => navigate('/student/dashboard')}>
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#D95D39] cursor-pointer" onClick={() => navigate('/student/dashboard')}>
            MessSmart
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F2ECE1] border border-[#4A3B32]/10 hover:bg-[#E6DEC9]/50 transition-all duration-200 font-bold"
          >
            <div className="w-8 h-8 rounded-full bg-[#D95D39] text-white flex items-center justify-center font-black shadow-md">
              {contextName ? contextName.charAt(0) : 'U'}
            </div>
            <span className="font-bold text-sm hidden sm:inline text-[#4A3B32]">{contextName}</span>
            <ChevronDown className={`w-4 h-4 text-[#4A3B32]/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6DEC9] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden transform origin-top-right transition-all text-[#4A3B32]">
              <div className="px-4 py-3 bg-[#F2ECE1]/50 border-b border-[#4A3B32]/10">
                <p className="text-[10px] font-black text-[#4A3B32]/40 uppercase tracking-widest">Account Operator</p>
                <p className="font-black text-sm text-[#4A3B32] truncate">{contextName}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                Log Out Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* TABLE ARCHITECTURE */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-4">
        
        {/* Optional back-navigation button row */}
        <div className="flex justify-start">
          <div className="bg-[#F2ECE1] px-6 py-4 border-b border-[#4A3B32]/10 rounded-3xl">
              <h1 className="font-black text-lg tracking-tight text-[#4A3B32]">Past Month Bills</h1>
              <p className="text-xs text-[#4A3B32]/60 font-medium">Historical ledger records and clearance status</p>
            </div>
        </div>

        {loading ? (
          <div className="text-center py-12 font-black text-[#E6DEC9] animate-pulse">Gathering billing records...</div>
        ) : history.length === 0 ? (
          
          /* 🚀 CHANGED: Box panel treated with high contrast clear white to stay colorful at low angles */
          <div className="bg-white text-[#4A3B32] rounded-3xl p-12 text-center border border-[#E6DEC9] shadow-xl space-y-3">
            
            <br></br>
            <CalendarRange className="w-12 h-12 text-[#4A3B32]/20 mx-auto" />
            <h3 className="font-black text-base">No Archived Statements Found</h3>
            <p className="text-xs text-[#4A3B32]/60 max-w-xs mx-auto font-medium">
              Your account history is pristine. Archived summaries appear at the turn of each calendar rollover cycle.
            </p>
          </div>
        ) : (
          /* 🚀 CHANGED: Table wrapper set to high contrast white canvas panel */
          <div className="bg-white text-[#4A3B32] rounded-3xl border border-[#E6DEC9] shadow-2xl overflow-hidden">
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  {/* 🚀 CHANGED: Table headers color enhanced with warm background tints */}
                  <tr className="bg-[#F2ECE1]/50 border-b border-[#4A3B32]/10 text-xs font-black uppercase tracking-wider text-[#4A3B32]/80">
                    <th className="px-6 py-4">Billing Cycle</th>
                    <th className="px-6 py-4">Archived On</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4A3B32]/10 text-sm font-bold text-[#4A3B32]/90 bg-white">
                  {history.map((row) => (
                    <tr key={row.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="px-6 py-4 font-mono font-black text-[#D95D39]">{row.billingPeriod.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-xs text-[#4A3B32]/60 font-semibold">
                        {new Date(row.archivedAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-black text-[#4A3B32]">₹{row.finalBillAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                          row.paymentStatus === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {row.paymentStatus === 'PAID' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {row.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PastBills;