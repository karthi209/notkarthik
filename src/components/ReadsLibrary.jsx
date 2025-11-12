import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogs } from '../services/api';

export default function ReadsLibrary() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const books = await fetchLogs('books');
        setEntries(books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEntryClick = (entry) => {
    navigate(`/myverse/books/${entry._id || entry.id}`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching reading library...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Reads</h2>
        <p className="post-content">
          Books that changed my perspective, taught me something new, or just entertained me thoroughly.
        </p>
      </div>

      <div className="library-grid">
        {entries.length === 0 ? (
          <div className="post">
            <p className="post-content">No reading entries yet. Stay tuned!</p>
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
