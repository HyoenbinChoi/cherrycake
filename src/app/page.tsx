"use client";

import { useState } from "react";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const visualizations = [
    { 
      src: '/tension?embed=true',
      href: '/tension',
      title: 'Tension Canvas',
      tags: '긴장 곡선 · 동적 시각화 · 4K'
    },
    { 
      src: '/motif-constellation?embed=true',
      href: '/motif-constellation',
      title: 'Motif Constellation',
      tags: '모티프 성좌 · 3D 네트워크 · 인터랙티브'
    },
    { 
      src: '/counterpoint?embed=true',
      href: '/counterpoint',
      title: 'Counterpoint Weave',
      tags: '대위법 직조 · 실시간 · 불협화도'
    },
    { 
      src: '/tonnetz?embed=true',
      href: '/tonnetz',
      title: 'Tonnetz Pathway',
      tags: '네오리만 경로 · 화성 진행 · 카메라 애니메이션'
    }
  ];

  const maxSlide = Math.ceil(visualizations.length / 2) - 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("전송에 실패했습니다.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // 3초 후 상태 초기화
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "오류가 발생했습니다.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-28 bg-ivory">
        <div className="container mx-auto px-[4%]">
          <h1 className="font-bold text-4xl md:text-6xl leading-tight tracking-tight">
            Decoding <span className="underline decoration-cyan underline-offset-8">Emotions</span>.
          </h1>
          <p className="mt-4 max-w-prose text-neutral-600">패턴의 시대, 감각을 해석하다.</p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <a href="#projects" className="rounded-xl bg-gradient-to-r from-cherry to-peach text-black px-5 py-3 font-medium hover:brightness-105">View Structures</a>
            <a href="#contact" className="rounded-xl border border-neutral-300 px-5 py-3 font-medium hover:bg-white/60">Work with me</a>
          </div>
        </div>
        <div className="relative mt-10 h-px bg-cherry/60">
          <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-transparent via-peach to-transparent animate-pulseLine" />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 bg-slate text-ivory">
        <div className="container mx-auto px-[4%]">
          <h2 className="text-3xl md:text-4xl font-medium mb-2">Structures</h2>
          <p className="text-ivory/70 mb-8">
            저는 거대한 문화의 결을 분석하고, 추상화하고, 다시 조형화합니다.
            <br />
            체리케이크는 그 과정이 투명하게 드러나는 나의 실험실이자, 하나의 예술 작품집입니다.
          </p>
          
          {/* Featured: Große Fuge */}
          <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-slate via-graphite to-slate ring-2 ring-cherry/30 hover:ring-cherry/60 transition-all group">
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Beethoven Große Fuge Op.133</h3>
                  <p className="text-ivory/80">베토벤 대 푸가의 구조적 긴장과 해소의 분석</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-cherry/20 text-cherry text-sm font-medium">Featured</span>
              </div>
              <div className="flex gap-3 flex-wrap mb-6">
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">Music Analysis</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">3D Visualization</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">Advanced Filtering</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">Form Timeline</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">Network Graph</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">Tonnetz Map</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">AI Narratives</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                <a 
                  href="/fuge" 
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition-all"
                >
                  3D Motif 네트워크 →
                </a>
                <a 
                  href="/motif-graph" 
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition-all"
                >
                  고급 Motif 분석 →
                </a>
                <a 
                  href="/motif" 
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition-all"
                >
                  형식 타임라인 →
                </a>
                <a 
                  href="/narratives" 
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-cherry/20 hover:bg-cherry/30 border border-cherry/40 font-medium transition-all"
                >
                  서사 분석 (NEW) →
                </a>
                <a 
                  href="/tonnetz" 
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 font-medium transition-all"
                >
                  Tonnetz 화성 지도 (NEW) →
                </a>
              </div>
            </div>
          </div>

          {/* Visualization Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {visualizations.map((item, i) => {
                  // Only load iframes for current slide and adjacent slides
                  const isVisible = Math.abs(i - currentSlide * 2) <= 2;
                  
                  return (
                    <div key={i} className="min-w-full md:min-w-[calc(50%-12px)] flex-shrink-0">
                      <a href={item.href} className="block">
                        <article className="rounded-2xl overflow-hidden bg-slate/70 ring-1 ring-white/5 hover:shadow-[0_0_0_1px_rgba(193,169,255,.9)] transition group h-full">
                          <div className="w-full aspect-video bg-black relative overflow-hidden">
                            {isVisible ? (
                              <iframe 
                                src={item.src}
                                className="w-full h-full border-0 pointer-events-none"
                                title={item.title}
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/30">
                                <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="text-2xl font-semibold">{item.title}</h3>
                            <p className="text-sm opacity-80 mt-1">{item.tags}</p>
                            <div className="mt-3 h-0.5 w-6 bg-cherry" />
                          </div>
                        </article>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-cherry/90 hover:bg-cherry text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(maxSlide, prev + 1))}
              disabled={currentSlide === maxSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-cherry/90 hover:bg-cherry text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === i ? 'bg-cherry w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="py-24 bg-graphite text-ivory">
        <div className="container mx-auto px-[4%]">
          <h2 className="text-3xl md:text-4xl font-medium">The Logic of Feeling</h2>
          <p className="mt-2 text-ivory/70">감성에도 패턴은 존재합니다.</p>
          <blockquote className="mt-6 border-l-2 border-rose pl-4 italic">
            체리케이크는 그 패턴을 찾아내고,
            <br />
            AI로 감각의 언어를 해석합니다.
            <br />
            데이터를 감성으로, 데이터를 새로운 예술로 창조합니다.
          </blockquote>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-ivory text-textGraphite">
        <div className="container mx-auto px-[4%] max-w-xl">
          <h2 className="text-3xl md:text-4xl font-medium">Start a Project</h2>
          
          {status === "success" && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
              ✅ 메시지가 성공적으로 전송되었습니다!
            </div>
          )}
          
          {status === "error" && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
              ❌ {errorMessage}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">이름</span>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={status === "loading"}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-cyan bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">이메일*</span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                disabled={status === "loading"}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-cyan bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">프로젝트 메모*</span>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required 
                rows={5} 
                disabled={status === "loading"}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-cyan bg-white disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </label>
            <button 
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-gradient-to-r from-cherry to-peach text-black px-5 py-3 font-medium hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {status === "loading" ? "전송 중..." : "Send"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
