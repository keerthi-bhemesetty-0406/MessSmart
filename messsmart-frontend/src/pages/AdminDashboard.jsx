import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';
import { 
  Utensils, User, LogOut, Check, X, 
  Scan, Users, Building, ChevronDown, Eye, Calendar, Activity, Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [showStudentsCard, setShowStudentsCard] = useState(true);
  const [showAdminsCard, setShowAdminsCard] = useState(true);

  const [adminContext, setAdminContext] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pendingStudents, setPendingStudents] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);

  const [mealAnalytics, setMealAnalytics] = useState({
    date: '',
    breakfast: { optIn: 0, optOut: 0, status: 'LIVE' },
    lunch: { optIn: 0, optOut: 0, status: 'LIVE' },
    dinner: { optIn: 0, optOut: 0, status: 'LIVE' }
  });

  const loadDashboardData = async () => {
    try {
      const storedUsername = localStorage.getItem('username');
      if (!storedUsername) {
        navigate('/login');
        return;
      }
      
      const profileRes = await API.get(`/admin/profile/${storedUsername}`);
      setAdminContext(profileRes.data); 
      localStorage.setItem('name', profileRes.data.name);
      
      const currentMessId = profileRes.data.messId;
      
      const [studRes, adminRes, countRes, analyticsRes] = await Promise.all([
        API.get(`/admin/pending/students/${currentMessId}`),
        API.get(`/admin/pending/admins/${currentMessId}`),
        API.get(`/admin/count/students/${currentMessId}`),
        API.get(`/admin/analytics/meals/${currentMessId}`)
      ]);

      setPendingStudents(studRes.data);
      setPendingAdmins(adminRes.data);
      setTotalStudentsCount(countRes.data.count || 0);
      setMealAnalytics(analyticsRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error("Error synchronizing dynamic dashboard operational vectors:", err);
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    loadDashboardData();

    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  const handleApprovalAction = async (type, action, id) => {
    const endpoint = `/admin/${action}/${type}/${id}`;
    try {
      if (action === 'approve') {
        await API.post(endpoint);
      } else {
        await API.delete(endpoint);
      }
      loadDashboardData();
    } catch (err) {
      alert("Execution gate error updating profile constraint.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading || !adminContext) {
    return (
      <div className="min-h-screen bg-[#4A3B32] flex items-center justify-center text-[#E6DEC9] font-bold tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <Utensils className="w-8 h-8 text-[#D95D39] animate-spin" />
          <span>Synchronizing Operational Dashboard View...</span>
        </div>
      </div>
    );
  }

  return (
    /* 🚀 CHANGED: Background updated to premium dark-medium gradient theme layer blueprints */
    <div className="min-h-screen bg-gradient-to-b from-[#EFDECD] to-[#3D3029] text-[#FDFBF7] font-sans flex flex-col antialiased">
      
      {/* HEADER SECTION */}
      {/* 🚀 CHANGED: Pure white head navigation panel elements */}
      <header className="bg-[#EFDECD] px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50 text-[#4A3B32]">
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
              {adminContext.name ? adminContext.name.charAt(0) : 'A'}
            </div>
            <span className="font-bold text-sm hidden sm:inline text-[#4A3B32]">{adminContext.name}</span>
            <ChevronDown className={`w-4 h-4 text-[#4A3B32]/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6DEC9] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden transform origin-top-right transition-all text-[#4A3B32]">
              <div className="px-4 py-3 bg-[#F2ECE1]/50 border-b border-[#4A3B32]/10">
                <p className="text-[10px] font-black text-[#4A3B32]/40 uppercase tracking-widest">Account Operator</p>
                <p className="font-black text-sm text-[#4A3B32] truncate">{adminContext.name}</p>
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

      {/* MAIN BODY WRAPPER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* BANNER ROW HERO CARD */}
        <div className="relative bg-gradient-to-r from-[#D95D39] to-[#FA724B] p-6 rounded-3xl shadow-xl text-white overflow-hidden border border-[#D95D39]/20">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
            <Utensils className="w-44 h-44" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="bg-[#4A3B32] text-white font-black uppercase text-[10px] px-2.5 py-1 rounded-full tracking-wider shadow-md">
                Operational Terminal Active
              </span>
              <h2 className="text-3xl font-black tracking-tight mt-2 drop-shadow-sm">Hello, {adminContext.name}!</h2>
              <div className="text-sm text-white/90 mt-1 font-bold flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#4A3B32]" />
                <span>Assigned Facility: <strong className="text-white font-extrabold underline decoration-[#4A3B32] decoration-2">{adminContext.messName}</strong></span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 text-center min-w-[140px] shadow-inner">
              <p className="text-3xl font-black text-white">{totalStudentsCount}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/80 mt-0.5">Registered Students</p>
            </div>
          </div>
        </div>

        {/* LIVE HEADCOUNT ANALYTICS SECTION */}
        {/* 🚀 CHANGED: Box dashboard layers treated with solid high contrast white cards */}
        <div className="bg-white text-[#4A3B32] border border-[#E6DEC9] p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#4A3B32]/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D95D39]" />
              <h3 className="font-black text-sm uppercase tracking-wider text-[#4A3B32]">
                Daily Roster Summary Headcounts
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black bg-[#F2ECE1] px-3 py-1.5 rounded-xl text-[#4A3B32] border border-[#4A3B32]/10 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#D95D39]" />
              <span className="font-mono">{mealAnalytics.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* BREAKFAST ANALYTICS */}
            <div className="p-5 rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between h-40 shadow-md bg-white border-[#9F8170] hover:scale-[1.01]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-base tracking-tight text-[#4A3B32]">Breakfast</span>
                  <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-200`}>
                    {mealAnalytics.breakfast.status}
                  </span>
                </div>
                <p className="text-[11px] font-black mt-1 px-2 py-0.5 bg-[#4A3B32]/5 text-[#4A3B32]/50 rounded w-max">Cut-off: 4:00 AM</p>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-[#4A3B32]/10 pt-3 text-center">
                <div className="border-r border-[#4A3B32]/10">
                  <p className="text-2xl font-black text-emerald-700">{mealAnalytics.breakfast.optIn}</p>
                  <p className="text-[10px] font-black uppercase text-[#4A3B32]/40 tracking-wider">Opted In</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-red-600">{mealAnalytics.breakfast.optOut}</p>
                  <p className="text-[10px] font-black uppercase text-[#4A3B32]/40 tracking-wider">Opted Out</p>
                </div>
              </div>
            </div>

            {/* LUNCH ANALYTICS */}
            <div className="p-5 rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between h-40 shadow-md bg-white border-[#9F8170] hover:scale-[1.01]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-base tracking-tight text-[#4A3B32]">Lunch</span>
                  <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-200`}>
                    {mealAnalytics.lunch.status}
                  </span>
                </div>
                <p className="text-[11px] font-black mt-1 px-2 py-0.5 bg-[#4A3B32]/5 text-[#4A3B32]/50 rounded w-max">Cut-off: 10:00 AM</p>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-[#4A3B32]/10 pt-3 text-center">
                <div className="border-r border-[#4A3B32]/10">
                  <p className="text-2xl font-black text-emerald-700">{mealAnalytics.lunch.optIn}</p>
                  <p className="text-[10px] font-black uppercase text-[#4A3B32]/40 tracking-wider">Opted In</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-red-600">{mealAnalytics.lunch.optOut}</p>
                  <p className="text-[10px] font-black uppercase text-[#4A3B32]/40 tracking-wider">Opted Out</p>
                </div>
              </div>
            </div>

            {/* DINNER ANALYTICS */}
            <div className="p-5 rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between h-40 shadow-md bg-white border-[#9F8170] hover:scale-[1.01]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-base tracking-tight text-[#4A3B32]">Dinner</span>
                  <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-200`}>
                    {mealAnalytics.dinner.status}
                  </span>
                </div>
                <p className="text-[11px] font-black mt-1 px-2 py-0.5 bg-[#4A3B32]/5 text-[#4A3B32]/50 rounded w-max">Cut-off: 5:00 PM</p>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-[#4A3B32]/10 pt-3 text-center">
                <div className="border-r border-[#4A3B32]/10">
                  <p className="text-2xl font-black text-emerald-700">{mealAnalytics.dinner.optIn}</p>
                  <p className="text-[10px] font-black uppercase text-[#4A3B32]/40 tracking-wider">Opted In</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-red-600">{mealAnalytics.dinner.optOut}</p>
                  <p className="text-[10px] font-black uppercase text-[#4A3B32]/40 tracking-wider">Opted Out</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* OPERATIONS TOKEN ACCESS SCANNER BLOCK */}
        <div className="bg-white text-[#4A3B32] border border-[#E6DEC9] p-6 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-200">
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4A3B32]/50">Roster Attendance Verification Gateway</p>
            <button 
              onClick={() => navigate('/admin/scan')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D95D39] hover:bg-[#BF4E2E] text-white font-black px-8 py-4 rounded-xl shadow-xl shadow-[#D95D39]/30 transition-all duration-150 active:scale-[0.98] text-sm tracking-wide"
            >
              <Scan className="w-5 h-5" />
              Scan Student Meal Token
            </button>
          </div>
        </div>

        {/* PENDING OPERATOR MATCH REQUESTS ROWS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD A: PENDING STUDENTS */}
          <div className="bg-white text-[#4A3B32] border border-[#E6DEC9] rounded-3xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-[#F2ECE1] px-5 py-4 border-b border-[#4A3B32]/10 flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#4A3B32]/80 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D95D39]" />
                Pending Students ({pendingStudents.length})
              </h3>
              <button 
                onClick={() => setShowStudentsCard(!showStudentsCard)}
                className="p-1 rounded-lg text-[#4A3B32]/40 hover:bg-[#E6DEC9]/40 hover:text-[#4A3B32] transition-colors"
              >
                {showStudentsCard ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {showStudentsCard && (
              <div className="p-4 flex-1 min-h-[160px]">
                {pendingStudents.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#4A3B32]/10 rounded-xl text-[#4A3B32]/40">
                    <p className="text-sm font-bold">No incoming student registrations.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {pendingStudents.map((student) => (
                      <div key={student.id} className="bg-[#F2ECE1]/30 border border-[#4A3B32]/5 p-3 rounded-xl flex items-center justify-between gap-2 transition-all hover:bg-[#F2ECE1]/50 animate-fadeIn">
                        <div className="truncate">
                          <p className="font-bold text-sm text-[#4A3B32] truncate">{student.name}</p>
                          <p className="text-xs text-[#4A3B32]/50 font-bold truncate">@{student.username}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button 
                            onClick={() => handleApprovalAction('student', 'approve', student.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleApprovalAction('student', 'dismiss', student.id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CARD B: PENDING STAFF ADMINS */}
          <div className="bg-white text-[#4A3B32] border border-[#E6DEC9] rounded-3xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-[#F2ECE1] px-5 py-4 border-b border-[#4A3B32]/10 flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#4A3B32]/80 flex items-center gap-2">
                <User className="w-4 h-4 text-[#D95D39]" />
                Pending Admins ({pendingAdmins.length})
              </h3>
              <button 
                onClick={() => setShowAdminsCard(!showAdminsCard)}
                className="p-1 rounded-lg text-[#4A3B32]/40 hover:bg-[#E6DEC9]/40 hover:text-[#4A3B32] transition-colors"
              >
                {showAdminsCard ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {showAdminsCard && (
              <div className="p-4 flex-1 min-h-[160px]">
                {pendingAdmins.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#4A3B32]/10 rounded-xl text-[#4A3B32]/40">
                    <p className="text-sm font-bold">No pending administrative team requests.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {pendingAdmins.map((staff) => (
                      <div key={staff.id} className="bg-[#F2ECE1]/30 border border-[#4A3B32]/5 p-3 rounded-xl flex items-center justify-between gap-2 transition-all hover:bg-[#F2ECE1]/50 animate-fadeIn">
                        <div className="truncate">
                          <p className="font-bold text-sm text-[#4A3B32] truncate">{staff.name}</p>
                          <p className="text-xs text-[#4A3B32]/50 font-bold truncate">@{staff.username}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button 
                            onClick={() => handleApprovalAction('admin', 'approve', staff.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleApprovalAction('admin', 'dismiss', staff.id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;