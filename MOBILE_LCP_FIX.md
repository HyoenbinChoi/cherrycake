# 🚨 모바일 LCP 긴급 수정 (12.32초 → 목표 2.5초)

## 문제 진단

### Lighthouse 모바일 측정 결과
```
LCP: 12.32초
├─ TTFB: 600ms (5%)
├─ Load Delay: 0ms (0%)
├─ Load Time: 0ms (0%)
└─ Render Delay: 11.72초 (95%) ← 병목!

LCP 요소: 
<p class="mt-5 max-w-prose text-[17px] leading-8 text-textGraphite/90">
  저는 숫자 대신 리듬을, 데이터 대신 감정의 구조를 봅니다.
  체리케이크는 감정의 패턴을 시각화하는 스튜디오입니다.
</p>
```

**핵심 원인**: 
- 한글 LCP 요소가 **2.0MB Pretendard 폰트** 다운로드 대기
- 모바일 네트워크에서 폰트 로딩 11.72초 소요
- Next.js가 폰트를 자동 preload하여 렌더링 블로킹

## 적용된 긴급 수정

### 1. LCP 요소에 system font 직접 적용

**파일**: `src/components/SignatureHero.tsx`

```tsx
// Before: 웹폰트 대기
<h1 className="font-display...">
  Decoding Emotions.
</h1>
<p className="...">
  저는 숫자 대신 리듬을...
</p>

// After: 즉시 렌더링
<h1 
  className="font-display..."
  style={{ fontFamily: 'ui-serif, Georgia, serif' }}
>
  Decoding Emotions.
</h1>
<p 
  className="..."
  style={{ 
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif' 
  }}
>
  저는 숫자 대신 리듬을...
</p>
```

### 2. 전역 폰트를 system font로 전환

**파일**: `src/app/layout.tsx`

```tsx
// Before: Next.js 폰트 변수 주입 (자동 preload)
<body className={`${display.variable} ${sansKR.variable} ${mono.variable} font-sans antialiased`}>

// After: system font 직접 사용 (preload 없음)
<body className="font-sans antialiased">
```

**파일**: `src/app/globals.css`

```css
/* Before: Tailwind font-sans (CSS 변수 사용) */
body { 
  @apply bg-ivory text-textGraphite font-sans antialiased;
}

/* After: system font 직접 지정 */
body { 
  @apply bg-ivory text-textGraphite antialiased;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
               "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
}

/* 헤딩도 system serif로 */
h1, h2, h3, h4, h5, h6 {
  font-family: ui-serif, Georgia, serif;
  letter-spacing: -0.02em;
  font-feature-settings: 'kern' 1;
}
```

### 3. 폰트 import 제거

**파일**: `src/app/layout.tsx`

```tsx
// Before
import { display, sansKR, mono } from "./fonts";

// After
// 제거됨 - 더 이상 preload 안 함
```

## 효과 예상

### LCP 개선 경로
```
Before: 12.32초
├─ TTFB: 600ms
├─ Render Delay: 11.72초 (폰트 다운로드 대기)
└─ LCP 요소: 한글 단락

After:  < 2.0초 예상
├─ TTFB: 600ms
├─ Render Delay: < 1.0초 (system font 즉시)
└─ LCP 요소: 한글 단락 즉시 렌더링

개선율: 85% 감소 (12.32초 → 2.0초)
```

### 네트워크 영향
- **Before**: 
  - Pretendard 2.0MB preload (blocking)
  - Instrument Serif (Google Fonts) preload
  
- **After**: 
  - **폰트 다운로드 0KB** (system font 사용)
  - 초기 렌더링 즉시
  - 웹폰트는 백그라운드 로딩 가능 (선택적)

### 사용자 경험
- ✅ **모바일 즉시 렌더링**: 한글 텍스트 0.6초 이내 표시
- ✅ **데이터 절약**: 2.0MB 폰트 다운로드 제거
- ✅ **배터리 절약**: 빠른 렌더링으로 CPU 사용 감소
- ⚠️ **타이포그래피 변경**: Pretendard → Apple SD Gothic Neo / Malgun Gothic

## 트레이드오프

### 장점
1. **모바일 LCP 극적 개선**: 12.32초 → < 2.0초
2. **즉시 렌더링**: 폰트 다운로드 없음
3. **네트워크 절약**: 2.0MB 절감
4. **안정성**: 웹폰트 로딩 실패해도 문제없음

### 단점
1. **타이포그래피 일관성**: Pretendard 대신 시스템 폰트
   - macOS/iOS: Apple SD Gothic Neo (높은 품질)
   - Windows: Malgun Gothic (괜찮은 품질)
   - Android: Noto Sans CJK (좋은 품질)
2. **브랜드 아이덴티티**: 웹폰트 없음 (선택적 enhancement 가능)

## 추가 고려사항

### 선택적 웹폰트 Enhancement (나중에 가능)
```tsx
// Critical CSS 로딩 후 웹폰트 지연 로드
useEffect(() => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      // 웹폰트 지연 로드
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/fonts/pretendard.css';
      document.head.appendChild(link);
    });
  }
}, []);
```

### Polyfill 제거 (다음 단계)
```json
// package.json - 이미 적용됨
"browserslist": [
  "last 2 Chrome versions",
  "last 2 Edge versions",
  "last 2 Safari versions",
  "last 2 Firefox versions"
]
```

## 검증 방법

### Lighthouse 모바일 테스트
```
1. Chrome DevTools
2. Device: Moto G Power (throttled)
3. Network: Slow 4G
4. Lighthouse Mobile Performance

목표:
- LCP < 2.5초 (현재 12.32초)
- Render Delay < 2.0초 (현재 11.72초)
- Performance Score > 90
```

### 시각적 확인
1. 모바일 에뮬레이션으로 cherrycake.me 접속
2. Network 탭: Slow 4G
3. "저는 숫자 대신 리듬을..." 텍스트 즉시 표시 확인
4. 한글이 시스템 폰트로 렌더링되는지 확인

## 결론

**긴급 수정 완료**:
- ✅ LCP 요소에 system font 직접 적용
- ✅ 전역 폰트를 system font로 전환
- ✅ Next.js 폰트 preload 제거
- ✅ 빌드 성공

**예상 결과**:
- LCP: 12.32초 → < 2.0초 (85% 개선)
- 모바일 네트워크: 2.0MB 절약
- Time to First Byte: 0.6초 → LCP 즉시

**다음 배포 후 모바일 Lighthouse 필수 재측정!**

---

## 타이포그래피 품질 비교

### Pretendard (웹폰트)
- 장점: 일관된 디자인, 세련된 자간/높이
- 단점: 2.0MB, 모바일 느림

### Apple SD Gothic Neo (macOS/iOS)
- 장점: 높은 가독성, 0KB, 즉시 렌더링
- 단점: Pretendard보다 약간 밋밋

### 권장사항
- **모바일 우선**: system font 유지 (현재 수정)
- **데스크탑**: 선택적으로 웹폰트 지연 로드 고려
- **핵심**: LCP 개선이 타이포그래피보다 우선
