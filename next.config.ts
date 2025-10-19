import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages는 standalone 모드 불필요
  // output: 'standalone', // ← 주석 처리
  
  // 압축 활성화
  compress: true,
  
  // 성능 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['react-force-graph-3d', 'three'],
  },
  
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // SWC 최소화
  swcMinify: true,
  reactStrictMode: true,
  
  // ESLint & TypeScript 빌드 시 무시 (수정 필요)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 캐시 헤더 설정
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/output/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
