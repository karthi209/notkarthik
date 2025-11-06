import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { fetchBlogs, fetchCategories, fetchBlogArchives } from '../services/api';
import './BlogsPage.css';

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [archives, setArchives] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch all necessary data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [blogsData, categoriesData, archivesData] = await Promise.all([
          fetchBlogs(),
          fetchCategories(),
          fetchBlogArchives()
        ]);
        setBlogs(blogsData);
        setCategories(categoriesData);
        setArchives(archivesData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      }
    };
    loadData();
  }, []);

  // Apply filters and sorting
  const handleFilter = async () => {
    try {
      const filters = {
        category: selectedCategory,
        sortBy: 'date',
        order: sortOrder
      };
      if (selectedDate) {
        const [year, month] = selectedDate.split('-');
        filters.startDate = new Date(year, month - 1, 1);
        filters.endDate = new Date(year, month, 0);
      }
      const filteredBlogs = await fetchBlogs(filters);
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error('Error filtering blogs:', error);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="blogs-container">
      <aside className="blog-sidebar">
        {/* Category Filter */}
        <div className="blog-categories">
          <h3>Categories</h3>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleFilter();
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Archives */}
        <div className="blog-archives">
          <h3>Archives</h3>
          <ul>
            {archives.map(archive => (
              <li key={`${archive._id.year}-${archive._id.month}`}>
                <button 
                  onClick={() => {
                    setSelectedDate(`${archive._id.year}-${archive._id.month}`);
                    handleFilter();
                  }}
                >
                  {monthNames[archive._id.month - 1]} {archive._id.year}
                  <span className="post-count">({archive.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sort Order */}
        <div className="blog-sort">
          <h3>Sort By</h3>
          <select 
            value={sortOrder} 
            onChange={(e) => {
              setSortOrder(e.target.value);
              handleFilter();
            }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </aside>

      <main className="blog-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 className="blog-title" style={{ marginBottom: 0 }}>Blog Posts</h2>
        </div>
        {blogs.length === 0 ? (
          <div className="post">
            <p className="post-content">No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          blogs.map(blog => (
          <article key={blog._id} className="blog-post">
            <h3 className="post-title">
              <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
            </h3>
            <div className="post-metadata">
              <span className="post-date">
                {new Date(blog.date).toLocaleDateString()}
              </span>
              <span className="post-category">{blog.category}</span>
            </div>
            <div className="post-preview">
              <ReactMarkdown>
                {safeMarkdownContent(blog.content).substring(0, 200) + '...'}
              </ReactMarkdown>
            </div>
            <Link to={`/blog/${blog._id}`} className="read-more">
              Read More →
            </Link>
          </article>
          ))
        )}
      </main>
    </div>
  );
}