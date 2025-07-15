#!/usr/bin/env python3
"""
API 클라이언트 테스트 스크립트
"""

import os
import sys
sys.path.append('src')

from clients.api_client import ApiClient
from models.recipe import Recipe, VideoMetadata, CuisineInfo, CuisineType, Ingredient

def test_api_client():
    """API 클라이언트 기능 테스트"""
    print("🔧 API 클라이언트 테스트 시작...")
    
    # API 클라이언트 초기화
    client = ApiClient(
        base_url="http://localhost:4000",
        auth_token="test_token"  # 실제 토큰으로 교체 필요
    )
    
    # 1. 연결 테스트
    print("\n1. API 서버 연결 테스트...")
    if client.test_connection():
        print("✅ API 서버 연결 성공")
    else:
        print("❌ API 서버 연결 실패")
        return
    
    # 2. 테스트용 레시피 데이터 생성
    print("\n2. 테스트용 레시피 데이터 생성...")
    
    # 테스트용 메타데이터
    metadata = VideoMetadata(
        title="맛있는 김치찌개 만들기",
        author_name="요리왕",
        author_url="https://www.youtube.com/@cookingtv",
        thumbnail_url="https://img.youtube.com/vi/test/maxresdefault.jpg",
        video_id="test_video_id"
    )
    
    # 테스트용 재료
    ingredients = [
        Ingredient(name="김치", original_name="신김치", normalized_name="김치", confidence=0.95),
        Ingredient(name="돼지고기", original_name="삼겹살", normalized_name="돼지고기", confidence=0.92),
        Ingredient(name="양파", original_name="중간 양파", normalized_name="양파", confidence=0.90),
        Ingredient(name="파", original_name="대파", normalized_name="파", confidence=0.88),
        Ingredient(name="마늘", original_name="다진 마늘", normalized_name="마늘", confidence=0.90),
    ]
    
    # 테스트용 요리 장르 정보
    cuisine_info = CuisineInfo(
        cuisine_type=CuisineType.KOREAN,
        confidence=0.95,
        reasoning="김치찌개는 대표적인 한식 요리입니다. 김치, 고춧가루, 참기름 등 한식 특유의 재료들이 사용되었습니다."
    )
    
    # 테스트용 레시피 객체 생성
    test_recipe = Recipe(
        youtube_url="https://www.youtube.com/watch?v=test_video_id",
        title="맛있는 김치찌개 만들기",
        metadata=metadata,
        ingredients=ingredients,
        cuisine_info=cuisine_info,
        transcript="안녕하세요! 오늘은 맛있는 김치찌개를 만들어보겠습니다...",
        processing_status="completed"
    )
    
    print(f"✅ 테스트 레시피 생성 완료: {test_recipe.title}")
    
    # 3. API 서버로 레시피 전송 테스트
    print("\n3. API 서버로 레시피 전송 테스트...")
    
    result = client.send_recipe_to_api(test_recipe, user_id="test_user")
    
    if result["success"]:
        print("✅ 레시피 전송 성공!")
        print(f"📋 서버 응답: {result.get('data', {})}")
        if "status_code" in result:
            print(f"🔢 상태 코드: {result['status_code']}")
    else:
        print("❌ 레시피 전송 실패!")
        print(f"❗ 에러: {result.get('error', 'Unknown error')}")
        if "status_code" in result:
            print(f"🔢 상태 코드: {result['status_code']}")
        if "response" in result:
            print(f"📄 서버 응답: {result['response']}")

if __name__ == "__main__":
    test_api_client()