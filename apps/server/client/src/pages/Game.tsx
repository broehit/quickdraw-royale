import React from "react";
import { useLocation } from "react-router-dom";
import Canvas from "../components/Canvas"; // adjust path if needed


const Game: React.FC = () => {
  const location = useLocation();
  const { playerName } = location.state || { playerName: "Anonymous" };

  const prompt = "Draw a cat"; // Later this will come from backend

  return (
    
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome, {playerName} 👋</h1>
      <h2>Your prompt is:</h2>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{prompt}</p>

      {/* Canvas Area */}
        <Canvas />
      </div>
      
  );
};

export default Game;

