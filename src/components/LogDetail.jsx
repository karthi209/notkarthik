import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function LogDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/logs/${category}/${id}`);
        
        if (!response.ok) {
          throw new Error('Log not found');
        }
        
        const data = await response.json();
        setLog(data);
      } catch (err) {
        console.error('Error fetching log:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category && id) {
      fetchLog();
    }
  }, [category, id]);

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching entry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Entry Not Found</h2>
          <div className="post-content">
            <p>Sorry, this entry doesn't exist or has been removed.</p>
            <p>
              <a 
                href="/myverse"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/myverse');
                }}
                className="read-more-link"
              >
                ← Back to Myverse
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="log-detail">
        <div className="log-detail-header">
          <button
            onClick={() => navigate('/myverse')}
            className="back-button"
          >
            ← Back to Myverse
          </button>
        </div>

        <article className="post">
          {log.image && (
            <div className="log-detail-image">
              <img src={log.image} alt={log.title} />
            </div>
          )}

          <header className="log-detail-title-section">
            <h1 className="post-title">{log.title}</h1>
            
            <div className="log-detail-meta">
              {log.rating && (
                <div className="log-detail-rating">
                  <span className="rating-label">Rating:</span>
                  <span className="rating-value">{log.rating}/5</span>
                </div>
              )}
              
              {log.category && (
                <div className="log-detail-category">
                  <span className="category-label">Category:</span>
                  <span className="category-value">{log.category}</span>
                </div>
              )}
              
              {log.created_at && (
                <div className="log-detail-date">
                  {new Date(log.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </header>

          {log.content && (
            <div className="post-content">
              <div dangerouslySetInnerHTML={{ __html: log.content }} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
