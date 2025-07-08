import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authHeader, setAuthHeader] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (username && password) {
      setUser({ username });
      setAuthHeader('Basic ' + btoa(`${username}:${password}`));
    }
  }, []);

  const login = (username, password) => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    setUser({ username });
    setAuthHeader('Basic ' + btoa(`${username}:${password}`));
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    setUser(null);
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, authHeader, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 