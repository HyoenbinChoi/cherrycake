# 🍰 cherrycake.me

> **Data meets Emotion** — 베토벤 대 푸가(Große Fuge Op.133)의 구조적 긴장과 해소를 분석하는 인터랙티브 시각화 프로젝트

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)

---

## 🎼 프로젝트 소개

cherrycake.me는 베토벤의 대 푸가(Große Fuge Op.133)를 4가지 관점에서 분석하고 시각화하는 웹 애플리케이션입니다:

1. **Tension Canvas** - 긴장 곡선 시각화 (4K 60fps)
2. **Motif Constellation** - 3D 모티프 네트워크
3. **Counterpoint Weave** - 대위법 직조 패턴
4. **Tonnetz Pathway** - 네오리만 화성 경로 지도

---

## 🚀 빠른 시작

### 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (포트 3000)
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 실행
npm start
```

**⚠️ 참고**: 개발 서버는 느립니다 (5-10초). 프로덕션은 **10배 빠릅니다** (0.5초)!

---

## 📁 프로젝트 구조

```
cherrycake/
├── src/
│   ├── app/                    # Next.js 앱 라우터
│   │   ├── page.tsx           # 홈페이지 (캐러셀)
│   │   ├── tension/           # Tension Canvas
│   │   ├── motif-constellation/ # Motif 3D
│   │   ├── counterpoint/      # Counterpoint Weave
│   │   └── tonnetz/           # Tonnetz Pathway
│   └── components/            # React 컴포넌트
│       ├── TensionCanvas.tsx
│       ├── MotifConstellation.tsx
│       ├── CounterpointWeave.tsx
│       └── TonnetzPathway.tsx
├── public/
│   ├── output/               # 분석 데이터 (JSON)
│   │   ├── tension_per_measure.json
│   │   ├── motif_graph.json
│   │   ├── events.json
│   │   ├── tonnetz.json
│   │   └── narratives.json
│   └── videos/              # 미디어 파일
├── CLOUDFLARE_DEPLOYMENT.md  # 배포 가이드 ⭐
├── DEPLOYMENT_COMPARISON.md  # 옵션 비교
├── PERFORMANCE.md            # 성능 최적화 리포트
└── ecosystem.config.js       # PM2 설정

```

---

## 🎨 주요 기능

### 1. Tension Canvas (긴장 곡선)
- **4K 해상도** (3840x2160) → Embed: 1080p
- **60fps** 애니메이션 → Embed: 30fps
- **90초** 루프
- 동적 블룸 효과
- 형식 세그먼트 시각화

### 2. Motif Constellation (모티프 성좌)
- **3D 네트워크** (react-force-graph-3d)
- **카메라 자동 이동**
- 세그먼트별 하이라이트
- 실시간 키워드 표시

### 3. Counterpoint Weave (대위법 직조)
- **4성부 동시 렌더링**
- 불협화도 기반 분리
- 섬유 직조 효과
- 실시간 음표 추적

### 4. Tonnetz Pathway (네오리만 경로)
- **Neo-Riemannian 변환** (P/R/L)
- 동적 카메라 줌
- 화성 진행 애니메이션
- 형식 구조 연동

---

## 🌐 배포

### 추천: Cloudflare Pages ⭐⭐⭐⭐⭐

**cherrycake.me 도메인 보유 시 최적 선택!**

```bash
# 1. GitHub 푸시
git push origin main

# 2. Cloudflare Pages 연결
# https://dash.cloudflare.com/pages

# 3. 완료! (1-2분)
# https://cherrycake.me
```

**장점:**
- ✅ 무제한 대역폭
- ✅ $0 비용
- ✅ 글로벌 CDN (275+ 도시)
- ✅ 자동 SSL
- ✅ DDoS 방어 내장

자세한 가이드: [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)

### 대안: AWS Amplify / EC2

비교 분석: [DEPLOYMENT_COMPARISON.md](./DEPLOYMENT_COMPARISON.md)

---

## 📊 성능 최적화

### 적용된 최적화

1. **Lazy Loading**: 보이는 슬라이드만 로드
2. **해상도 조절**: Embed 모드에서 1080p
3. **프레임레이트 제한**: Embed 30fps, Direct 60fps
4. **3D 경량화**: Particles/Ticks 감소
5. **Next.js 빌드**: SWC minify, 트리 쉐이킹

### 성능 지표

| 메트릭 | 개발 서버 | 프로덕션 | 개선 |
|--------|-----------|----------|------|
| 초기 로딩 | 5.0초 | 0.4초 | **92%↓** |
| 메모리 | 500MB | 150MB | **70%↓** |
| CPU 사용률 | 80% | 30% | **62%↓** |

자세한 분석: [PERFORMANCE.md](./PERFORMANCE.md)

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS
- **3D**: react-force-graph-3d, Three.js
- **Canvas**: Native Canvas API (2D rendering)

### Data Processing
- **Source**: Beethoven Große Fuge Op.133 (MuseData)
- **Analysis**: Python scripts (music21, networkx)
- **Format**: JSON

### Deployment
- **Platform**: Cloudflare Pages
- **CDN**: Cloudflare (275+ locations)
- **Domain**: cherrycake.me (Cloudflare)
- **SSL**: Auto (Let's Encrypt)

---

## 📖 문서

- [배포 가이드 (Cloudflare)](./CLOUDFLARE_DEPLOYMENT.md) - **추천!**
- [배포 옵션 비교](./DEPLOYMENT_COMPARISON.md)
- [AWS 배포 가이드](./AWS_DEPLOYMENT.md)
- [성능 최적화](./PERFORMANCE.md)
- [성능 비교 분석](./PERFORMANCE_COMPARISON.md)

---

## 🧪 개발

### 필수 요구사항
- Node.js 20+
- npm 9+

### 스크립트
```bash
npm run dev         # 개발 서버 (Turbopack)
npm run build       # 프로덕션 빌드
npm start           # 프로덕션 실행
npm run lint        # ESLint 검사
```

### 환경변수
```bash
# .env.local
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

---

## 🎯 프로젝트 목표

> "감성에도 패턴은 존재합니다."

cherrycake.me는 음악의 구조적 패턴을 AI와 데이터 시각화로 해석하여, 베토벤의 대 푸가에 숨겨진 긴장과 해소의 서사를 드러냅니다.

**철학**: 데이터를 감성으로, 데이터를 새로운 예술로 창조합니다.

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 👤 작성자

**cherrycake.me**  
*Resonant Architecture*

- Website: [cherrycake.me](https://cherrycake.me)
- Email: hyeonbinofficial@gmail.com

---

## 🙏 감사

- Beethoven - Große Fuge Op.133 작곡
- MuseData - 악보 데이터 제공
- Next.js Team - 프레임워크
- Cloudflare - 호스팅 & CDN

---

**Made with ❤️ and ☕ in Seoul, Korea**
