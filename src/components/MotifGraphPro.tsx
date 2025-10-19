"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

/**
 * MotifGraphPro.tsx — Beethoven Große Fuge Op.133 고급 3D Motif 네트워크
 *
 * 기대 입력(JSON, node-link 형식)
 * {
 *   "nodes": [{
 *      "id": "Violin1_0",
 *      "part": "Violin I",
 *      "n": 4,                      // interval n-gram 길이
 *      "pattern": [2, -1, 2, ...],  // 반음 간격 시퀀스
 *      "count": 7,                  // 반복 빈도
 *      "occurrences": [12, 13, 48], // 대표 마디들 (선택)
 *      "label": "Vln1 n=4 (2,-1,2)",
 *      "group": 1                   // 커뮤니티/클러스터 id (선택)
 *   }, ...],
 *   "links": [{
 *      "source": "Violin1_0",
 *      "target": "Viola_3",
 *      "weight": 0.83,              // 유사도 (0~1)
 *      "kind": "transpose|invert|similar" // 연결 근거
 *   }, ...]
 * }
 *
 * 의미 설계
 * - 색상: 파트(Part)
 * - 크기: count(등장 빈도) → 의미의 중심성
 * - 링크 굵기: weight(유사도)
 * - 링크 색상: kind (transpose=밝은 회색, invert=푸른 회색, similar=보라)
 * - 툴팁: 패턴, 등장마디, n, count, 그룹
 *
 * 최소 동작
 * - motif_graph.json에 count/part/label만 있어도 동작하며, 고급 필드가 있을 경우 자동 활용
 */

type NodeT = {
  id: string;
  part?: string;
  n?: number;
  pattern?: number[];
  count?: number;
  occurrences?: number[];
  label?: string;
  group?: number;
};

type LinkT = {
  source: string;
  target: string;
  weight?: number;
  kind?: "transpose" | "invert" | "similar" | string;
};

type GraphData = { nodes: NodeT[]; links: LinkT[] };

const PART_COLORS: Record<string, string> = {
  Violin: "#c084fc",
  "Violin I": "#c084fc",
  "Violin II": "#a78bfa",
  Viola: "#60a5fa",
  Cello: "#34d399",
};

function nodeColor(node: NodeT) {
  if (node.part && PART_COLORS[node.part]) return PART_COLORS[node.part];
  // part 프리픽스 매칭
  if (node.part && /violin/i.test(node.part)) return PART_COLORS["Violin"];
  if (node.part && /viola/i.test(node.part)) return PART_COLORS["Viola"];
  if (node.part && /cello|violoncello/i.test(node.part)) return PART_COLORS["Cello"];
  return "#93c5fd"; // default
}

function linkColor(link: LinkT) {
  switch (link.kind) {
    case "transpose":
      return "rgba(255,255,255,0.45)";
    case "invert":
      return "rgba(120,180,255,0.7)";
    case "similar":
      return "rgba(190,140,255,0.7)";
    default:
      return "rgba(255,255,255,0.25)";
  }
}

function fmtPattern(p?: number[]) {
  return p && p.length ? `(${p.join(", ")})` : "(pattern)";
}

