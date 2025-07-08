import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ColleagueForm.css';

const ColleagueForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authHeader } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    hire_date: '',
    salary: '',
    notes: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const isEditing = Boolean(id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location]);

  const fetchColleague = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/colleagues/${id}`);
      if (!response.ok) {
        setError('Failed to fetch colleague');
        return;
      }
      const data = await response.json();
      
      // Convert date format for input field
      const hireDate = data.hire_date ? new Date(data.hire_date).toISOString().split('T')[0] : '';
      
      setFormData({
        name: data.name || '',
        position: data.position || '',
        department: data.department || '',
        email: data.email || '',
        phone: data.phone || '',
        hire_date: hireDate,
        salary: data.salary || '',
        notes: data.notes || ''
      });
      
      if (data.photo_url) {
        setPhotoPreview(data.photo_url);
      }
    } catch (err) {
      setError('Failed to fetch colleague');
      console.error('Error fetching colleague:', err);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      fetchColleague();
    }
  }, [isEditing, fetchColleague]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add photo if selected
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      const url = isEditing 
        ? `http://localhost:3001/api/colleagues/${id}`
        : 'http://localhost:3001/api/colleagues';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: authHeader ? { 'Authorization': authHeader } : undefined,
        body: formDataToSend
      });

      if (!response.ok) {
        setError('Failed to save colleague');
        setLoading(false);
        return;
      }

      const savedColleague = await response.json();
      navigate(`/colleague/${savedColleague.id}`);
    } catch (err) {
      setError('Failed to save colleague');
      setLoading(false);
      console.error('Error saving colleague:', err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="colleague-form-container">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Colleague' : 'Add New Colleague'}</h1>
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>

      {error && (
        <div className="form-error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="colleague-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Engineering"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Employment Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hire_date">Hire Date</label>
              <input
                type="date"
                id="hire_date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Photo</h3>
          
          <div className="photo-upload">
            <div className="photo-preview">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" />
              ) : (
                <div className="no-photo-preview">
                  <span>No photo</span>
                </div>
              )}
            </div>
            
            <div className="photo-input">
              <label htmlFor="photo" className="photo-label">
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-file-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes about the colleague..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : (isEditing ? 'Update Colleague' : 'Add Colleague')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColleagueForm; 