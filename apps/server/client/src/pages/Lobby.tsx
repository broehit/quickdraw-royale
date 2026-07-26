import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AVATARS = ["🎨", "🚀", "🦊", "🐱", "🤖", "⚡", "👑", "👾"];

function Lobby() {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🎨");
  const [gameMode, setGameMode] = useState("Classic Pictionary");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim() !== "") {
      navigate("/game", { 
        state: { 
          playerName: name.trim(), 
          avatar: selectedAvatar,
          gameMode: gameMode
        } 
      });
    } else {
      alert("Please enter your player nickname!");
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: "1.5rem" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "520px", padding: "2.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "3rem", display: "inline-block", marginBottom: "0.5rem" }} className="animate-float">
            {selectedAvatar}
          </span>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>Player Lobby</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Choose your avatar and set your nickname to enter the arena
          </p>
        </div>

        {/* Avatar Picker */}
        <div style={{ marginBottom: "1.8rem" }}>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.6rem", fontWeight: 600 }}>
            Pick Your Avatar
          </label>
          <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedAvatar(emoji)}
                style={{
                  fontSize: "1.5rem",
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  border: selectedAvatar === emoji ? "2px solid var(--accent-indigo)" : "1px solid var(--glass-border)",
                  background: selectedAvatar === emoji ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Player Name Input */}
        <div style={{ marginBottom: "1.8rem" }}>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.6rem", fontWeight: 600 }}>
            Nickname
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. PicassoMaster99"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            maxLength={20}
            autoFocus
          />
        </div>

        {/* Game Mode Selector */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.6rem", fontWeight: 600 }}>
            Select Game Mode
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            {["Classic Pictionary", "Speed Draw"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setGameMode(mode)}
                className={`btn ${gameMode === mode ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.9rem", padding: "0.6rem 0.8rem" }}
              >
                {mode === "Classic Pictionary" ? "🎨 Classic" : "⚡ Speed Draw"}
              </button>
            ))}
          </div>
        </div>

        {/* Join Action */}
        <button 
          onClick={handleJoin} 
          className="btn btn-accent" 
          style={{ width: "100%", fontSize: "1.1rem", padding: "0.9rem" }}
        >
          🚀 Start Game Arena
        </button>
      </div>
    </div>
  );
}

export default Lobby;
