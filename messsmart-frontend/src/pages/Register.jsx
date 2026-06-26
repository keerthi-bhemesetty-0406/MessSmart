import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/client';
import { User, Lock, Utensils, AlertCircle, CheckCircle2, Building, Layers } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  // Primary Navigation Toggles
  const [role, setRole] = useState('STUDENT'); // STUDENT or ADMIN
  const [adminType, setAdminType] = useState('NEW_MESS'); // NEW_MESS or EXISTING_MESS

  // Input Field State Models
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMessId, setSelectedMessId] = useState('');
  const [newMessName, setNewMessName] = useState('');

  // Dropdown Fetch Collection
  const [messes, setMesses] = useState([]);
  
  // Interface Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all existing mess profiles natively from the backend on mount or role toggle
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const response = await API.get('/messes');
        
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.messes)) {
          data = response.data.messes;
        }

        setMesses(data);
      } catch (err) {
        console.error('Failed to load active mess building locations.', err);
      }
    };
    
    fetchMesses();
  }, [role, adminType]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password) {
      setError('Please provide all mandatory structural credentials.');
      return;
    }

    setLoading(true);
    let endpoint = '';
    let payload = { name: name.trim(), username: username.trim(), password: password };

    if (role === 'STUDENT') {
      if (!selectedMessId) {
        setError('Please select a dining mess building.');
        setLoading(false);
        return;
      }
      endpoint = '/auth/register/student';
      payload.messId = selectedMessId;
    } else if (role === 'ADMIN' && adminType === 'NEW_MESS') {
      if (!newMessName.trim()) {
        setError('Please specify a unique name for the new mess facility.');
        setLoading(false);
        return;
      }
      endpoint = '/auth/register/admin/new-mess';
      payload.messName = newMessName.trim();
    } else {
      if (!selectedMessId) {
        setError('Please choose an existing mess location to manage.');
        setLoading(false);
        return;
      }
      endpoint = '/auth/register/admin/existing-mess';
      payload.messId = selectedMessId;
    }

    try {
      const response = await API.post(endpoint, payload);
      setSuccess(response.data.message || 'Account generated successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration gateway error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#EFDECD] via-[#4A3B32] to-[#3D3029] relative overflow-hidden selection:bg-[#D95D39] selection:text-white">
      {/* Background Ambience Accent Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D95D39]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E6DEC9]/10 rounded-full blur-3xl"></div>

      {/* 🚀 CHANGED: max-w condensed slightly to keep proportions locked cleanly into view heights */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#E6DEC9] overflow-hidden z-10 my-auto">
        
        {/* Banner Brand Identity */}
        {/* 🚀 CHANGED: Condensed inner vertical padding (p-6 -> py-3.5 px-6) and icon dimensions to elevate fold bounds */}
        <div className="bg-[#D95D39] py-3.5 px-6 text-center text-white relative">
          <div className="inline-flex p-1.5 bg-white/20 rounded-full mb-1 backdrop-blur-sm shadow-inner">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">Join MessSmart</h1>
          <p className="text-white/70 text-xs mt-0.5 font-bold">Register your profile for campus dining logs</p>
        </div>

        {/* 🚀 CHANGED: Shifted wrapper from padding p-8 down to p-5 for complete layout scannability */}
        <div className="p-5">
          
          {/* Slider Row 1: Primary Role Choice (Student vs Admin) */}
          {/* 🚀 CHANGED: Reduced vertical margins (mb-5 -> mb-3) */}
          <div className="relative bg-[#F2ECE1] p-1 rounded-xl flex mb-3 border border-[#4A3B32]/15 shadow-inner">
            <div 
              className="absolute top-1 bottom-1 rounded-lg bg-white shadow border border-[#4A3B32]/20 transition-all duration-300 ease-out"
              style={{
                left: role === 'STUDENT' ? '4px' : '50%',
                width: 'calc(50% - 4px)'
              }}
            />
            <button
              type="button"
              onClick={() => { setRole('STUDENT'); setError(''); setSuccess(''); }}
              className="w-1/2 py-1.5 text-xs font-black rounded-lg z-10 transition-colors duration-200 text-[#4A3B32]"
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => { setRole('ADMIN'); setError(''); setSuccess(''); }}
              className="w-1/2 py-1.5 text-xs font-black rounded-lg z-10 transition-colors duration-200 text-[#4A3B32]"
            >
              Admin Portal
            </button>
          </div>

          {/* Slider Row 2: Secondary Operational Choice */}
          {/* 🚀 CHANGED: Reduced margins (mb-6 -> mb-4) and py padding values */}
          {role === 'ADMIN' && (
            <div className="relative bg-[#F2ECE1] p-1 rounded-xl flex mb-4 border border-[#4A3B32]/15 shadow-inner animate-fadeIn">
              <div 
                className="absolute top-1 bottom-1 rounded-lg bg-white shadow border border-[#4A3B32]/20 transition-all duration-300 ease-out"
                style={{
                  left: adminType === 'NEW_MESS' ? '4px' : '50%',
                  width: 'calc(50% - 4px)'
                }}
              />
              <button
                type="button"
                onClick={() => { setAdminType('NEW_MESS'); setError(''); }}
                className="w-1/2 py-1 text-[11px] font-black rounded-lg z-10 transition-colors duration-200 text-[#4A3B32]"
              >
                Create New Mess
              </button>
              <button
                type="button"
                onClick={() => { setAdminType('EXISTING_MESS'); setError(''); }}
                className="w-1/2 py-1 text-[11px] font-black rounded-lg z-10 transition-colors duration-200 text-[#4A3B32]"
              >
                Existing Mess Staff
              </button>
            </div>
          )}

          {/* Alert Callouts */}
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
              <span className="font-bold">{success}</span>
            </div>
          )}

          {/* Registration Input Form Fields */}
          {/* 🚀 CHANGED: space-y-4 condensed down to space-y-2.5 to pack the lines closer */}
          <form onSubmit={handleSignupSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-0.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4A3B32]/40">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your first and last name"
                  /* 🚀 CHANGED: Shaved input vertical padding (py-2.5 -> py-2) */
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-[#4A3B32] font-bold placeholder:text-[#4A3B32]/30 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-0.5">
                Account Username ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4A3B32]/40">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose unique username account id"
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-[#4A3B32] font-bold placeholder:text-[#4A3B32]/30 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-0.5">
                Secure Account Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4A3B32]/40">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-[#4A3B32] font-bold placeholder:text-[#4A3B32]/30 text-xs"
                />
              </div>
            </div>

            {((role === 'STUDENT') || (role === 'ADMIN' && adminType === 'EXISTING_MESS')) && (
              <div className="animate-fadeIn">
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-0.5">
                  Select Assigned Mess Building Location
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4A3B32]/40">
                    <Building className="w-3.5 h-3.5" />
                  </span>
                  <select
                    value={selectedMessId}
                    onChange={(e) => setSelectedMessId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-[#4A3B32] font-bold text-xs appearance-none"
                  >
                    <option value="" disabled hidden>-- Select a Mess Location --</option>
                    {messes.length === 0 ? (
                      <option value="">No mess locations configured on server</option>
                    ) : (
                      messes.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.messName} (ID: {m.id})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            )}

            {role === 'ADMIN' && adminType === 'NEW_MESS' && (
              <div className="animate-fadeIn">
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-0.5">
                  New Mess Facility Corporate Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4A3B32]/40">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={newMessName}
                    onChange={(e) => setNewMessName(e.target.value)}
                    placeholder="E.g., North Campus Dining, Mess 1"
                    className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-[#4A3B32] font-bold placeholder:text-[#4A3B32]/30 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 🚀 CHANGED: Py action spacing reduced for tighter compilation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-[#D95D39] text-white rounded-xl font-black transition-all duration-150 hover:bg-[#BF4E2E] shadow-lg shadow-[#D95D39]/20 disabled:opacity-50 active:scale-[0.99] text-xs tracking-wide"
            >
              {loading ? 'Creating Profile Context...' : 'Submit Profile Registration'}
            </button>
          </form>

          {/* Footer Routing Block */}
          {/* 🚀 CHANGED: mt-6 and pt-5 pulled down to mt-4 and pt-3 */}
          <div className="mt-4 pt-3 border-t border-[#4A3B32]/10 text-center text-xs">
            <span className="text-[#4A3B32]/70 font-bold">Already have an active profile? </span>
            <Link 
              to="/login" 
              className="font-black text-[#D95D39] hover:text-[#BF4E2E] underline decoration-[#D95D39]/40 underline-offset-4"
            >
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;