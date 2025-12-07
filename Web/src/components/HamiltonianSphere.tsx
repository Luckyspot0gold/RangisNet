'use client';
import { useRef, useEffect } from 'react';

export default function HamiltonianSphere({ r = 1 }: { r: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple wireframe sphere animation
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sphere wireframe
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = r * 100;
      
      // Latitude lines
      for (let i = -2; i <= 2; i++) {
        const y = centerY + (i * radius / 3);
        const localRadius = Math.sqrt(radius * radius - (i * radius / 3) ** 2);
        
        ctx.beginPath();
        ctx.ellipse(centerX, y, localRadius, localRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Longitude lines
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius * Math.abs(Math.cos(angle + frame * 0.01)),
          radius,
          angle,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [r]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ border: '1px solid #00d4ff40', borderRadius: '8px' }}
    />
  );
}
