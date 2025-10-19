'use client';

import { useEffect, useState, useMemo } from 'react';

interface ClusterStats {
  nodes?: number;
  links?: number;
  mean_count?: number;
  max_count?: number;
  dominant_parts?: [string, number][];
  n_lengths?: [number, number][];
  avg_weight?: number;
}

interface Cluster {
  cluster_id: number;
  stats?: ClusterStats;
  narrative_ko: string;
  narrative_en: string;
  representative_measures?: number[];
}

interface Segment {
  segment_index?: number;
  segment_id?: number;
  measures: [number, number];
  mean_tension?: number;
  dominant_modules?: number[];
  narrative_ko: string;
  narrative_en: string;
}

interface NarrativesData {
  clusters: Cluster[];
  segments: Segment[];
}

export default function NarrativesPage() {
  const src = '/output/narratives.json';
  const [data, setData] = useState<NarrativesData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'clusters' | 'segments'>('clusters');

  useEffect(() => {
    let alive = true;
    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status}`);
        return res.json();
      })
      .then(j => alive && setData(j))
      .catch(e => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, [src]);

  const filteredClusters = useMemo(() => {
    if (!data) return [] as Cluster[];
    if (!searchTerm.trim()) return data.clusters;
    const s = searchTerm.toLowerCase();
    return data.clusters.filter(c =>
      (c.narrative_ko?.toLowerCase() || '').includes(s) || 
      (c.narrative_en?.toLowerCase() || '').includes(s)
    );
  }, [data, searchTerm]);

  const filteredSegments = useMemo(() => {
    if (!data) return [] as Segment[];
    if (!searchTerm.trim()) return data.segments;
    const s = searchTerm.toLowerCase();
    return data.segments.filter(c =>
      (c.narrative_ko?.toLowerCase() || '').includes(s) || 
      (c.narrative_en?.toLowerCase() || '').includes(s)
    );
  }, [data, searchTerm]);

  if (err) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-2">Error loading narratives</div>
          <div className="text-sm text-gray-500">{err}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading narratives...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Große Fuge — Narratives
          </h1>
          <p className="text-neutral-400 text-sm">
            Auto-generated cluster and segment narratives for exhibition.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search: inversion, module, tension, measures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-sm w-64 outline-none focus:border-neutral-500"
          />
          {/* KO/EN 버튼 숨김 - 현재 영어 위주 */}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-6 pb-4 flex gap-2">
        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'clusters'
              ? 'bg-purple-600 text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Clusters ({data.clusters.length})
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'segments'
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Segments ({data.segments.length})
        </button>
      </div>

      {/* Clusters Section */}
      {activeTab === 'clusters' && (
        <section className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClusters.length === 0 ? (
              <div className="col-span-full text-center text-neutral-500 py-12">
                No results found
              </div>
            ) : (
              filteredClusters.map((c) => (
                <article
                  key={c.cluster_id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 hover:border-purple-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-purple-400 font-medium">
                      Cluster #{c.cluster_id}
                    </div>
                    {c.stats && (
                      <div className="text-[11px] text-neutral-500">
                        motifs {c.stats.nodes ?? '-'} · links {c.stats.links ?? '-'} · mean {c.stats.mean_count?.toFixed?.(1) ?? '-'}
                      </div>
                    )}
                  </div>
                  <p className="text-sm leading-6 whitespace-pre-wrap text-neutral-300">
                    {c.narrative_en}
                  </p>
                  {c.stats?.dominant_parts && c.stats.dominant_parts.length > 0 && (
                    <div className="pt-2 border-t border-neutral-800">
                      <div className="text-xs text-neutral-500 mb-1">
                        Dominant Parts
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {c.stats.dominant_parts.map(([part, count]) => (
                          <span
                            key={part}
                            className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded text-xs"
                          >
                            {part} ×{count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {c.representative_measures && c.representative_measures.length > 0 && (
                    <div className="text-xs text-neutral-500">
                      measures: {c.representative_measures.slice(0, 16).join(', ')}
                      {c.representative_measures.length > 16 ? ' …' : ''}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* Segments Section */}
      {activeTab === 'segments' && (
        <section className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSegments.length === 0 ? (
              <div className="col-span-full text-center text-neutral-500 py-12">
                No results found
              </div>
            ) : (
              filteredSegments.map((s) => {
                const segId = s.segment_index ?? s.segment_id ?? 0;
                return (
                  <article
                    key={segId}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-400 font-medium">
                        Segment {segId} · mm. {s.measures[0]}–{s.measures[1]}
                      </div>
                      {typeof s.mean_tension === 'number' && (
                        <div className="text-[11px] text-orange-400">
                          tension {s.mean_tension.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm leading-6 whitespace-pre-wrap text-neutral-300">
                      {s.narrative_en}
                    </p>
                    {s.dominant_modules && s.dominant_modules.length > 0 && (
                      <div className="text-xs text-neutral-500">
                        dominant modules: {s.dominant_modules.map((n) => `#${n}`).join(', ')}
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-10 text-xs text-neutral-500 text-center">
        <p>
          {data.clusters.length} clusters, {data.segments.length} segments total | Auto-generated by motif_narrative.py
        </p>
      </footer>
    </main>
  );
}
