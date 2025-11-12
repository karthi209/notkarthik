import { useNavigate } from 'react-router-dom';

export default function MyversePage() {
  const navigate = useNavigate();

  const libraries = [
    {
      id: 'music',
      name: 'Music',
      description: 'Playlists, albums, and songs that define my soundtrack',
      path: '/myverse/music',
      icon: '♫'
    },
    {
      id: 'games',
      name: 'Games',
      description: 'Games I have played, reviewed, and cannot stop thinking about',
      path: '/myverse/games',
      icon: '⌘'
    },
    {
      id: 'screen',
      name: 'Screen',
      description: 'Movies and TV series worth watching',
      path: '/myverse/screen',
      icon: '▶'
    },
    {
      id: 'reads',
      name: 'Reads',
      description: 'Books that changed my perspective',
      path: '/myverse/reads',
      icon: '◈'
    }
  ];

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Myverse</h2>
        <p className="post-content">
          My personal universe of entertainment - a collection of everything I consume, 
          review, and obsess over. From music to games, screens to reads.
        </p>
      </div>

      <div className="myverse-hub-grid">
        {libraries.map((library) => (
          <div
            key={library.id}
            className="myverse-hub-card"
            onClick={() => navigate(library.path)}
          >
            <div className="myverse-hub-icon">{library.icon}</div>
            <h3 className="myverse-hub-title">{library.name}</h3>
            <p className="myverse-hub-description">{library.description}</p>
            <span className="myverse-hub-link">Explore →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
