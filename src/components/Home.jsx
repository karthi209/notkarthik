import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThoughtsPage from './ThoughtsPage';
import WhoamiPage from './WhoamiPage';
import MyversePage from './MyversePage';
import MusicLibrary from './MusicLibrary';
import GamesLibrary from './GamesLibrary';
import ScreenLibrary from './ScreenLibrary';
import ReadsLibrary from './ReadsLibrary';
import FieldnotesPage from './FieldnotesPage';
import LabPage from './LabPage';
import BlogPost from './BlogPost';
import LogDetail from './LogDetail';
import AdminPanel from './AdminPanel';
import { fetchBlogs, fetchLogs } from '../services/api';
import '../styles/classic2000s.css';

export default function Home({ themeToggleButton }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState('home');
  const [activeLogTab, setActiveLogTab] = useState('games');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [myverseDropdownOpen, setMyverseDropdownOpen] = useState(false);
  const [myverseDropdownMobileOpen, setMyverseDropdownMobileOpen] = useState(false);
  const [entries, setEntries] = useState({
    blogs: [],
    games: [],
    movies: [],
    series: [],
    books: []
  });
  
  // Check if we're on a blog/thoughts post page
  const isBlogPostPage = location.pathname.startsWith('/blog/') || location.pathname.startsWith('/thoughts/');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLogDetailPage = location.pathname.startsWith('/myverse/') && location.pathname.split('/').length > 3;
  
  // Update active page based on URL - default to home
  useEffect(() => {
    if (isBlogPostPage || isLogDetailPage) {
      return; // Don't change active page for blog posts or log details
    }
    if (isAdminPage) {
      return; // Keep navigation untouched on admin
    }
    
    if (location.pathname === '/' || location.pathname === '') {
      setActivePage('home');
    } else if (location.pathname === '/thoughts' || location.pathname.startsWith('/thoughts')) {
      setActivePage('thoughts');
    } 
    else if (location.pathname === '/myverse' || location.pathname.startsWith('/myverse')) {
      setActivePage('myverse');
    } else if (location.pathname === '/fieldnotes' || location.pathname.startsWith('/fieldnotes')) {
      setActivePage('fieldnotes');
    } else if (location.pathname === '/lab' || location.pathname.startsWith('/lab')) {
      setActivePage('lab');
    } else if (location.pathname === '/whoami' || location.pathname.startsWith('/whoami')) {
      setActivePage('whoami');
    } else if (!location.pathname.startsWith('/blog/') && !location.pathname.startsWith('/thoughts/')) {
      // Default to home if path doesn't match (except blog posts)
      setActivePage('home');
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, isBlogPostPage, isLogDetailPage, isAdminPage, navigate]);

  const renderLibraryPage = () => {
    const path = location.pathname;
    if (path.includes('/myverse/music')) return <MusicLibrary />;
    if (path.includes('/myverse/games')) return <GamesLibrary />;
    if (path.includes('/myverse/screen')) return <ScreenLibrary />;
    if (path.includes('/myverse/reads')) return <ReadsLibrary />;
    return <MyversePage />;
  };
  
  const mainNavigation = [
    { id: 'home', name: 'Home', symbol: '◉' },
    { id: 'thoughts', name: 'Thoughts', symbol: '◈' },
    { id: 'myverse', name: 'Myverse', symbol: '⬢' },
    { id: 'fieldnotes', name: 'Fieldnotes', symbol: '◐' },
    { id: 'lab', name: 'Lab', symbol: '⊙' },
    { id: 'whoami', name: 'Whoami', symbol: '◆' },
  ];
  
  const logTabs = [
    { id: 'games', name: 'Games' },
    { id: 'movies', name: 'Movies' },
    { id: 'series', name: 'TV Series' },
    { id: 'books', name: 'Books' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const blogs = await fetchBlogs();
        const games = await fetchLogs('games');
        const movies = await fetchLogs('movies');
        const series = await fetchLogs('series');
        const books = await fetchLogs('books');
        
        setEntries({
          blogs,
          games,
          movies,
          series,
          books
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isBlogPostPage && !isLogDetailPage) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isBlogPostPage, isLogDetailPage]);

  const getActiveLogEntries = () => {
    return entries[activeLogTab] || [];
  };

  // All create/update actions now live in the /admin panel

  // X/Twitter username (without @) from env, fallback to placeholder
  const twitterUsername =
    import.meta.env.VITE_X_USERNAME ||
    import.meta.env.VITE_TWITTER_USERNAME ||
    'yourusername';

  const renderHomePage = () => {
    if (loading) {
      return (
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching blog posts...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="homepage-layout">
        <div className="homepage-main">
          <div className="hero-banner">
            <div className="geometric-hero">
              {/* Central sun */}
              <div className="geo-circle">☉</div>
              
              {/* 7 orbital rings */}
              <div className="geo-orbit orbit-1"></div>
              <div className="geo-orbit orbit-2"></div>
              <div className="geo-orbit orbit-3"></div>
              <div className="geo-orbit orbit-4"></div>
              <div className="geo-orbit orbit-5"></div>
              <div className="geo-orbit orbit-6"></div>
              <div className="geo-orbit orbit-7"></div>
              
              {/* Elliptical paths */}
              <div className="geo-ellipse ellipse-1"></div>
              <div className="geo-ellipse ellipse-2"></div>
              <div className="geo-ellipse ellipse-3"></div>
              
              {/* Planetary bodies with symbols */}
              <div className="geo-planet planet-1">☿</div>
              <div className="geo-planet planet-2">♀</div>
              <div className="geo-planet planet-3">⊕</div>
              <div className="geo-planet planet-4">♂</div>
              <div className="geo-planet planet-5">♃</div>
              <div className="geo-planet planet-6">♄</div>
              <div className="geo-planet planet-7">♅</div>
              <div className="geo-planet planet-8">♆</div>
              
              {/* Earth marker */}
              <div className="earth-marker">
                <div className="marker-text">← You're here</div>
              </div>
              
              {/* Asteroid belt dots */}
              <div className="asteroid-belt">
                <div className="asteroid a1">·</div>
                <div className="asteroid a2">·</div>
                <div className="asteroid a3">·</div>
                <div className="asteroid a4">·</div>
                <div className="asteroid a5">·</div>
                <div className="asteroid a6">·</div>
              </div>
              
              {/* Reference lines */}
              <div className="geo-line line-1"></div>
              <div className="geo-line line-2"></div>
              <div className="geo-line line-3"></div>
              <div className="geo-line line-4"></div>
              
              {/* Measurement markers */}
              <div className="geo-cross"></div>
              <div className="degree-marker m1">0°</div>
              <div className="degree-marker m2">90°</div>
              <div className="degree-marker m3">180°</div>
              <div className="degree-marker m4">270°</div>
              
              {/* Corner annotations */}
              <div className="corner-label label-tl">Kepler's Map</div>
              <div className="corner-label label-br">c. 1609</div>
            </div>
          </div>

          <div className="post hero-section">
            <div className="post-content">
              <p>
                $ whoami<br/>
                &gt; definitely not karthik
              </p>
              <p>
                You've found the space where I dump my thoughts, document my adventures,
                and occasionally pretend to be wise about technology. This is my corner of the internet
                where I write about anything that crosses my mind - from deep technical insights to 
                "why did I spend 4 hours debugging a missing semicolon?"
              </p>
              <p>
                Expect unfiltered thoughts, coding experiments, life observations, and probably 
                too many references to terminal commands. Consider this less of a blog and more 
                of a public journal with syntax highlighting.
              </p>
            </div>
          </div>

          <div>
            <h3 className="post-section-title">
              Recent Thoughts
            </h3>
            {entries.blogs.length === 0 ? (
              <div className="blog-card-empty">
                <p>No thoughts yet. Create your first post!</p>
              </div>
            ) : (
              <div className="blog-cards-grid">
                {entries.blogs.slice(0, 6).map((blog, index) => {
                  // Ancient symbols - all approximately same size
                  const symbols = [
                    '◉', // Circled dot
                    '◈', // Diamond with cross
                    '⬢', // Hexagon
                    '◐', // Half circle (moon phase)
                    '◑', // Inverted half circle
                    '◓', // Circle with quadrant
                    '⊙', // Circled dot operator
                    '⊚', // Circled ring
                    '⊛', // Circled asterisk
                    '☥', // Ankh
                    '⚶', // Trigram
                    '⚸', // Trigram
                    '◆', // Filled diamond
                    '◇', // Empty diamond
                    '●', // Filled circle
                    '○', // Empty circle
                    '■', // Filled square
                    '□', // Empty square
                    '▲', // Filled triangle
                    '△', // Empty triangle
                    '⬟', // Pentagon
                    '⬠', // Pentagon outline
                    '⬡', // Hexagon outline
                    '◬', // Square with dots
                    '⊗'  // Circled times
                  ];
                  
                  // Deterministic symbol based on blog ID (consistent across renders)
                  const symbolIndex = blog._id ? String(blog._id).charCodeAt(0) % symbols.length : index % symbols.length;
                  const blogSymbol = symbols[symbolIndex];
                  
                  return (
                    <div 
                      key={blog._id} 
                      className="blog-card"
                      onClick={() => navigate(`/thoughts/${blog._id}`)}
                    >
                      <div className="blog-card-icon">{blogSymbol}</div>
                      <h2 className="blog-card-title">{blog.title}</h2>
                      <div className="blog-card-date">{new Date(blog.date).toLocaleDateString()}</div>
                      <div className="blog-card-excerpt">
                        {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </div>
                      <div className="blog-card-footer">
                        <span className="blog-card-link">Read →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <aside className="homepage-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              Latest Logs
            </h3>
            <p className="sidebar-section-text">What I've been consuming lately</p>
            <ul className="sidebar-list">
              {['games','movies','series','books'].map(cat => {
                const slice = (entries[cat] || []).slice(0,3);
                if (slice.length === 0) return null;
                return (
                  <li key={cat} className="sidebar-list-block">
                    <div className="sidebar-list-heading">{cat}</div>
                    <ul className="sidebar-sublist">
                      {slice.map(item => (
                        <li key={item._id || item.id} className="sidebar-sublist-item">
                          <span className="sidebar-item-title">{item.title}</span>
                          {item.rating && (
                            <span className="sidebar-item-meta">{item.rating}/5</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              Quick Links
            </h3>
            <ul className="sidebar-quick-links">
              <li>
                <a href="/thoughts" onClick={(e) => { e.preventDefault(); navigate('/thoughts'); }}>
                  All Thoughts →
                </a>
              </li>
              <li>
                <a href="/myverse" onClick={(e) => { e.preventDefault(); navigate('/myverse'); }}>
                  Myverse →
                </a>
              </li>
              <li>
                <a href="/whoami" onClick={(e) => { e.preventDefault(); navigate('/whoami'); }}>
                  About Me →
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              Status
            </h3>
            <div className="sidebar-status">
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Currently online</span>
              </div>
              <p className="sidebar-section-text">
                Building in public, learning in public, failing in public.
              </p>
            </div>
          </div>
        </aside>
      </div>
    );
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="header-top">
            <h1 
              onClick={() => {
                setActivePage('home');
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="site-title"
              style={{ display: 'flex', alignItems: 'center', gap: '0.7em' }}
            >
              <span className="site-title-main">01100101</span>
              <span className="site-title-separator hide-mobile"> // </span>
              <span 
                className="site-title-subtitle hide-mobile"
                style={{ margin: 0, padding: 0 }}
              >
                thoughts and chaos
              </span>
            </h1>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
          
          <nav className={`navigation ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {mainNavigation.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    setActivePage(item.id);
                    navigate(`/${item.id === 'home' ? '' : item.id}`);
                    setMobileMenuOpen(false);
                  }}
                  className={activePage === item.id ? 'nav-link-active' : 'nav-link'}
                  data-symbol={item.symbol}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="nav-actions">
              {themeToggleButton}
            </div>
          </nav>
        </div>
      </header>

      <div className="container">
        <main>
          {isAdminPage ? (
            <AdminPanel />
          ) : isBlogPostPage ? (
            <BlogPost />
          ) : isLogDetailPage ? (
            <LogDetail />
          ) : (
            <>
              {activePage === 'home' && renderHomePage()}
              {activePage === 'thoughts' && <ThoughtsPage />}
              {activePage === 'myverse' && renderLibraryPage()}
              {activePage === 'fieldnotes' && <FieldnotesPage />}
              {activePage === 'lab' && <LabPage />}
              {activePage === 'whoami' && <WhoamiPage />}
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-brand">
              <span className="footer-title">01100101</span>
              <span className="footer-subtitle">thoughts and chaos</span>
            </div>
            <p className="footer-text">
              My corner of the internet where I document thoughts, code, and everything in between.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">
              <span className="footer-symbol">△</span>
              Navigate
            </h4>
            <ul className="footer-links">
              <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
              <li><a href="/thoughts" onClick={(e) => { e.preventDefault(); navigate('/thoughts'); }}>Thoughts</a></li>
              <li><a href="/myverse" onClick={(e) => { e.preventDefault(); navigate('/myverse'); }}>Myverse</a></li>
              <li><a href="/whoami" onClick={(e) => { e.preventDefault(); navigate('/whoami'); }}>Whoami</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">
              <span className="footer-symbol">⊙</span>
              Connect
            </h4>
            <ul className="footer-links">
              <li><a href="https://github.com/karthi209" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://x.com/notkarthik" target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
              <li><a href="mailto:hello@example.com">Email</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">
              <span className="footer-symbol">□</span>
              Meta
            </h4>
            <ul className="footer-links">
              <li><a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>Admin</a></li>
              <li><a href="https://github.com/karthi209/notkarthik" target="_blank" rel="noopener noreferrer">Source Code</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} definitely not karthik. Built with caffeine and curiosity.
          </p>
        </div>
      </footer>
    </div>
  );
}