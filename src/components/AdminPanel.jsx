import { useEffect, useMemo, useState } from 'react';
import { adminCreateBlog, adminFetchFeaturedTweets, adminUpdateFeaturedTweets, getStoredApiKey, setStoredApiKey } from '../services/admin';
import { adminCreateLog } from '../services/logs-admin';

export default function AdminPanel() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  // Blog form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  // Featured tweets
  const [tweetUrls, setTweetUrls] = useState(['', '', '', '', '']);

  // Logs form
  const [logTitle, setLogTitle] = useState('');
  const [logType, setLogType] = useState('games');
  const [logContent, setLogContent] = useState('');
  const [logRating, setLogRating] = useState('');

  useEffect(() => {
    const key = getStoredApiKey();
    if (key) setApiKey(key);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const list = await adminFetchFeaturedTweets();
        const urls = (list || []).map((x) => x.url);
        setTweetUrls([urls[0] || '', urls[1] || '', urls[2] || '', urls[3] || '', urls[4] || '']);
      } catch { /* ignore */ }
    })();
  }, []);

  const canSubmitBlog = useMemo(() => apiKey && title && category && content, [apiKey, title, category, content]);

  const handleSaveKey = () => {
    setStoredApiKey(apiKey.trim());
    setStatus('API key saved');
    setTimeout(() => setStatus(''), 1500);
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    try {
      setStatus('Creating blog...');
      const tagsArray = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null;
      await adminCreateBlog({ title, content, category, tags: tagsArray });
      setStatus('Blog created');
      setTitle(''); setCategory('general'); setTags(''); setContent('');
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  const submitTweets = async (e) => {
    e.preventDefault();
    try {
      setStatus('Updating featured tweets...');
      const urls = tweetUrls.map((u) => u.trim()).filter(Boolean).slice(0, 5);
      await adminUpdateFeaturedTweets(urls);
      setStatus('Featured tweets updated');
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  const submitLog = async (e) => {
    e.preventDefault();
    try {
      setStatus('Creating log...');
      await adminCreateLog({ title: logTitle, type: logType, content: logContent, rating: logRating || null });
      setStatus('Log created');
      setLogTitle(''); setLogType('games'); setLogContent(''); setLogRating('');
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  return (
    <div className="container">
      <h2 className="post-title" style={{ marginTop: 'var(--space-lg)' }}>Admin Panel</h2>

      <section className="post" style={{ borderBottom: 'none' }}>
        <h3 className="twitter-sidebar-title">Authentication</h3>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <input
            type="password"
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ maxWidth: 480 }}
          />
          <button className="form-button form-button-primary" onClick={handleSaveKey}>Save Key</button>
          {status && <span style={{ color: 'var(--color-text-light)' }}>{status}</span>}
        </div>
      </section>

      <section className="post">
        <h3 className="twitter-sidebar-title">Create Blog</h3>
        <form onSubmit={submitBlog} className="add-content-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Content (Markdown)</label>
            <textarea className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="form-actions">
            <button className="form-button form-button-primary" type="submit" disabled={!canSubmitBlog}>Create Blog</button>
          </div>
        </form>
      </section>

      <section className="post">
        <h3 className="twitter-sidebar-title">Featured Tweets (max 5)</h3>
        <form onSubmit={submitTweets} className="add-content-form">
          {tweetUrls.map((u, i) => (
            <div className="form-group" key={i}>
              <label className="form-label">Tweet URL #{i + 1}</label>
              <input className="form-input" value={u} onChange={(e) => {
                const next = [...tweetUrls];
                next[i] = e.target.value;
                setTweetUrls(next);
              }} />
            </div>
          ))}
          <div className="form-actions">
            <button className="form-button form-button-primary" type="submit">Save Featured Tweets</button>
          </div>
        </form>
      </section>

      <section className="post">
        <h3 className="twitter-sidebar-title">Create Log</h3>
        <form onSubmit={submitLog} className="add-content-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={logTitle} onChange={(e) => setLogTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={logType} onChange={(e) => setLogType(e.target.value)}>
              <option value="games">Games</option>
              <option value="movies">Movies</option>
              <option value="series">TV Series</option>
              <option value="books">Books</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-textarea" value={logContent} onChange={(e) => setLogContent(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <input className="form-input" value={logRating} onChange={(e) => setLogRating(e.target.value)} />
          </div>
          <div className="form-actions">
            <button className="form-button form-button-primary" type="submit">Create Log</button>
          </div>
        </form>
      </section>
    </div>
  );
}


