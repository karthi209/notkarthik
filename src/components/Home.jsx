import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BlogsPage from './BlogsPage';
import LogsPage from './LogsPage';
import AboutPage from './AboutPage';
import BlogPost from './BlogPost';
import ElfsightTwitter from './ElfsightTwitter';
import FeaturedTweets from './FeaturedTweets';
import AdminPanel from './AdminPanel';
import { fetchBlogs, fetchLogs } from '../services/api';
import '../classic2000s.css';

export default function Home({ themeToggleButton }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState('home');
  const [activeLogTab, setActiveLogTab] = useState('games');
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState({
    blogs: [],
    games: [],
    movies: [],
    series: [],
    books: []
  });
  
  // Check if we're on a blog post page
  const isBlogPostPage = location.pathname.startsWith('/blog/');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Update active page based on URL - default to home
  useEffect(() => {
    if (isBlogPostPage) {
      return; // Don't change active page for blog posts
    }
    if (isAdminPage) {
      return; // Keep navigation untouched on admin
    }
    
    if (location.pathname === '/' || location.pathname === '') {
      setActivePage('home');
    } else if (location.pathname === '/blogs' || location.pathname.startsWith('/blogs')) {
      setActivePage('blogs');
    } else if (location.pathname === '/logs' || location.pathname.startsWith('/logs')) {
      setActivePage('logs');
    } else if (location.pathname === '/about' || location.pathname.startsWith('/about')) {
      setActivePage('about');
    } else if (!location.pathname.startsWith('/blog/')) {
      // Default to home if path doesn't match (except blog posts)
      setActivePage('home');
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, isBlogPostPage, isAdminPage, navigate]);
  
  const mainNavigation = [
    { id: 'home', name: 'home' },
    { id: 'blogs', name: 'blogs' },
    { id: 'logs', name: 'logs' },
    { id: 'about', name: 'about' },
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

    if (!isBlogPostPage) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isBlogPostPage]);

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
          <div className="post">
            <h2 className="post-title">Welcome!</h2>
            <div className="post-date">{new Date().toLocaleDateString()}</div>
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
            <h3 className="post-section-title">Featured Blog Posts</h3>
            {entries.blogs.length === 0 ? (
              <div className="post">
                <p className="post-content">No blog posts yet. Create your first post!</p>
              </div>
            ) : (
              entries.blogs.slice(0, 7).map(blog => (
                <div key={blog._id} className="post">
                  <h2 className="post-title">
                    <a 
                      href={`/blog/${blog._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/blog/${blog._id}`);
                      }}
                      className="post-title-link"
                    >
                      {blog.title}
                    </a>
                  </h2>
                  <div className="post-date">{new Date(blog.date).toLocaleDateString()}</div>
                  <div className="post-content">
                    <p>{blog.content.substring(0, 300)}...</p>
                    <p>
                      <a 
                        href={`/blog/${blog._id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/blog/${blog._id}`);
                        }}
                        className="read-more-link"
                      >
                        Continue reading →
                      </a>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="homepage-sidebar">
          <div className="twitter-sidebar-container">
            <h3 className="twitter-sidebar-title">Featured Tweets</h3>
            <FeaturedTweets />
          </div>
        </aside>
      </div>
    );
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <h1 
            onClick={() => {
              setActivePage('home');
              navigate('/');
            }}
            className="site-title"
          >
            <span className="site-title-main">notkarthik</span>
            <span className="site-title-separator"> // </span>
            <span className="site-title-subtitle">thoughts and chaos</span>
          </h1>
          <nav className="navigation" style={{ display: 'flex', alignItems: 'center' }}>
            {mainNavigation.map((item, idx) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                  navigate(`/${item.id === 'home' ? '' : item.id}`);
                }}
                className={activePage === item.id ? 'nav-link-active' : 'nav-link'}
              >
                {item.name}
              </a>
            ))}
            {themeToggleButton}
          </nav>
        </div>
      </header>
      <div className="container">
        <main>
          {isAdminPage ? (
            <AdminPanel />
          ) : isBlogPostPage ? (
            <BlogPost />
          ) : (
            <>
              {activePage === 'home' && renderHomePage()}
              {activePage === 'blogs' && <BlogsPage entries={entries.blogs} />}
              {activePage === 'logs' && (
                <LogsPage 
                  entries={getActiveLogEntries()} 
                  activeTab={activeLogTab}
                  setActiveTab={setActiveLogTab}
                  tabs={logTabs}
                />
              )}
              {activePage === 'about' && <AboutPage />}
            </>
          )}
        </main>
      </div>
      {/* Creation UI removed; use /admin for all write operations */}
    </div>
  );
}