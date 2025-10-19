'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MusicEvent {
  part: string;
  measure: number;
  offset: number;
  ql: number;
  type: string;
  midi: number;
  pc: number;
  isRest: boolean;
}

interface EventsData {
  [index: number]: MusicEvent;
  length: number;
}

// Part colors for weaving threads
const PART_COLORS: Record<string, string> = {
  'Violin 1': '#FF6B6B',
  'Violin 2': '#4ECDC4',
  'Viola': '#FFE66D',
  'Violoncello': '#95E1D3',
};

const PART_ORDER = ['Violin 1', 'Violin 2', 'Viola', 'Violoncello'];

export default function CounterpointWeave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [events, setEvents] = useState<MusicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbed, setIsEmbed] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Detect embed mode from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get('embed') === 'true');
  }, []);

  // Constants
  const LOOP_DURATION = 60000; // 60 seconds
  // Use lower resolution in embed mode for performance
  const WIDTH = isEmbed ? 1920 : 3840; // 1080p in embed, 4K otherwise
  const HEIGHT = isEmbed ? 1080 : 2160;
  const MIDI_MIN = 36;
  const MIDI_MAX = 96;

  useEffect(() => {
    fetch('/output/events.json')
      .then(r => r.json())
      .then((data: EventsData) => {
        const eventsArray = Array.from(data).filter(e => e && !e.isRest);
        setEvents(eventsArray);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load events:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!events.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Calculate total duration in quarter lengths
    let maxTime = 0;
    const measureStarts: Record<number, number> = {};
    const measuresData: Record<number, { maxEnd: number }> = {};

    events.forEach(e => {
      if (!measuresData[e.measure]) {
        measuresData[e.measure] = { maxEnd: 0 };
      }
      const eventEnd = e.offset + e.ql;
      measuresData[e.measure].maxEnd = Math.max(measuresData[e.measure].maxEnd, eventEnd);
    });

    let cumulative = 0;
    Object.keys(measuresData).sort((a, b) => Number(a) - Number(b)).forEach(m => {
      measureStarts[Number(m)] = cumulative;
      cumulative += measuresData[Number(m)].maxEnd;
    });

    maxTime = cumulative;

    // Group events by part
    const eventsByPart: Record<string, MusicEvent[]> = {};
    PART_ORDER.forEach(part => {
      eventsByPart[part] = events
        .filter(e => e.part === part)
        .sort((a, b) => {
          const aTime = measureStarts[a.measure] + a.offset;
          const bTime = measureStarts[b.measure] + b.offset;
          return aTime - bTime;
        });
    });

    // Calculate dissonance between simultaneous notes
    const calculateDissonance = (midi1: number, midi2: number): number => {
      const interval = Math.abs(midi1 - midi2) % 12;
      const dissonanceMap: Record<number, number> = {
        0: 0,    // unison
        1: 0.9,  // minor 2nd
        2: 0.7,  // major 2nd
        3: 0.3,  // minor 3rd
        4: 0.2,  // major 3rd
        5: 0.4,  // perfect 4th
        6: 0.8,  // tritone
        7: 0.1,  // perfect 5th
        8: 0.2,  // minor 6th
        9: 0.3,  // major 6th
        10: 0.7, // minor 7th
        11: 0.8, // major 7th
      };
      return dissonanceMap[interval] || 0;
    };

    // Drawing parameters
    const padding = { left: 150, right: 150, top: 150, bottom: 150 };
    const chartWidth = WIDTH - padding.left - padding.right;
    const chartHeight = HEIGHT - padding.top - padding.bottom;

    const timeToX = (time: number) => padding.left + (time / maxTime) * chartWidth;
    const midiToY = (midi: number) => 
      padding.top + chartHeight - ((midi - MIDI_MIN) / (MIDI_MAX - MIDI_MIN)) * chartHeight;

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

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw staff lines for visual reference
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const y = padding.top + (chartHeight / 10) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(WIDTH - padding.right, y);
        ctx.stroke();
      }

      // Get all active notes at current time
      const activeNotes: Array<{ part: string; midi: number; time: number }> = [];
      
      PART_ORDER.forEach((part, partIdx) => {
        const partEvents = eventsByPart[part];
        const color = PART_COLORS[part];
        
        // Draw completed threads
        partEvents.forEach((event, idx) => {
          const startTime = measureStarts[event.measure] + event.offset;
          const endTime = startTime + event.ql;
          
          if (startTime > currentTime) return;
          
          const x1 = timeToX(startTime);
          const y1 = midiToY(event.midi);
          const x2 = timeToX(Math.min(endTime, currentTime));
          
          // Check if this note is currently active
          if (startTime <= currentTime && currentTime <= endTime) {
            activeNotes.push({ part, midi: event.midi, time: startTime });
          }

          // Calculate dissonance with other parts
          let avgDissonance = 0;
          let dissonanceCount = 0;
          
          PART_ORDER.forEach(otherPart => {
            if (otherPart === part) return;
            const otherEvents = eventsByPart[otherPart];
            
            otherEvents.forEach(otherEvent => {
              const otherStart = measureStarts[otherEvent.measure] + otherEvent.offset;
              const otherEnd = otherStart + otherEvent.ql;
              
              // Check for overlap
              if (Math.max(startTime, otherStart) < Math.min(endTime, otherEnd)) {
                avgDissonance += calculateDissonance(event.midi, otherEvent.midi);
                dissonanceCount++;
              }
            });
          });
          
          if (dissonanceCount > 0) {
            avgDissonance /= dissonanceCount;
          }

          // Draw the note thread
          const isActive = startTime <= currentTime && currentTime <= endTime;
          const drawEndTime = Math.min(endTime, currentTime);
          const y2 = y1; // Keep same pitch

          // Fiber separation effect based on dissonance
          const noiseIntensity = avgDissonance * 20;
          const segments = Math.max(3, Math.floor(event.ql * 2));
          
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // Draw multiple fiber strands for weaving effect
          const fiberCount = 3;
          for (let f = 0; f < fiberCount; f++) {
            const fiberOffset = (f - 1) * 2;
            
            // Glow effect for active notes
            if (isActive) {
              ctx.shadowBlur = 30;
              ctx.shadowColor = color;
            } else {
              ctx.shadowBlur = 5;
              ctx.shadowColor = color;
            }

            ctx.strokeStyle = isActive ? color : `${color}88`;
            ctx.lineWidth = isActive ? 4 : 2;

            ctx.beginPath();
            for (let seg = 0; seg <= segments; seg++) {
              const segTime = startTime + (drawEndTime - startTime) * (seg / segments);
              if (segTime > currentTime) break;

              const segX = timeToX(segTime);
              
              // Add noise based on dissonance
              const noiseX = Math.sin(segTime * 0.5 + f * 2) * noiseIntensity;
              const noiseY = Math.cos(segTime * 0.7 + f * 3) * noiseIntensity + fiberOffset;
              
              // Weaving pattern - parts weave over/under each other
              const weaveFactor = Math.sin((segTime + partIdx * 10) * 0.3) * 15;
              
              if (seg === 0) {
                ctx.moveTo(segX + noiseX, y1 + noiseY + weaveFactor);
              } else {
                ctx.lineTo(segX + noiseX, y1 + noiseY + weaveFactor);
              }
            }
            ctx.stroke();
          }

          ctx.restore();

          // Draw note start point
          if (startTime <= currentTime) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.shadowBlur = isActive ? 20 : 10;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(x1, y1, isActive ? 6 : 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      });

      // Draw progress indicator
      const progressX = timeToX(currentTime);
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, padding.top);
      ctx.lineTo(progressX, HEIGHT - padding.bottom);
      ctx.stroke();
      ctx.restore();

      // Draw current time and stats
      if (!isEmbed) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px "SF Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Time: ${currentTime.toFixed(1)} / ${maxTime.toFixed(1)} qL`, padding.left, 80);
        ctx.fillText(`Active Notes: ${activeNotes.length}`, WIDTH - 400, 80);

        // Draw part labels
        ctx.font = '32px "SF Mono", monospace';
        PART_ORDER.forEach((part, idx) => {
          ctx.fillStyle = PART_COLORS[part];
          ctx.textAlign = 'right';
          const y = padding.top + 50 + idx * 50;
          ctx.fillText(part, padding.left - 20, y);
        });

        // Progress bar
        ctx.fillStyle = '#333333';
        ctx.fillRect(padding.left, HEIGHT - 100, chartWidth, 10);
        ctx.fillStyle = '#00AAFF';
        ctx.fillRect(padding.left, HEIGHT - 100, chartWidth * progress, 10);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-2xl">Loading counterpoint data...</div>
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
        <div className="absolute top-8 right-8 text-white text-xl font-mono bg-black/70 px-6 py-4 rounded-lg">
          <div className="font-bold text-2xl mb-2">Counterpoint Weave</div>
          <div className="text-sm text-gray-400">Beethoven - Große Fuge Op. 133</div>
          <div className="text-xs text-gray-500 mt-3">4K • 60fps • 60s loop</div>
          <div className="mt-4 space-y-2">
            {PART_ORDER.map(part => (
              <div key={part} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: PART_COLORS[part] }}
                />
                <span>{part}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isEmbed && (
        <div className="absolute bottom-8 left-8 text-white text-sm font-mono bg-black/70 px-6 py-4 rounded-lg">
          <div className="font-bold mb-2">Visual Encoding</div>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• X-axis: Time (quarter lengths)</div>
            <div>• Y-axis: Pitch (MIDI note)</div>
            <div>• Thread separation: Dissonance</div>
            <div>• Glow intensity: Active notes</div>
            <div>• Weaving pattern: Part interaction</div>
          </div>
        </div>
      )}
    </div>
  );
}
