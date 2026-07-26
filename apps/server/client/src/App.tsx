import { Routes, Route, NavLink, Link } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* Glassmorphic Navbar */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <div className="nav-logo-icon">🎨</div>
          <span className="gradient-text">Quickdraw Royale</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/lobby" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Lobby
          </NavLink>
          <NavLink to="/game" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Game Arena
          </NavLink>
        </div>

        <div className="nav-badge">
          <span className="pulse-dot"></span>
          <span>Live Multiplayer</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </main>

      {/* App Footer */}
    <footer className="app-footer">
  <p>
    • Made with ❤️ by <strong>Rohit Manal</strong>
  </p>
</footer>
    </div>
  );
}

export default App;
