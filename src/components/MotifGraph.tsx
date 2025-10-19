'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  part: string;
  count: number;
  n: number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  weight: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
  metadata: {
    node_count: number;
    edge_count: number;
    parts: string[];
  };
}

export default function MotifGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ForceGraph3D, setForceGraph3D] = useState<any>(null);

  useEffect(() => {
    // Dynamic import of react-force-graph-3d
    import('react-force-graph-3d').then((module) => {
      setForceGraph3D(() => module.default);
    });

    // Load graph data
    fetch('/fuge/motif_graph.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load graph data');
        return res.json();
      })
      .then(data => {
        setGraphData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading motif graph:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getNodeColor = (node: Node) => {
    const colors: { [key: string]: string } = {
      'Violin 1': '#ff6b6b',
      'Violin 2': '#4ecdc4',
      'Viola': '#45b7d1',
      'Violoncello': '#f9ca24'
    };
    return colors[node.part] || '#ffffff';
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Motif Graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Error: {error}</p>
          <p className="text-sm text-gray-400">Please make sure the data files are in /public/fuge/</p>
        </div>
      </div>
    );
  }

  if (!graphData || !ForceGraph3D) {
    return null;
  }

  return (
    <div className="w-full h-screen relative" ref={containerRef}>
      {/* Info Panel */}
      <div className="absolute top-4 left-4 z-10 bg-gray-900 bg-opacity-90 p-4 rounded-lg text-white max-w-md">
        <h1 className="text-2xl font-bold mb-2">Beethoven Große Fuge Op.133</h1>
        <h2 className="text-lg mb-4 text-gray-300">Motif Network Graph</h2>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Nodes:</span> {graphData.metadata.node_count}</p>
          <p><span className="font-semibold">Edges:</span> {graphData.metadata.edge_count}</p>
          <div className="mt-3">
            <p className="font-semibold mb-2">Parts:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
                <span>Violin 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4ecdc4]"></div>
                <span>Violin 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#45b7d1]"></div>
                <span>Viola</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f9ca24]"></div>
                <span>Violoncello</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-10 bg-gray-900 bg-opacity-90 p-3 rounded-lg text-white text-xs">
        <p><strong>Controls:</strong></p>
        <p>• Drag to rotate</p>
        <p>• Scroll to zoom</p>
        <p>• Click node for details</p>
      </div>

      {/* Force Graph */}
      <ForceGraph3D
        graphData={graphData}
        nodeLabel={(node: Node) => `
          <div style="background: rgba(0,0,0,0.9); padding: 8px; border-radius: 4px; color: white;">
            <strong>${node.part}</strong><br/>
            Length: ${node.n}<br/>
            Count: ${node.count}
          </div>
        `}
        nodeColor={getNodeColor}
        nodeVal={(node: Node) => Math.log(node.count + 1) * 2}
        linkWidth={1}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkOpacity={0.3}
        backgroundColor="#0a0a0a"
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        cooldownTicks={100}
        onNodeClick={(node: Node) => {
          console.log('Node clicked:', node);
        }}
      />
    </div>
  );
}
