import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LabPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Placeholder for future API integration
  useEffect(() => {
    // TODO: Fetch projects from backend or GitHub API
    setProjects([]);
  }, []);

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Lab</h2>
        <p className="post-content">
          My tech playground - experimental projects, creative code, side projects, 
          and anything I'm currently tinkering with. Some work in progress, some abandoned, 
          all interesting.
        </p>
      </div>

      {loading ? (
        <div className="post">
          <p className="post-content">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="post">
          <p className="post-content">
            No projects listed yet. Check back soon or visit my{' '}
            <a 
              href="https://github.com/karthi209" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-color)' }}
            >
              GitHub
            </a>{' '}
            for now.
          </p>
        </div>
      ) : (
        projects.map((project, index) => (
          <div key={index} className="post">
            <h3 className="post-title">
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            </h3>
            <div className="post-metadata">
              {project.tech && (
                <span className="post-category">
                  {project.tech.join(', ')}
                </span>
              )}
              {project.status && (
                <span className="post-status" style={{ marginLeft: '1rem' }}>
                  Status: {project.status}
                </span>
              )}
            </div>
            <div className="post-content">
              <p>{project.description}</p>
            </div>
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-more-link"
              >
                View Project →
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
