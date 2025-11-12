import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FieldnotesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API integration
  useEffect(() => {
    // TODO: Fetch fieldnotes/travel entries from backend
    setEntries([]);
  }, []);

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Fieldnotes</h2>
        <p className="post-content">
          Travel logs, personal journeys, and adventures. Documentation of places visited,
          experiences lived, and lessons learned along the way.
        </p>
      </div>

      {loading ? (
        <div className="post">
          <p className="post-content">Loading fieldnotes...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="post">
          <p className="post-content">
            No fieldnotes yet. The journey begins soon...
          </p>
        </div>
      ) : (
        entries.map((entry, index) => (
          <div key={index} className="post">
            <h3 className="post-title">
              <Link to={`/fieldnotes/${entry.slug}`}>{entry.title}</Link>
            </h3>
            <div className="post-date">{new Date(entry.date).toLocaleDateString()}</div>
            <div className="post-content">
              <p>{entry.excerpt}</p>
            </div>
            <Link to={`/fieldnotes/${entry.slug}`} className="read-more-link">
              Read more →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
