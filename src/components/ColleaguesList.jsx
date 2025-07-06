import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ColleaguesList.css';

const ColleaguesList = () => {
  const [colleagues, setColleagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchColleagues();
  }, []);

  const fetchColleagues = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/colleagues');
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
      <h1>Our Team</h1>
      <div className="colleagues-grid">
        {colleagues.map((colleague) => (
          <Link 
            to={`/colleague/${colleague.id}`} 
            key={colleague.id} 
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ColleaguesList; 