import requests
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import logging

from models.recipe import Recipe

load_dotenv()

logger = logging.getLogger(__name__)


class ApiClient:
    def __init__(self, base_url: str = None, auth_token: str = None):
        self.base_url = base_url or os.getenv("API_SERVER_URL", "http://localhost:4000")
        self.auth_token = auth_token or os.getenv("API_AUTH_TOKEN")
        self.session = requests.Session()
        
        # 기본 헤더 설정
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
        
        # 인증 토큰이 있으면 헤더에 추가
        if self.auth_token:
            self.session.headers.update({
                "Authorization": f"Bearer {self.auth_token}"
            })

    def send_recipe_to_api(self, recipe: Recipe, user_id: str = None) -> Dict[str, Any]:
        """
        분석 완료된 레시피를 API 서버로 전송합니다.
        
        Args:
            recipe: 분석 완료된 Recipe 객체
            user_id: 사용자 ID (옵션)
            
        Returns:
            API 서버 응답
        """
        try:
            # Recipe 객체를 API 서버가 요구하는 형태로 변환
            recipe_data = {
                "youtube_url": str(recipe.youtube_url),
                "title": recipe.title,
                "metadata": {
                    "title": recipe.metadata.title if recipe.metadata else None,
                    "author_name": recipe.metadata.author_name if recipe.metadata else None,
                    "author_url": recipe.metadata.author_url if recipe.metadata else None,
                    "thumbnail_url": recipe.metadata.thumbnail_url if recipe.metadata else None,
                    "video_id": recipe.metadata.video_id if recipe.metadata else None,
                } if recipe.metadata else None,
                "ingredients": [
                    {
                        "name": ingredient.name,
                        "original_name": ingredient.original_name,
                        "normalized_name": ingredient.normalized_name,
                        "confidence": ingredient.confidence
                    }
                    for ingredient in recipe.ingredients
                ],
                "cuisine_info": {
                    "cuisine_type": recipe.cuisine_info.cuisine_type.value,
                    "confidence": recipe.cuisine_info.confidence,
                    "reasoning": recipe.cuisine_info.reasoning
                } if recipe.cuisine_info else None,
                "transcript": recipe.transcript,
                "processing_status": recipe.processing_status
            }
            
            # API 서버로 POST 요청 (Agent 전용 endpoint)
            url = f"{self.base_url}/v1/recipes/from-agent"
            
            logger.info(f"Sending recipe to API server: {url}")
            logger.debug(f"Recipe data: {recipe_data}")
            
            response = self.session.post(url, json=recipe_data)
            
            # 응답 확인
            if response.status_code == 200 or response.status_code == 201:
                logger.info(f"Successfully sent recipe to API server: {recipe.title}")
                return {
                    "success": True,
                    "data": response.json(),
                    "status_code": response.status_code
                }
            else:
                logger.error(f"Failed to send recipe to API server: {response.status_code}")
                logger.error(f"Response: {response.text}")
                return {
                    "success": False,
                    "error": f"API server returned {response.status_code}",
                    "response": response.text,
                    "status_code": response.status_code
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error sending recipe to API server: {e}")
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Unexpected error sending recipe to API server: {e}")
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }

    def test_connection(self) -> bool:
        """
        API 서버와의 연결을 테스트합니다.
        
        Returns:
            연결 성공 여부
        """
        try:
            # 헬스체크 또는 간단한 GET 요청
            url = f"{self.base_url}/health"  # 헬스체크 엔드포인트가 있다면
            response = self.session.get(url, timeout=5)
            return response.status_code == 200
        except:
            # 헬스체크 엔드포인트가 없다면 기본 경로로 테스트
            try:
                url = f"{self.base_url}/"
                response = self.session.get(url, timeout=5)
                return response.status_code < 500  # 4xx도 연결은 성공
            except:
                return False