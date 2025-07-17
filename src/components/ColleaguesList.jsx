import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStatusStream } from '../hooks/useStatusStream';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../config/api';
import Modal from './Modal';
import './ColleaguesList.css';

const ColleaguesList = () => {
  const navigate = useNavigate();
  const { user, authHeader } = useAuth();
  const [colleagues, setColleagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [colleagueToDelete, setColleagueToDelete] = useState(null);
  const { getStatus } = useStatusStream();

  useEffect(() => {
    fetchColleagues();
  }, []);

  const fetchColleagues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colleagues`);
      if (!response.ok) {
        setError('Failed to load colleagues');
        setLoading(false);
        return;
      }
      const data = await response.json();
      setColleagues(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load colleagues');
      setLoading(false);
      console.error('Error fetching colleagues:', err);
    }
  };

  const handleDeleteClick = (e, colleague) => {
    e.preventDefault();
    e.stopPropagation();
    setColleagueToDelete(colleague);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !authHeader || !colleagueToDelete) {
      setError('Authentication required to delete colleague');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/colleagues/${colleagueToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
        }
      });

      if (response.ok) {
        // Remove from local state
        setColleagues(prev => prev.filter(c => c.id !== colleagueToDelete.id));
        setShowDeleteModal(false);
        setColleagueToDelete(null);
      } else {
        setError('Failed to delete colleague');
      }
    } catch (err) {
      setError('Failed to delete colleague');
      console.error('Error deleting colleague:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setColleagueToDelete(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading colleagues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchColleagues}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="colleagues-list">
      <div className="list-header">
        <h1>Our Team</h1>
        <button
          onClick={() => navigate('/add')}
          className="add-colleague-btn"
        >

          + Add Colleague
        </button>
      </div>
      <div className="colleagues-grid">
        {colleagues.map((colleague) => (
          <div key={colleague.id} className="colleague-card-wrapper">
            <Link
              to={`/colleague/${colleague.id}`}
              className="colleague-card"
            >
              <div className="colleague-photo">
                {colleague.photo_url ? (
                  <img src={colleague.photo_url} alt={colleague.name} />
                ) : (
                  <div className="no-photo">
                    <span>{colleague.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="colleague-info">
                <h3>{colleague.name}</h3>
                <p className="position">{colleague.position || 'Position not specified'}</p>
                <p className="department">{colleague.department || 'Department not specified'}</p>
                <p className="status-text">
                  {getStatus(colleague.id) !== null ? (getStatus(colleague.id) ? 'At Work' : 'Not at Work') : (colleague.is_at_work ? 'At Work' : 'Not at Work')}
                  <span className={`status-dot ${getStatus(colleague.id) !== null ? (getStatus(colleague.id) ? 'online' : 'offline') : (colleague.is_at_work ? 'online' : 'offline')}`}>
                    {getStatus(colleague.id) !== null ? (getStatus(colleague.id) ? '🟢' : '🔴') : (colleague.is_at_work ? '🟢' : '🔴')}
                  </span>
                </p>
              </div>
            </Link>
            {user && (
              <button
                onClick={(e) => handleDeleteClick(e, colleague)}
                className="delete-colleague-btn-small"
                title="Delete colleague"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Colleague"
        message={colleagueToDelete ? `Are you sure you want to delete ${colleagueToDelete.name}? This action cannot be undone and will permanently remove all their information and photo.` : ''}
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
    </div>
  );
};

export default ColleaguesList; 