import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogs } from '../services/api';

export default function ScreenLibrary() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movies = await fetchLogs('movies');
        const series = await fetchLogs('series');
        setEntries([...movies, ...series]);
      } catch (error) {
        console.error('Error fetching screen content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEntryClick = (entry) => {
    const category = entry.type || entry.category || 'movies';
    navigate(`/myverse/${category}/${entry._id || entry.id}`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching screen library...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Screen</h2>
        <p className="post-content">
          Movies and TV series that left an impact. My reviews and thoughts on what's worth watching.
        </p>
      </div>

      <div className="library-grid">
        {entries.length === 0 ? (
          <div className="post">
            <p className="post-content">No screen entries yet. Stay tuned!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry._id || entry.id} 
              className="library-card"
              onClick={() => handleEntryClick(entry)}
            >
              {entry.image && (
                <div className="library-card-image">
                  <img src={entry.image} alt={entry.title} />
                </div>
              )}
              <div className="library-card-content">
                <h3 className="library-card-title">{entry.title}</h3>
                {entry.rating && (
                  <div className="library-card-rating">
                    <span className="rating-value">{entry.rating}/5</span>
                  </div>
                )}
                {entry.content && (
                  <p className="library-card-excerpt">
                    {entry.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
