import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogs } from '../services/api';

export default function GamesLibrary() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await fetchLogs('games');
        setEntries(games);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEntryClick = (entry) => {
    navigate(`/myverse/games/${entry._id || entry.id}`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching games library...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Games</h2>
        <p className="post-content">
          Games I've played, reviewed, and can't stop thinking about. From indie gems to AAA blockbusters.
        </p>
      </div>

      <div className="library-grid">
        {entries.length === 0 ? (
          <div className="post">
            <p className="post-content">No game entries yet. Stay tuned!</p>
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
