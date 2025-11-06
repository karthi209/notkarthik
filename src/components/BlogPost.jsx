import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Tweet } from 'react-tweet';
import { fetchBlogs } from '../services/api';
import './BlogPost.css';

// Helper function to safely convert content to string for ReactMarkdown
const safeMarkdownContent = (content) => {
  if (typeof content === 'string') {
    return content;
  }
  if (content == null) {
    return '';
  }
  return String(content);
};

// Extract tweet ID from Twitter/X URL
const extractTweetId = (url) => {
  if (!url) return null;
  
  // Match patterns like:
  // https://twitter.com/username/status/1234567890
  // https://x.com/username/status/1234567890
  // twitter.com/username/status/1234567890
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
};

// Custom component to render links, with special handling for Twitter URLs
const MarkdownLink = ({ href, children }) => {
  const tweetId = extractTweetId(href);
  
  if (tweetId) {
    return (
      <div style={{ margin: 'var(--space-xl) 0', display: 'flex', justifyContent: 'center' }}>
        <Tweet id={tweetId} />
      </div>
    );
  }
  
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

// Custom component to render paragraphs, detecting standalone Twitter URLs
const MarkdownParagraph = ({ children }) => {
  // Check if the paragraph contains only a Twitter URL as text (no other content)
  const text = typeof children === 'string' ? children.trim() : 
               Array.isArray(children) ? children.map(c => {
                 if (typeof c === 'string') return c;
                 // If it's a link, get its href
                 if (c && c.props && c.props.href) return c.props.href;
                 return '';
               }).join('').trim() : '';
  
  const tweetId = extractTweetId(text);
  
  // Only replace if the paragraph is essentially just a Twitter URL (with optional whitespace)
  if (tweetId && text.match(/^https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+\/?\s*$/i)) {
    return (
      <div style={{ margin: 'var(--space-xl) 0', display: 'flex', justifyContent: 'center' }}>
        <Tweet id={tweetId} />
      </div>
    );
  }
  
  return <p>{children}</p>;
};

export default function BlogPost() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract ID from URL pathname if not in params (fallback for catch-all routes)
  const id = paramId || location.pathname.replace('/blog/', '');

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
      <div className="post">
        <h2 className="post-title">Loading...</h2>
        <div className="post-content">
          <p>Fetching blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post">
        <h2 className="post-title">Error</h2>
        <div className="post-content">
          <p>{error}</p>
          <p>
            The blog post you're looking for might have been removed or doesn't exist.
          </p>
          <p>
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="read-more-link"
            >
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="post">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="read-more-link"
          style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}
        >
          ← Back to home
        </a>
      </div>
      <article className="post">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-date">
          Posted on {new Date(post.date).toLocaleDateString()} in {post.category}
        </div>
        <div className="post-content">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => <MarkdownLink href={href}>{children}</MarkdownLink>,
              p: ({ children }) => <MarkdownParagraph>{children}</MarkdownParagraph>
            }}
          >
            {safeMarkdownContent(post.content)}
          </ReactMarkdown>
        </div>
        <footer className="post-footer">
          <div className="post-footer-main">
            <div>
              Filed under: <span style={{ fontFamily: 'var(--font-body)' }}>{post.category}</span>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="post-footer-tags">
              Tags: {post.tags.join(', ')}
            </div>
          )}
        </footer>
      </article>
    </div>
  );
} 