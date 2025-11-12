import { useEffect, useMemo, useState } from 'react';
import { adminCreateBlog, getStoredApiKey, setStoredApiKey } from '../services/admin';
import { adminCreateLog } from '../services/logs-admin';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('thoughts'); // thoughts, games, movies, series, books, music
  
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  // Blog/Thought form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('tech');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  // Log form (games, movies, series, books)
  const [logTitle, setLogTitle] = useState('');
  const [logContent, setLogContent] = useState('');
  const [logRating, setLogRating] = useState(5);
  const [logType, setLogType] = useState('games');

  // Music form
  const [musicTitle, setMusicTitle] = useState('');
  const [musicArtist, setMusicArtist] = useState('');
  const [musicAlbum, setMusicAlbum] = useState('');
  const [musicSpotifyUrl, setMusicSpotifyUrl] = useState('');
  const [musicNotes, setMusicNotes] = useState('');

  // Quill modules configuration - simplified for mobile
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    const key = getStoredApiKey();
    if (key) setApiKey(key);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Get credentials from environment variables
    const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password';
    
    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setUsername('');
    setPassword('');
  };

  const canSubmitBlog = useMemo(() => title && category && content, [title, category, content]);

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
      setStatus('Blog created successfully!');
      setTitle(''); setCategory('tech'); setTags(''); setContent('');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  const submitLog = async (e) => {
    e.preventDefault();
    try {
      setStatus(`Creating ${logType} entry...`);
      await adminCreateLog({ 
        title: logTitle, 
        type: logType, 
        content: logContent, 
        rating: parseInt(logRating) 
      });
      setStatus(`${logType.charAt(0).toUpperCase() + logType.slice(1)} entry created successfully!`);
      setLogTitle(''); setLogContent(''); setLogRating(5);
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  const submitMusic = async (e) => {
    e.preventDefault();
    try {
      setStatus('Creating music entry...');
      // For now, create as a log entry with type 'music'
      await adminCreateLog({ 
        title: `${musicTitle} - ${musicArtist}`, 
        type: 'music', 
        content: `Album: ${musicAlbum}\nSpotify: ${musicSpotifyUrl}\n\n${musicNotes}`, 
        rating: 0 
      });
      setStatus('Music entry created successfully!');
      setMusicTitle(''); setMusicArtist(''); setMusicAlbum(''); setMusicSpotifyUrl(''); setMusicNotes('');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  const tabs = [
    { id: 'thoughts', name: 'Thoughts', symbol: '◈' },
    { id: 'games', name: 'Games', symbol: '⌘' },
    { id: 'movies', name: 'Movies', symbol: '▶' },
    { id: 'series', name: 'TV Series', symbol: '▶' },
    { id: 'books', name: 'Books', symbol: '◈' },
    { id: 'music', name: 'Music', symbol: '♫' },
  ];

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="post" style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem' }}>
          <h2 className="post-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>
          <form onSubmit={handleLogin} className="add-content-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                className="form-input" 
                type="text"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                className="form-input" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
            <div className="form-actions">
              <button className="form-button form-button-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 'var(--space-md)', 
        marginBottom: 'var(--space-lg)',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <h2 className="post-title" style={{ 
          margin: 0, 
          flex: '1 1 auto', 
          fontSize: 'clamp(1.1rem, 4vw, 1.75rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span className="section-symbol" style={{ fontSize: '0.9em' }}>◉</span> 
          <span>Admin Panel</span>
        </h2>
        <button 
          className="form-button" 
          onClick={handleLogout}
          style={{ 
            padding: '0.6rem 1.1rem',
            fontSize: '0.85rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            flex: '0 0 auto',
            whiteSpace: 'nowrap',
            minWidth: '90px',
            background: 'var(--color-text)',
            color: 'var(--color-background)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div 
        className="admin-tabs-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem', 
          marginBottom: 'var(--space-lg)', 
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.75rem'
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setStatus('');
              if (tab.id !== 'thoughts' && tab.id !== 'music') {
                setLogType(tab.id);
              }
            }}
            className="admin-tab-button"
            style={{
              padding: '0.65rem 0.5rem',
              border: activeTab === tab.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-background)' : 'var(--color-text)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: activeTab === tab.id ? '600' : '500',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              minHeight: '68px',
              textAlign: 'center',
              lineHeight: '1.2'
            }}
          >
            <span style={{ opacity: 0.8, fontSize: '1.3em', display: 'block' }}>{tab.symbol}</span>
            <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {tab.name}
            </span>
          </button>
        ))}
      </div>

      {/* Thoughts Form */}
      {activeTab === 'thoughts' && (
        <section className="post" style={{ padding: 'var(--space-lg)' }}>
          <h3 className="twitter-sidebar-title" style={{ marginBottom: 'var(--space-md)', fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
            Create Thought
          </h3>
          <form onSubmit={submitBlog} className="add-content-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="general">General</option>
                <option value="tech">Tech</option>
                <option value="life">Life</option>
                <option value="coding">Coding</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input 
                className="form-input" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="react, javascript, webdev"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <div className="quill-wrapper" style={{ 
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                />
              </div>
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--color-text-light)', 
                marginTop: '0.5rem' 
              }}>
                Essential formatting tools: Headers, Bold, Lists, Links, Code blocks
              </p>
            </div>
            <div className="form-actions">
              <button className="form-button form-button-primary" type="submit" disabled={!canSubmitBlog}>
                Create Thought
              </button>
            </div>
            {status && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: status.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                border: `1px solid ${status.includes('Error') ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)'}`,
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                {status}
              </div>
            )}
          </form>
        </section>
      )}

      {/* Games, Movies, Series, Books Form */}
      {['games', 'movies', 'series', 'books'].includes(activeTab) && (
        <section className="post" style={{ padding: 'var(--space-lg)' }}>
          <h3 className="twitter-sidebar-title" style={{ marginBottom: 'var(--space-md)', fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Entry
          </h3>
          <form onSubmit={submitLog} className="add-content-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                className="form-input" 
                value={logTitle} 
                onChange={(e) => setLogTitle(e.target.value)} 
                placeholder={`Name of the ${activeTab === 'series' ? 'TV series' : activeTab.slice(0, -1)}`}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <input 
                className="form-input" 
                type="number" 
                min="1" 
                max="5" 
                value={logRating} 
                onChange={(e) => setLogRating(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Review / Notes</label>
              <textarea 
                className="form-textarea" 
                value={logContent} 
                onChange={(e) => setLogContent(e.target.value)}
                placeholder="Your thoughts, review, or notes..."
                rows="8"
                style={{ minHeight: '200px' }}
              />
            </div>
            <div className="form-actions">
              <button className="form-button form-button-primary" type="submit">
                Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1)}
              </button>
            </div>
            {status && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: status.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                border: `1px solid ${status.includes('Error') ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)'}`,
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                {status}
              </div>
            )}
          </form>
        </section>
      )}

      {/* Music Form */}
      {activeTab === 'music' && (
        <section className="post" style={{ padding: 'var(--space-lg)' }}>
          <h3 className="twitter-sidebar-title" style={{ marginBottom: 'var(--space-md)', fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
            Add Music / Playlist
          </h3>
          <form onSubmit={submitMusic} className="add-content-form">
            <div className="form-group">
              <label className="form-label">Song / Playlist Title</label>
              <input 
                className="form-input" 
                value={musicTitle} 
                onChange={(e) => setMusicTitle(e.target.value)} 
                placeholder="Song or playlist name"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Artist</label>
              <input 
                className="form-input" 
                value={musicArtist} 
                onChange={(e) => setMusicArtist(e.target.value)} 
                placeholder="Artist or band name"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Album (optional)</label>
              <input 
                className="form-input" 
                value={musicAlbum} 
                onChange={(e) => setMusicAlbum(e.target.value)} 
                placeholder="Album name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Spotify URL (optional)</label>
              <input 
                className="form-input" 
                value={musicSpotifyUrl} 
                onChange={(e) => setMusicSpotifyUrl(e.target.value)} 
                placeholder="https://open.spotify.com/..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea 
                className="form-textarea" 
                value={musicNotes} 
                onChange={(e) => setMusicNotes(e.target.value)}
                placeholder="Why you love it, when you discovered it, etc..."
                rows="6"
                style={{ minHeight: '150px' }}
              />
            </div>
            <div className="form-actions">
              <button className="form-button form-button-primary" type="submit">
                Add Music
              </button>
            </div>
            {status && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: status.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                border: `1px solid ${status.includes('Error') ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)'}`,
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                {status}
              </div>
            )}
          </form>
        </section>
      )}
    </div>
  );
}








