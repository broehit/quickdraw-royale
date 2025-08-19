// Lobby.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim() !== "") {
      // pass name to Game page
      navigate("/game", { state: { playerName: name } });
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Lobby</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={handleJoin} style={{ marginLeft: "1rem" }}>
  Start Game
</button>

    </div>
  );
}

export default Lobby;
