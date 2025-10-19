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
          className="relative h-64 md:h-80 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at 25% 30%, rgba(225, 74, 92, 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 70%, rgba(193, 169, 255, 0.2) 0%, transparent 50%), linear-gradient(145deg, #F3EFEA 0%, rgba(243, 239, 234, 0.8) 100%)",
          }}
        >
          <div className="absolute inset-0 mix-blend-soft-light opacity-40 bg-[radial-gradient(circle_at_35%_25%,white_0%,transparent_40%)]" />
        </div>
      </div>
    </section>
  );
}
