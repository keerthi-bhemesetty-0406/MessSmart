import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('messsmart_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Validate if token is expired based on current timestamp
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.sub,
            role: decoded.role, // Pulls "ROLE_STUDENT" or "ROLE_ADMIN" from JwtUtil claims
          });
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('messsmart_token', token);
    const decoded = jwtDecode(token);
    setUser({
      username: decoded.sub,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('messsmart_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);