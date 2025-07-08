import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-brand">
          <h1 onClick={() => navigate('/')} className="nav-title">
            Colleagues Directory
          </h1>
        </div>
        
        <div className="nav-actions">
          {user ? (
            <div className="auth-status">
              <span className="user-info">
                <span className="user-icon">👤</span>
                <span className="username">{user.username}</span>
                <span className="status-indicator online"></span>
              </span>
              <button onClick={handleLogout} className="nav-logout-button">
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
    </nav>
  );
};

export default Navigation; 