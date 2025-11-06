export default function RecentSection({ title, entries, type }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-mono mb-4 text-teal-400">{title}</h3>
      {entries.map(entry => (
        <div key={entry._id} className="mb-4 pb-4 border-b border-gray-700 last:border-0">
          <h4 className="text-lg mb-2">{entry.title}</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {type === 'blog' ? new Date(entry.date).toLocaleDateString() : entry.rating}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 