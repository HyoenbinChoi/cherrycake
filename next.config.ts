import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages - 정적 HTML export
  output: 'export',
  
  // 이미지 최적화 비활성화 (정적 export 필수)
  images: {
    unoptimized: true,
  },
  
  // trailing slash (정적 호스팅 호환성)
  trailingSlash: true,
  
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
  
  // SWC 최소화
  swcMinify: true,
  reactStrictMode: true,
  
  // ESLint & TypeScript 빌드 시 무시
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
