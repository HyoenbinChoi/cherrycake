"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * FormTimeline.tsx — Beethoven Große Fuge Op.133 timeline visualizer
 *
 * What it does
 *  - Loads form segments from a JSON file produced by parse_fuge.py (form_timeline.json)
 *  - Renders an SVG timeline where each segment spans its measure range
 *  - (Optional) Renders a simple tension curve derived from the segment "score" field
 *
 * Usage
 *  <FormTimeline
 *    src="/output/form_timeline.json"
 *    height={280}
 *    padding={32}
 *    title="Große Fuge — Form Timeline"
 *  />
 *
 * Expected JSON shape (form_timeline.json)
 *  {
 *    "segments": [
 *      { "start_measure": 1, "end_measure": 12, "score": 3.14 },
 *      { "start_measure": 13, "end_measure": 24, "score": 2.71 },
 *      ...
 *    ]
 *  }
 */

export type Segment = {
  start_measure: number;
  end_measure: number;
  score?: number; // heuristic tension (optional)
};

export type FormTimelineProps = {
  src?: string; // path to form_timeline.json (default: "/output/form_timeline.json")
  height?: number; // total SVG height
  padding?: number; // left/right padding
  title?: string;
  className?: string;
};

const defaultSrc = "/output/form_timeline.json";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function FormTimeline({
  src = defaultSrc,
  height = 280,
  padding = 32,
  title = "Form Timeline",
  className,
}: FormTimelineProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${src}: ${r.status}`);
        return r.json();
      })
      .then((j) => {
        if (!alive) return;
        const segs: Segment[] = (j?.segments || []).map((s: any) => ({
          start_measure: Number(s.start_measure),
          end_measure: Number(s.end_measure),
          score: typeof s.score === "number" ? s.score : undefined,
        }));
        setSegments(segs);
        setLoading(false);
      })
      .catch((e) => {
        if (alive) {
          setError(String(e));
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [src]);

  const dims = useMemo(() => {
    const w = 1000; // SVG viewBox width (scaled by CSS)
    return { w, h: height, innerW: w - padding * 2, innerH: height - 80 };
  }, [height, padding]);

  const domain = useMemo(() => {
    if (!segments.length) return { minM: 0, maxM: 1 };
    const minM = Math.min(...segments.map((s) => s.start_measure));
    const maxM = Math.max(...segments.map((s) => s.end_measure));
    return { minM, maxM };
  }, [segments]);

  const scaleX = (m: number) => {
    const { minM, maxM } = domain;
    if (maxM === minM) return padding;
    const t = (m - minM) / (maxM - minM);
    return padding + t * dims.innerW;
  };

  const tensionPoints = useMemo(() => {
    // Build a simple series from each segment midpoint with score as y
    const pts = segments.map((s) => ({
      x: (s.start_measure + s.end_measure) / 2,
      y: typeof s.score === "number" ? s.score : 0,
    }));
    if (!pts.length) return [] as { x: number; y: number }[];
    // Normalize y into [0,1]
    const ys = pts.map((p) => p.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const span = maxY - minY || 1;
    return pts.map((p) => ({ x: p.x, y: (p.y - minY) / span }));
  }, [segments]);

  const gridY = 4; // number of horizontal grid lines for tension band

  if (loading) {
    return (
      <div className={"w-full " + (className ?? "")}>
        <div className="px-4 py-3">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-12 text-center">
          <p className="text-neutral-400">Loading timeline data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={"w-full " + (className ?? "")}>      
      <div className="px-4 py-3 flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {segments.length > 0 && (
          <div className="text-sm text-neutral-500">Measures {domain.minM}–{domain.maxM} • Segments {segments.length}</div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 text-red-500 text-sm">{error}</div>
      )}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950">
        <svg viewBox={`0 0 ${dims.w} ${dims.h}`} className="w-full h-auto block">
          {/* Background */}
          <rect x={0} y={0} width={dims.w} height={dims.h} fill="#0a0a0a" />

          {/* Axis baseline */}
          <line x1={padding} y1={dims.h - 40} x2={dims.w - padding} y2={dims.h - 40} stroke="#444" strokeWidth={1} />

          {/* Measure ticks */}
          {segments.length > 0 && (
            <g>
              {Array.from({ length: 11 }).map((_, i) => {
                const m = Math.round(domain.minM + (i * (domain.maxM - domain.minM)) / 10);
                const x = scaleX(m);
                return (
                  <g key={i}>
                    <line x1={x} x2={x} y1={40} y2={dims.h - 40} stroke="#222" strokeWidth={1} />
                    <text x={x} y={dims.h - 18} textAnchor="middle" fontSize={10} fill="#aaa">{m}</text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Segments as bands */}
          <g>
            {segments.map((s, idx) => {
              const x1 = scaleX(s.start_measure);
              const x2 = scaleX(s.end_measure);
              const w = Math.max(2, x2 - x1);
              const y = 64;
              const h = dims.innerH - 40; // tall band
              // alternating fill for readability
              const alt = idx % 2 === 0;
              return (
                <g key={idx}>
                  <rect x={x1} y={y} width={w} height={h} fill={alt ? "#141414" : "#0f0f0f"} stroke="#2a2a2a" strokeWidth={1} />
                  <text x={(x1 + x2) / 2} y={y + 16} textAnchor="middle" fontSize={11} fill="#cfcfcf">
                    Seg {idx + 1}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Tension grid */}
          <g>
            {Array.from({ length: gridY }).map((_, i) => {
              const yy = 64 + ((dims.innerH - 40) * i) / (gridY - 1);
              return <line key={i} x1={padding} x2={dims.w - padding} y1={yy} y2={yy} stroke="#1d1d1d" strokeWidth={1} />;
            })}
          </g>

          {/* Tension line (normalized 0..1 mapped to band height) */}
          {tensionPoints.length > 1 && (
            <g>
              {tensionPoints.map((p, i) => {
                if (i === 0) return null;
                const prev = tensionPoints[i - 1];
                const x1 = scaleX(prev.x);
                const x2 = scaleX(p.x);
                const yBase = 64 + (dims.innerH - 40);
                const ySpan = -(dims.innerH - 40);
                const y1 = yBase + ySpan * clamp(prev.y, 0, 1);
                const y2 = yBase + ySpan * clamp(p.y, 0, 1);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8ab4ff" strokeWidth={2} />;
              })}
              {/* Points */}
              {tensionPoints.map((p, i) => {
                const x = scaleX(p.x);
                const yBase = 64 + (dims.innerH - 40);
                const ySpan = -(dims.innerH - 40);
                const y = yBase + ySpan * clamp(p.y, 0, 1);
                return <circle key={i} cx={x} cy={y} r={3} fill="#bcd3ff" />;
              })}
            </g>
          )}
        </svg>
      </div>

      <div className="px-4 py-3 text-sm text-neutral-400">
        <p>
          각 세그먼트는 피치클래스 분포 변화로 감지된 구간입니다. 파란 곡선은 세그먼트의
          score(상대적 긴장 추정치)를 0–1로 정규화하여 표시합니다.
        </p>
      </div>
    </div>
  );
}
