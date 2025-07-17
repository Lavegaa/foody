# 🍽️ Foody - 자취생을 위한 냉장고 레시피 추천 서비스

자취생들을 위한 스마트 레시피 추천 서비스입니다. 냉장고에 있는 재료를 기반으로 만들 수 있는 레시피를 추천하며, AI 에이전트가 유튜브 레시피 영상을 분석하여 자동으로 레시피 데이터베이스를 구축합니다.

## 📱 주요 기능

### 🤖 AI 에이전트 기반 레시피 분석
- 유튜브 레시피 영상의 자막을 AI로 분석
- 재료 목록 자동 추출 및 정제
- 요리 장르 자동 분류 (한식, 중식, 일식, 양식 등)
- 중복 레시피 자동 검증

### 🧊 스마트 냉장고 관리
- 직관적인 재료 추가/삭제 인터페이스
- 기존 재료 기반 자동완성 검색
- 사용자 정의 재료 추가 기능
- 모바일 우선 모달 기반 UX

### 🔍 맞춤형 레시피 추천
- 보유 재료 기반 매칭률 계산
- 매칭률 순/제목 순 정렬 옵션
- 부족한 재료 vs 보유 재료 구분 표시
- 원클릭 유튜브 영상 연결

## 🛠️ 기술 스택

### Frontend (Next.js)
```
Next.js 15 + TypeScript
├── Tailwind CSS (모바일 우선 반응형 디자인)
├── NextAuth.js (Google OAuth)
├── React Query (서버 상태 관리)
├── Zustand (클라이언트 상태 관리)
└── Repository Pattern (API 추상화)
```

### Backend (NestJS)
```
NestJS + TypeScript
├── Prisma ORM
├── Supabase (PostgreSQL)
├── JWT Authentication
├── Clean Architecture
└── Swagger API Documentation
```

### AI Agent (Python)
```
Python + LangChain
├── OpenAI GPT-4
├── youtube_transcript_api
├── Streamlit Web Interface
└── FastAPI Integration
```

## 🏗️ 프로젝트 구조

```
foody/
├── foody_client_nextjs/          # Frontend (Next.js)
│   ├── app/                      # App Router
│   ├── components/               # 재사용 컴포넌트
│   │   ├── common/              # 공통 컴포넌트
│   │   └── recipes/             # 레시피 관련 컴포넌트
│   └── domain/                   # 도메인 로직
│       └── repositories/         # API Repository Pattern
├── foody_server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── domain/              # 도메인 계층
│   │   │   └── recipe/          # 레시피 도메인
│   │   └── infra/               # 인프라 계층
│   └── prisma/                   # 데이터베이스 스키마
└── foody_recipe_agent/           # AI Agent (Python)
    ├── streamlit_app.py          # Streamlit 인터페이스
    └── src/                      # AI 분석 로직
```

## 📊 데이터베이스 스키마

```sql
-- 사용자
users (id, email, name, profile_image)

-- 레시피
recipes (id, title, thumbnail, link, category_id, author_id, user_id)

-- 재료
ingredients (id, name)

-- 사용자 보유 재료
user_ingredients (user_id, ingredient_id, quantity, unit)

-- 레시피별 필요 재료
recipe_ingredients (recipe_id, ingredient_id)

-- 요리 카테고리
categories (id, name, description)

-- 저자 정보
authors (id, author_name, author_url)
```

## 🚀 설치 및 실행

### 1. 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/foody.git
cd foody
```

### 2. Backend 설정

```bash
cd foody_server

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에서 데이터베이스 URL, JWT 시크릿 등 설정

# 데이터베이스 마이그레이션
npx prisma migrate dev
npx prisma generate

# 서버 실행
npm run start:dev
```

### 3. Frontend 설정

```bash
cd foody_client_nextjs

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# Google OAuth, API URL 등 설정

# 개발 서버 실행
npm run dev
```

### 4. AI Agent 설정 (선택사항)

```bash
cd foody_recipe_agent

# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정 (.env)
OPENAI_API_KEY=your_openai_api_key
API_BASE_URL=http://localhost:4000

