# 🍰 cherrycake.me

> **Data × Emotion × AI** — 문화의 패턴을 데이터로 분석하고, AI로 해석하며, 새로운 예술로 창조하는 포트폴리오

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)

---

## � 프로젝트 소개

**cherrycake.me**는 데이터 분석과 AI를 활용한 예술 프로젝트 포트폴리오입니다.

### 철학
> "감성에도 패턴은 존재합니다."

문화의 결을 분석하고, 추상화하고, 다시 조형화합니다.  
데이터를 감성으로, 데이터를 새로운 예술로 창조합니다.

### Featured Project: Beethoven Große Fuge Op.133

베토벤의 대 푸가(Große Fuge Op.133)를 다각도로 분석하고 시각화하는 종합 프로젝트:

- **7개 시각화** 도구
- **10K+ 데이터 포인트** 분석
- **788 마디** 전곡 커버
- **4K 60fps** 실시간 렌더링

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

## 📁 사이트 구조

```
cherrycake.me/
├── /                           # 포트폴리오 홈페이지
│   ├── Hero Section           # 브랜드 소개
│   ├── Projects Grid          # 프로젝트 목록
│   ├── Philosophy             # 철학 & 비전
│   └── Contact                # 연락처
│
├── /projects/grosse-fuge/     # Große Fuge 프로젝트 상세
│   └── 4개 시각화 캐러셀
│
└── 개별 시각화 도구 (Embed 모드)
    ├── /tension               # Tension Canvas (긴장 곡선)
    ├── /motif-constellation   # Motif Constellation (3D 네트워크)
    ├── /counterpoint          # Counterpoint Weave (대위법)
    ├── /tonnetz               # Tonnetz Pathway (화성 경로)
    ├── /motif-graph           # Motif Graph (모티프 분석)
    ├── /narratives            # AI Narratives (해설)
    ├── /motif                 # Motif Explorer
    └── /fuge                  # Form Timeline (형식 분석)
```

### 코드 구조

```
src/
├── app/
│   ├── page.tsx                      # 포트폴리오 홈
│   ├── layout.tsx                    # 루트 레이아웃 + 푸터
│   ├── projects/grosse-fuge/         # 프로젝트 상세 페이지
│   ├── tension/                      # 긴장 곡선 시각화
│   ├── motif-constellation/          # 3D 모티프 네트워크
│   ├── counterpoint/                 # 대위법 시각화
│   ├── tonnetz/                      # 화성 경로 지도
│   └── [other visualizations]/       # 기타 시각화 도구
│
├── components/
│   ├── Header.tsx                    # 네비게이션 헤더
│   ├── TensionCanvas.tsx             # 긴장 곡선 컴포넌트
│   ├── MotifConstellation.tsx        # 3D 네트워크 컴포넌트
│   ├── CounterpointWeave.tsx         # 대위법 컴포넌트
│   └── TonnetzPathway.tsx            # 화성 경로 컴포넌트
│
└── app/globals.css                   # 글로벌 스타일 (접근성 개선)

public/
├── output/                           # 분석 데이터 (JSON)
│   ├── events.json                   # 음표 이벤트 데이터
│   ├── tension_per_measure.json      # 마디별 긴장도
│   ├── motif_graph.json              # 모티프 그래프
│   ├── narratives.json               # AI 해설
│   ├── tonnetz.json                  # 화성 진행
│   └── form_timeline.json            # 형식 타임라인
└── videos/                           # 미디어 파일
```

---

## 🎨 주요 기능

### 포트폴리오 홈페이지
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- **애니메이션**: Fade-in, scale, blur 효과
- **프로젝트 그리드**: Featured 배지, 메트릭 표시
- **Contact 섹션**: 이메일 연락처 제공

### Große Fuge 시각화 도구

#### 1. Tension Canvas (긴장 곡선)
- **4K 해상도** (3840x2160)
- **60fps** 실시간 애니메이션
- 동적 블룸 효과
- 형식 세그먼트별 색상 구분

#### 2. Motif Constellation (3D 모티프 네트워크)
- **3D Force Graph** (react-force-graph-3d)
- 카메라 자동 이동 & 줌
- 세그먼트별 하이라이트
- 실시간 키워드 표시

