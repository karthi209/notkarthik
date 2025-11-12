import React from 'react';
import './styles/variables.css';
import './styles/typography.css';
import './styles/classic2000s.css';
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
  // Minimal ASCII-style icons
  const icon = theme === 'dark' ? '☾' : '☀';
  
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
              <span className="theme-icon">{icon}</span>
              <span>{theme === 'dark' ? 'dark' : 'light'}</span>
            </button>
          }
        />
      } />
    </Routes>
  );
}

export default App;
