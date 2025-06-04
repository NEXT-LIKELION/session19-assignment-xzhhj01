# Simple Blog

Next.js와 Tailwind CSS를 사용한 모던한 블로그 애플리케이션입니다.

## 기능

- 📝 게시글 CRUD
- 💬 댓글 시스템
- 🎨 모던한 UI/UX
- 📱 반응형 디자인
- 🌍 위치 기반 게시글 작성

## 기술 스택

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma)

## CSR/SSR 패턴 분석

### SSR (Server-Side Rendering) 사용
1. **메인 페이지 (`/app/page.js`)**
   - 게시글 목록을 서버 사이드에서 렌더링
   - SEO 최적화 및 초기 로딩 성능 향상
   - `cache: "no-store"` 옵션으로 항상 최신 데이터 제공

2. **게시글 상세 페이지 (`/app/post/[id]/page.js`)**
   - 개별 게시글 데이터를 서버에서 렌더링
   - 동적 라우팅을 통한 SEO 최적화

### CSR (Client-Side Rendering) 사용
1. **댓글 시스템 (`CommentSection.js`)**
   - 실시간 댓글 작성/수정/삭제를 위한 클라이언트 사이드 렌더링
   - `useState`와 `useEffect`를 활용한 상태 관리
   - 사용자 인터랙션에 즉각적인 반응

2. **게시글 작성/수정 페이지**
   - 폼 입력과 실시간 유효성 검사
   - 위치 정보 수집을 위한 클라이언트 사이드 기능

3. **동적 UI 컴포넌트**
   - 수정/삭제 버튼
   - 로딩 상태 표시
   - 에러 처리

### 하이브리드 렌더링 전략
- 초기 페이지 로드: SSR을 통한 빠른 초기 렌더링
- 인터랙티브 기능: CSR을 통한 부드러운 사용자 경험
- Dynamic Imports: 필요한 컴포넌트만 동적으로 로드

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 환경 설정

1. `.env` 파일 생성:
```env
DATABASE_URL="file:./dev.db"
```

2. 데이터베이스 마이그레이션:
```bash
npx prisma migrate dev
```

## 주요 기능별 설명

### 1. 게시글 관리
- 생성: `/post/write` 페이지에서 새 글 작성
- 조회: 메인 페이지에서 목록 확인, `/post/[id]`에서 상세 내용 확인
- 수정: 게시글 상세 페이지에서 수정 버튼으로 접근
- 삭제: 게시글 상세 페이지에서 삭제 가능

### 2. 댓글 시스템
- 실시간 댓글 작성/수정/삭제
- 작성자 정보 저장
- 수정 이력 표시

### 3. UI/UX 특징
- 반응형 그리드 레이아웃
- 모던한 그라데이션 디자인
- 부드러운 애니메이션 효과
- 직관적인 사용자 인터페이스
