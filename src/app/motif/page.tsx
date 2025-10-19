import FormTimeline from '@/components/FormTimeline';

export default function MotifPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Beethoven Große Fuge Op.133
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl">
            베토벤 대 푸가의 구조적 긴장과 해소를 시각화합니다
          </p>
        </div>

        {/* Description */}
        <div className="mb-12 max-w-4xl">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">구조 분석</h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                베토벤 대 푸가의 형식적 구조와 긴장도의 변화를 분석.
              </p>
              <p>
                아래 타임라인은 피치클래스 분포의 변화를 기반으로 자동으로 감지된 
                38개의 형식 세그먼트를 나타냄. 파란 곡선은 각 구간의 
                상대적 긴장도를 표시.
              </p>
            </div>
          </div>
        </div>

        {/* Form Timeline */}
        <div className="mb-12">
          <FormTimeline
            src="/output/form_timeline.json"
            height={320}
            padding={40}
            title="형식 타임라인 및 긴장도 곡선"
          />
        </div>

        {/* Analysis Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">구조 분석</h3>
            <ul className="space-y-2 text-neutral-300 text-sm">
              <li>• <strong>총 마디 수:</strong> 788마디</li>
              <li>• <strong>형식 세그먼트:</strong> 38개 구간</li>
              <li>• <strong>주요 조성:</strong> B♭ Major</li>
              <li>• <strong>편성:</strong> 현악 4중주 (Vn1, Vn2, Vla, Vc)</li>
            </ul>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">긴장도 분석 방법</h3>
            <ul className="space-y-2 text-neutral-300 text-sm">
              <li>• 피치클래스 히스토그램 변화 감지</li>
              <li>• 슬라이딩 윈도우 기반 세그먼테이션</li>
              <li>• L2 거리 측정을 통한 경계 추정</li>
              <li>• 각 세그먼트의 긴장도 점수 계산</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <a
            href="/fuge"
            className="inline-flex items-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors"
          >
            <span>← 3D Motif 네트워크 보기</span>
          </a>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors"
          >
            <span>홈으로 돌아가기</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-neutral-500 text-sm">
            <p>
              이 시각화는 music21, NumPy, NetworkX를 사용한 자동 음악 분석을 기반으로 합니다.
            </p>
            <p className="mt-2">
              Ludwig van Beethoven • Große Fuge in B♭ major, Op.133 (1825)
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
