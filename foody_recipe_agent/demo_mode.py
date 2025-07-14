#!/usr/bin/env python3
"""
데모 모드: YouTube IP 차단 시 사용할 수 있는 시뮬레이션 모드
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from models.recipe import Recipe, Ingredient

def create_demo_recipe(youtube_url: str) -> Recipe:
    """
    데모용 가짜 레시피 생성
    """
    # 데모 재료 목록 (한국 요리 기준)
    demo_ingredients = [
        Ingredient(name="김치", original_name="신김치", normalized_name="김치", confidence=0.95),
        Ingredient(name="돼지고기", original_name="삼겹살", normalized_name="돼지고기", confidence=0.92),
        Ingredient(name="양파", original_name="중간 양파", normalized_name="양파", confidence=0.90),
        Ingredient(name="파", original_name="대파", normalized_name="파", confidence=0.88),
        Ingredient(name="마늘", original_name="다진 마늘", normalized_name="마늘", confidence=0.90),
        Ingredient(name="고춧가루", original_name="고춧가루", normalized_name="고춧가루", confidence=0.85),
        Ingredient(name="참기름", original_name="참기름", normalized_name="참기름", confidence=0.82),
        Ingredient(name="두부", original_name="순두부", normalized_name="두부", confidence=0.88),
        Ingredient(name="물", original_name="물", normalized_name="물", confidence=0.95),
    ]
    
    demo_transcript = """
    안녕하세요! 오늘은 맛있는 김치찌개를 만들어보겠습니다.
    재료는 김치 200g, 돼지고기 삼겹살 150g, 양파 1개, 대파 1대가 필요합니다.
    그리고 마늘 3쪽, 고춧가루 1큰술, 참기름도 준비해주세요.
    순두부 한 모와 물 500ml도 넣어서 끓여주시면 됩니다.
    정말 간단하고 맛있는 김치찌개 완성!
    """
    
    recipe = Recipe(
        youtube_url=youtube_url,
        title="김치찌개 만들기 - 데모 영상",
        ingredients=demo_ingredients,
        transcript=demo_transcript,
        processing_status="completed"
    )
    
    return recipe

def is_demo_url(youtube_url: str) -> bool:
    """
    데모 URL인지 확인
    """
    demo_keywords = ["demo", "test", "sample", "example"]
    return any(keyword in youtube_url.lower() for keyword in demo_keywords)

if __name__ == "__main__":
    # 테스트
    demo_url = "https://www.youtube.com/watch?v=demo123"
    recipe = create_demo_recipe(demo_url)
    
    print("🎭 데모 레시피 생성됨:")
    print(f"📺 URL: {recipe.youtube_url}")
    print(f"📝 제목: {recipe.title}")
    print(f"🥬 재료 수: {len(recipe.ingredients)}")
    
    for i, ingredient in enumerate(recipe.ingredients):
        print(f"  {i+1}. {ingredient.name} (신뢰도: {ingredient.confidence:.0%})")