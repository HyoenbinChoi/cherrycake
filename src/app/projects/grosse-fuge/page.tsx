"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 fade-in 애니메이션
    setIsVisible(true);
  }, []);

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

  // 모바일: 4개, 데스크톱: 2개 슬라이드
  const maxSlide = visualizations.length - 1; // 모바일 기준

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-ivory overflow-hidden">
        <div className="container mx-auto px-[4%]">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.1] tracking-tight">
              Decoding <span className="relative inline-block">
                <span className="text-gradient">Emotions</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6C50 2 150 2 200 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#89E8E0" />
                      <stop offset="100%" stopColor="#C1A9FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>.
            </h1>
            <p className="mt-6 max-w-prose text-lg md:text-xl text-neutral-600 leading-relaxed">
              패턴의 시대, 감각을 해석하다.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a 
                href="#projects" 
                className="group relative rounded-xl bg-gradient-to-r from-cherry to-peach text-white px-6 py-3.5 font-semibold hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10">View Structures</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cherry/80 to-peach/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>
        </div>
        <div className={`relative mt-12 h-px bg-gradient-to-r from-transparent via-cherry/60 to-transparent transition-opacity duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-transparent via-peach to-transparent animate-pulseLine" />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 md:py-32 bg-gradient-to-b from-slate via-slate to-graphite text-ivory">
        <div className="container mx-auto px-[4%]">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Structures</h2>
            <p className="text-ivory/70 text-lg leading-relaxed max-w-3xl">
              저는 거대한 문화의 결을 분석하고, 추상화하고, 다시 조형화합니다.
              <br />
              체리케이크는 그 과정이 투명하게 드러나는 나의 실험실이자, 하나의 예술 작품집입니다.
            </p>
          </div>
          
          {/* Featured: Große Fuge */}
          <div className="mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate/80 via-graphite to-slate backdrop-blur ring-2 ring-cherry/30 hover:ring-cherry/60 hover:shadow-elevated transition-all duration-500 group">
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight">
                    Beethoven Große Fuge Op.133
                  </h3>
                  <p className="text-ivory/80 text-lg">베토벤 대 푸가의 구조적 긴장과 해소의 분석</p>
                </div>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-cherry/20 to-peach/20 border border-cherry/30 text-cherry text-sm font-semibold backdrop-blur">
                  Featured
                </span>
              </div>
              <div className="flex gap-2 flex-wrap mb-8">
                {['Music Analysis', '3D Visualization', 'Advanced Filtering', 'Form Timeline', 'Network Graph', 'Tonnetz Map', 'AI Narratives'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/10 transition-colors duration-200">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <a 
                  href="/fuge" 
                  className="group/link flex items-center justify-between px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-medium transition-all duration-200"
                >
                  <span>3D Motif 네트워크</span>
                  <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a 
                  href="/motif-graph" 
                  className="group/link flex items-center justify-between px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-medium transition-all duration-200"
                >
                  <span>고급 Motif 분석</span>
                  <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a 
                  href="/motif" 
                  className="group/link flex items-center justify-between px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-medium transition-all duration-200"
                >
                  <span>형식 타임라인</span>
                  <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a 
                  href="/narratives" 
                  className="group/link flex items-center justify-between px-5 py-3 rounded-xl bg-cherry/10 hover:bg-cherry/20 border border-cherry/30 hover:border-cherry/50 font-medium transition-all duration-200"
                >
                  <span>서사 분석 <span className="text-xs opacity-75">NEW</span></span>
                  <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a 
                  href="/tonnetz" 
                  className="group/link flex items-center justify-between px-5 py-3 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-500/50 font-medium transition-all duration-200"
                >
                  <span>Tonnetz 화성 지도 <span className="text-xs opacity-75">NEW</span></span>
                  <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Visualization Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out gap-4 md:gap-6"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {visualizations.map((item, i) => {
                  // 현재 슬라이드와 인접 슬라이드만 로드
                  const isVisible = Math.abs(i - currentSlide) <= 1;
                  
                  return (
                    <div key={i} className="min-w-full flex-shrink-0 px-2 md:px-0">
                      <a href={item.href} className="block group/card">
                        <article className="rounded-2xl overflow-hidden bg-slate/70 ring-1 ring-white/5 hover:ring-white/20 hover:shadow-elevated transition-all duration-300 h-full transform hover:-translate-y-1">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6">
                            <h3 className="text-2xl font-display font-bold group-hover/card:text-cherry transition-colors duration-200">{item.title}</h3>
                            <p className="text-sm opacity-70 mt-2 font-sans">{item.tags}</p>
                            <div className="mt-4 h-0.5 w-8 bg-gradient-to-r from-cherry to-peach transition-all duration-300 group-hover/card:w-16" />
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-cherry/90 hover:bg-cherry hover:scale-110 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 z-10 shadow-lg"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(maxSlide, prev + 1))}
              disabled={currentSlide === maxSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-cherry/90 hover:bg-cherry hover:scale-110 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 z-10 shadow-lg"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i 
                      ? 'bg-cherry w-8 shadow-[0_0_8px_rgba(225,74,92,0.6)]' 
                      : 'bg-white/30 hover:bg-white/50 w-2'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="py-24 md:py-32 bg-gradient-to-b from-graphite to-slate text-ivory relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cherry rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-[4%] relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            The Logic of Feeling
          </h2>
          <p className="text-xl text-ivory/70 mb-8">감성에도 패턴은 존재합니다.</p>
          <blockquote className="relative pl-8 py-4 border-l-4 border-rose italic text-lg md:text-xl leading-relaxed max-w-3xl">
            <div className="absolute -left-[9px] top-0 w-[18px] h-[18px] bg-rose rounded-full" />
            <p className="mb-4">
              체리케이크는 그 패턴을 찾아내고,
            </p>
            <p className="mb-4">
              AI로 감각의 언어를 해석합니다.
            </p>
            <p>
              데이터를 감성으로, 데이터를 새로운 예술로 창조합니다.
            </p>
            <div className="absolute -left-[9px] bottom-0 w-[18px] h-[18px] bg-peach rounded-full" />
          </blockquote>
        </div>
      </section>
    </>
  );
}
