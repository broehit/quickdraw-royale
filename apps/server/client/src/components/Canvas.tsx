import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Connect to backend server with auto-fallback
let socket: Socket;
try {
  socket = io("http://localhost:5000", { autoConnect: true, reconnectionAttempts: 3 });
} catch (e) {
  console.warn("Socket connection warning:", e);
}

const PRESET_COLORS = [
  "#ffffff", // White
  "#6366f1", // Indigo
  "#ec4899", // Hot Pink
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#eab308", // Yellow
  "#f97316", // Orange
  "#ef4444", // Red
  "#a855f7", // Purple
  "#0a0d14", // Black
];

interface CanvasProps {
  onStrokeStart?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ onStrokeStart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#6366f1");
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const activeColor = isEraser ? "#0d111a" : color;

  // Handle canvas drawing start
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

    if (socket?.connected) {
      socket.emit("startDrawing", {
        x,
        y,
        color: activeColor,
        lineWidth,
      });
    }
  };

  // Handle canvas mouse move drawing
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

    if (socket?.connected) {
      socket.emit("draw", { x, y });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear local & remote canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (socket?.connected) {
      socket.emit("clear");
    }
  };

  // Export drawing as image
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `quickdraw-art-${Date.now()}.png`;
    link.click();
  };

  // Listen for socket drawing events
  useEffect(() => {
    if (!socket) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleRemoteStart = (data: { x: number; y: number; color: string; lineWidth: number }) => {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const handleRemoteDraw = (data: { x: number; y: number }) => {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    };

    const handleRemoteClear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("startDrawing", handleRemoteStart);
    socket.on("draw", handleRemoteDraw);
    socket.on("clear", handleRemoteClear);

    return () => {
      socket.off("startDrawing", handleRemoteStart);
      socket.off("draw", handleRemoteDraw);
      socket.off("clear", handleRemoteClear);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", alignItems: "center" }}>
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
          padding: "1rem 1.5rem"
        }}
      >
        {/* Color Palette Swatches */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, marginRight: "0.2rem" }}>
            Colors
          </span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  backgroundColor: c,
                  border: color === c && !isEraser ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                  boxShadow: color === c && !isEraser ? `0 0 10px ${c}` : "none",
                  cursor: "pointer",
                  transform: color === c && !isEraser ? "scale(1.2)" : "scale(1)",
                  transition: "all var(--transition-fast)"
                }}
                title={c}
              />
            ))}
          </div>

          {/* Custom Color Picker Input */}
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setIsEraser(false);
            }}
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              background: "none",
              cursor: "pointer",
              marginLeft: "0.4rem"
            }}
            title="Custom Color"
          />
        </div>

        {/* Brush Size Slider & Preview Dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Size</span>
          <input
            type="range"
            min="1"
            max="30"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "100px", accentColor: "var(--accent-indigo)" }}
          />
          <div 
            style={{ 
              width: "24px", 
              height: "24px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div 
              style={{ 
                width: `${Math.min(lineWidth, 20)}px`, 
                height: `${Math.min(lineWidth, 20)}px`, 
                borderRadius: "50%", 
                backgroundColor: activeColor 
              }} 
            />
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", minWidth: "30px" }}>{lineWidth}px</span>
        </div>

        {/* Tools: Pen, Eraser, Clear, Grid, Export */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`btn ${!isEraser ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setIsEraser(false)}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.88rem" }}
          >
            ✏️ Pen
          </button>

          <button
            type="button"
            className={`btn ${isEraser ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setIsEraser(true)}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.88rem" }}
          >
            🧹 Eraser
          </button>

          <button
            type="button"
            className={`btn btn-secondary`}
            onClick={() => setShowGrid(!showGrid)}
            style={{ padding: "0.45rem 0.8rem", fontSize: "0.88rem" }}
            title="Toggle Grid"
          >
            🌐 {showGrid ? "Grid On" : "Grid Off"}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={clearCanvas}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.88rem" }}
          >
            🗑️ Clear
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={downloadDrawing}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.88rem" }}
            title="Download Art"
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Main Drawing Canvas Frame */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "700px",
          height: "500px",
          background: "#0d111a",
          borderRadius: "var(--radius-lg)",
          border: "2px solid var(--glass-border)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          backgroundImage: showGrid 
            ? "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)"
            : "none",
          backgroundSize: "20px 20px"
        }}
      >
        <canvas
          ref={canvasRef}
          width={700}
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
