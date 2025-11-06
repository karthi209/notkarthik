import { useEffect, useState } from 'react';
import { Tweet } from 'react-tweet';

// Extract tweet ID from X/Twitter URL
const extractTweetId = (url) => {
  if (!url) return null;
  const match = String(url).match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
};

export default function FeaturedTweets() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/featured-tweets`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setUrls((data || []).map((d) => d.url).slice(0, 5));
      } catch (err) {
        if (!cancelled) setError('');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null;
  if (!urls || urls.length === 0) return null;

  return (
    <div className="featured-tweets" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {urls.map((url, idx) => {
        const id = extractTweetId(url);
        if (!id) return null;
        return (
          <div
            key={idx}
            className="featured-tweet"
            data-theme="light"
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <div style={{ width: '100%', maxWidth: 900 }}>
              <Tweet id={id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}


