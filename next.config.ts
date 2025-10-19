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
};

export default nextConfig;
