'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MeasureTension {
  measure: number;
  tension: number;
  rhythm: number;
  roughness: number;
  tonal: number;
}

interface FormSegment {
  label: string;
  start: number;
  end: number;
  color?: string;
}

interface TensionData {
  measures: MeasureTension[];
}

interface FormTimelineData {
  segments: FormSegment[];
}

export default function TensionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tensionData, setTensionData] = useState<MeasureTension[]>([]);
  const [formSegments, setFormSegments] = useState<FormSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Check if in embed mode
  const [isEmbed, setIsEmbed] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsEmbed(params.get('embed') === 'true');
    }
  }, []);

  // Constants
  const LOOP_DURATION = 90000; // 90 seconds in ms
  // Use lower resolution in embed mode for performance
  const WIDTH = isEmbed ? 1920 : 3840; // 1080p in embed, 4K otherwise
  const HEIGHT = isEmbed ? 1080 : 2160;

  useEffect(() => {
    Promise.all([
      fetch('/output/tension_per_measure.json').then(r => r.json()),
      fetch('/output/form_timeline.json').then(r => r.json())
    ])
      .then(([tension, form]: [TensionData, FormTimelineData]) => {
        setTensionData(tension.measures);
        setFormSegments(form.segments);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!tensionData.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set canvas size
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Normalize tension values
    const tensions = tensionData.map(d => d.tension);
    const minTension = Math.min(...tensions);
    const maxTension = Math.max(...tensions);
    const normalize = (v: number) => (v - minTension) / (maxTension - minTension);

    // Drawing parameters
    const padding = { left: 200, right: 200, top: 200, bottom: 300 };
    const chartWidth = WIDTH - padding.left - padding.right;
    const chartHeight = HEIGHT - padding.top - padding.bottom;

    const xScale = (measure: number) => 
      padding.left + (measure - 1) / (tensionData.length - 1) * chartWidth;
    const yScale = (normalizedTension: number) => 
      padding.top + chartHeight - (normalizedTension * chartHeight);

    let lastTime = 0;
    const targetFPS = isEmbed ? 30 : 60; // 30fps in embed mode, 60fps otherwise
    const frameInterval = 1000 / targetFPS;

    const animate = (time: number) => {
      // Throttle frame rate
      if (time - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      if (startTimeRef.current === 0) {
        startTimeRef.current = time;
      }

      const elapsed = time - startTimeRef.current;
      const progress = (elapsed % LOOP_DURATION) / LOOP_DURATION;
      const currentMeasure = 1 + progress * (tensionData.length - 1);

      // Clear with dark background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw form segments as background regions with bloom at boundaries
      ctx.save();
      formSegments.forEach((seg, idx) => {
        const x1 = xScale(seg.start);
        const x2 = xScale(seg.end);
        
        // Background tint
        ctx.fillStyle = seg.color 
          ? `${seg.color}08` 
          : `hsla(${idx * 60}, 50%, 50%, 0.03)`;
        ctx.fillRect(x1, padding.top, x2 - x1, chartHeight);

        // Segment boundary bloom effect
        const boundaryProgress = Math.abs(currentMeasure - seg.start) % 1;
        if (boundaryProgress < 0.1 && currentMeasure >= seg.start - 2 && currentMeasure <= seg.start + 2) {
          const bloomIntensity = 1 - boundaryProgress * 10;
          
          // Multiple glow layers for bloom
          for (let i = 5; i > 0; i--) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${bloomIntensity * 0.15 * i / 5})`;
            ctx.lineWidth = i * 8;
            ctx.beginPath();
            ctx.moveTo(x1, padding.top);
            ctx.lineTo(x1, padding.top + chartHeight);
            ctx.stroke();
          }
        }

        // Segment labels
        if (!isEmbed) {
          ctx.fillStyle = '#888888';
          ctx.font = 'bold 36px "SF Mono", "Courier New", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(seg.label, (x1 + x2) / 2, HEIGHT - padding.bottom + 100);
        }
      });
      ctx.restore();

      // Draw grid
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 2;
      
      // Horizontal grid lines
      for (let i = 0; i <= 10; i++) {
        const y = padding.top + (chartHeight / 10) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(WIDTH - padding.right, y);
        ctx.stroke();
      }

      // Vertical grid lines (every 50 measures)
      for (let m = 0; m <= tensionData.length; m += 50) {
        const x = xScale(m);
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.stroke();
        
        // Measure numbers
        if (!isEmbed) {
          ctx.fillStyle = '#666666';
          ctx.font = '32px "SF Mono", "Courier New", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(m.toString(), x, HEIGHT - padding.bottom + 60);
        }
      }

      // Draw axes labels
      if (!isEmbed) {
        ctx.fillStyle = '#AAAAAA';
        ctx.font = 'bold 42px "SF Mono", "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Measure Number', WIDTH / 2, HEIGHT - 80);
        
        ctx.save();
        ctx.translate(80, HEIGHT / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Normalized Tension', 0, 0);
        ctx.restore();
      }

      // Draw tension curve with variable thickness and glow
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < tensionData.length - 1; i++) {
        const d1 = tensionData[i];
        const d2 = tensionData[i + 1];
        
        const x1 = xScale(d1.measure);
        const y1 = yScale(normalize(d1.tension));
        const x2 = xScale(d2.measure);
        const y2 = yScale(normalize(d2.tension));

        const avgTension = (normalize(d1.tension) + normalize(d2.tension)) / 2;
        
        // Calculate if this segment should be visible based on animation progress
        const segmentProgress = Math.min(1, Math.max(0, 
          (currentMeasure - d1.measure) / (d2.measure - d1.measure)
        ));

        if (d1.measure <= currentMeasure) {
          // Line thickness based on tension (2-15 range)
          const baseThickness = 2 + avgTension * 13;
          
          // Brightness based on tension
          const brightness = Math.floor(100 + avgTension * 155);
          
          // Add perlin-like noise effect to line position
          const noiseIntensity = avgTension * 15;
          const noiseY1 = y1 + Math.sin(d1.measure * 0.3 + elapsed * 0.001) * noiseIntensity;
          const noiseY2 = y2 + Math.sin(d2.measure * 0.3 + elapsed * 0.001) * noiseIntensity;

          // Draw glow layers (bloom effect)
          const glowLayers = Math.ceil(3 + avgTension * 5);
          for (let g = glowLayers; g > 0; g--) {
            const glowAlpha = (0.1 * avgTension) / g;
            const glowWidth = baseThickness + g * 8 * avgTension;
            
            ctx.strokeStyle = `rgba(${brightness}, ${brightness}, 255, ${glowAlpha})`;
            ctx.lineWidth = glowWidth;
            
            ctx.beginPath();
            ctx.moveTo(x1, noiseY1);
            if (d2.measure <= currentMeasure) {
              ctx.lineTo(x2, noiseY2);
            } else {
              const partialX = x1 + (x2 - x1) * segmentProgress;
              const partialY = noiseY1 + (noiseY2 - noiseY1) * segmentProgress;
              ctx.lineTo(partialX, partialY);
            }
            ctx.stroke();
          }

          // Main line
          ctx.strokeStyle = `rgb(${brightness}, ${brightness}, 255)`;
          ctx.lineWidth = baseThickness;
          ctx.beginPath();
          ctx.moveTo(x1, noiseY1);
          if (d2.measure <= currentMeasure) {
            ctx.lineTo(x2, noiseY2);
          } else {
            const partialX = x1 + (x2 - x1) * segmentProgress;
            const partialY = noiseY1 + (noiseY2 - noiseY1) * segmentProgress;
            ctx.lineTo(partialX, partialY);
          }
          ctx.stroke();
        }
      }

      // Draw current position indicator
      const currentX = xScale(currentMeasure);
      const currentIndex = Math.floor(currentMeasure - 1);
      if (currentIndex >= 0 && currentIndex < tensionData.length) {
        const currentTension = normalize(tensionData[currentIndex].tension);
        const currentY = yScale(currentTension);

        // Pulsing indicator
        const pulseScale = 1 + Math.sin(elapsed * 0.005) * 0.3;
        
        // Glow
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 40 * pulseScale);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 40 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 10 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Current measure info
        if (!isEmbed) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 48px "SF Mono", "Courier New", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(
            `Measure: ${Math.floor(currentMeasure)} | Tension: ${currentTension.toFixed(3)}`,
            padding.left,
            100
          );
        }
      }

      // Progress bar at bottom
      if (!isEmbed) {
        ctx.fillStyle = '#333333';
        ctx.fillRect(padding.left, HEIGHT - 150, chartWidth, 20);
        
        ctx.fillStyle = '#00AAFF';
        ctx.fillRect(padding.left, HEIGHT - 150, chartWidth * progress, 20);

        // Time display
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '36px "SF Mono", "Courier New", monospace';
        ctx.textAlign = 'center';
        const currentTime = (elapsed % LOOP_DURATION) / 1000;
        ctx.fillText(
          `${currentTime.toFixed(1)}s / ${(LOOP_DURATION / 1000).toFixed(0)}s`,
          WIDTH / 2,
          HEIGHT - 100
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tensionData, formSegments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-2xl">Loading tension data...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
      {!isEmbed && (
        <div className="absolute top-8 right-8 text-white text-xl font-mono bg-black/50 px-6 py-3 rounded">
          <div>Beethoven - Große Fuge Op. 133</div>
          <div className="text-sm text-gray-400 mt-1">Tension Analysis Visualization</div>
          <div className="text-xs text-gray-500 mt-2">4K • 60fps • 90s loop</div>
        </div>
      )}
    </div>
  );
}
