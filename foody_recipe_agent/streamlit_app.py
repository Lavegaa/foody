import streamlit as st
import requests
import json
from typing import Dict, Any
import time

# 페이지 설정
st.set_page_config(
    page_title="Foody Recipe Agent",
    page_icon="🍳",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 스타일링
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 2rem 0;
        background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 3rem;
        font-weight: bold;
    }
    .ingredient-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        border-left: 4px solid #4ECDC4;
    }
    .status-success {
        color: #28a745;
        font-weight: bold;
    }
    .status-error {
        color: #dc3545;
        font-weight: bold;
    }
    .status-processing {
        color: #ffc107;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

# API 설정
API_BASE_URL = "http://localhost:8000"

def check_api_health():
    """API 서버 상태 확인"""
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def get_video_info(youtube_url: str) -> Dict[str, Any]:
    """비디오 정보 가져오기"""
    try:
        response = requests.get(
            f"{API_BASE_URL}/video-info",
            params={"youtube_url": youtube_url},
            timeout=10
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"HTTP {response.status_code}: {response.text}"}
    except Exception as e:
        return {"error": str(e)}

def extract_ingredients(youtube_url: str) -> Dict[str, Any]:
    """재료 추출 요청"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/extract-ingredients",
            json={"youtube_url": youtube_url},
            timeout=60
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"HTTP {response.status_code}: {response.text}"}
    except Exception as e:
        return {"error": str(e)}

def check_recipe_exists(youtube_url: str) -> Dict[str, Any]:
    """레시피가 이미 존재하는지 확인"""
    try:
        api_server_url = "http://localhost:4000"
        response = requests.post(
            f"{api_server_url}/v1/recipes/check-exists",
            json={"youtubeUrl": youtube_url},
            timeout=5
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"exists": False, "error": f"HTTP {response.status_code}"}
            
    except Exception as e:
        return {"exists": False, "error": str(e)}

def save_to_api_server(recipe: Dict[str, Any]) -> None:
    """레시피를 API 서버에 저장"""
    try:
        # API 서버 URL 설정
        api_server_url = "http://localhost:4000"
        youtube_url = recipe.get("youtube_url", "")
        
        # 1. 먼저 중복 체크
        with st.spinner("중복 레시피 확인 중..."):
            check_result = check_recipe_exists(youtube_url)
            
        if check_result.get("exists", False):
            video_id = check_result.get("videoId", "Unknown")
            st.warning(f"⚠️ 이미 존재하는 레시피입니다!")
            st.info(f"🎥 Video ID: {video_id}")
            st.info("💡 같은 YouTube 영상으로 만든 레시피가 이미 데이터베이스에 저장되어 있습니다.")
            return
        
        # 2. 중복이 아니면 저장 진행
        recipe_data = {
            "youtube_url": youtube_url,
            "title": recipe.get("title", ""),
            "metadata": recipe.get("metadata", {}),
            "ingredients": recipe.get("ingredients", []),
            "cuisine_info": recipe.get("cuisine_info", {}),
            "transcript": recipe.get("transcript", ""),
            "processing_status": recipe.get("processing_status", "completed")
        }
        
        with st.spinner("API 서버에 저장하는 중..."):
            response = requests.post(
                f"{api_server_url}/v1/recipes/from-agent",
                json=recipe_data,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                st.success("✅ 레시피가 성공적으로 저장되었습니다!")
                
                # 저장된 레시피 정보 표시
                saved_recipe = response.json()
                with st.expander("📋 저장된 레시피 정보", expanded=False):
                    st.json(saved_recipe)
                    
            elif response.status_code == 400 and "이미 존재하는" in response.text:
                st.warning("⚠️ 이미 존재하는 레시피입니다!")
                st.info("💡 같은 YouTube 영상으로 만든 레시피가 이미 저장되어 있습니다.")
            else:
                st.error(f"❌ 저장 실패: HTTP {response.status_code}")
                st.error(f"응답: {response.text}")
                
    except requests.exceptions.RequestException as e:
        st.error(f"❌ 네트워크 오류: {str(e)}")
        st.info("💡 API 서버가 실행 중인지 확인해주세요 (localhost:4000)")
    except Exception as e:
        st.error(f"❌ 예상치 못한 오류: {str(e)}")

def main():
    # 헤더
    st.markdown('<h1 class="main-header">🍳 Foody Recipe Agent</h1>', unsafe_allow_html=True)
    st.markdown("### YouTube 레시피 영상에서 재료를 자동으로 추출하는 AI 에이전트")
    
    # 사이드바
    with st.sidebar:
        st.header("🔧 설정")
        
        # API 상태 확인
        if check_api_health():
            st.markdown('<p class="status-success">✅ API 서버 연결됨</p>', unsafe_allow_html=True)
        else:
            st.markdown('<p class="status-error">❌ API 서버 연결 안됨</p>', unsafe_allow_html=True)
            st.error("API 서버를 먼저 실행해주세요:\n```bash\npython src/main.py\n```")
            return
        
        st.markdown("---")
        st.markdown("### 📋 사용 방법")
        st.markdown("""
        1. YouTube 레시피 영상 URL 입력
        2. '비디오 정보 확인' 버튼 클릭
        3. '재료 추출' 버튼 클릭
        4. 결과 확인
        """)
        
        st.markdown("---")
        st.markdown("### 🔗 지원 URL 형식")
        st.markdown("""
        - `https://www.youtube.com/watch?v=VIDEO_ID`
        - `https://youtu.be/VIDEO_ID`
        - `https://www.youtube.com/embed/VIDEO_ID`
        """)
        
        st.markdown("---")
        st.markdown("### ⚠️ 주의사항")
        st.markdown("""
        - 자막이 있는 요리 영상만 분석 가능
        - YouTube IP 차단 시 네트워크 변경 필요
        - 한국어 자막 없는 경우 영어 자막 사용
        """)
        
        # IP 차단 해결 안내
        st.markdown("### 🚫 IP 차단 해결")
        st.error("IP 차단 시 시간 대기로는 해결되지 않습니다!")
        st.markdown("""
        **효과적인 해결 방법:**
        1. 🔥 **핸드폰 핫스팟 사용** (가장 확실)
        2. 🌐 **다른 WiFi 연결**
        3. 🏢 **다른 장소에서 사용** (카페, 도서관 등)
        4. 💰 **VPN 서비스 사용** (유료지만 확실)
        """)
        
        st.markdown("---")
        st.markdown("### 🎭 데모 모드")
        st.markdown("""
        **IP 차단 시 데모 테스트 URL:**
        ```
        https://www.youtube.com/watch?v=demo123
        ```
        이 URL로 기능을 시연할 수 있습니다.
        """)
        
        st.markdown("---")
        if st.button("🗑️ 통계 초기화", help="세션 통계를 초기화합니다"):
            if 'session_stats' in st.session_state:
                st.session_state.session_stats = {
                    'total_analyses': 0,
                    'successful_analyses': 0,
                    'total_ingredients': 0,
                    'recent_ingredients': []
                }
                st.success("통계가 초기화되었습니다!")
                st.rerun()
    
    # 메인 컨텐츠
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("🎥 YouTube 영상 분석")
        
        # YouTube URL 입력
        youtube_url = st.text_input(
            "YouTube 영상 URL을 입력하세요:",
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID",
            help="요리 레시피 영상의 YouTube URL을 입력하세요"
        )
        
        if youtube_url:
            # 비디오 정보 확인
            col_info, col_extract = st.columns(2)
            
            with col_info:
                if st.button("🔍 비디오 정보 확인", use_container_width=True):
                    with st.spinner("비디오 정보를 가져오는 중..."):
                        video_info = get_video_info(youtube_url)
                    
                    if "error" in video_info:
                        st.error(f"오류: {video_info['error']}")
                    else:
                        st.success("비디오 정보를 성공적으로 가져왔습니다!")
                        
                        # 비디오 정보 표시
                        with st.expander("📊 비디오 정보", expanded=True):
                            # 기본 정보
                            st.write(f"**비디오 ID:** {video_info.get('video_id', 'N/A')}")
                            st.write(f"**자막 사용 가능:** {'✅' if video_info.get('transcript_available', False) else '❌'}")
                            
                            # 메타데이터
                            metadata = video_info.get('metadata')
                            if metadata and not metadata.get('error'):
                                st.markdown("---")
                                st.markdown("**📺 영상 정보:**")
                                
                                # 썸네일 표시
                                if metadata.get('thumbnail_url'):
                                    st.image(metadata['thumbnail_url'], width=300)
                                
                                # 제목과 채널
                                if metadata.get('title'):
                                    st.write(f"**제목:** {metadata['title']}")
                                if metadata.get('author_name'):
                                    st.write(f"**채널:** {metadata['author_name']}")
                                if metadata.get('author_url'):
                                    st.write(f"**채널 URL:** {metadata['author_url']}")
                            
                            # 자막 언어
                            if video_info.get('available_languages'):
                                st.markdown("---")
                                st.write("**🌍 사용 가능한 언어:**")
                                for lang in video_info['available_languages']:
                                    st.write(f"- {lang}")
            
            with col_extract:
                if st.button("🤖 재료 추출", use_container_width=True, type="primary"):
                    with st.spinner("AI가 재료를 추출하는 중... (1-2분 소요)"):
                        # 진행 상태 표시
                        progress_bar = st.progress(0)
                        status_text = st.empty()
                        
                        status_text.text("자막 추출 중...")
                        progress_bar.progress(25)
                        time.sleep(0.5)
                        
                        status_text.text("재료 분석 중...")
                        progress_bar.progress(50)
                        
                        # 실제 API 호출
                        result = extract_ingredients(youtube_url)
                        
                        status_text.text("재료 정규화 중...")
                        progress_bar.progress(75)
                        time.sleep(0.5)
                        
                        status_text.text("결과 정리 중...")
                        progress_bar.progress(100)
                        time.sleep(0.5)
                        
                        # 진행 상태 제거
                        progress_bar.empty()
                        status_text.empty()
                        
                        # 통계 업데이트
                        if 'session_stats' not in st.session_state:
                            st.session_state.session_stats = {
                                'total_analyses': 0,
                                'successful_analyses': 0,
                                'total_ingredients': 0,
                                'recent_ingredients': []
                            }
                        
                        stats = st.session_state.session_stats
                        stats['total_analyses'] += 1
                        
                        if result.get("success", False):
                            stats['successful_analyses'] += 1
                            recipe = result.get("recipe", {})
                            ingredients = recipe.get("ingredients", [])
                            stats['total_ingredients'] += len(ingredients)
                            
                            # 최근 재료 목록 업데이트
                            new_ingredients = [ing.get('name', '') for ing in ingredients]
                            stats['recent_ingredients'].extend(new_ingredients)
                            # 최대 20개까지만 유지
                            if len(stats['recent_ingredients']) > 20:
                                stats['recent_ingredients'] = stats['recent_ingredients'][-20:]
                    
                    # 결과 저장
                    st.session_state.extraction_result = result
    
    with col2:
        st.header("ℹ️ 정보")
        
        # 세션 통계 (실제 값)
        if 'session_stats' not in st.session_state:
            st.session_state.session_stats = {
                'total_analyses': 0,
                'successful_analyses': 0,
                'total_ingredients': 0,
                'recent_ingredients': []
            }
        
        stats = st.session_state.session_stats
        success_rate = f"{(stats['successful_analyses'] / max(stats['total_analyses'], 1) * 100):.0f}%" if stats['total_analyses'] > 0 else "0%"
        
        st.metric("분석한 영상", stats['total_analyses'])
        st.metric("추출된 재료", stats['total_ingredients'])
        st.metric("성공률", success_rate)
        
        # 최근 추출된 재료
        if stats['recent_ingredients']:
            st.subheader("💡 최근 추출된 재료")
            for ingredient in stats['recent_ingredients'][-8:]:  # 최근 8개만 표시
                st.write(f"• {ingredient}")
        else:
            st.subheader("💡 재료 추출 예시")
            st.write("아직 분석한 영상이 없습니다.")
            st.write("데모 URL로 테스트해보세요!")
            st.code("https://www.youtube.com/watch?v=demo123")
    
    # 결과 표시
    if hasattr(st.session_state, 'extraction_result'):
        result = st.session_state.extraction_result
        
        st.markdown("---")
        st.header("📊 분석 결과")
        
        if "error" in result and result.get('error') is not None:
            error_msg = result.get('error', 'Unknown error')
            error_msg = str(error_msg)  # 문자열로 변환
            
            # 에러 타입에 따른 맞춤형 메시지
            if "YouTube에서 현재 IP를 차단" in error_msg or "다른 네트워크" in error_msg:
                st.error("🚫 YouTube IP 차단")
                st.warning("⚠️ 시간 대기로는 해결되지 않습니다!")
                st.info("""
                **즉시 해결 방법:**
                - 🔥 핸드폰 핫스팟으로 변경 (가장 확실)
                - 🌐 다른 WiFi 사용
                - 🏢 다른 장소에서 시도
                - 💰 VPN 서비스 사용
                """)
            elif "자막이 없습니다" in error_msg:
                st.warning("📝 자막 없음")
                st.info("자막이 있는 다른 요리 영상을 시도해주세요.")
            elif "유효하지 않은 YouTube URL" in error_msg:
                st.error("🔗 잘못된 URL")
                st.info("올바른 YouTube URL을 입력해주세요.")
            else:
                st.error(f"❌ 오류: {error_msg}")
                
                # 디버깅을 위한 상세 정보
                with st.expander("🔍 상세 오류 정보", expanded=False):
                    st.json(result)
                
        elif result.get("success", False):
            recipe = result.get("recipe", {})
            ingredients = recipe.get("ingredients", [])
            
            # 디버깅용 로그
            print(f"DEBUG: success={result.get('success')}, recipe keys={list(recipe.keys()) if recipe else 'None'}")
            print(f"DEBUG: ingredients length={len(ingredients) if ingredients else 'None'}")
            
            if ingredients:
                st.success(f"✅ 총 {len(ingredients)}개의 재료를 추출했습니다!")
                
                # 음식 장르 정보 표시
                cuisine_info = recipe.get('cuisine_info')
                if cuisine_info and isinstance(cuisine_info, dict):
                    st.subheader("🍽️ 음식 장르")
                    
                    col_cuisine, col_confidence = st.columns([2, 1])
                    with col_cuisine:
                        cuisine_type = cuisine_info.get('cuisine_type', '기타')
                        if cuisine_type:
                            st.markdown(f"### {cuisine_type}")
                        else:
                            st.markdown("### 기타")
                    
                    with col_confidence:
                        confidence = cuisine_info.get('confidence', 0)
                        if confidence is not None:
                            try:
                                confidence_pct = float(confidence) * 100
                                st.metric("신뢰도", f"{confidence_pct:.0f}%")
                            except (ValueError, TypeError):
                                st.metric("신뢰도", "N/A")
                        else:
                            st.metric("신뢰도", "N/A")
                    
                    # 판단 근거
                    reasoning = cuisine_info.get('reasoning')
                    if reasoning and reasoning != "None":
                        st.info(f"**판단 근거**: {reasoning}")
                
                # 재료 목록 표시
                st.subheader("🥬 추출된 재료 목록")
                
                # 3열로 재료 표시
                cols = st.columns(3)
                for i, ingredient in enumerate(ingredients):
                    with cols[i % 3]:
                        st.markdown(f"""
                        <div class="ingredient-card">
                            <h4>{ingredient.get('name', 'N/A')}</h4>
                            <small>신뢰도: {ingredient.get('confidence', 0):.0%}</small>
                        </div>
                        """, unsafe_allow_html=True)
                
                # 영상 정보
                metadata = recipe.get('metadata')
                if metadata:
                    with st.expander("📺 영상 정보", expanded=False):
                        # 썸네일
                        if metadata.get('thumbnail_url'):
                            st.image(metadata['thumbnail_url'], width=400)
                        
                        # 영상 정보
                        col_info1, col_info2 = st.columns(2)
                        with col_info1:
                            if metadata.get('title'):
                                st.write(f"**📝 제목:** {metadata['title']}")
                            if metadata.get('author_name'):
                                st.write(f"**👤 채널:** {metadata['author_name']}")
                        
                        with col_info2:
                            if metadata.get('video_id'):
                                st.write(f"**🆔 비디오 ID:** {metadata['video_id']}")
                            if metadata.get('author_url'):
                                st.write(f"**🔗 채널 URL:** [링크]({metadata['author_url']})")
                
                # 처리 세부사항
                with st.expander("🔍 처리 세부사항", expanded=False):
                    st.write(f"**처리 상태:** {recipe.get('processing_status', 'N/A')}")
                    st.write(f"**YouTube URL:** {recipe.get('youtube_url', 'N/A')}")
                    
                    if recipe.get('transcript'):
                        st.write("**추출된 자막 (일부):**")
                        transcript = recipe['transcript']
                        st.text(transcript[:200] + "..." if len(transcript) > 200 else transcript)
                
                # 재료 목록 다운로드 및 저장
                st.subheader("📥 내보내기 및 저장")
                
                # JSON 형태로 다운로드
                ingredient_names = [ing.get('name', '') for ing in ingredients]
                json_data = json.dumps(ingredient_names, ensure_ascii=False, indent=2)
                
                col_json, col_text, col_save = st.columns(3)
                with col_json:
                    st.download_button(
                        label="JSON 다운로드",
                        data=json_data,
                        file_name="ingredients.json",
                        mime="application/json"
                    )
                
                with col_text:
                    text_data = "\n".join(ingredient_names)
                    st.download_button(
                        label="텍스트 다운로드",
                        data=text_data,
                        file_name="ingredients.txt",
                        mime="text/plain"
                    )
                
                with col_save:
                    if st.button("💾 API 서버에 저장", type="primary", use_container_width=True):
                        save_to_api_server(recipe)
            else:
                st.warning("추출된 재료가 없습니다.")
        else:
            st.error("재료 추출에 실패했습니다.")
    
    # 푸터
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center; color: #666; padding: 2rem;'>
            <p>🍳 Foody Recipe Agent v1.0 | 
            <a href='https://github.com/your-repo' target='_blank'>GitHub</a> | 
            Made with ❤️ by AI</p>
        </div>
        """,
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()