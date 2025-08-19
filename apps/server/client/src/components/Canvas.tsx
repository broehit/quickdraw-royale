import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Connect to backend server
const socket: Socket = io("http://localhost:5000");

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);

  // Start drawing
  const startDrawing = (e: React.MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);

    socket.emit("startDrawing", {
  x: e.nativeEvent.offsetX,
  y: e.nativeEvent.offsetY,
});


    // 🔥 Tell others a new stroke is starting
    socket.emit("startDrawing", {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color,
      lineWidth,
    });
  };

  

  // Draw while mouse moves
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    // Emit draw event
    socket.emit("draw", {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Listen for drawing updates from server
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // When someone starts a stroke
    socket.on("startDrawing", (data: { x: number; y: number; color: string; lineWidth: number }) => {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.lineWidth;
    });

    // When someone is drawing
    socket.on("draw", (data: { x: number; y: number }) => {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    return () => {
      socket.off("startDrawing");
      socket.off("draw");
    };
  }, []);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    socket.emit("clear");
  };

  // Listen for "clear" from server
  useEffect(() => {
    socket.on("clear", () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    return () => {
      socket.off("clear");
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Toolbar */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Brush Size:
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
          <span style={{ marginLeft: "5px" }}>{lineWidth}px</span>
        </label>
        <button onClick={clearCanvas} style={{ marginLeft: "20px" }}>
          Clear
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "2px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Canvas;

