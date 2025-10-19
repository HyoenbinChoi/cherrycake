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

        {/* 질감/형태로 '사람 손'의 느낌 */}
        <div
          className="relative h-64 md:h-80 rounded-2xl overflow-hidden"
          style={{
            background:
              "radial-gradient(120px 90px at 20% 30%, rgba(225, 74, 92, 0.3), transparent 60%), radial-gradient(220px 180px at 80% 70%, rgba(225, 74, 92, 0.5), transparent 60%), linear-gradient(145deg, #F3EFEA, transparent)",
          }}
        >
          <div className="absolute inset-0 mix-blend-multiply opacity-60 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_45%)]" />
          <div className="absolute bottom-4 right-4 text-sm font-mono opacity-70 text-textGraphite">
            🍒 Signature Field No.01
          </div>
        </div>
      </div>
    </section>
  );
}
