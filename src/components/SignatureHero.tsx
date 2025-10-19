// components/SignatureHero.tsx
import Link from "next/link";

export default function SignatureHero() {
  return (
    <section className="section pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="container mx-auto px-5 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-end">
        {/* 비대칭 타이틀 (의도적 불균형) */}
        <div>
          <h1 className="font-display text-5xl leading-tight md:text-6xl tracking-tight text-textGraphite max-w-[16ch]">
            Decoding Emotions.
          </h1>

          <p className="mt-5 max-w-prose text-[17px] leading-8 text-textGraphite/90">
            우리는 숫자 대신 리듬을, 데이터 대신 감정의 구조를 봅니다.
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
        <div className="relative h-64 md:h-80 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-ivory overflow-hidden group">
          {/* 점선 그리드 배경 */}
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, #E14A5C 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          
          {/* 추상적 데이터 라인 */}
          <svg className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-40 transition-opacity duration-700" viewBox="0 0 400 320" preserveAspectRatio="none">
            {/* 웨이브폼 라인 1 */}
            <path
              d="M 0 160 Q 50 120, 100 140 T 200 160 T 300 140 T 400 160"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* 웨이브폼 라인 2 */}
            <path
              d="M 0 180 Q 60 200, 120 180 T 240 180 T 360 200 T 400 180"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* 그라데이션 정의 */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E14A5C" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#F6B79E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#C1A9FF" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#89E8E0" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFADC6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* 데이터 포인트 */}
          <div className="absolute top-[35%] left-[15%] w-2 h-2 rounded-full bg-cherry opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-[55%] right-[20%] w-2 h-2 rounded-full bg-violet opacity-50 animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-[30%] left-[60%] w-1.5 h-1.5 rounded-full bg-peach opacity-70 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
          
          {/* 라벨 */}
          <div className="absolute bottom-4 right-4 text-xs font-mono text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cherry animate-pulse"></span>
            Emotional Pattern
          </div>
        </div>
      </div>
    </section>
  );
}