export default function MotifGraphPro({ src = "/output/motif_graph.json" }: { src?: string }) {
  const fgRef = useRef<any>(null);
  const [raw, setRaw] = useState<GraphData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // UI 상태
  const [minCount, setMinCount] = useState<number>(1);
  const [minWeight, setMinWeight] = useState<number>(0);
  const [showInvert, setShowInvert] = useState<boolean>(true);
  const [showTranspose, setShowTranspose] = useState<boolean>(true);
  const [showSimilar, setShowSimilar] = useState<boolean>(true);
  const [partFilter, setPartFilter] = useState<Record<string, boolean>>({});

  // 데이터 로드
  useEffect(() => {
    let alive = true;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${src} (${r.status})`);
        return r.json();
      })
      .then((j) => {
        if (!alive) return;
        // node/link 기본값 보정
        const nodes: NodeT[] = (j.nodes || []).map((n: any) => ({
          id: String(n.id),
          part: n.part ?? "",
          n: Number(n.n ?? 0),
          pattern: Array.isArray(n.pattern) ? n.pattern : undefined,
          count: Number(n.count ?? 1),
          occurrences: Array.isArray(n.occurrences) ? n.occurrences : undefined,
          label: n.label ?? undefined,
          group: typeof n.group === "number" ? n.group : undefined,
        }));
        const links: LinkT[] = (j.links || []).map((l: any) => ({
          source: String(l.source),
          target: String(l.target),
          weight: typeof l.weight === "number" ? l.weight : undefined,
          kind: l.kind ?? undefined,
        }));
        setRaw({ nodes, links });

        // 파트 필터 초기화
        const parts = new Set(nodes.map((n) => n.part).filter((p): p is string => Boolean(p)));
        const init: Record<string, boolean> = {};
        parts.forEach((p) => (init[p] = true));
        setPartFilter(init);
      })
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, [src]);

  // 필터 적용
  const data = useMemo<GraphData | null>(() => {
    if (!raw) return null;
    const allowedKinds = new Set<string>([
      ...(showTranspose ? ["transpose"] : []),
      ...(showInvert ? ["invert"] : []),
      ...(showSimilar ? ["similar"] : []),
    ]);

    const keepNode = (n: NodeT) => (n.count ?? 1) >= minCount && (n.part ? partFilter[n.part] !== false : true);
    const nodes = raw.nodes.filter(keepNode);
    const nodeSet = new Set(nodes.map((n) => n.id));
    const links = raw.links.filter((l) => {
      if (l.weight !== undefined && l.weight < minWeight) return false;
      if (l.kind && !allowedKinds.has(l.kind)) return false;
      return nodeSet.has(String(l.source)) && nodeSet.has(String(l.target));
    });
    return { nodes, links };
  }, [raw, minCount, minWeight, showTranspose, showInvert, showSimilar, partFilter]);

  // 노드 크기 스케일 (빈도에 비례)
  const nodeVal = (n: NodeT) => Math.max(4, Math.min(18, (n.count ?? 1) * 1.5));

  // 툴팁 텍스트
  const tooltip = (n: NodeT) => {
    const lines = [
      n.label ?? n.id,
      n.part ? `Part: ${n.part}` : undefined,
      n.n ? `n-gram: ${n.n}` : undefined,
      n.pattern ? `pattern: ${fmtPattern(n.pattern)}` : undefined,
      typeof n.count === "number" ? `count: ${n.count}` : undefined,
      n.occurrences && n.occurrences.length ? `measures: ${n.occurrences.slice(0, 12).join(", ")}${
        n.occurrences.length > 12 ? " …" : ""
      }` : undefined,
      typeof n.group === "number" ? `cluster: ${n.group}` : undefined,
    ].filter(Boolean);
    return lines.join("\n");
  };

  // 초기 카메라 위치 살짝 넓게
  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.cameraPosition({ z: 220 });
  }, [data]);

  return (
    <div className="w-full h-screen bg-black text-white flex">
      {/* 좌측 패널: 컨트롤 */}
      <aside className="w-72 shrink-0 border-r border-neutral-800 p-4 space-y-4 overflow-y-auto">
        <h2 className="text-lg font-semibold">Motif Network — Pro</h2>
        {err && <div className="text-red-400 text-xs">{err}</div>}

        <div>
          <div className="text-sm mb-1">최소 등장 빈도</div>
          <input
            type="range"
            min={1}
            max={20}
            value={minCount}
            onChange={(e) => setMinCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-neutral-400">≥ {minCount}</div>
        </div>

        <div>
          <div className="text-sm mb-1">최소 유사도(링크 가중치)</div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={minWeight}
            onChange={(e) => setMinWeight(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-neutral-400">≥ {minWeight.toFixed(2)}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm">링크 종류</div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={showTranspose} onChange={(e) => setShowTranspose(e.target.checked)} />
            transpose
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={showInvert} onChange={(e) => setShowInvert(e.target.checked)} />
            invert
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={showSimilar} onChange={(e) => setShowSimilar(e.target.checked)} />
            similar
          </label>
        </div>

        <div className="space-y-1">
          <div className="text-sm">파트 필터</div>
          <div className="space-y-1">
            {Object.keys(partFilter).map((p) => (
              <label key={p} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={partFilter[p] !== false}
                  onChange={(e) => setPartFilter((old) => ({ ...old, [p]: e.target.checked }))}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 text-xs text-neutral-400 space-y-1">
          <div>색상 = 파트, 크기 = 빈도(count)</div>
          <div>선 굵기 = 유사도, 색 = 연결 근거</div>
        </div>
      </aside>

      {/* 그래프 */}
      <div className="flex-1">
        {data && (
          <ForceGraph3D
            ref={fgRef}
            graphData={data}
            backgroundColor="black"
            nodeVal={(n: any) => nodeVal(n as NodeT)}
            nodeColor={(n: any) => nodeColor(n as NodeT)}
            nodeLabel={(n: any) => tooltip(n as NodeT)}
            linkColor={(l: any) => linkColor(l as LinkT)}
            linkWidth={(l: any) => Math.max(0.5, 3 * (l.weight ?? 0.2))}
            linkOpacity={0.9}
          />
        )}
      </div>
    </div>
  );
}