#### 3. Counterpoint Weave (대위법 직조)
- **4성부 동시 렌더링**
- 불협화도 기반 색상 매핑
- 섬유 직조 시각 효과
- 실시간 음표 추적

#### 4. Tonnetz Pathway (화성 경로)
- **Neo-Riemannian 변환** (P/R/L)
- 동적 카메라 추적
- 화성 진행 애니메이션
- 형식 구조 연동

#### 5. 추가 분석 도구
- **Motif Graph**: 모티프 관계 분석
- **AI Narratives**: GPT 기반 음악 해설
- **Form Timeline**: 형식 구조 타임라인
- **Motif Explorer**: 모티프 탐색기

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

1. **폰트 최적화**: 4개 폰트 → 1개 폰트 (Noto Sans KR)
2. **접근성 개선**: WCAG AA 준수 색상 시스템
3. **코드 분할**: Next.js App Router 자동 코드 스플리팅
4. **정적 생성**: 14개 페이지 정적 빌드
5. **번들 최적화**: SWC minify, 트리 쉐이킹

### 성능 지표

| 메트릭 | 개발 서버 | 프로덕션 | 개선 |
|--------|-----------|----------|------|
| 초기 로딩 | 5.0초 | 0.4초 | **92%↓** |
| 메모리 사용 | 500MB | 150MB | **70%↓** |
| CPU 사용률 | 80% | 30% | **62%↓** |
| 번들 크기 | - | 102kB | 최적화됨 |

### 번들 크기

| 페이지 | 크기 | First Load JS |
|--------|------|---------------|
| 홈페이지 (/) | 3.2kB | 109kB |
| 프로젝트 상세 | 3.7kB | 106kB |
| Tension | 2.4kB | 104kB |
| Motif Constellation | 178kB | 280kB |
| 기타 시각화 | 1.5-3kB | 104-107kB |

자세한 분석: [PERFORMANCE.md](./PERFORMANCE.md)

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.5.6 (App Router, React 19)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.x + Custom CSS Variables
- **Fonts**: Noto Sans KR (Google Fonts)
- **3D Graphics**: react-force-graph-3d, Three.js
- **Canvas**: Native Canvas API (2D rendering)

### Design System
- **Colors**: WCAG AA 준수 (4.5:1+ 대비율)
- **Palette**: Cherry/Rose/Peach (따뜻함) × Cyan/Violet (기술) × Graphite/Slate/Ivory (균형)
- **Typography**: Noto Sans KR (단일 폰트, 한글 최적화)
- **Animations**: CSS keyframes + Tailwind transitions

### Data Processing
- **Source**: Beethoven Große Fuge Op.133 (MuseData)
- **Analysis**: Python (music21, networkx, numpy)
- **Format**: JSON (events, tension, motifs, narratives)

### Deployment
- **Platform**: Cloudflare Pages
- **CDN**: Cloudflare Global Network
- **Domain**: cherrycake.me
- **SSL**: Auto (Let's Encrypt)
- **CI/CD**: GitHub integration (auto-deploy on push)

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

## 🎯 디자인 철학

> "감성에도 패턴은 존재합니다."

cherrycake.me는 데이터 분석과 AI를 통해 문화의 패턴을 발견하고,  
이를 새로운 예술 형태로 재해석하는 것을 목표로 합니다.

**핵심 가치:**
- 🎨 **Data × Emotion**: 데이터를 감성적으로 표현
- 🤖 **AI × Creativity**: AI로 새로운 해석 생성
- 🎵 **Analysis × Art**: 분석을 예술로 승화

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 👤 Contact

**cherrycake.me**  
*Resonant Architecture*

- 🌐 Website: [cherrycake.me](https://cherrycake.me)
- ✉️ Email: [hyeonbinofficial@gmail.com](mailto:hyeonbinofficial@gmail.com)

---

## 🙏 Credits

- **Beethoven** - Große Fuge Op.133 작곡
- **MuseData** - 악보 데이터 제공
- **Next.js Team** - 프레임워크
- **Cloudflare** - 호스팅 & CDN
- **Google Fonts** - Noto Sans KR

---

**Made with ❤️ and ☕**
