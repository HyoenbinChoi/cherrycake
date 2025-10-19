'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TonnetzNode {
  id: string;
  label: string;
  root: number;
  quality: string;
  pcs: number[];
  x: number;
  y: number;
  occurrences_qL: number[];
}

interface TonnetzLink {
  source: string;
  target: string;
  kind: string;
  weight: number;
}

interface TonnetzData {
  nodes: TonnetzNode[];
  links: TonnetzLink[];
}

interface FormSegment {
  label: string;
  start: number;
  end: number;
  color?: string;
}

interface FormTimelineData {
  segments: FormSegment[];
}

// Neo-Riemannian transformation colors
const TRANSFORM_COLORS: Record<string, string> = {
  'P': '#FF6B6B',  // Parallel (red)
  'R': '#4ECDC4',  // Relative (cyan)
  'L': '#FFE66D',  // Leading-tone (yellow)
  'other': '#444444', // Other transformations (dim gray)
};

const TRANSFORM_OPACITY: Record<string, number> = {
  'P': 0.9,
  'R': 0.9,
  'L': 0.9,
  'other': 0.3,
};

const TRANSFORM_WIDTH: Record<string, number> = {
  'P': 6,
  'R': 6,
  'L': 6,
  'other': 2,
};

export default function TonnetzPathway() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tonnetzData, setTonnetzData] = useState<TonnetzData | null>(null);
  const [formSegments, setFormSegments] = useState<FormSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbed, setIsEmbed] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // Detect embed mode from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get('embed') === 'true');
  }, []);

  // Constants
  const LOOP_DURATION = 90000; // 90 seconds
  // Use lower resolution in embed mode for performance
  const WIDTH = isEmbed ? 1920 : 3840; // 1080p in embed, 4K otherwise
  const HEIGHT = isEmbed ? 1080 : 2160;

  useEffect(() => {
    Promise.all([
      fetch('/output/tonnetz.json').then(r => r.json()),
      fetch('/output/form_timeline.json').then(r => r.json()),
    ])
      .then(([tonnetz, form]: [TonnetzData, FormTimelineData]) => {
        setTonnetzData(tonnetz);
        setFormSegments(form.segments);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!tonnetzData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Calculate bounds for Tonnetz coordinates
    const xCoords = tonnetzData.nodes.map(n => n.x);
    const yCoords = tonnetzData.nodes.map(n => n.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    // Calculate total duration
    let maxTime = 0;
    tonnetzData.nodes.forEach(node => {
      const lastOccurrence = Math.max(...node.occurrences_qL);
      if (lastOccurrence > maxTime) maxTime = lastOccurrence;
    });

    // Camera state
    let cameraX = 0;
    let cameraY = 0;
    let cameraZoom = 1.5; // Reduced from 2 to 1.5 to show more
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZoom = 1.5; // Reduced from 2.0 to 1.5

    let lastFrameTime = 0;
    const targetFPS = isEmbed ? 30 : 60; // 30fps in embed mode, 60fps otherwise
    const frameInterval = 1000 / targetFPS;

    const animate = (time: number) => {
      // Throttle frame rate
      if (time - lastFrameTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = time;

      if (startTimeRef.current === 0) {
        startTimeRef.current = time;
      }

      const elapsed = time - startTimeRef.current;
      const progress = (elapsed % LOOP_DURATION) / LOOP_DURATION;
      const currentTime = progress * maxTime;

      // Update segment
      const segmentIndex = Math.floor(progress * formSegments.length);
      if (segmentIndex !== currentSegmentIndex && formSegments[segmentIndex]) {
        setCurrentSegmentIndex(segmentIndex);
        
        const segment = formSegments[segmentIndex];
        
        // Find nodes active in this segment
        const activeNodes = tonnetzData.nodes.filter(node =>
          node.occurrences_qL.some(t => t >= segment.start * 10 && t <= segment.end * 10)
        );

        if (activeNodes.length > 0) {
          // Calculate center of active nodes
          const avgX = activeNodes.reduce((sum, n) => sum + n.x, 0) / activeNodes.length;
          const avgY = activeNodes.reduce((sum, n) => sum + n.y, 0) / activeNodes.length;
          
          targetCameraX = avgX;
          targetCameraY = avgY;
          targetCameraZoom = 2.0; // Reduced from 2.5 to 2.0
        }
      }

      // Smooth camera transition
      cameraX += (targetCameraX - cameraX) * 0.02;
      cameraY += (targetCameraY - cameraY) * 0.02;
      cameraZoom += (targetCameraZoom - cameraZoom) * 0.02;

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Drawing parameters with camera
      const baseScale = 700; // Reduced from 800 to 700 for more compact view
      const scale = baseScale * cameraZoom;
      const centerX = WIDTH / 2;
      const centerY = HEIGHT / 2;

      // Transform Tonnetz coordinates to screen coordinates
      const tonnetzToScreen = (tx: number, ty: number) => {
        const sx = centerX + (tx - cameraX) * scale;
        const sy = centerY - (ty - cameraY) * scale;
        return { x: sx, y: sy };
      };

      // Draw grid
      ctx.save();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2; // Increased from 1 to 2
      
      for (let gx = Math.floor(minX) - 2; gx <= Math.ceil(maxX) + 2; gx++) {
        for (let gy = Math.floor(minY) - 2; gy <= Math.ceil(maxY) + 2; gy++) {
          const p1 = tonnetzToScreen(gx, gy);
          const p2 = tonnetzToScreen(gx + 1, gy);
          const p3 = tonnetzToScreen(gx, gy + 1);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Draw links (transformation paths)
      tonnetzData.links.forEach(link => {
        const sourceNode = tonnetzData.nodes.find(n => n.id === link.source);
        const targetNode = tonnetzData.nodes.find(n => n.id === link.target);
        
        if (!sourceNode || !targetNode) return;

        const p1 = tonnetzToScreen(sourceNode.x, sourceNode.y);
        const p2 = tonnetzToScreen(targetNode.x, targetNode.y);

        const color = TRANSFORM_COLORS[link.kind] || TRANSFORM_COLORS.other;
        const opacity = TRANSFORM_OPACITY[link.kind] || TRANSFORM_OPACITY.other;
        const width = TRANSFORM_WIDTH[link.kind] || TRANSFORM_WIDTH.other;

        // Draw arrow/path
        ctx.save();
        ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = width * cameraZoom;
        ctx.lineCap = 'round';

        // Glow effect for P, R, L
        if (link.kind !== 'other') {
          ctx.shadowBlur = 20 * cameraZoom;
          ctx.shadowColor = color;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Draw arrow head
        if (link.kind !== 'other') {
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const arrowSize = 15 * cameraZoom;
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(
            p2.x - arrowSize * Math.cos(angle - Math.PI / 6),
            p2.y - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            p2.x - arrowSize * Math.cos(angle + Math.PI / 6),
            p2.y - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // Draw nodes
      tonnetzData.nodes.forEach(node => {
        const pos = tonnetzToScreen(node.x, node.y);

        // Check if active at current time
        const isActive = node.occurrences_qL.some(t => {
          return Math.abs(t - currentTime) < 50; // Active within 50 qL
        });

        // Calculate size based on occurrence frequency
        const occurrenceCount = node.occurrences_qL.length;
        const baseSize = 15 + Math.log(occurrenceCount + 1) * 8; // Increased base size and multiplier
        
        // Pulsating effect
        const pulsePhase = (elapsed * 0.003 + node.x + node.y) % (Math.PI * 2);
        const pulseFactor = 1 + Math.sin(pulsePhase) * 0.2;
        const size = baseSize * pulseFactor * cameraZoom;

        // Color based on quality
        const color = node.quality === 'M' ? '#66AAFF' : '#FF6688';

        ctx.save();

        // Glow for active nodes
        if (isActive) {
          ctx.shadowBlur = 40 * cameraZoom;
          ctx.shadowColor = color;
          
          // Extra glow ring
          ctx.fillStyle = color + '44';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main node circle
        ctx.fillStyle = isActive ? color : color + '88';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Stroke
        ctx.strokeStyle = '#FFFFFF' + (isActive ? 'FF' : '44');
        ctx.lineWidth = 3 * cameraZoom; // Increased from 2 to 3
        ctx.stroke();

        ctx.restore();

        // Label
        if (cameraZoom > 0.5) { // Changed threshold from 0.8 to 0.5
          ctx.save();
          ctx.fillStyle = isActive ? '#FFFFFF' : '#AAAAAA';
          ctx.font = `bold ${24 * cameraZoom}px "SF Mono", monospace`; // Increased from 16 to 24
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          if (isActive) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#000000';
          }
          
          if (!isEmbed) {
            ctx.fillText(node.label, pos.x, pos.y + size + 30 * cameraZoom); // Increased from 20 to 30
          }
          ctx.restore();
        }
      });

      // Draw legend (moved to bottom left)
      if (!isEmbed) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const legendY = HEIGHT - 550; // Position from bottom
        ctx.fillRect(50, legendY, 500, 320);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 48px "SF Mono", monospace';
        ctx.fillText('Neo-Riemannian Transformations', 70, legendY + 60);

        const transformTypes = ['P', 'R', 'L', 'other'];
        const transformLabels: Record<string, string> = {
          'P': 'Parallel',
          'R': 'Relative',
          'L': 'Leading-tone',
          'other': 'Other',
        };

        transformTypes.forEach((type, idx) => {
          const y = legendY + 130 + idx * 50;
          
          // Color box
          ctx.fillStyle = TRANSFORM_COLORS[type];
          ctx.fillRect(70, y - 18, 45, 36);
          
          // Label
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '36px "SF Mono", monospace';
          ctx.fillText(transformLabels[type], 135, y + 5);
        });
        ctx.restore();
      }

      // Current segment info
      if (!isEmbed) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(WIDTH - 650, 50, 600, 220); // Increased size
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 42px "SF Mono", monospace'; // Increased from 28 to 42
        ctx.fillText('Current Segment', WIDTH - 630, 110);
        
        ctx.font = '36px "SF Mono", monospace'; // Increased from 24 to 36
        ctx.fillStyle = '#AAAAAA';
        if (formSegments[currentSegmentIndex]) {
          ctx.fillText(formSegments[currentSegmentIndex].label, WIDTH - 630, 170);
          ctx.fillText(
            `Measures ${formSegments[currentSegmentIndex].start}-${formSegments[currentSegmentIndex].end}`,
            WIDTH - 630,
            220
          );
        }
        ctx.restore();
      }

      // Progress bar
      if (!isEmbed) {
        ctx.save();
        const barWidth = 1200; // Increased from 800 to 1200
        const barX = (WIDTH - barWidth) / 2;
        const barY = HEIGHT - 150;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, 25); // Increased height from 15 to 25
        
        ctx.fillStyle = '#00AAFF';
        ctx.fillRect(barX, barY, barWidth * progress, 25);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '32px "SF Mono", monospace'; // Increased from 20 to 32
        ctx.textAlign = 'center';
        ctx.fillText(
          `${(progress * 100).toFixed(1)}% • ${(elapsed / 1000).toFixed(1)}s / ${LOOP_DURATION / 1000}s`,
          WIDTH / 2,
          barY + 60
        );
        ctx.restore();
      }

      // Title
      if (!isEmbed) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect((WIDTH - 1200) / 2, HEIGHT - 280, 1200, 120); // Increased size
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 56px "SF Mono", monospace'; // Increased from 36 to 56
        ctx.textAlign = 'center';
        ctx.fillText('Tonnetz Pathway', WIDTH / 2, HEIGHT - 220);
        
        ctx.font = '38px "SF Mono", monospace'; // Increased from 24 to 38
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('Beethoven - Große Fuge Op. 133', WIDTH / 2, HEIGHT - 170);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tonnetzData, formSegments, currentSegmentIndex]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-2xl">Loading Tonnetz data...</div>
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
        <div className="absolute bottom-8 right-8 text-white text-lg font-mono bg-black/70 px-6 py-4 rounded-lg">
          <div className="font-bold mb-2 text-xl">Visual Encoding</div>
          <div className="space-y-1 text-base text-gray-400">
            <div>• Blue: Major chords</div>
            <div>• Pink: Minor chords</div>
            <div>• Size: Occurrence freq.</div>
            <div>• Pulse: Rhythm pattern</div>
            <div>• Glow: Active now</div>
            <div>• Arrows: Progressions</div>
          </div>
        </div>
      )}
      {!isEmbed && (
        <div className="absolute top-8 right-8 text-white text-base font-mono bg-black/70 px-6 py-4 rounded-lg">
          <div className="text-sm text-gray-500">4K • 60fps • 90s loop</div>
        </div>
      )}
    </div>
  );
}
