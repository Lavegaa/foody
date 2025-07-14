# Foody Recipe Agent

YouTube 레시피 영상에서 재료를 자동으로 추출하는 AI 에이전트입니다.

## 주요 기능

- **YouTube 영상 자막 추출**: 한국어/영어 자막 지원
- **영상 메타데이터 수집**: 제목, 채널명, 썸네일, 채널 URL 등
- **LangChain 기반 재료 분석**: GPT-4를 활용한 지능형 재료 추출
- **2단계 재료 정규화**: 오타 수정 + 일반화 (최대 2단계 평가)
- **FastAPI REST API**: 고성능 비동기 API 서버
- **Streamlit 웹 인터페이스**: 사용자 친화적인 UI/UX

## 설치 방법

```bash
# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일에 OPENAI_API_KEY 입력
```

## 사용 방법

### 1. Streamlit 웹 인터페이스 (권장)

**간단한 방법 (개별 실행):**
```bash
# 1. API 서버 실행 (터미널 1)
python start_api.py

# 2. Streamlit 앱 실행 (터미널 2)
python start_streamlit.py
```

**동시 실행 (실험적):**
```bash
python run_both.py
```

**수동 실행:**
```bash
# 1. API 서버 실행 (터미널 1)
cd src && python main.py

# 2. Streamlit 앱 실행 (터미널 2)
streamlit run streamlit_app.py
```

브라우저에서 `http://localhost:8501` 접속

### 2. API 직접 사용
```bash
# 재료 추출
curl -X POST "http://localhost:8000/extract-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"}'

# 비디오 정보 확인
curl "http://localhost:8000/video-info?youtube_url=https://www.youtube.com/watch?v=VIDEO_ID"
```

## 프로젝트 구조

```
foody_recipe_agent/
├── src/
│   ├── agents/
│   │   ├── __init__.py
│   │   └── ingredient_extractor.py    # 메인 AI 에이전트
│   ├── models/
│   │   ├── __init__.py
│   │   └── recipe.py                  # 데이터 모델
│   ├── utils/
│   │   ├── __init__.py
│   │   └── youtube_transcript.py      # 자막 추출 유틸리티
│   ├── __init__.py
│   └── main.py                        # FastAPI 서버
├── tests/                             # 테스트 코드
├── .streamlit/
│   └── config.toml                    # Streamlit 설정
├── streamlit_app.py                   # Streamlit 웹 인터페이스
├── run_streamlit.py                   # Streamlit 실행 스크립트
├── requirements.txt
├── .env.example
└── README.md
```

## 처리 과정

1. **메타데이터 수집**: YouTube oEmbed API로 영상 정보 수집 (제목, 채널, 썸네일)
2. **자막 추출**: YouTube 영상에서 한국어/영어 자막 추출
3. **재료 분석**: LLM을 통해 자막에서 재료 추출
4. **1차 정규화**: 오타 수정, 구체적인 재료명 일반화
5. **2차 정규화**: 더 엄격한 일반화 및 중복 제거
6. **결과 반환**: 메타데이터 + 정제된 재료 목록과 함께 Recipe 객체 반환

## 환경 변수

- `OPENAI_API_KEY`: OpenAI API 키 (필수)

## 문제 해결

### YouTube IP 차단 문제
YouTube에서 IP를 차단하는 경우가 있습니다. 이는 짧은 시간에 많은 요청을 보낼 때 발생합니다.

**⚠️ 중요**: 시간 대기로는 해결되지 않습니다! (10시간+ 지속됨)

**효과적인 해결 방법:**
1. **🔥 핸드폰 핫스팟 사용** (가장 확실한 방법)
2. **🌐 다른 WiFi 연결** (카페, 도서관 등)
3. **💰 VPN 서비스 사용** (유료지만 확실함)

**개발/테스트용:**
- **데모 모드**: `https://www.youtube.com/watch?v=demo123`
- 실제 기능 완전 체험 가능

**상세 해결책**: [SIMPLE_IP_SOLUTIONS.md](SIMPLE_IP_SOLUTIONS.md) 참고

### 자막 없는 영상
- 자막이 있는 요리 영상만 분석 가능
- 한국어 자막이 없으면 영어 자막 사용
- 자막이 전혀 없는 영상은 분석 불가

### API 연결 문제
- API 서버가 실행 중인지 확인: `http://localhost:8000/health`
- 방화벽 설정 확인
- 포트 8000, 8501이 사용 중인지 확인