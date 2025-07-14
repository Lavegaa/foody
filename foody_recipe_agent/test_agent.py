#!/usr/bin/env python3
"""
AI 에이전트 기능 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from agents.ingredient_extractor import IngredientExtractorAgent
from dotenv import load_dotenv

load_dotenv()

def test_openai_api_key():
    """OpenAI API 키 확인"""
    print("🔑 OpenAI API 키 확인")
    print("-" * 40)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        print(f"✅ API 키 설정됨: {api_key[:10]}...{api_key[-4:]}")
        return True
    else:
        print("❌ OPENAI_API_KEY가 설정되지 않았습니다!")
        print("💡 .env 파일에 OPENAI_API_KEY=your_api_key_here 를 추가하세요")
        return False

def test_ingredient_extraction():
    """재료 추출 테스트"""
    print("\n🤖 재료 추출 테스트")
    print("-" * 40)
    
    # 테스트용 자막 (한국 요리)
    test_transcript = """
    안녕하세요 오늘은 간단한 김치찌개를 만들어보겠습니다.
    필요한 재료는 김치 200g, 돼지고기 100g, 양파 1개, 대파 1대입니다.
    그리고 마늘 3쪽, 고춧가루 1큰술, 참기름도 준비해주세요.
    물 500ml와 두부 한 모도 넣어주시면 더 맛있습니다.
    """
    
    try:
        agent = IngredientExtractorAgent()
        print("✅ AI 에이전트 초기화 성공")
        
        # 재료 추출 테스트
        print("📝 재료 추출 중...")
        ingredients = agent.extract_ingredients_from_transcript(test_transcript)
        print(f"✅ 추출된 재료: {ingredients}")
        
        # 정규화 테스트
        print("🔄 재료 정규화 중...")
        normalized = agent.normalize_ingredients(ingredients)
        print(f"✅ 정규화된 재료: {normalized}")
        
        # 2차 정규화 테스트
        print("🔄 2차 정규화 중...")
        final = agent.second_pass_normalization(normalized)
        print(f"✅ 최종 재료: {final}")
        
        return True
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        print(f"📋 오류 타입: {type(e).__name__}")
        import traceback
        print(f"📋 상세 오류:")
        traceback.print_exc()
        return False

def test_full_process():
    """전체 프로세스 테스트"""
    print("\n🎬 전체 프로세스 테스트")
    print("-" * 40)
    
    # 실제 YouTube URL로 테스트 (자막이 있는 영상)
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # 자막이 있는 영상
    
    try:
        agent = IngredientExtractorAgent()
        print(f"📺 YouTube URL: {test_url}")
        
        recipe = agent.process_youtube_video(test_url)
        print(f"✅ 처리 상태: {recipe.processing_status}")
        print(f"✅ 추출된 재료 수: {len(recipe.ingredients)}")
        
        for i, ingredient in enumerate(recipe.ingredients[:5]):  # 처음 5개만 표시
            print(f"  {i+1}. {ingredient.name} (신뢰도: {ingredient.confidence:.0%})")
        
        return True
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """메인 테스트 함수"""
    print("🧪 AI 에이전트 기능 테스트")
    print("=" * 50)
    
    # 1. API 키 확인
    if not test_openai_api_key():
        return
    
    # 2. 재료 추출 테스트
    if not test_ingredient_extraction():
        return
    
    # 3. 전체 프로세스 테스트
    test_full_process()
    
    print("\n🏁 테스트 완료!")

if __name__ == "__main__":
    main()