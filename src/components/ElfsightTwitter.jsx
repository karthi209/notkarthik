import { useEffect, useRef } from 'react';

export default function ElfsightTwitter() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Elfsight platform.js once
    const existing = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://elfsightcdn.com/platform.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ margin: 'var(--space-lg) 0' }}>
      <div className="elfsight-app-749cc6aa-7eda-422c-882b-8870c8dfb430" data-elfsight-app-lazy></div>
    </div>
  );
}


