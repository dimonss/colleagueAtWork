import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ColleagueDetail.css';

const ColleagueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [colleague, setColleague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchColleague = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/colleagues/${id}`);
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

  const handleStatusToggle = async () => {
    if (!colleague) return;
    
    setStatusLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/colleagues/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_at_work: !colleague.is_at_work })
      });

      if (response.ok) {
        const updatedColleague = await response.json();
        setColleague(updatedColleague);
      } else {
        console.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setStatusLoading(false);
    }
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
        <button 
          onClick={() => navigate(`/edit/${id}`)} 
          className="edit-colleague-btn"
        >
          Edit Colleague
        </button>
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
              <button 
                onClick={handleStatusToggle}
                disabled={statusLoading}
                className={`status-button ${colleague.is_at_work ? 'at-work' : 'not-at-work'}`}
              >
                {statusLoading ? 'Updating...' : (colleague.is_at_work ? 'At Work' : 'Not at Work')}
              </button>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Position</h3>
            <p>{colleague.position || 'Not specified'}</p>
          </div>
          
          <div className="info-section">
            <h3>Department</h3>
            <p>{colleague.department || 'Not specified'}</p>
          </div>
          
          <div className="info-section">
            <h3>Email</h3>
            <p>
              {colleague.email ? (
                <a href={`mailto:${colleague.email}`}>{colleague.email}</a>
              ) : (
                'Not specified'
              )}
            </p>
          </div>
          
          <div className="info-section">
            <h3>Phone</h3>
            <p>
              {colleague.phone ? (
                <a href={`tel:${colleague.phone}`}>{colleague.phone}</a>
              ) : (
                'Not specified'
              )}
            </p>
          </div>
          
          <div className="info-section">
            <h3>Hire Date</h3>
            <p>{formatDate(colleague.hire_date)}</p>
          </div>
          
          <div className="info-section">
            <h3>Salary</h3>
            <p>{formatSalary(colleague.salary)}</p>
          </div>
          
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
    </div>
  );
};

export default ColleagueDetail; 