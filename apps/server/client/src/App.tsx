import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  return (
    <>
      <nav style={{ padding: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/lobby" style={{ marginRight: "1rem" }}>Lobby</Link>
        <Link to="/game">Game</Link>
      </nav>
      <nav style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
  <h2 style={{ margin: 0 }}>Pictionary Clone 🎮</h2>
</nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;


