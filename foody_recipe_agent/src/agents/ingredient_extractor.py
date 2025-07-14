from typing import List, Optional
from langchain.schema import BaseMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv

from models.recipe import Ingredient, Recipe, VideoMetadata, CuisineInfo, CuisineType
from utils.youtube_transcript import YouTubeTranscriptExtractor
from utils.youtube_metadata import YouTubeMetadataExtractor

load_dotenv()


class IngredientList(BaseModel):
    ingredients: List[str] = Field(description="추출된 재료 목록")


class IngredientNormalizer(BaseModel):
    normalized_ingredients: List[str] = Field(description="정규화된 재료 목록")


class CuisineClassifier(BaseModel):
    cuisine_type: str = Field(description="음식 장르 (한식, 중식, 일식, 양식, 이탈리안, 태국식, 베트남식, 인도식, 멕시코식, 퓨전, 베이킹, 디저트, 기타)")
    confidence: float = Field(description="신뢰도 (0.0-1.0)")
    reasoning: str = Field(description="판단 근거")


class IngredientExtractorAgent:
    def __init__(self, model_name: str = "gpt-4o-mini"):
        self.llm = ChatOpenAI(
            model=model_name,
            temperature=0.1,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # 재료 추출 프롬프트
        self.extraction_prompt = PromptTemplate.from_template(
            """
            다음은 YouTube 요리 영상의 자막입니다. 이 자막에서 요리에 사용되는 재료들을 추출해주세요.

            자막 내용:
            {transcript}

            지침:
            1. 요리에 실제로 사용되는 재료만 추출하세요
            2. 조리도구나 조리법은 제외하세요
            3. 재료의 양이나 단위는 제거하고 재료명만 추출하세요
            4. 한국어로 답변하세요
            5. 중복되는 재료는 한 번만 포함하세요

            {format_instructions}
            """
        )
        
        # 재료 정규화 프롬프트
        self.normalization_prompt = PromptTemplate.from_template(
            """
            다음 재료 목록을 정규화해주세요. 오타를 수정하고 너무 구체적인 재료명을 일반적인 이름으로 변경하세요.

            재료 목록:
            {ingredients}

            정규화 지침:
            1. 오타 수정 (예: '영파' → '양파')
            2. 구체적인 재료명을 일반화 (예: '적양파' → '양파', '대파' → '파')
            3. 브랜드명 제거
            4. 표준 한국어 표기법 적용
            5. 중복 제거

            {format_instructions}
            """
        )
        
        # 음식 장르 분류 프롬프트
        self.cuisine_prompt = PromptTemplate.from_template(
            """
            다음 자막과 재료 목록을 보고 이 요리의 장르를 분류해주세요.

            자막 내용:
            {transcript}

            추출된 재료:
            {ingredients}

            영상 제목:
            {title}

            분류 지침:
            1. 재료, 조리법, 용어 등을 종합적으로 고려하세요
            2. 한식: 김치, 고춧가루, 된장, 간장, 참기름, 깻잎 등
            3. 중식: 굴소스, 춘장, 팔각, 오향분, 청경채, 죽순 등
            4. 일식: 미소, 다시마, 가츠오부시, 미린, 사케, 와사비 등
            5. 양식: 버터, 치즈, 크림, 올리브오일, 허브 등
            6. 이탈리안: 파스타, 토마토소스, 바질, 파르메산 치즈 등
            7. 확실하지 않으면 "기타"로 분류하세요
            8. 신뢰도는 0.0-1.0 사이로 정확히 평가하세요

            {format_instructions}
            """
        )
        
        self.extraction_parser = PydanticOutputParser(pydantic_object=IngredientList)
        self.normalization_parser = PydanticOutputParser(pydantic_object=IngredientNormalizer)
        self.cuisine_parser = PydanticOutputParser(pydantic_object=CuisineClassifier)
    
    def extract_ingredients_from_transcript(self, transcript: str) -> List[str]:
        """
        자막에서 재료를 추출합니다.
        """
        try:
            # 1단계: 재료 추출
            prompt = self.extraction_prompt.format(
                transcript=transcript,
                format_instructions=self.extraction_parser.get_format_instructions()
            )
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            result = self.extraction_parser.parse(response.content)
            
            return result.ingredients
            
        except Exception as e:
            raise Exception(f"재료 추출 중 오류 발생: {str(e)}")
    
    def normalize_ingredients(self, ingredients: List[str]) -> List[str]:
        """
        재료명을 정규화합니다.
        """
        try:
            ingredients_text = "\n".join([f"- {ingredient}" for ingredient in ingredients])
            
            prompt = self.normalization_prompt.format(
                ingredients=ingredients_text,
                format_instructions=self.normalization_parser.get_format_instructions()
            )
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            result = self.normalization_parser.parse(response.content)
            
            return result.normalized_ingredients
            
        except Exception as e:
            raise Exception(f"재료 정규화 중 오류 발생: {str(e)}")
    
    def second_pass_normalization(self, ingredients: List[str]) -> List[str]:
        """
        2차 정규화를 수행합니다.
        """
        try:
            # 2차 정규화를 위한 더 엄격한 프롬프트
            strict_prompt = PromptTemplate.from_template(
                """
                다음 재료 목록을 더 엄격하게 정규화해주세요. 최대한 일반적이고 표준적인 재료명으로 변경하세요.

                재료 목록:
                {ingredients}

                엄격한 정규화 지침:
                1. 매우 구체적인 재료명을 가장 일반적인 이름으로 변경
                2. 지역 방언이나 특수 표기를 표준어로 변경
                3. 유사한 재료는 하나로 통합 (예: '쪽파', '실파', '대파' → '파')
                4. 불필요한 수식어 제거
                5. 최종적으로 가장 기본적인 재료명만 남기기

                {format_instructions}
                """
            )
            
            ingredients_text = "\n".join([f"- {ingredient}" for ingredient in ingredients])
            
            prompt = strict_prompt.format(
                ingredients=ingredients_text,
                format_instructions=self.normalization_parser.get_format_instructions()
            )
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            result = self.normalization_parser.parse(response.content)
            
            return result.normalized_ingredients
            
        except Exception as e:
            raise Exception(f"2차 정규화 중 오류 발생: {str(e)}")
    
    def classify_cuisine(self, transcript: str, ingredients: List[str], title: str = "") -> CuisineInfo:
        """
        음식 장르를 분류합니다.
        """
        try:
            ingredients_text = ", ".join(ingredients)
            
            prompt = self.cuisine_prompt.format(
                transcript=transcript[:500],  # 자막이 너무 길면 처음 500자만
                ingredients=ingredients_text,
                title=title or "제목 없음",
                format_instructions=self.cuisine_parser.get_format_instructions()
            )
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            result = self.cuisine_parser.parse(response.content)
            
            # CuisineType enum으로 변환
            try:
                cuisine_type = CuisineType(result.cuisine_type)
            except ValueError:
                # 매칭되지 않는 경우 기타로 설정
                cuisine_type = CuisineType.OTHER
            
            return CuisineInfo(
                cuisine_type=cuisine_type,
                confidence=result.confidence,
                reasoning=result.reasoning
            )
            
        except Exception as e:
            print(f"음식 장르 분류 실패: {e}")
            return CuisineInfo(
                cuisine_type=CuisineType.OTHER,
                confidence=0.0,
                reasoning="분류 실패"
            )
    
    def verify_cuisine_classification(self, cuisine_info: CuisineInfo, transcript: str, ingredients: List[str]) -> CuisineInfo:
        """
        음식 장르 분류를 2차 검증합니다.
        """
        try:
            # 2차 검증을 위한 다른 접근법 사용
            verification_prompt = PromptTemplate.from_template(
                """
                다음은 1차 분류 결과입니다:
                - 분류: {cuisine_type}
                - 신뢰도: {confidence}
                - 근거: {reasoning}

                이 분류가 맞는지 다시 한번 검증해주세요:

                재료 목록: {ingredients}
                자막 일부: {transcript}

                검증 지침:
                1. 1차 분류 결과가 합리적인지 평가하세요
                2. 재료와 조리법을 다시 분석하세요
                3. 확실하지 않으면 신뢰도를 낮추거나 "기타"로 변경하세요
                4. 최종 신뢰도는 보수적으로 평가하세요

                {format_instructions}
                """
            )
            
            ingredients_text = ", ".join(ingredients)
            
            prompt = verification_prompt.format(
                cuisine_type=cuisine_info.cuisine_type.value,
                confidence=cuisine_info.confidence,
                reasoning=cuisine_info.reasoning,
                ingredients=ingredients_text,
                transcript=transcript[:300],  # 더 짧게
                format_instructions=self.cuisine_parser.get_format_instructions()
            )
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            result = self.cuisine_parser.parse(response.content)
            
            # 검증된 결과로 업데이트
            try:
                verified_cuisine_type = CuisineType(result.cuisine_type)
            except ValueError:
                verified_cuisine_type = CuisineType.OTHER
            
            # 2차 검증에서는 신뢰도를 더 보수적으로 설정
            final_confidence = min(result.confidence, cuisine_info.confidence)
            
            return CuisineInfo(
                cuisine_type=verified_cuisine_type,
                confidence=final_confidence,
                reasoning=f"2차 검증: {result.reasoning}"
            )
            
        except Exception as e:
            print(f"음식 장르 2차 검증 실패: {e}")
            # 검증 실패 시 원래 결과 반환하되 신뢰도 낮춤
            return CuisineInfo(
                cuisine_type=cuisine_info.cuisine_type,
                confidence=max(0.3, cuisine_info.confidence - 0.2),
                reasoning=f"검증 실패, 원본: {cuisine_info.reasoning}"
            )
    
    def process_youtube_video(self, youtube_url: str) -> Recipe:
        """
        YouTube 영상을 분석하여 재료를 추출하고 정규화합니다.
        """
        # 데모 모드 확인 (URL에 'demo'가 포함된 경우)
        if "demo" in youtube_url.lower():
            return self._create_demo_recipe(youtube_url)
        
        try:
            # 1. 메타데이터 추출
            try:
                metadata = YouTubeMetadataExtractor.get_video_metadata(youtube_url)
            except Exception as e:
                print(f"메타데이터 추출 실패: {e}")
                metadata = None
            
            # 2. 자막 추출
            transcript = YouTubeTranscriptExtractor.get_transcript(youtube_url)
            if not transcript:
                raise Exception("자막을 추출할 수 없습니다.")
            
            # 3. 재료 추출
            raw_ingredients = self.extract_ingredients_from_transcript(transcript)
            
            # 4. 1차 정규화
            normalized_ingredients = self.normalize_ingredients(raw_ingredients)
            
            # 5. 2차 정규화
            final_ingredients = self.second_pass_normalization(normalized_ingredients)
            
            # 6. Ingredient 객체 생성 - 단순화하여 매핑 오류 방지
            ingredients = []
            for final_ingredient in final_ingredients:
                ingredients.append(Ingredient(
                    name=final_ingredient,
                    original_name=final_ingredient,  # 일단 같은 이름으로 설정
                    normalized_name=final_ingredient,  # 일단 같은 이름으로 설정
                    confidence=0.9
                ))
            
            # 7. 음식 장르 분류
            print("🍽️ 음식 장르 분류 중...")
            cuisine_info = self.classify_cuisine(
                transcript=transcript,
                ingredients=final_ingredients,
                title=metadata.title if metadata else ""
            )
            
            # 8. 음식 장르 2차 검증
            print("🔍 음식 장르 검증 중...")
            verified_cuisine_info = self.verify_cuisine_classification(
                cuisine_info=cuisine_info,
                transcript=transcript,
                ingredients=final_ingredients
            )
            
            # 9. Recipe 객체 생성
            recipe = Recipe(
                youtube_url=youtube_url,
                title=metadata.title if metadata else None,
                metadata=metadata,
                ingredients=ingredients,
                cuisine_info=verified_cuisine_info,
                transcript=transcript,
                processing_status="completed"
            )
            
            return recipe
            
        except Exception as e:
            # 실패한 경우 Recipe 객체 반환
            recipe = Recipe(
                youtube_url=youtube_url,
                processing_status="failed",
                transcript=transcript if 'transcript' in locals() else None
            )
            raise Exception(f"YouTube 영상 처리 중 오류 발생: {str(e)}")
    
    def _create_demo_recipe(self, youtube_url: str) -> Recipe:
        """
        데모용 레시피 생성
        """
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
        
        demo_metadata = YouTubeMetadataExtractor.create_demo_metadata(youtube_url)
        
        # 데모용 음식 장르 정보
        demo_cuisine_info = CuisineInfo(
            cuisine_type=CuisineType.KOREAN,
            confidence=0.95,
            reasoning="김치찌개는 대표적인 한식 요리입니다. 김치, 고춧가루, 참기름 등 한식 특유의 재료들이 사용되었습니다."
        )
        
        return Recipe(
            youtube_url=youtube_url,
            title=demo_metadata.title,
            metadata=demo_metadata,
            ingredients=demo_ingredients,
            cuisine_info=demo_cuisine_info,
            transcript=demo_transcript,
            processing_status="completed"
        )