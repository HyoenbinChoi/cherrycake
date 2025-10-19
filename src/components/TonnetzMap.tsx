"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * TonnetzMap.tsx — visualize tonnetz.json
 *
 * Input (/public/output/tonnetz.json)
 *  {
 *    nodes: [{ id, label, root, quality, pcs:[...], x, y, occurrences_qL:[...] }],
 *    links: [{ source, target, kind: 'P'|'R'|'L'|'other', weight }],
 *    meta: {...}
 *  }
 */

type NodeT = {
  id: string;
  label: string;
  root: number;
  quality: 'M' | 'm';
  pcs: number[];
  x: number; // tonnetz coords
  y: number;
  occurrences_qL?: number[];
};

type LinkT = { source: string; target: string; kind?: string; weight?: number };

type DataT = { nodes: NodeT[]; links: LinkT[]; meta?: any };

const KIND_COLOR: Record<string, string> = {
  P: '#9ae6b4',
  R: '#90cdf4',
  L: '#d6bcfa',
  other: '#a3a3a3'
};

export default function TonnetzMap({ src = "/output/tonnetz.json" }: { src?: string }) {
  const [data, setData] = useState<DataT | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [scale, setScale] = useState(42);
  const [nodeSize, setNodeSize] = useState(8);
  const [showOther, setShowOther] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(src)
      .then(r => { if(!r.ok) throw new Error(`Failed to load ${src}`); return r.json(); })
      .then(j => { if(alive) setData(j); })
      .catch(e => alive && setErr(String(e)));
    return () => { alive = false };
  }, [src]);

  const nodes = data?.nodes || [];
  const links = useMemo(() => {
    if (!data) return [] as LinkT[];
    return data.links.filter(l => showOther || (l.kind && l.kind !== 'other'));
  }, [data, showOther]);

  // derive node degree for sizing (or use occurrences length)
  const degree = useMemo(() => {
    const d: Record<string, number> = {};
    nodes.forEach(n => d[n.id] = Math.max(1, n.occurrences_qL?.length || 1));
    links.forEach(l => { d[l.source] = (d[l.source]||1)+1; d[l.target] = (d[l.target]||1)+1 });
    return d;
  }, [nodes, links]);

  const view = { w: 1200, h: 800, pad: 60 };
  const toXY = (n: NodeT) => ({ X: view.pad + n.x * scale + view.w/2, Y: view.pad + n.y * scale + view.h/2 });

  if (err) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-2">Error loading Tonnetz data</div>
          <div className="text-sm text-gray-500">{err}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading Tonnetz...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white">
      <header className="px-6 pt-6 pb-3 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Tonnetz Map — Neo-Riemannian Visualization</h1>
          <p className="text-neutral-400 text-sm">P/R/L 변환 경로로 본 화성 공간 | {nodes.length} triads, {links.length} transitions</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-neutral-400">scale</span>
            <input 
              type="range" 
              min={24} 
              max={80} 
              value={scale} 
              onChange={e=>setScale(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-neutral-500 w-8 text-right">{scale}</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-neutral-400">node</span>
            <input 
              type="range" 
              min={5} 
              max={20} 
              value={nodeSize} 
              onChange={e=>setNodeSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-neutral-500 w-8 text-right">{nodeSize}</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showOther} 
              onChange={e=>setShowOther(e.target.checked)}
              className="w-4 h-4"
            /> 
            <span className="text-neutral-400">기타 링크</span>
          </label>
        </div>
      </header>

      <svg viewBox={`0 0 ${view.w} ${view.h}`} className="w-full h-[calc(100vh-180px)] block">
        <rect x={0} y={0} width={view.w} height={view.h} fill="#0a0a0a" />

        {/* links */}
        <g>
          {links.map((l, i) => {
            const a = nodes.find(n => n.id === l.source);
            const b = nodes.find(n => n.id === l.target);
            if (!a || !b) return null;
            const A = toXY(a), B = toXY(b);
            const col = KIND_COLOR[l.kind || 'other'] || '#999';
            return (
              <g key={i}>
                <line x1={A.X} y1={A.Y} x2={B.X} y2={B.Y} stroke={col} strokeWidth={1.5} opacity={0.8} />
              </g>
            );
          })}
        </g>

        {/* nodes */}
        <g>
          {nodes.map((n, i) => {
            const { X, Y } = toXY(n);
            const r = Math.min(22, nodeSize + Math.log(degree[n.id] + 1));
            const fill = n.quality === 'M' ? '#60a5fa' : '#f472b6';
            return (
              <g key={n.id}>
                <circle cx={X} cy={Y} r={r} fill={fill} opacity={0.9} />
                <text x={X} y={Y+4} textAnchor="middle" fontSize={10} fill="#e5e7eb" fontWeight="500">{n.label}</text>
              </g>
            );
          })}
        </g>

        {/* legend */}
        <g>
          {Object.entries(KIND_COLOR).map(([k,c],i)=> (
            <g key={k}>
              <rect x={20} y={20+i*18} width={12} height={12} fill={c} />
              <text x={38} y={30+i*18} fontSize={11} fill="#cbd5e1">{k === 'P' ? 'P (parallel)' : k === 'R' ? 'R (relative)' : k === 'L' ? 'L (leitton)' : 'other'}</text>
            </g>
          ))}
        </g>
      </svg>

      <footer className="px-6 py-4 text-xs text-neutral-500">
        <p className="mb-1">
          <strong>노드 색상:</strong> 파랑 = 장삼화음 (Major), 분홍 = 단삼화음 (Minor)
        </p>
        <p className="mb-1">
          <strong>링크 색상:</strong> 초록(P) = Parallel · 하늘(R) = Relative · 보라(L) = Leittonwechsel · 회색 = 기타 전이
        </p>
        <p>
          <strong>전시 설명:</strong> "노드는 작품에서 실제로 등장한 삼화음, 좌표는 5도(+7)·장3도(+4) 격자 평균점. 링크는 인접 구간의 네오리만 변환."
        </p>
      </footer>
    </div>
  );
}
