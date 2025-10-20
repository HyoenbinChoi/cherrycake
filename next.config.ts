import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages는 Next.js를 직접 지원하므로 기본 설정 사용
  // output: 'export' 제거 - Cloudflare가 자동으로 처리
  
  images: {
    unoptimized: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 정적 에셋 캐시 최적화
  async headers() {
    return [
      {
        // 폰트 파일 캐시 (1년, immutable)
        source: '/:all*(woff2|woff|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // CSS, JS 파일 캐시
        source: '/:all*(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 이미지 캐시 (1년)
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
