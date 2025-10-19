"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * TonnetzSync.tsx — Cross-linked Tonnetz × Timeline (Segments) viewer
 *
 * Loads:
 *  - /output/tonnetz.json                (from tonnetz_map.py)
 *  - /output/form_timeline.json          (segments with start_measure, end_measure)
 *  - /output/events.json (optional)      (for mapping quarterLength offsets -> approximate measure)
 *
 * What it does:
 *  - Shows a Tonnetz map (simple 2D lattice like TonnetzMap.tsx)
 *  - Shows a sidebar list of segments; hovering/clicking a segment highlights nodes/links
 *    whose occurrences (qL) fall inside that segment's measure range (approx via events.json)
 *
 * How measure mapping works:
 *  - We derive an approximate mapping from score offsets (qL) to measure numbers by scanning events.json
 *    and taking the earliest offset observed for each measure (start anchor).
 *  - Then, given any offset t, we find the last anchor whose offset <= t to estimate a measure.
 *  - This is heuristic but robust enough for visualization.
 */

type NodeT = { id: string; label: string; root: number; quality: 'M'|'m'; x: number; y: number; occurrences_qL?: number[] };
type LinkT = { source: string; target: string; kind?: string; weight?: number };

type TonnetzData = { nodes: NodeT[]; links: LinkT[]; meta?: any };

type Segment = { start_measure: number; end_measure: number; score?: number };

type EventsRow = { measure?: number; offset?: number; ql?: number };

const KIND_COLOR: Record<string, string> = { P: '#9ae6b4', R: '#90cdf4', L: '#d6bcfa', other: '#a3a3a3' };

function buildMeasureAnchors(rows: EventsRow[]): { measure: number; offset: number }[] {
  // Build accurate cumulative measure starts
  const measuresData: Record<number, { maxEnd: number }> = {};
  
  for (const r of rows) {
    const m = typeof r.measure === 'number' ? r.measure : undefined;
    const o = typeof r.offset === 'number' ? r.offset : undefined;
    if (m === undefined || o === undefined) continue;
    
    if (!measuresData[m]) {
      measuresData[m] = { maxEnd: 0 };
    }
    // Assuming 'ql' field exists in events
    const ql = (r as any).ql || 0;
    const eventEnd = o + ql;
    measuresData[m].maxEnd = Math.max(measuresData[m].maxEnd, eventEnd);
  }
  
  // Calculate cumulative measure starts
  const anchors: { measure: number; offset: number }[] = [];
  let cumulative = 0.0;
  
  for (const m of Object.keys(measuresData).map(Number).sort((a, b) => a - b)) {
    anchors.push({ measure: m, offset: cumulative });
    cumulative += measuresData[m].maxEnd;
  }
  
  return anchors;
}

