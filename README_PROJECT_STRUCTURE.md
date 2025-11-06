# Project Structure

## Frontend (src/)
- components/ — React components
- services/ — API and admin service modules
- styles/ — CSS files (global, variables, responsive, typography, etc.)
- assets/ — Images, fonts, icons
- utils/ — Shared helper functions
- App.jsx, main.jsx — App entry points

## Backend (backend/)
- models/ — Mongoose models
- routes/ — Express route handlers
- middleware/ — Express middleware
- scripts/ — Utility scripts
- utils/ — Shared backend helpers
- db.js — Database connection
- server.js — Main server entry point

## Root
- public/ — Static assets
- index.html — Main HTML template
- package.json, vite.config.js — Project config
- README.md, VERSION.txt — Documentation/versioning

---

This structure keeps frontend and backend code organized and maintainable. Move legacy/global stylesheets to `styles/` for consistency. Remove unused files/folders as needed.