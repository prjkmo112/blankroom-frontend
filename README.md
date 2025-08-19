# Blankroom Frontend

실시간 채팅과 협업 기능을 제공하는 웹 애플리케이션의 프론트엔드입니다.

## 🚀 기능

- **실시간 채팅**: WebSocket을 통한 실시간 메시지 송수신
- **방 관리**: 채팅방 생성, 참가, 관리 기능
- **사용자 인증**: JWT 기반 로그인/회원가입 시스템
- **파일 업로드**: 이미지 및 파일 공유 기능
- **반응형 디자인**: 모바일 및 데스크톱 최적화

## 🛠 기술 스택

- **프론트엔드**: React 19, TypeScript
- **빌드 도구**: Vite
- **UI 라이브러리**: Mantine, Tailwind CSS
- **상태 관리**: Zustand (영속성 지원)
- **라우팅**: React Router DOM
- **실시간 통신**: Socket.io Client
- **HTTP 클라이언트**: Axios
- **아이콘**: Tabler Icons
- **알림**: Notistack

## 📋 사전 요구사항

- Node.js (권장: 18.x 이상)
- npm 또는 yarn

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수를 설정하세요:
```env
VITE_REST_API_URL=http://localhost:3000
```

### 3. 개발 서버 실행
```bash
npm run dev
```
개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 4. 프로덕션 빌드
```bash
npm run build
```

### 5. 빌드 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── api/              # API 클라이언트 및 모델
├── assets/           # 정적 자산
├── components/       # 재사용 가능한 컴포넌트
├── layouts/          # 레이아웃 컴포넌트
├── pages/            # 페이지 컴포넌트
├── services/         # 서비스 (WebSocket 등)
├── stores/           # Zustand 스토어
├── types/            # TypeScript 타입 정의
└── routes.tsx        # 라우트 정의
```

## 🎯 주요 컴포넌트

### 상태 관리
- `userStore`: 사용자 인증 상태 관리
- `chatStore`: 채팅 메시지 및 WebSocket 연결 관리
- `uiStore`: UI 상태 (로딩, 모달 등)
- `pageStore`: 페이지별 상태

### 서비스
- `websocketService`: Socket.io 기반 실시간 통신
- `customAxios`: HTTP 요청 인터셉터 및 에러 처리

## 🔐 인증 시스템

- JWT 토큰 기반 인증
- 로컬 스토리지를 통한 세션 유지
- 401 응답 시 자동 로그아웃
- 보호된 라우트 지원

## 💬 실시간 채팅

- 방 기반 채팅 시스템
- 메시지 히스토리 로드
- 실시간 알림

## 🎨 스타일링

- **Mantine**: 주요 UI 컴포넌트
- **Tailwind CSS**: 유틸리티 클래스
- **CSS Modules**: 컴포넌트별 스타일링
- **반응형 디자인**: 모바일 퍼스트 접근

## 📝 개발 가이드

### 코드 스타일
- ESLint 설정에 따른 코딩 스타일
- 세미콜론 사용 안 함
- 2칸 들여쓰기
- 130자 줄 길이 제한

### 경로 별칭
```typescript
@/*           → src/*
@assets/*     → src/assets/*
@layouts/*    → src/layouts/*
@components/* → src/components/*
```

### 린팅 및 타입 체크
```bash
npm run lint        # ESLint 실행
```

## 🚀 배포

프로덕션 빌드 후 `dist/` 폴더의 내용을 웹 서버에 배포하세요.
