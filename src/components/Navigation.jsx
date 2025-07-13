import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useStatusStream } from '../hooks/useStatusStream';
import Modal from './Modal';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isConnected } = useStatusStream();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-brand">
          <h1 onClick={() => navigate('/')} className="nav-title">
            Colleagues Directory
          </h1>
          <div className="connection-status">
            <span className="online-status-indicator">
              {isConnected ? '🟢' : '🔴'}
            </span>
            <span className="status-text">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="nav-actions">
          {user ? (
            <div className="auth-status">
              <span className="user-info">
                <span className="user-icon">👤</span>
                <span className="username">{user.username}</span>
                <span className="status-indicator online"></span>
              </span>
              <button onClick={handleLogoutClick} className="nav-logout-button">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-status">
              <span className="user-info">
                <span className="user-icon">🔒</span>
                <span className="username">Guest</span>
                <span className="status-indicator offline"></span>
              </span>
              <button onClick={() => navigate('/login')} className="nav-login-button">
                Login
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to add or edit colleagues."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </nav>
  );
};

export default Navigation; 