'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-3d';

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <div className="text-white">Loading 3D Graph...</div>,
});

interface MotifNode extends NodeObject {
  id: string;
  part: string;
  n: number;
  pattern: number[];
  count: number;
  occurrences: number[];
  label: string;
  group: number;
  val?: number;
  color?: string;
  // For 3D rendering
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
}

interface MotifLink extends LinkObject {
  kind: string;
  weight: number;
  source: string | MotifNode;
  target: string | MotifNode;
  width?: number;
  color?: string;
}

interface MotifGraphData {
  directed: boolean;
  multigraph: boolean;
  graph: Record<string, unknown>;
  nodes: MotifNode[];
  links: MotifLink[];
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

interface Narrative {
  measure: number;
  segment: string;
  narrative_kr: string;
  narrative_en: string;
  keywords?: string[];
}

interface NarrativesData {
  narratives: Narrative[];
}

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

// Part colors
const PART_COLORS: Record<string, string> = {
  'Violin 1': '#FF6B6B',
  'Violin 2': '#4ECDC4',
  'Viola': '#FFE66D',
  'Violoncello': '#95E1D3',
};

export default function MotifConstellation() {
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [formSegments, setFormSegments] = useState<FormSegment[]>([]);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [floatingKeywords, setFloatingKeywords] = useState<Array<{text: string, x: number, y: number, z: number}>>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isEmbed, setIsEmbed] = useState(false);

  const LOOP_DURATION = 60000; // 60 seconds

