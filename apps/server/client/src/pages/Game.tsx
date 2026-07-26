import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Canvas from "../components/Canvas";

const PROMPTS = [
  "Cat 🐱",
  "Rocket 🚀",
  "Pizza 🍕",
  "Guitar 🎸",
  "Castle 🏰",
  "Robot 🤖",
  "Sun ☀️",
  "Dragon 🐉",
  "Submarine 🛥️",
  "Laptop 💻"
];

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  isCorrect?: boolean;
  timestamp: string;
}

const Game: React.FC = () => {
  const location = useLocation();
  const { playerName = "Player 1", avatar = "🎨", gameMode = "Classic Pictionary" } = location.state || {};

  const [promptIndex, setPromptIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [guessInput, setGuessInput] = useState("");
  const [score, setScore] = useState(0);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "System",
      avatar: "🤖",
      text: `Welcome ${playerName}! Turn timer started for ${gameMode}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const currentPrompt = PROMPTS[promptIndex];
  const targetWord = currentPrompt.split(" ")[0].toLowerCase();

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle Next Word Prompt Switch
  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    setTimeLeft(60);
  };

  // Submit Guess in Chat Feed
  const handleSendGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    const userText = guessInput.trim();
    const isCorrect = userText.toLowerCase().includes(targetWord);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: playerName,
      avatar: avatar,
      text: userText,
      isCorrect: isCorrect,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    setGuessInput("");

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "System",
          avatar: "🎉",
          text: `🎯 CORRECT! ${playerName} guessed '${targetWord.toUpperCase()}' correctly! (+100 PTS)`,
          isCorrect: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Game Header Bar */}
      <div 
        className="glass-panel"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          marginBottom: "1.5rem",
          gap: "1rem"
        }}
      >
        {/* Player Profile Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "2rem" }}>{avatar}</span>
          <div>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>{playerName}</h2>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Score: <strong style={{ color: "var(--accent-emerald)" }}>{score} PTS</strong> • {gameMode}
            </span>
          </div>
        </div>

        {/* Word Prompt Display */}
        <div 
          style={{
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            padding: "0.5rem 1.5rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
            position: "relative"
          }}
        >
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Your Drawing Prompt
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", justifyContent: "center" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {showPrompt ? currentPrompt : "🙈 Hidden Prompt"}
            </span>
            <button
              type="button"
              onClick={() => setShowPrompt(!showPrompt)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
              title="Toggle Prompt Visibility"
            >
              {showPrompt ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        {/* Timer & Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Time Left</div>
            <div 
              style={{ 
                fontSize: "1.4rem", 
                fontWeight: 800, 
                color: timeLeft <= 10 ? "var(--accent-rose)" : "var(--accent-cyan)" 
              }}
            >
              ⏱️ {timeLeft}s
            </div>
          </div>

          <button 
            onClick={handleNextPrompt} 
            className="btn btn-secondary"
            style={{ padding: "0.5rem 0.9rem", fontSize: "0.88rem" }}
            title="Switch Word Prompt"
          >
            🔀 Next Prompt
          </button>
        </div>
      </div>

      {/* Main Arena Layout */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 340px", 
          gap: "1.5rem",
          alignItems: "start"
        }}
      >
        {/* Left Column: Interactive Canvas */}
        <div style={{ width: "100%" }}>
          <Canvas />
        </div>

        {/* Right Column: Live Chat & Guess Feed */}
        <div 
          className="glass-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "580px",
            padding: "1.2rem"
          }}
        >
          <div style={{ paddingBottom: "0.8rem", borderBottom: "1px solid var(--glass-border)", marginBottom: "0.8rem" }}>
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>💬 Live Guesses & Chat</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Type your guess below to score points!
            </span>
          </div>

          {/* Messages Feed Container */}
          <div 
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              paddingRight: "0.3rem"
            }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "var(--radius-sm)",
                  background: msg.isCorrect 
                    ? "rgba(16, 185, 129, 0.2)" 
                    : msg.sender === "System" 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : "rgba(18, 24, 38, 0.8)",
                  border: msg.isCorrect 
                    ? "1px solid var(--accent-emerald)" 
                    : "1px solid rgba(255, 255, 255, 0.05)",
                  fontSize: "0.88rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ fontWeight: 600, color: msg.isCorrect ? "var(--accent-emerald)" : "var(--text-primary)" }}>
                    {msg.avatar} {msg.sender}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{msg.timestamp}</span>
                </div>
                <div style={{ color: msg.isCorrect ? "#ffffff" : "var(--text-secondary)" }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Guess Input Form */}
          <form onSubmit={handleSendGuess} style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
            <input
              type="text"
              className="glass-input"
              placeholder="Type your guess here..."
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              style={{ fontSize: "0.9rem", padding: "0.6rem 0.9rem" }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0.6rem 1rem", fontSize: "0.9rem" }}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Game;
