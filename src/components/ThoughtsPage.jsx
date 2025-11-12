import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchBlogs, fetchCategories, fetchBlogArchives } from '../services/api';
import './BlogsPage.css';

export default function ThoughtsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [archives, setArchives] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');

  // Ancient symbols - same as home page
  const symbols = [
    '◉', '◈', '⬢', '◐', '◑', '◓', '⊙', '⊚', '⊛', '☥', '⚶', '⚸',
    '◆', '◇', '●', '○', '■', '□', '▲', '△', '⬟', '⬠', '⬡', '◬', '⊗'
  ];

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

  // Handle tab change
  const handleCategoryChange = (category) => {
    setActiveTab(category);
    setSelectedCategory(category === 'all' ? '' : category);
    if (category === 'all') {
      setSearchParams({ tab: 'all' });
    } else {
      setSearchParams({ tab: category, category: category });
    }
  };

  // Re-fetch when category or sort changes
  useEffect(() => {
    handleFilter();
  }, [selectedCategory, sortOrder, selectedDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter blogs based on active tab
  const filteredBlogs = activeTab === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeTab);

  return (
    <div className="blogs-container">
      <aside className="blog-sidebar">
        {/* Categories */}
        <div className="blog-categories">
          <h3><span className="section-symbol-small">◈</span> Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button 
                onClick={() => handleCategoryChange('all')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0',
                  cursor: 'pointer',
                  color: activeTab === 'all' ? 'var(--color-accent)' : 'var(--color-text)',
                  fontWeight: activeTab === 'all' ? 'bold' : 'normal',
                  textDecoration: activeTab === 'all' ? 'underline' : 'none',
                  fontSize: '1rem',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                All
              </button>
            </li>
            {categories.map(category => (
              <li key={category}>
                <button 
                  onClick={() => handleCategoryChange(category)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem 0',
                    cursor: 'pointer',
                    color: activeTab === category ? 'var(--color-accent)' : 'var(--color-text)',
                    fontWeight: activeTab === category ? 'bold' : 'normal',
                    textDecoration: activeTab === category ? 'underline' : 'none',
                    fontSize: '1rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Archives */}
        <div className="blog-archives">
          <h3><span className="section-symbol-small">⬢</span> Archives</h3>
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
          <h3><span className="section-symbol-small">⊙</span> Sort By</h3>
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
          <h2 className="blog-title" style={{ marginBottom: 0 }}>
            <span className="section-symbol">◉</span> Thoughts
          </h2>
        </div>
        {filteredBlogs.length === 0 ? (
          <div className="post">
            <p className="post-content">No posts yet. Create your first thought!</p>
          </div>
        ) : (
          <div className="blog-cards-grid">
            {filteredBlogs.map((blog, index) => {
              // Deterministic symbol based on blog ID (consistent across renders)
              const symbolIndex = blog._id ? String(blog._id).charCodeAt(0) % symbols.length : index % symbols.length;
              const blogSymbol = symbols[symbolIndex];
              
              return (
                <Link 
                  key={blog._id} 
                  to={`/thoughts/${blog._id}`}
                  className="blog-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="blog-card-icon">{blogSymbol}</div>
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <div className="blog-card-date">{new Date(blog.date).toLocaleDateString()}</div>
                  {blog.category && (
                    <div className="blog-card-category">{blog.category}</div>
                  )}
                  <div className="blog-card-excerpt">
                    {String(blog.content || '').replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </div>
                  <div className="blog-card-footer">
                    <span className="blog-card-link">Read →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
