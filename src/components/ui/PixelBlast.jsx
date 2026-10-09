import React, { useRef, useEffect } from 'react';

export function PixelBlast({
  variant = 'square',
  pixelSize = 3,
  color = '#008fd2 ',
  patternScale = 2,
  patternDensity = 1,
  enableRipples = true,
  rippleSpeed = 0.3,
  rippleThickness = 0.5,
  rippleIntensityScale = 1,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  className = ''
}) {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Touch ripple trigger
    const addRipple = (x, y) => {
      if (!enableRipples) return;
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.75,
        alpha: 1.0 * rippleIntensityScale,
      });
    };

    const handlePointerDown = (e) => addRipple(e.clientX, e.clientY);
    window.addEventListener('pointerdown', handlePointerDown);

    let time = 0;
    const step = pixelSize * patternScale;

    // Render loop
    const render = () => {
      time += speed * 0.02;

      if (transparent) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#060609';
        ctx.fillRect(0, 0, width, height);
      }

      // Update ripples
      ripplesRef.current.forEach((r, idx) => {
        r.radius += rippleSpeed * 12;
        r.alpha -= 0.008;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(idx, 1);
        }
      });

      // Draw Pixels
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          if (Math.sin(x * 0.01 + y * 0.01 + time) * patternDensity < -0.2) continue;

          // Check ripple influence
          let wave = 0;
          ripplesRef.current.forEach((r) => {
            const dist = Math.hypot(x - r.x, y - r.y);
            const delta = Math.abs(dist - r.radius);
            if (delta < rippleThickness * 100) {
              wave += Math.max(0, (1 - delta / (rippleThickness * 100)) * r.alpha);
            }
          });

          // Edge fade
          let edgeAlpha = 1;
          if (edgeFade > 0) {
            const minX = Math.min(x, width - x) / (width * edgeFade * 0.5);
            const minY = Math.min(y, height - y) / (height * edgeFade * 0.5);
            edgeAlpha = Math.max(0, Math.min(1, minX * minY));
          }

          const baseAlpha = 0.08 + wave * 0.45;
          const finalAlpha = Math.min(1, baseAlpha * edgeAlpha);

          if (finalAlpha > 0.02) {
            ctx.fillStyle = color;
            ctx.globalAlpha = finalAlpha;

            if (variant === 'square') {
              ctx.fillRect(x, y, pixelSize, pixelSize);
            } else {
              ctx.beginPath();
              ctx.arc(x, y, pixelSize * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [variant, pixelSize, color, patternScale, patternDensity, enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale, speed, transparent, edgeFade]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none -z-10 w-full h-full ${className}`}
    />
  );
}