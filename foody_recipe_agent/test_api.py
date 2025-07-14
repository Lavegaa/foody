#!/usr/bin/env python3
"""
API 엔드포인트 테스트 스크립트
"""

import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

def test_api_health():
    """API 서버 상태 확인"""
    print("🏥 API 서버 상태 확인")
    print("-" * 40)
    
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ API 서버 정상 작동")
            print(f"📋 응답: {response.json()}")
            return True
        else:
            print(f"❌ API 서버 오류: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API 서버 연결 실패: {e}")
        print("💡 먼저 API 서버를 실행하세요: cd src && python main.py")
        return False

def test_video_info():
    """비디오 정보 API 테스트"""
    print("\n📺 비디오 정보 API 테스트")
    print("-" * 40)
    
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/video-info",
            params={"youtube_url": test_url},
            timeout=10
        )
        
        print(f"📊 응답 상태: HTTP {response.status_code}")
        print(f"📋 응답 내용: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ 비디오 정보 조회 성공")
            print(f"  - 비디오 ID: {data.get('video_id')}")
            print(f"  - 자막 사용 가능: {data.get('transcript_available')}")
            print(f"  - 사용 가능한 언어: {data.get('available_languages')}")
            return True
        else:
            print(f"❌ 비디오 정보 조회 실패")
            return False
            
    except Exception as e:
        print(f"❌ 요청 실패: {e}")
        return False

def test_ingredient_extraction():
    """재료 추출 API 테스트"""
    print("\n🤖 재료 추출 API 테스트")
    print("-" * 40)
    
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    try:
        print("📤 요청 전송 중...")
        response = requests.post(
            f"{API_BASE_URL}/extract-ingredients",
            json={"youtube_url": test_url},
            timeout=120  # 2분 타임아웃
        )
        
        print(f"📊 응답 상태: HTTP {response.status_code}")
        print(f"📋 응답 헤더: {dict(response.headers)}")
        
        try:
            data = response.json()
            print(f"📋 응답 내용: {json.dumps(data, indent=2, ensure_ascii=False)}")
        except:
            print(f"📋 원시 응답: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                recipe = data.get("recipe", {})
                ingredients = recipe.get("ingredients", [])
                print("✅ 재료 추출 성공")
                print(f"  - 처리 상태: {recipe.get('processing_status')}")
                print(f"  - 추출된 재료 수: {len(ingredients)}")
                
                for i, ingredient in enumerate(ingredients[:5]):
                    print(f"  - {i+1}. {ingredient.get('name')} (신뢰도: {ingredient.get('confidence', 0):.0%})")
                
                return True
            else:
                print(f"❌ 재료 추출 실패: {data.get('error')}")
                return False
        else:
            print(f"❌ API 요청 실패: HTTP {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ 요청 타임아웃 (2분 초과)")
        return False
    except Exception as e:
        print(f"❌ 요청 실패: {e}")
        return False

def main():
    """메인 테스트 함수"""
    print("🧪 API 엔드포인트 테스트")
    print("=" * 50)
    
    # 1. API 서버 상태 확인
    if not test_api_health():
        return
    
    # 2. 비디오 정보 API 테스트
    test_video_info()
    
    # 3. 재료 추출 API 테스트
    test_ingredient_extraction()
    
    print("\n🏁 테스트 완료!")

if __name__ == "__main__":
    main()