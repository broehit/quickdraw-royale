import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container" style={{ textAlign: "center", paddingTop: "2rem" }}>
      {/* Hero Header */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            padding: "0.4rem 1rem", 
            borderRadius: "var(--radius-full)", 
            background: "rgba(99, 102, 241, 0.15)", 
            border: "1px solid rgba(99, 102, 241, 0.3)",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            color: "#a5b4fc",
            fontWeight: 600
          }}
        >
          <span>🚀 Real-Time Multiplayer Pictionary</span>
        </div>

        <h1 style={{ fontSize: "3.5rem", lineHeight: "1.15", marginBottom: "1.2rem" }}>
          Unleash Your Creativity in <span className="gradient-text">Quickdraw Royale</span> ⚡
        </h1>

        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: "1.6" }}>
          Draw secretly, guess in real-time, and compete with friends in an ultra-smooth, low-latency multiplayer game powered by Socket.io and React.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/lobby" className="btn btn-primary" style={{ fontSize: "1.1rem", padding: "0.9rem 2rem" }}>
            🎮 Enter Lobby
          </Link>
          <Link to="/game" className="btn btn-secondary" style={{ fontSize: "1.1rem", padding: "0.9rem 2rem" }}>
            ⚡ Jump into Practice Game
          </Link>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: "1.5rem", 
          width: "100%", 
          maxWidth: "1100px", 
          marginTop: "3.5rem" 
        }}
      >
        <div className="glass-card" style={{ textAlign: "left" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>⚡</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Instant Canvas Sync</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Stroke-by-stroke Socket.io WebSocket streaming ensures zero delay across all connected players.
          </p>
        </div>

        <div className="glass-card" style={{ textAlign: "left" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🎨</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Pro Creative Suite</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Pick from curated neon color palettes, brush size sliders, eraser mode, and canvas download tools.
          </p>
        </div>

        <div className="glass-card" style={{ textAlign: "left" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🏆</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Real-Time Guess Feed</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Type your guesses in live chat and trigger instant celebration feedback when you hit the exact target word.
          </p>
        </div>

        <div className="glass-card" style={{ textAlign: "left" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🔮</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Glassmorphic Theme</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Vibrant neon dark theme with smooth micro-animations designed for maximum visual immersion.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
