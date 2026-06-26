import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';
import { User, Lock, Utensils, AlertCircle } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('ROLE_STUDENT'); // Maps to ROLE_STUDENT or ROLE_ADMIN
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (!username || !password) {
      setError('Please fill in all layout credentials.');
      return;
    }

  try {
    setLoading(true);
    
    const response = await API.post('/auth/login', {
      username: username.trim(),
      password: password,
      role: role
    });

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username.trim());
      
      if (typeof login === 'function') {
        login(response.data.token);
      }

      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError('Server responded successfully, but did not distribute a session token.');
    }

  } catch (err) {
    console.error("Login sequence execution catch:", err);
    const serverMessage = err.response?.data?.error || 'Authentication server connection failed.';
    setError(serverMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#EFDECD] via-[#4A3B32] to-[#3D3029] relative overflow-hidden selection:bg-[#D95D39] selection:text-white">
      {/* Decorative Warm Background Shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D95D39]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E6DEC9]/10 rounded-full blur-3xl"></div>

      {/* 🚀 CHANGED: Max width packed into a tighter sm window constraint to center lookups */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#E6DEC9] overflow-hidden z-10 my-auto">
        
        {/* Banner Identity Branding */}
        {/* 🚀 CHANGED: Reduced vertical tracking dimensions (p-6 -> py-3.5 px-6) */}
        <div className="bg-[#D95D39] py-3.5 px-6 text-center text-white relative">
          <div className="inline-flex p-1.5 bg-white/20 rounded-full mb-1 backdrop-blur-sm shadow-inner">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">MessSmart</h1>
          <p className="text-white/80 text-xs mt-0.5 font-medium">Campus Dining Management Platform</p>
        </div>

        {/* 🚀 CHANGED: Outer form box padding shifted down to p-5 to ensure elements fit above the fold line */}
        <div className="p-5">
          {/* Smooth Sliding Toggle Slider Control */}
          {/* 🚀 CHANGED: Slider vertical offset dropped down from mb-8 to mb-4 */}
          <div className="relative bg-[#F2ECE1] p-1 rounded-xl flex mb-4 border border-[#4A3B32]/15 shadow-inner">
            <div 
              className="absolute top-1 bottom-1 rounded-lg bg-white shadow border border-[#4A3B32]/20 transition-all duration-300 ease-out"
              style={{
                left: role === 'ROLE_STUDENT' ? '4px' : '50%',
                width: 'calc(50% - 4px)'
              }}
            />
            <button
              type="button"
              onClick={() => { setRole('ROLE_STUDENT'); setError(''); }}
              className="w-1/2 py-2 text-xs font-black rounded-lg z-10 transition-colors duration-200 text-[#4A3B32]"
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => { setRole('ROLE_ADMIN'); setError(''); }}
              className="w-1/2 py-2 text-xs font-black rounded-lg z-10 transition-colors duration-200 text-[#4A3B32]"
            >
              Admin Portal
            </button>
          </div>

          {/* Runtime Server Error Alerts */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {/* Form Endpoint Context Wrapper */}
          {/* 🚀 CHANGED: Input row gap margins tightened from space-y-5 to space-y-3 */}
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-1">
                Username ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4A3B32]/40">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  /* 🚀 CHANGED: Input fields padding packed together cleanly (py-3 -> py-2) */
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] transition-all placeholder:text-[#4A3B32]/30 text-[#4A3B32] font-bold text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#4A3B32]/80 mb-1">
                Password
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
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#4A3B32]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] transition-all placeholder:text-[#4A3B32]/30 text-[#4A3B32] font-bold text-xs"
                />
              </div>
            </div>

            {/* 🚀 CHANGED: Scaled down button padding for compact rendering tracking */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-[#D95D39] text-white rounded-xl font-black transition-all duration-150 hover:bg-[#BF4E2E] shadow-lg shadow-[#D95D39]/20 disabled:opacity-50 active:scale-[0.99] text-xs tracking-wide"
            >
              {loading ? 'Processing Context...' : `Sign In as ${role === 'ROLE_STUDENT' ? 'Student' : 'Administrator'}`}
            </button>
          </form>

          {/* Footer Routing Block */}
          {/* 🚀 CHANGED: Margins consolidated (mt-8 and pt-6 -> mt-4 and pt-3) */}
          <div className="mt-4 pt-3 border-t border-[#4A3B32]/10 text-center text-xs">
            <span className="text-[#4A3B32]/70 font-bold">New to the platform? </span>
            <Link 
              to={ '/register' } 
              className="font-black text-[#D95D39] hover:text-[#BF4E2E] underline decoration-[#D95D39]/40 underline-offset-4"
            >
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;