import './LogsPage.css';

export default function LogsPage({ entries, activeTab, setActiveTab, tabs }) {
  return (
    <div className="logs-container">
      <h2 className="log-title">Activity Logs</h2>
      <div className="log-tabs">
        {tabs.map(tab => (
          <a
            key={tab.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(tab.id);
            }}
            className={activeTab === tab.id ? 'log-tab-active' : 'log-tab'}
          >
            {tab.name}
          </a>
        ))}
      </div>
      <div>
        {entries.map(entry => (
          <div key={entry._id} className="log-entry">
            <h3 className="log-entry-title">{entry.title}</h3>
            <div className="post-date">
              {new Date(entry.date).toLocaleDateString()}
            </div>
            <div className="log-entry-details">
              {entry.rating && <div className="log-detail">Rating: {entry.rating}/5</div>}
              {entry.status && <div className="log-detail">Status: {entry.status}</div>}
              {entry.completion && <div className="log-detail">Progress: {entry.completion}</div>}
              {entry.author && <div className="log-detail">Author: {entry.author}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 