import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchBlogs } from '../services/api';
import './BlogPost.css';
import DOMPurify from 'dompurify';

export default function BlogPost() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract ID from URL pathname if not in params (fallback for catch-all routes)
  const id = paramId || location.pathname.replace('/blog/', '').replace('/thoughts/', '');

  // Ancient symbol for the post (randomized based on ID for consistency)
  const symbols = [
    '◉', '◈', '⬢', '◐', '◑', '◓', '⊙', '⊚', '⊛', '☥', '⚶', '⚸',
    '◆', '◇', '●', '○', '■', '□', '▲', '△', '⬟', '⬠', '⬡', '◬', '⊗'
  ];
  // Use ID to deterministically pick a symbol for this post
  const postSymbol = symbols[id ? String(id).charCodeAt(0) % symbols.length : 0];

  useEffect(() => {
    // Reset state when ID changes
    setLoading(true);
    setError(null);
    setPost(null);

    // Don't fetch if ID is still undefined or empty
    if (!id) {
      setError('Invalid blog post ID');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        // Use remote backend API URL
        let apiUrl = import.meta.env.VITE_API_URL;
        // If VITE_API_URL already ends with /api, don't add it again
        if (apiUrl && !apiUrl.endsWith('/api')) {
          apiUrl = apiUrl + '/api';
        }
        const response = await fetch(`${apiUrl}/blogs/${id}`);
        if (!response.ok) {
          throw new Error(
            response.status === 404 
              ? 'Blog post not found' 
              : 'Failed to fetch blog post'
          );
        }
        const data = await response.json();
        setPost(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, location.pathname]);

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Error</h2>
          <div className="post-content">
            <p>{error}</p>
            <p>
              The blog post you're looking for might have been removed or doesn't exist.
            </p>
            <p>
              <a 
                href="/thoughts"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/thoughts');
                }}
                className="read-more-link"
              >
                ← Back to thoughts
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <article className="post blog-post-article">
        <div className="blog-post-nav">
          <a 
            href="/thoughts"
            onClick={(e) => {
              e.preventDefault();
              navigate('/thoughts');
            }}
            className="back-link"
            title="Back to thoughts"
          >
            ◀
          </a>
        </div>
        <div className="blog-post-header">
          <div className="blog-post-symbol-top">{postSymbol}</div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-metadata-group">
            <span className="post-date">
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="post-category-badge">{post.category}</span>
          </div>
        </div>
        <div className="post-content">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(post.content || '', {
                ADD_TAGS: ['iframe'],
                ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
              })
            }}
          />
        </div>
        <footer className="post-footer">
          {post.tags && post.tags.length > 0 && (
            <div className="post-footer-tags">
              <span className="section-symbol-small">⊙</span>
              <span>Tags: {post.tags.join(', ')}</span>
            </div>
          )}
        </footer>
      </article>
    </div>
  );
} 