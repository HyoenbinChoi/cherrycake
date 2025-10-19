import MotifGraph from '@/components/MotifGraph';
import Link from 'next/link';

export default function FugePage() {
  return (
    <main className="w-full h-screen relative">
      <MotifGraph />
      
      {/* Navigation Link */}
      <div className="absolute bottom-4 right-4 z-10">
        <Link 
          href="/motif"
          className="inline-flex items-center px-4 py-2 bg-gray-900 bg-opacity-90 hover:bg-opacity-100 border border-gray-700 rounded-lg text-white text-sm transition-all"
        >
          <span>형식 타임라인 보기 →</span>
        </Link>
      </div>
    </main>
  );
}
