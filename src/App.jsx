import React from 'react';
import './styles/variables.css';
import './styles/typography.css';
import './styles/book.css';
import './styles/responsive.css';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';

function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
}

function App() {
  const [theme, toggleTheme] = useTheme();
  // Classic moon/sun SVG icon
  const icon = theme === 'dark'
    ? (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}><path d="M15.5 10.5C15.5 13.5376 13.0376 16 10 16C8.85714 16 7.78571 15.6429 6.92857 15C9.5 15 12 12.5 12 10C12 7.5 9.5 5 6.92857 5C7.78571 4.35714 8.85714 4 10 4C13.0376 4 15.5 6.46243 15.5 10.5Z" fill="#FFD700"/></svg>)
    : (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}><circle cx="10" cy="10" r="5" fill="#222"/><g stroke="#222" strokeWidth="1.5"><line x1="10" y1="1" x2="10" y2="4"/><line x1="10" y1="16" x2="10" y2="19"/><line x1="1" y1="10" x2="4" y2="10"/><line x1="16" y1="10" x2="19" y2="10"/><line x1="3.5" y1="3.5" x2="5.5" y2="5.5"/><line x1="14.5" y1="14.5" x2="16.5" y2="16.5"/><line x1="3.5" y1="16.5" x2="5.5" y2="14.5"/><line x1="14.5" y1="5.5" x2="16.5" y2="3.5"/></g></svg>);
  return (
    <Routes>
      <Route path="/*" element={
        <Home
          themeToggleButton={
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {icon}
              <span>{theme === 'dark' ? 'dark' : 'light'}</span>
            </button>
          }
        />
      } />
    </Routes>
  );
}

export default App;