  // Detect embed mode from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get('embed') === 'true');
  }, []);

  // Set dimensions based on window size
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/output/motif_graph.json').then(r => r.json()),
      fetch('/output/form_timeline.json').then(r => r.json()),
      fetch('/output/narratives.json').then(r => r.json()),
    ])
      .then(([motifGraph, formTimeline, narrativesData]: [MotifGraphData, FormTimelineData, NarrativesData]) => {
        // Process motif graph
        const maxCount = Math.max(...motifGraph.nodes.map(n => n.count));
        const minCount = Math.min(...motifGraph.nodes.map(n => n.count));
        
        const nodes = motifGraph.nodes.map(node => ({
          ...node,
          val: 5 + (node.count - minCount) / (maxCount - minCount) * 25, // Size based on frequency
          color: PART_COLORS[node.part] || '#FFFFFF',
        }));

        const links = motifGraph.links.map(link => ({
          ...link,
          color: `rgba(255, 255, 255, ${link.weight * 0.3})`,
          width: link.weight * 3, // Thickness based on similarity
        }));

        setGraphData({ nodes, links });
        setFormSegments(formTimeline.segments);
        setNarratives(narrativesData.narratives);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setIsLoading(false);
      });
  }, []);

  // Extract keywords from narrative
  const extractKeywords = useCallback((narrative: Narrative): string[] => {
    if (narrative.keywords && narrative.keywords.length > 0) {
      return narrative.keywords;
    }
    // Extract from Korean narrative (simple approach)
    const text = narrative.narrative_kr;
    const words = text.split(/[\s,、，]+/)
      .filter(w => w.length > 2)
      .slice(0, 5);
    return words;
  }, []);

  // Camera animation and segment transitions
  useEffect(() => {
    if (!graphRef.current || graphData.nodes.length === 0) return;

    const animate = (time: number) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = time;
      }

      const elapsed = time - startTimeRef.current;
      const progress = (elapsed % LOOP_DURATION) / LOOP_DURATION;
      
      // Calculate current segment based on progress
      const segmentIndex = Math.floor(progress * formSegments.length);
      
      if (segmentIndex !== currentSegmentIndex && formSegments[segmentIndex]) {
        setCurrentSegmentIndex(segmentIndex);
        
        const segment = formSegments[segmentIndex];
        
        // Find narratives for this segment
        const segmentNarratives = narratives.filter(
          n => n.measure >= segment.start && n.measure <= segment.end
        );
        
        // Highlight nodes that appear in this segment
        const nodesInSegment = new Set<string>();
        graphData.nodes.forEach(node => {
          const motifNode = node as MotifNode;
          const hasOccurrence = motifNode.occurrences.some(
            occ => occ >= segment.start && occ <= segment.end
          );
          if (hasOccurrence) {
            nodesInSegment.add(motifNode.id);
          }
        });
        
        setHighlightedNodes(nodesInSegment);

        // Generate floating keywords
        if (segmentNarratives.length > 0) {
          const narrative = segmentNarratives[0];
          const keywords = extractKeywords(narrative);
          
          const newKeywords = keywords.map((text, i) => ({
            text,
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            z: (Math.random() - 0.5) * 300,
          }));
          
          setFloatingKeywords(newKeywords);
        }
      }

      // Camera rotation
      if (graphRef.current) {
        const angle = progress * Math.PI * 2;
        const distance = 600;
        const height = Math.sin(progress * Math.PI * 4) * 100;
        
        const camera = graphRef.current.camera();
        if (camera) {
          camera.position.x = Math.cos(angle) * distance;
          camera.position.z = Math.sin(angle) * distance;
          camera.position.y = height;
          camera.lookAt(0, 0, 0);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [graphData.nodes.length, formSegments, narratives, currentSegmentIndex, extractKeywords]);

  // Node customization
  const nodeThreeObject = useCallback((node: NodeObject) => {
    const motifNode = node as MotifNode;
    const isHighlighted = highlightedNodes.has(motifNode.id);
    
    if (typeof window !== 'undefined') {
      const THREE = require('three');
      
      // Create node sphere
      const geometry = new THREE.SphereGeometry(motifNode.val || 5);
      const material = new THREE.MeshPhongMaterial({
        color: motifNode.color || '#FFFFFF',
        emissive: isHighlighted ? motifNode.color : '#000000',
        emissiveIntensity: isHighlighted ? 0.8 : 0,
        shininess: 100,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      // Add glow effect for highlighted nodes
      if (isHighlighted) {
        const glowGeometry = new THREE.SphereGeometry((motifNode.val || 5) * 1.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: motifNode.color,
          transparent: true,
          opacity: 0.3,
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glowSphere);
      }
      
      return sphere;
    }
    
    return undefined;
  }, [highlightedNodes]);

  // Link customization
  const linkWidth = useCallback((link: LinkObject) => {
    const motifLink = link as MotifLink;
    return motifLink.width || 1;
  }, []);

  const linkColor = useCallback((link: LinkObject) => {
    const motifLink = link as MotifLink;
    return motifLink.color || 'rgba(255, 255, 255, 0.2)';
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-2xl">Loading motif constellation...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="w-full h-full">
        <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#000000"
          nodeLabel={(node) => {
            const motifNode = node as MotifNode;
            return `${motifNode.label}<br/>Count: ${motifNode.count}`;
          }}
          nodeThreeObject={nodeThreeObject}
          nodeThreeObjectExtend={true}
          linkWidth={linkWidth}
          linkColor={linkColor}
          linkOpacity={isEmbed ? 0.2 : 0.3}
          linkDirectionalParticles={isEmbed ? 1 : 2}
          linkDirectionalParticleWidth={isEmbed ? 1 : 2}
          linkDirectionalParticleSpeed={0.005}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.3}
          warmupTicks={isEmbed ? 50 : 100}
          cooldownTicks={isEmbed ? 500 : 1000}
        />
      </div>

      {/* Floating keywords overlay */}
      {!isEmbed && floatingKeywords.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {floatingKeywords.map((keyword, idx) => (
            <div
              key={idx}
              className="absolute text-white text-2xl font-bold opacity-70 animate-pulse"
              style={{
                left: `${50 + keyword.x / 10}%`,
                top: `${50 + keyword.y / 10}%`,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
              }}
            >
              {keyword.text}
            </div>
          ))}
        </div>
      )}

      {/* Info overlay */}
      {!isEmbed && (
        <div className="absolute top-8 left-8 text-white space-y-4 bg-black/70 p-6 rounded-lg max-w-md">
          <h1 className="text-3xl font-bold">Motif Constellation</h1>
          <div className="text-sm space-y-2">
            <div className="text-gray-300">
              Beethoven - Große Fuge Op. 133
            </div>
            <div className="text-gray-400">
              {formSegments[currentSegmentIndex]?.label || 'Loading...'}
            </div>
            <div className="text-xs text-gray-500 mt-4">
              4K • 60fps • 60s loop
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {!isEmbed && (
        <div className="absolute top-8 right-8 bg-black/70 p-6 rounded-lg">
          <h3 className="text-white font-bold mb-3">Parts</h3>
          <div className="space-y-2">
            {Object.entries(PART_COLORS).map(([part, color]) => (
              <div key={part} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-white text-sm">{part}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-gray-400 text-xs">
            <div>Node size: Occurrence frequency</div>
            <div>Link thickness: Similarity</div>
            <div>Glow: Active in current segment</div>
          </div>
        </div>
      )}

      {/* Segment info */}
      {!isEmbed && (
        <div className="absolute bottom-8 left-8 right-8 bg-black/70 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <span className="font-bold">Segment:</span>{' '}
              {formSegments[currentSegmentIndex]?.label || 'N/A'}
            </div>
            <div className="text-white">
              <span className="font-bold">Measures:</span>{' '}
              {formSegments[currentSegmentIndex]?.start} -{' '}
              {formSegments[currentSegmentIndex]?.end}
            </div>
            <div className="text-gray-400 text-sm">
              {highlightedNodes.size} motifs active
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
              style={{
                width: `${((currentSegmentIndex + 1) / formSegments.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {!isEmbed && (
        <div className="absolute bottom-8 right-8 bg-black/70 p-4 rounded-lg text-white text-sm">
          <div>Nodes: {graphData.nodes.length}</div>
          <div>Links: {graphData.links.length}</div>
          <div>Highlighted: {highlightedNodes.size}</div>
        </div>
      )}
    </div>
  );
}