# Streamlit 앱 실행
streamlit run streamlit_app.py
```

## 🌐 API 엔드포인트

### 인증 관련
```
POST /auth/login          # 로그인
POST /auth/refresh        # 토큰 갱신
```

### 레시피 관련
```
GET  /v1/recipes                      # 레시피 목록
GET  /v1/recipes/:id                  # 레시피 상세
GET  /v1/recipes/recipes-with-ingredients  # 재료 포함 레시피 목록
POST /v1/recipes/from-agent           # AI 에이전트로부터 레시피 생성
POST /v1/recipes/check-exists         # 레시피 중복 확인
```

### 재료 관리
```
GET    /v1/recipes/ingredients        # 사용자 보유 재료 목록
POST   /v1/recipes/ingredients        # 재료 추가
DELETE /v1/recipes/ingredients/:id    # 재료 삭제
GET    /v1/recipes/all-ingredients    # 전체 재료 목록
```

## 📱 주요 화면 및 기능

### 🔐 로그인 화면
- **Google OAuth 간편 로그인**
- 모바일 우선 반응형 디자인
- 브랜드 아이덴티티가 담긴 UI

### 🧊 냉장고 관리 (모달)
- **스마트 재료 검색**: 기존 재료 우선 표시
- **원클릭 추가**: 검색 결과 바로 추가
- **커스텀 재료**: 없는 재료 직접 추가
- **시각적 관리**: 태그 형태 재료 목록

### 🍳 레시피 추천
- **매칭률 기반 정렬**: 보유 재료로 만들 수 있는 순서
- **재료 현황 표시**: ✅ 보유 재료 vs ❌ 부족한 재료
- **필터링 옵션**: 매칭률순, 제목순 정렬
- **상세 모달**: 유튜브 링크, 재료 상세 정보

## 🎯 주요 UX 특징

### 📱 모바일 우선 설계
- 모든 인터페이스가 터치 친화적
- 큰 버튼과 명확한 시각적 계층
- 한 손으로 조작 가능한 UI

### 🔄 모달 기반 네비게이션
- 페이지 전환 없는 빠른 상호작용
- 컨텍스트 유지로 사용성 향상
- 뒤로가기 없는 직관적 플로우

### 🎨 일관된 디자인 시스템
- Tailwind CSS 기반 디자인 토큰
- 오렌지 계열 브랜드 컬러
- 명확한 텍스트 대비와 접근성

## 🤖 AI 에이전트 워크플로

### 🧠 AI 분석 과정
1. **자막 추출**: youtube_transcript_api로 영상 자막 수집
2. **LLM 분석**: GPT-4로 재료 및 요리 정보 추출
3. **데이터 정제**: 재료명 일반화, 오타 수정
4. **장르 분류**: 13가지 요리 카테고리 자동 분류
5. **품질 관리**: 중복 방지 및 데이터 검증

## 🚦 개발 로드맵

### ✅ Phase 1: 핵심 기능 구현 (완료)
- [x] AI 에이전트 레시피 분석 시스템
- [x] 사용자 인증 및 냉장고 관리
- [x] 레시피 추천 및 매칭 알고리즘
- [x] 모바일 우선 UX 개선

### 🚧 Phase 2: 고도화 (진행 중)
- [ ] 요리 완료 기록 및 히스토리
- [ ] 재료 사용량 추적
- [ ] 개인화된 추천 알고리즘
- [ ] 푸시 알림 (재료 소비기한 등)

### 📋 Phase 3: 소셜 기능 (계획)
- [ ] 레시피 평점 및 리뷰 시스템
- [ ] 사용자간 레시피 공유
- [ ] 요리 인증 및 소셜 피드
- [ ] 식자재 온라인 쇼핑 연동

## 🔧 개발 가이드

### 코드 컨벤션
- **TypeScript Strict Mode** 사용
- **ESLint + Prettier** 코드 포맷팅
- **Repository Pattern** API 추상화
- **Component 단위** 개발

### 브랜치 전략
```
main                    # 프로덕션 배포
├── develop            # 개발 통합
├── feature/xxx        # 기능 개발
└── hotfix/xxx         # 긴급 수정
```

### 커밋 메시지
```
✨ feat: 새로운 기능 추가
🐛 fix: 버그 수정
⚡️ perf: 성능 개선
♻️ refactor: 코드 리팩토링
📝 docs: 문서 업데이트
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '✨ feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- **프로젝트 링크**: https://github.com/your-username/foody
- **이슈 리포트**: https://github.com/your-username/foody/issues
- **기능 제안**: https://github.com/your-username/foody/discussions

---

**🍽️ 맛있는 요리와 함께하는 스마트한 자취 생활을 시작해보세요!**