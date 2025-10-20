// components/SignatureHero.tsx
import Link from "next/link";

export default function SignatureHero() {
  return (
    <section className="section pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="container mx-auto px-5 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-end">
        {/* 비대칭 타이틀 (의도적 불균형) */}
        <div>
          <h1 
            className="font-display text-5xl leading-tight md:text-6xl tracking-tight text-textGraphite max-w-[16ch]"
            style={{ fontFamily: 'ui-serif, Georgia, serif' }}
          >
            Decoding Emotions.
          </h1>

          <p 
            className="mt-5 max-w-prose text-[17px] leading-8 text-textGraphite/90"
            style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif' }}
          >
            저는 숫자 대신 리듬을, 데이터 대신 감정의 구조를 봅니다.
            <br />
            체리케이크는 감정의 패턴을 시각화하는 스튜디오입니다.
          </p>

          <div className="mt-7 flex gap-3 flex-wrap">
            <Link href="#projects" className="btn btn--cherry">
              View Structures
            </Link>
            <Link href="#philosophy" className="btn btn--ghost">
              About Philosophy
            </Link>
          </div>
        </div>

        {/* 데이터 비주얼 - 추상적 웨이브폼 */}
        <div className="relative h-64 md:h-80 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-ivory overflow-hidden group shadow-soft hover:shadow-elevated transition-shadow duration-500">
          {/* 점선 그리드 배경 - 무한 이동 */}
          <div 
            className="absolute inset-0 opacity-[0.2] animate-grid-drift"
            style={{
              backgroundImage: 'radial-gradient(circle, #E14A5C 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />
          
          {/* 추상적 데이터 라인 - 웨이브 애니메이션 */}
          <svg className="absolute inset-0 w-full h-full opacity-40 group-hover:opacity-55 transition-opacity duration-700" viewBox="0 0 400 320" preserveAspectRatio="none">
            {/* 웨이브폼 라인 1 */}
            <path
              className="animate-wave-flow"
              d="M 0 160 Q 50 120, 100 140 T 200 160 T 300 140 T 400 160"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* 웨이브폼 라인 2 */}
            <path
              className="animate-wave-flow-delayed"
              d="M 0 180 Q 60 200, 120 180 T 240 180 T 360 200 T 400 180"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* 그라데이션 정의 - 애니메이션 */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E14A5C" stopOpacity="0.4">
                  <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#F6B79E" stopOpacity="0.6">
                  <animate attributeName="stop-opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#C1A9FF" stopOpacity="0.4">
                  <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#89E8E0" stopOpacity="0.4">
                  <animate attributeName="stop-opacity" values="0.4;0.75;0.4" dur="2.5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#FFADC6" stopOpacity="0.5">
                  <animate attributeName="stop-opacity" values="0.5;0.85;0.5" dur="2.5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
          </svg>
          
          {/* 데이터 포인트 - 눈에 띄는 이동 */}
          <div className="absolute top-[35%] left-[15%] w-3 h-3 rounded-full bg-cherry opacity-75 animate-float-1 shadow-md" />
          <div className="absolute top-[55%] right-[20%] w-3 h-3 rounded-full bg-violet opacity-65 animate-float-2 shadow-md" />
          <div className="absolute bottom-[30%] left-[60%] w-2.5 h-2.5 rounded-full bg-peach opacity-80 animate-float-3 shadow-md" />
          
          {/* 라벨 */}
          <div className="absolute bottom-4 right-4 text-xs font-mono text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cherry animate-pulse shadow-sm"></span>
            Emotional Pattern
          </div>
        </div>
      </div>
    </section>
  );
}