function approxMeasureOfOffset(anchors: {measure:number; offset:number}[], t: number): number | null {
  if (!anchors.length) return null;
  let lo = 0, hi = anchors.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (anchors[mid].offset <= t) { ans = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  return anchors[Math.max(0, Math.min(ans, anchors.length - 1))].measure;
}

export default function TonnetzSync({
  tonnetzSrc = "/output/tonnetz.json",
  timelineSrc = "/output/form_timeline.json",
  eventsSrc = "/output/events.json",
}: { tonnetzSrc?: string; timelineSrc?: string; eventsSrc?: string }) {
  const [tz, setTZ] = useState<TonnetzData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [anchors, setAnchors] = useState<{ measure: number; offset: number }[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [scale, setScale] = useState(42);
  const [nodeSize, setNodeSize] = useState(8);
  const [showOther, setShowOther] = useState(true);
  const [activeSeg, setActiveSeg] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // load tonnetz
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(tonnetzSrc).then(r=>{ if(!r.ok) throw new Error('tonnetz'); return r.json(); }),
      fetch(timelineSrc).then(r=>{ if(!r.ok) throw new Error('timeline'); return r.json(); }),
      fetch(eventsSrc).then(r=> r.ok ? r.json() : Promise.resolve([]))
    ]).then(([tzj, tlj, evj]) => {
      if(!alive) return;
      setTZ(tzj);
      setSegments((tlj?.segments || []).map((s:any)=>({ start_measure: Number(s.start_measure), end_measure: Number(s.end_measure), score: typeof s.score==='number'?s.score:undefined })));
      const evRows: EventsRow[] = Array.isArray(evj) ? evj : [];
      setAnchors(buildMeasureAnchors(evRows));
    }).catch(e => alive && setErr(String(e)));
    return ()=>{ alive = false };
  }, [tonnetzSrc, timelineSrc, eventsSrc]);

  const nodes = tz?.nodes || [];
  const linksRaw = tz?.links || [];

  // active segment range & highlight sets
  const activeRange = useMemo(() => {
    if (activeSeg === null || !segments[activeSeg]) return null;
    return { a: segments[activeSeg].start_measure, b: segments[activeSeg].end_measure };
  }, [activeSeg, segments]);

  const highlighted = useMemo(() => {
    if (!activeRange || !anchors.length) return { nodes: new Set<string>(), links: new Set<number>() };
    const { a, b } = activeRange;
    const nodeHit = new Set<string>();
    const linksHit = new Set<number>();

    // mark nodes whose occurrences fall into [a,b]
    nodes.forEach(n => {
      const occ = n.occurrences_qL || [];
      for (const t of occ) {
        const m = approxMeasureOfOffset(anchors, t);
        if (m !== null && m >= a && m <= b) { nodeHit.add(n.id); break; }
      }
    });

    // mark links if both ends hit
    linksRaw.forEach((l, i) => {
      if (nodeHit.has(String(l.source)) && nodeHit.has(String(l.target))) linksHit.add(i);
    });
    return { nodes: nodeHit, links: linksHit };
  }, [activeRange, anchors, nodes, linksRaw]);

  const links = useMemo(() => {
    return linksRaw.filter((l, i) => showOther || (l.kind && l.kind !== 'other'));
  }, [linksRaw, showOther]);

  const view = { w: 1200, h: 800, pad: 60 };
  const toXY = (n: NodeT) => ({ X: view.pad + n.x * scale + view.w/2, Y: view.pad + n.y * scale + view.h/2 });

  if (err) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-2">Error loading data</div>
          <div className="text-sm text-gray-500">{err}</div>
        </div>
      </div>
    );
  }

  if (!tz) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading Tonnetz Sync...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex">
      {/* sidebar */}
      <aside className="w-80 shrink-0 border-r border-neutral-800 p-4 space-y-4 overflow-y-auto">
        <div>
          <h2 className="text-lg font-semibold mb-1">Form Segments</h2>
          <p className="text-xs text-neutral-500">세그먼트에 마우스를 올리면 해당 구간의 화음이 하이라이트됩니다</p>
        </div>
        
        <div className="space-y-2 max-h-[40vh] overflow-auto pr-1">
          {segments.map((s, i) => (
            <button
              key={i}
              onMouseEnter={() => setActiveSeg(i)}
              onMouseLeave={() => setActiveSeg(null)}
              onClick={() => setActiveSeg(activeSeg === i ? null : i)}
              className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                i===activeSeg
                  ? 'border-blue-500 bg-blue-900/20 shadow-lg' 
                  : 'border-neutral-800 bg-neutral-900 hover:border-neutral-600'
              }`}
            >
              <div className="text-sm font-medium">
                Segment {i + 1}
              </div>
              <div className="text-xs text-neutral-400">
                mm. {s.start_measure}–{s.end_measure}
              </div>
              {typeof s.score === 'number' && (
                <div className="text-[11px] text-orange-400 mt-1">
                  tension: {s.score.toFixed(2)}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="text-sm font-semibold">View Controls</div>
          
          <label className="flex items-center gap-2 text-xs">
            <span className="w-12">Scale</span>
            <input 
              type="range" 
              min={24} 
              max={80} 
              value={scale} 
              onChange={e=>setScale(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-8 text-right text-neutral-500">{scale}</span>
          </label>
          
          <label className="flex items-center gap-2 text-xs">
            <span className="w-12">Node</span>
            <input 
              type="range" 
              min={5} 
              max={20} 
              value={nodeSize} 
              onChange={e=>setNodeSize(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-8 text-right text-neutral-500">{nodeSize}</span>
          </label>
          
          <label className="flex items-center gap-2 text-xs">
            <input 
              type="checkbox" 
              checked={showOther} 
              onChange={e=>setShowOther(e.target.checked)}
              className="w-4 h-4"
            /> 
            <span>기타 링크 표시</span>
          </label>
        </div>

        <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-500">
          <p className="mb-2"><strong>노드:</strong> {nodes.length}개 삼화음</p>
          <p><strong>링크:</strong> {links.length}개 전이</p>
        </div>
      </aside>

      {/* main canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-black/80 rounded-xl p-3 text-xs space-y-1 pointer-events-none">
          <div className="font-semibold mb-2">Tonnetz — Neo-Riemannian Space</div>
          {activeSeg !== null && segments[activeSeg] && (
            <div className="text-blue-400">
              ▸ Segment {activeSeg + 1} (mm. {segments[activeSeg].start_measure}–{segments[activeSeg].end_measure})
            </div>
          )}
        </div>

        <svg 
          viewBox={`0 0 ${view.w} ${view.h}`} 
          className="w-full h-screen block cursor-move"
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startPan = { ...pan };
            
            const handleMove = (me: MouseEvent) => {
              setPan({
                x: startPan.x + (me.clientX - startX),
                y: startPan.y + (me.clientY - startY)
              });
            };
            
            const handleUp = () => {
              document.removeEventListener('mousemove', handleMove);
              document.removeEventListener('mouseup', handleUp);
            };
            
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleUp);
          }}
        >
          <rect x={0} y={0} width={view.w} height={view.h} fill="#0a0a0a" />

          {/* Zoomable/pannable content - only nodes and links */}
          <g transform={`translate(${view.w/2}, ${view.h/2})`}>
            <g transform={`scale(${zoom})`}>
              <g transform={`translate(${pan.x / zoom}, ${pan.y / zoom})`}>
                <g transform={`translate(${-view.w/2}, ${-view.h/2})`}>
              {/* links */}
              <g>
                {links.map((lnk, idx) => {
                  const A = nodes.find(n => n.id === String(lnk.source));
                  const B = nodes.find(n => n.id === String(lnk.target));
                  if (!A || !B) return null;
                  
                  const active = highlighted.links.has(linksRaw.indexOf(lnk));
                  const col = KIND_COLOR[lnk.kind || 'other'] || '#666';
                  const { X: x1, Y: y1 } = toXY(A);
                  const { X: x2, Y: y2 } = toXY(B);
                  
                  return (
                    <line
                      key={`${lnk.source}-${lnk.target}-${idx}`}
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2}
                      stroke={col} 
                      strokeWidth={active ? 3 : 1.5} 
                      opacity={active ? 1 : 0.4}
                      className="transition-all"
                    />
                  );
                })}
              </g>

              {/* nodes */}
              <g>
                {nodes.map((n) => {
                  const { X, Y } = toXY(n);
                  const r0 = Math.min(22, nodeSize + Math.log((n.occurrences_qL?.length || 1) + 1));
                  const active = highlighted.nodes.has(n.id);
                  const r = active ? r0 + 3 : r0;
                  const fill = n.quality === 'M' ? '#60a5fa' : '#f472b6';
                  return (
                    <g key={n.id} className="transition-all">
                      <circle 
                        cx={X} 
                        cy={Y} 
                        r={r} 
                        fill={fill} 
                        opacity={active ? 1 : 0.7} 
                        stroke={active ? '#e5e7eb' : 'none'} 
                        strokeWidth={active ? 2 : 0}
                      />
                      <text 
                        x={X} 
                        y={Y+4} 
                        textAnchor="middle" 
                        fontSize={active ? 11 : 10} 
                        fill="#e5e7eb" 
                        opacity={active ? 1 : 0.8}
                        fontWeight={active ? 600 : 400}
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </g>
                </g>
              </g>
            </g>
          </g>

          {/* Legend - fixed position, outside zoom group */}
          <g>
            <rect x={15} y={15} width={140} height={78} fill="#000" opacity={0.8} rx={4} />
            {Object.entries(KIND_COLOR).map(([k,c],i)=> (
              <g key={k}>
                <rect x={20} y={20+i*18} width={12} height={12} fill={c} />
                <text x={38} y={30+i*18} fontSize={11} fill="#cbd5e1">
                  {k === 'P' ? 'P (parallel)' : k === 'R' ? 'R (relative)' : k === 'L' ? 'L (leitton)' : k}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Zoom Control - Vertical Slider */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 bg-black/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-neutral-700">
          {/* Zoom In Button */}
          <button
            onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110 shadow-lg"
            title="Zoom In"
          >
            +
          </button>

          {/* Vertical Zoom Slider */}
          <div className="relative h-40 w-10 flex items-center justify-center">
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="appearance-none bg-transparent cursor-pointer"
              style={{
                width: '160px',
                height: '10px',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
              }}
              title={`Zoom: ${zoom.toFixed(1)}x`}
            />
            {/* Custom track styling */}
            <style jsx>{`
              input[type="range"]::-webkit-slider-track {
                width: 100%;
                height: 8px;
                background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.5) / 2.5) * 100}%, #404040 ${((zoom - 0.5) / 2.5) * 100}%, #404040 100%);
                border-radius: 4px;
              }
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 18px;
                height: 18px;
                background: #60a5fa;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
                border: 2px solid white;
                margin-top: -5px;
              }
              input[type="range"]::-webkit-slider-thumb:hover {
                background: #93c5fd;
                box-shadow: 0 0 12px rgba(96, 165, 250, 0.8);
              }
              input[type="range"]::-moz-range-track {
                width: 100%;
                height: 8px;
                background: #404040;
                border-radius: 4px;
              }
              input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                background: #60a5fa;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid white;
              }
            `}</style>
          </div>

          {/* Zoom level indicator */}
          <div className="text-white text-sm font-mono font-semibold bg-blue-600/20 px-3 py-1 rounded-lg">
            {zoom.toFixed(1)}x
          </div>

          {/* Zoom Out Button */}
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev / 1.2))}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110 shadow-lg"
            title="Zoom Out"
          >
            −
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-neutral-700 my-1" />

          {/* Reset Button */}
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            title="Reset View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Wheel zoom hint */}
          <div className="text-[10px] text-neutral-500 text-center mt-2 max-w-[60px] leading-tight">
            Wheel to zoom
          </div>
        </div>

        {/* Pan hint overlay */}
        <div className="absolute bottom-4 right-6 bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2 text-xs text-neutral-400 border border-neutral-700">
          <span className="font-semibold text-blue-400">Drag</span> canvas to pan
        </div>
      </div>
    </div>
  );
}
