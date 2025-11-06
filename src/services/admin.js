const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE}/api`;

export const getStoredApiKey = () => {
  try { return localStorage.getItem('admin_api_key') || ''; } catch { return ''; }
};

export const setStoredApiKey = (key) => {
  try { localStorage.setItem('admin_api_key', key || ''); } catch { /* ignore */ }
};

const authHeaders = () => {
  const key = getStoredApiKey();
  return key ? { 'x-api-key': key } : {};
};

export const adminCreateBlog = async ({ title, content, category, tags }) => {
  const res = await fetch(`${API}/blogs/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ title, content, category, tags }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const adminUpdateFeaturedTweets = async (urls) => {
  const res = await fetch(`${API}/featured-tweets`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const adminFetchFeaturedTweets = async () => {
  const res = await fetch(`${API}/featured-tweets`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};


