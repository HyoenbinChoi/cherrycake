# 🔧 Cloudflare Pages 빌드 에러 해결

## ❌ 에러: "Pages only supports files up to 25 MiB"

### 원인
`.next/cache/webpack/client-production/0.pack` 파일이 91.9MB로 25MB 제한 초과

### ✅ 해결 방법

#### 옵션 1: Cloudflare Pages 설정 변경 (추천)

1. **Cloudflare Pages 대시보드** 접속
   ```
   https://dash.cloudflare.com/pages
   ```

2. **cherrycake 프로젝트** → **Settings** → **Builds & deployments**

3. **Build configuration 수정**:
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   ```
   
   **중요**: `Build output directory`를 `.next`에서 `out`으로 변경!

4. **환경 변수 추가** (선택사항):
   ```
   NODE_VERSION = 20
   ```

5. **Retry deployment** 클릭

---

#### 옵션 2: 로컬에서 빌드 확인

```bash
cd ~/cherrycake
rm -rf .next out
npm run build
ls -lh out/  # out/ 디렉토리 생성 확인
```

**예상 출력**:
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    3.67 kB         106 kB
├ ○ /tension                             2.36 kB         104 kB
...
○  (Static)  prerendered as static content

✓ Export successful
```

---

## 📋 현재 설정

### next.config.ts
```typescript
{
  output: 'export',           // 정적 HTML export
  images: { unoptimized: true },  // 이미지 최적화 비활성화
  trailingSlash: true,        // /page/ 형식 URL
}
```

### .gitignore
```
/.next/
/out/
.next/cache/   # ← Cloudflare 업로드 방지
```

### .cfignore (Cloudflare 전용)
```
.next/cache/
cache/
node_modules/
```

---

## 🚀 배포 후 확인

### 1. 빌드 로그 확인
```
✓ Export successful
```

### 2. 배포 URL 접속
```
https://cherrycake.pages.dev
```

### 3. 시각화 페이지 테스트
- `/tension/` - Tension Canvas
- `/motif-constellation/` - Motif 3D
- `/counterpoint/` - Counterpoint Weave
- `/tonnetz/` - Tonnetz Pathway

---

## 🔍 문제 해결

### 빌드는 성공하지만 페이지가 비어있음
→ `trailingSlash: true` 설정 확인
→ URL에 `/` 추가: `/tension` → `/tension/`

### 404 에러
→ `public/_redirects` 파일 확인:
```
/*    /index.html   200
```

### JSON 로딩 실패
→ `public/output/*.json` 파일이 커밋되었는지 확인
→ 파일 크기가 25MB 이하인지 확인:
```bash
du -sh public/output/*
```

---

## 📊 파일 크기 확인

```bash
# 큰 파일 찾기
find .next -type f -size +25M 2>/dev/null

# out/ 디렉토리 전체 크기
du -sh out/

# public/ 디렉토리 크기
du -sh public/
```

---

## ✅ 체크리스트

- [ ] `next.config.ts`에 `output: 'export'` 설정
- [ ] `.gitignore`에 `.next/cache/` 추가
- [ ] Cloudflare Pages 설정: `Build output directory = out`
- [ ] GitHub 푸시 후 자동 배포 확인
- [ ] 배포된 사이트에서 모든 페이지 동작 확인

---

**문제가 계속되면**: Cloudflare Pages 로그 전체를 확인하고, `out/` 디렉토리가 제대로 생성되었는지 확인하세요.
