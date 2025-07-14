#!/usr/bin/env python3
"""
음식 장르 분류 기능 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from agents.ingredient_extractor import IngredientExtractorAgent

def test_cuisine_classification():
    """음식 장르 분류 테스트"""
    print("🧪 음식 장르 분류 기능 테스트")
    print("=" * 50)
    
    # 테스트 케이스들
    test_cases = [
        {
            "name": "김치찌개 (한식)",
            "transcript": "안녕하세요! 오늘은 김치찌개를 만들어보겠습니다. 신김치와 돼지고기, 고춧가루를 준비해주세요.",
            "ingredients": ["김치", "돼지고기", "고춧가루", "참기름", "대파", "마늘"],
            "title": "집에서 만드는 김치찌개"
        },
        {
            "name": "짜장면 (중식)",
            "transcript": "중국식 짜장면을 만들어보겠습니다. 춘장과 양파, 돼지고기를 준비하세요.",
            "ingredients": ["춘장", "양파", "돼지고기", "면", "대파", "마늘"],
            "title": "정통 중국식 짜장면"
        },
        {
            "name": "카레라이스 (일식)",
            "transcript": "일본식 카레를 만들어봅시다. 카레룩스와 감자, 당근을 준비해주세요.",
            "ingredients": ["카레룩스", "감자", "당근", "양파", "쇠고기", "쌀"],
            "title": "일본식 카레라이스"
        },
        {
            "name": "파스타 (이탈리안)",
            "transcript": "토마토 파스타를 만들어보겠습니다. 스파게티면과 토마토소스, 바질을 준비하세요.",
            "ingredients": ["스파게티", "토마토소스", "바질", "파르메산치즈", "올리브오일", "마늘"],
            "title": "토마토 바질 파스타"
        },
        {
            "name": "애매한 요리 (기타 예상)",
            "transcript": "특별한 퓨전 요리를 만들어보겠습니다. 다양한 재료들을 섞어서 만들어보죠.",
            "ingredients": ["닭고기", "쌀", "야채", "소금", "후추"],
            "title": "퓨전 요리"
        }
    ]
    
    agent = IngredientExtractorAgent()
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 테스트 {i}: {test_case['name']}")
        print("-" * 40)
        
        try:
            # 1차 분류
            cuisine_info = agent.classify_cuisine(
                transcript=test_case["transcript"],
                ingredients=test_case["ingredients"],
                title=test_case["title"]
            )
            
            print(f"🥘 1차 분류: {cuisine_info.cuisine_type.value}")
            print(f"📊 신뢰도: {cuisine_info.confidence:.2f}")
            print(f"💭 근거: {cuisine_info.reasoning}")
            
            # 2차 검증
            verified_cuisine = agent.verify_cuisine_classification(
                cuisine_info=cuisine_info,
                transcript=test_case["transcript"],
                ingredients=test_case["ingredients"]
            )
            
            print(f"\n🔍 2차 검증: {verified_cuisine.cuisine_type.value}")
            print(f"📊 최종 신뢰도: {verified_cuisine.confidence:.2f}")
            print(f"💭 검증 근거: {verified_cuisine.reasoning}")
            
        except Exception as e:
            print(f"❌ 오류 발생: {e}")

def test_demo_mode():
    """데모 모드 테스트"""
    print("\n🎭 데모 모드 테스트")
    print("=" * 50)
    
    agent = IngredientExtractorAgent()
    
    try:
        recipe = agent.process_youtube_video("https://www.youtube.com/watch?v=demo123")
        
        print(f"📺 제목: {recipe.title}")
        print(f"🥘 음식 장르: {recipe.cuisine_info.cuisine_type.value}")
        print(f"📊 신뢰도: {recipe.cuisine_info.confidence:.2f}")
        print(f"💭 근거: {recipe.cuisine_info.reasoning}")
        print(f"🥬 재료 수: {len(recipe.ingredients)}")
        
    except Exception as e:
        print(f"❌ 데모 모드 오류: {e}")

def main():
    """메인 테스트 함수"""
    print("🧪 음식 장르 분류 테스트 시작")
    
    # 1. 기본 분류 테스트
    test_cuisine_classification()
    
    # 2. 데모 모드 테스트
    test_demo_mode()
    
    print("\n🏁 테스트 완료!")

if __name__ == "__main__":
    main()