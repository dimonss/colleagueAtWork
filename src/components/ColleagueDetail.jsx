import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStatusStream } from '../hooks/useStatusStream';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../config/api';
import Modal from './Modal';
import './ColleagueDetail.css';

const ColleagueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authHeader } = useAuth();
  const [colleague, setColleague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getStatus } = useStatusStream();

  const fetchColleague = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colleagues/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Colleague not found');
        } else {
          setError('Failed to fetch colleague');
        }
        setLoading(false);
        return;
      }
      const data = await response.json();
      setColleague(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch colleague');
      setLoading(false);
      console.error('Error fetching colleague:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchColleague();
  }, [fetchColleague]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  // Get synchronized status - prioritize SSE data over local data
  const getCurrentStatus = () => {
    if (!colleague) return null;
    const sseStatus = getStatus(colleague.id);
    return sseStatus !== null ? sseStatus : colleague.is_at_work;
  };

  const handleStatusToggle = async () => {
    if (!colleague) return;
    
    const currentStatus = getCurrentStatus();
    const newStatus = !currentStatus;
    
    setStatusLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/colleagues/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_at_work: newStatus })
      });

      if (response.ok) {
        console.log('Status updated successfully');
      } else {
        console.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !authHeader) {
      setError('Authentication required to delete colleague');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/colleagues/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
        }
      });

      if (response.ok) {
        navigate('/', { replace: true });
      } else {
        setError('Failed to delete colleague');
      }
    } catch (err) {
      setError('Failed to delete colleague');
      console.error('Error deleting colleague:', err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading colleague information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="back-button">Back to Team</Link>
        </div>
      </div>
    );
  }

  if (!colleague) {
    return (
      <div className="error-container">
        <div className="error">
          <h2>Colleague Not Found</h2>
          <p>The colleague you're looking for doesn't exist.</p>
          <Link to="/" className="back-button">Back to Team</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="colleague-detail">
      <div className="detail-header">
        <Link to="/" className="back-link">
          ← Back to Team
        </Link>
        <div className="detail-actions">
          <button 
            onClick={() => navigate(`/edit/${id}`)} 
            className="edit-colleague-btn"
          >
            Edit Colleague
          </button>
          {user && (
            <button 
              onClick={handleDeleteClick}
              className="delete-colleague-btn"
            >
              Delete Colleague
            </button>
          )}
        </div>
      </div>
      
      <div className="detail-content">
        <div className="detail-photo">
          {colleague.photo_url ? (
            <img src={colleague.photo_url} alt={colleague.name} />
          ) : (
            <div className="no-photo-large">
              <span>{colleague.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        
        <div className="detail-info">
          <div className="detail-header-info">
            <h1>{colleague.name}</h1>
            <div className="status-toggle">
              <span className={`status-indicator ${getCurrentStatus() ? 'online' : 'offline'}`}>
                {getCurrentStatus() ? '🟢' : '🔴'}
              </span>
              <button 
                onClick={handleStatusToggle}
                disabled={statusLoading}
                className={`status-button ${getCurrentStatus() ? 'at-work' : 'not-at-work'}`}
              >
                {statusLoading ? 'Updating...' : (getCurrentStatus() ? 'At Work' : 'Not at Work')}
              </button>
            </div>
          </div>
          
          {colleague.position && (
            <div className="info-section">
              <h3>Position</h3>
              <p>{colleague.position}</p>
            </div>
          )}
          
          {colleague.department && (
            <div className="info-section">
              <h3>Department</h3>
              <p>{colleague.department}</p>
            </div>
          )}
          
          {colleague.email && (
            <div className="info-section">
              <h3>Email</h3>
              <p>
                <a href={`mailto:${colleague.email}`}>{colleague.email}</a>
              </p>
            </div>
          )}
          
          {colleague.phone && (
            <div className="info-section">
              <h3>Phone</h3>
              <p>
                <a href={`tel:${colleague.phone}`}>{colleague.phone}</a>
              </p>
            </div>
          )}
          
          {colleague.hire_date && (
            <div className="info-section">
              <h3>Hire Date</h3>
              <p>{formatDate(colleague.hire_date)}</p>
            </div>
          )}
          
          {colleague.salary && (
            <div className="info-section">
              <h3>Salary</h3>
              <p>{formatSalary(colleague.salary)}</p>
            </div>
          )}
          
          {colleague.notes && (
            <div className="info-section">
              <h3>Notes</h3>
              <p>{colleague.notes}</p>
            </div>
          )}
          
          <div className="info-section">
            <h3>Member Since</h3>
            <p>{formatDate(colleague.created_at)}</p>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Colleague"
        message={`Are you sure you want to delete ${colleague.name}? This action cannot be undone and will permanently remove all their information and photo.`}
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmButtonClass="danger"
      />
    </div>
  );
};

export default ColleagueDetail; 