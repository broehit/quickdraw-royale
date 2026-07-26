import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Setup Socket.io connection
let socket: Socket | null = null;
try {
  socket = io("http://localhost:5000", { 
    autoConnect: true, 
    reconnectionAttempts: 2,
    timeout: 3000
  });
} catch (e) {
  console.warn("Socket.io local backend not active, falling back to BroadcastChannel sync", e);
}

// Setup BroadcastChannel for instant cross-tab / cross-window sync
const broadcastChannel = typeof window !== "undefined" && "BroadcastChannel" in window 
  ? new BroadcastChannel("quickdraw_canvas_sync") 
  : null;

const PRESET_COLORS = [
  "#6366f1", // Neon Indigo
  "#ec4899", // Hot Pink
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#eab308", // Bright Yellow
  "#f97316", // Vibrant Orange
  "#ef4444", // Crimson Red
  "#a855f7", // Deep Purple
  "#ffffff", // Crisp White
  "#0d111a", // Canvas Dark
];

interface CanvasProps {
  onStrokeStart?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ onStrokeStart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#6366f1");
  const [lineWidth, setLineWidth] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const activeColor = isEraser ? "#0d111a" : color;

  // Track socket connection state
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, []);

  // Handle stroke start
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);

    if (onStrokeStart) onStrokeStart();

    const eventData = { x, y, color: activeColor, lineWidth };

    // Broadcast cross-tab
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "startDrawing", data: eventData });
    }

    // Socket.io emit
    if (socket && isConnected) {
      socket.emit("startDrawing", eventData);
    }
  };

  // Handle stroke drawing
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = activeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();

    const eventData = { x, y };

    // Broadcast cross-tab
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "draw", data: eventData });
    }

    // Socket.io emit
    if (socket && isConnected) {
      socket.emit("draw", eventData);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "clear" });
    }

    if (socket && isConnected) {
      socket.emit("clear");
    }
  };

  // Download image
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `quickdraw-art-${Date.now()}.png`;
    link.click();
  };

  // Listen for remote events (BroadcastChannel & Socket.io)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const executeStart = (data: { x: number; y: number; color: string; lineWidth: number }) => {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const executeDraw = (data: { x: number; y: number }) => {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    };

    const executeClear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // BroadcastChannel listener
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === "startDrawing") executeStart(data);
        if (type === "draw") executeDraw(data);
        if (type === "clear") executeClear();
      };
    }

    // Socket.io listener
    if (socket) {
      socket.on("startDrawing", executeStart);
      socket.on("draw", executeDraw);
      socket.on("clear", executeClear);
    }

    return () => {
      if (socket) {
        socket.off("startDrawing", executeStart);
        socket.off("draw", executeDraw);
        socket.off("clear", executeClear);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", alignItems: "center" }}>
      {/* Real-time Sync Status Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", width: "100%", justifyContent: "space-between" }}>
        <div 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            padding: "0.3rem 0.8rem", 
            borderRadius: "var(--radius-full)", 
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            fontSize: "0.82rem",
            color: "var(--accent-emerald)",
            fontWeight: 600
          }}
        >
          <span className="pulse-dot"></span>
          <span>
            {isConnected ? "🟢 Connected via Socket.io & Cross-Tab Sync" : "⚡ Real-Time Cross-Tab Sync Active"}
          </span>
        </div>

        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Open another tab or window to test live drawing sync!
        </span>
      </div>

      {/* Canvas Toolbar Controls */}
      <div 
        className="glass-card" 
        style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1.2rem", 
          alignItems: "center", 
          justifyContent: "space-between", 
          width: "100%",
          padding: "1.2rem 1.5rem"
        }}
      >
        {/* Color Swatches */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            Palette:
          </span>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: c,
                  border: color === c && !isEraser ? "2.5px solid #ffffff" : "1px solid rgba(255,255,255,0.25)",
                  boxShadow: color === c && !isEraser ? `0 0 12px ${c}` : "none",
                  cursor: "pointer",
                  transform: color === c && !isEraser ? "scale(1.18)" : "scale(1)",
                  transition: "all var(--transition-fast)"
                }}
                title={`Select color ${c}`}
              />
            ))}
          </div>

          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setIsEraser(false);
            }}
            style={{
              width: "30px",
              height: "30px",
              border: "none",
              background: "none",
              cursor: "pointer",
              marginLeft: "0.3rem"
            }}
            title="Custom Color Picker"
          />
        </div>

        {/* Brush Size Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", fontWeight: 600 }}>Brush</span>
          <input
            type="range"
            min="2"
            max="40"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "110px", accentColor: "var(--accent-indigo)" }}
          />
          <div 
            style={{ 
              width: "26px", 
              height: "26px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div 
              style={{ 
                width: `${Math.min(lineWidth, 22)}px`, 
                height: `${Math.min(lineWidth, 22)}px`, 
                borderRadius: "50%", 
                backgroundColor: activeColor 
              }} 
            />
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", minWidth: "32px", fontWeight: 600 }}>
            {lineWidth}px
          </span>
        </div>

        {/* Tools: Pen, Eraser, Clear, Grid, Save */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`btn ${!isEraser ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setIsEraser(false)}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            ✏️ Pen
          </button>

          <button
            type="button"
            className={`btn ${isEraser ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setIsEraser(true)}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            🧹 Eraser
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowGrid(!showGrid)}
            style={{ padding: "0.5rem 0.9rem", fontSize: "0.9rem" }}
          >
            🌐 {showGrid ? "Grid On" : "Grid Off"}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={clearCanvas}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            🗑️ Clear
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={downloadDrawing}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            💾 Save Art
          </button>
        </div>
      </div>

      {/* Main Canvas Canvas Frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "720px",
          height: "500px",
          background: "#0d111a",
          borderRadius: "var(--radius-lg)",
          border: "2px solid var(--accent-indigo-glow)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
          backgroundImage: showGrid 
            ? "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)"
            : "none",
          backgroundSize: "20px 20px"
        }}
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={500}
          style={{
            width: "100%",
            height: "100%",
            cursor: isEraser ? "cell" : "crosshair",
            touchAction: "none"
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Canvas;
