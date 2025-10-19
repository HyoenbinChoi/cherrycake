"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SignatureHero from "@/components/SignatureHero";
import { Card, CardTitle, CardText } from "@/components/ui/card";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      id: 'grosse-fuge',
      title: 'Beethoven Große Fuge Op.133',
      description: '베토벤 대 푸가의 구조적 긴장과 해소를 다각도로 분석한 종합 프로젝트',
      tags: ['Music Analysis', '3D Visualization', 'AI Narratives', 'Tonnetz', 'Network Graph'],
      status: 'Featured',
      link: '/projects/grosse-fuge',
      year: '2025',
      metrics: {
        visualizations: 7,
        dataPoints: '10K+',
        duration: '788 measures'
      }
    },
    {
      id: 'upcoming',
      title: 'More Projects Coming Soon',
      description: '데이터와 감성이 만나는 새로운 실험들',
      tags: ['TBA'],
      status: 'Coming Soon',
      link: '#',
      year: '2025',
      isPlaceholder: true
    }
  ];

  return (
    <>
      {/* Signature Hero - 새 디자인 섹션 */}
      <SignatureHero />

      {/* Main Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-ivory via-ivory to-rose/10">
        {/* 기하학적 패턴 배경 - 눈에 띄는 이동 */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <div 
            className="absolute inset-0 animate-grid-slow"
            style={{
              backgroundImage: `
                linear-gradient(to right, #E14A5C 1.5px, transparent 1.5px),
                linear-gradient(to bottom, #E14A5C 1.5px, transparent 1.5px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        
        {/* 추상적 색상 악센트 - 눈에 띄는 회전/이동 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-40 h-40 border-[3px] border-cherry/15 rounded-full animate-spin-slow shadow-md" />
          <div className="absolute bottom-[25%] left-[8%] w-32 h-32 border-[3px] border-violet/15 rounded-full animate-pulse-subtle shadow-md" />
          <div className="absolute top-[50%] right-[25%] w-20 h-20 bg-gradient-to-br from-peach/8 to-transparent rounded-lg rotate-12 animate-float-slow shadow-md" />
        </div>

        <div className={`container mx-auto px-[4%] relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-cherry/10 to-peach/10 border border-cherry/20">
            <span className="text-sm font-semibold text-cherry">Data × Emotion × AI</span>
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-6">
            cherrycake<span className="text-gradient">.</span>me
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-3xl mx-auto mb-8">
            패턴의 시대, 감각을 해석하다.
            <br />
            <span className="text-lg opacity-80">문화의 결을 분석하고, 추상화하고, 다시 조형화합니다.</span>
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="#projects" 
              className="group relative rounded-xl bg-gradient-to-r from-cherry to-peach text-white px-8 py-4 font-semibold hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Explore Projects</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cherry/80 to-peach/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a 
              href="#philosophy" 
              className="rounded-xl border-2 border-neutral-300 bg-white/50 backdrop-blur px-8 py-4 font-semibold hover:border-cherry hover:bg-white transition-all duration-300"
            >
              About Philosophy
            </a>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="py-20 md:py-28 bg-gradient-to-b from-slate via-slate to-graphite text-ivory">
        <div className="container mx-auto px-[4%]">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Projects</h2>
            <p className="text-ivory/70 text-lg leading-relaxed max-w-3xl mx-auto">
              각 프로젝트는 독립적인 예술 작품이자 실험입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={project.isPlaceholder ? '#' : project.link}
                className={`group block ${project.isPlaceholder ? 'pointer-events-none' : ''}`}
              >
                <article 
                  className={`rounded-3xl overflow-hidden bg-gradient-to-br from-slate/80 via-graphite to-slate backdrop-blur ring-2 shadow-soft transition-all duration-500 h-full ${
                    project.isPlaceholder 
                      ? 'ring-white/10 opacity-50' 
                      : 'ring-cherry/30 hover:ring-cherry/60 hover:shadow-elevated hover:-translate-y-2'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-graphite to-slate overflow-hidden">
                    {project.isPlaceholder ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-cherry/20 to-violet/20 group-hover:scale-105 transition-transform duration-500" />
                    )}
                    
                    {project.status && (
                      <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-cherry/20 to-peach/20 border border-cherry/30 backdrop-blur">
                        <span className="text-sm font-semibold text-cherry">{project.status}</span>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 text-6xl font-display font-bold text-white/10 group-hover:text-white/20 transition-colors">
                      {project.year}
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    <h3 className="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight group-hover:text-cherry transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-ivory/80 text-lg mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-white/10">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-2xl font-bold text-gradient-cyan">{value}</div>
                            <div className="text-xs text-ivory/60 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap mb-6">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/10 transition-colors duration-200">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {!project.isPlaceholder && (
                      <div className="flex items-center gap-2 text-cherry font-semibold group-hover:gap-4 transition-all duration-300">
                        <span>Explore Project</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 md:py-28 bg-gradient-to-b from-graphite to-slate text-ivory relative">
        {/* 대각선 패턴 - 눈에 띄는 이동 */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div 
            className="absolute inset-0 animate-stripe-drift"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 40px,
                rgba(255, 173, 198, 0.6) 40px,
                rgba(255, 173, 198, 0.6) 43px
              )`,
            }}
          />
        </div>
        
        {/* 추상적 도형 악센트 - 눈에 띄는 애니메이션 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[5%] w-48 h-48 border-2 border-rose/15 rounded-full animate-pulse-subtle" />
          <div className="absolute bottom-[20%] right-[8%] w-40 h-40 border-2 border-violet/15 rotate-45 animate-spin-very-slow" 
               style={{ borderRadius: '20%' }} />
        </div>
        
        <div className="container mx-auto px-[4%] relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            The Logic of Feeling
          </h2>
          <p className="text-xl text-ivory/70 mb-10">감성에도 패턴은 존재합니다.</p>
          <blockquote className="relative pl-8 py-2 border-l-[3px] border-rose italic text-lg md:text-xl leading-relaxed max-w-3xl">
            <div className="absolute -left-[7px] top-0 w-3 h-3 bg-rose rounded-full ring-2 ring-graphite" />
            <p className="mb-4">
              체리케이크는 그 패턴을 찾아내고,
            </p>
            <p className="mb-4">
              AI로 감각의 언어를 해석합니다.
            </p>
            <p>
              데이터를 감성으로, 데이터를 새로운 예술로 창조합니다.
            </p>
            <div className="absolute -left-[7px] bottom-0 w-3 h-3 bg-peach rounded-full ring-2 ring-graphite" />
          </blockquote>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 md:py-28 bg-ivory">
        <div className="container mx-auto px-[4%]">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight text-textGraphite">Approach</h2>
            <p className="text-neutral-600 text-lg leading-relaxed max-w-2xl mx-auto">
              데이터 분석, AI 해석, 시각화를 통해 감정의 구조를 드러냅니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
              <CardTitle>Pattern Recognition</CardTitle>
              <CardText>음악, 텍스트, 행동 데이터에서 반복되는 구조와 리듬을 추출합니다.</CardText>
            </Card>
            <Card className="hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
              <CardTitle>AI Interpretation</CardTitle>
              <CardText>LLM과 분석 알고리즘을 통해 감정의 언어를 해독하고 내러티브를 생성합니다.</CardText>
            </Card>
            <Card className="hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
              <CardTitle>Visual Synthesis</CardTitle>
              <CardText>3D 네트워크, 타임라인, Tonnetz 등 다층적 시각화로 추상을 구체화합니다.</CardText>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-ivory">
        <div className="container mx-auto px-[4%]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
              Get in Touch
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed mb-12">
              프로젝트 협업, 문의, 또는 그냥 인사라도 환영합니다.
            </p>
            
            <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-br from-white to-ivory border-2 border-neutral-200 hover:border-cherry/40 transition-all duration-300 shadow-soft hover:shadow-elevated">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cherry/10 to-peach/10">
                <svg className="w-6 h-6 text-cherry" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-neutral-500 mb-1">Email</div>
                <a 
                  href="mailto:hyeonbinofficial@gmail.com"
                  className="text-lg font-semibold text-neutral-900 hover:text-cherry transition-colors duration-200"
                >
                  hyeonbinofficial@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
