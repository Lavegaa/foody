from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
import uvicorn
from typing import Dict, Any

from models import IngredientExtractionRequest, IngredientExtractionResponse, Recipe
from agents import IngredientExtractorAgent

app = FastAPI(
    title="Foody Recipe Agent",
    description="YouTube 레시피 영상에서 재료를 추출하는 AI 에이전트",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용 - 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI 에이전트 인스턴스
agent = IngredientExtractorAgent()


@app.get("/")
async def root():
    return {"message": "Foody Recipe Agent API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}


@app.post("/extract-ingredients", response_model=IngredientExtractionResponse)
async def extract_ingredients(request: IngredientExtractionRequest):
    """
    YouTube 영상에서 재료를 추출합니다.
    """
    try:
        # 유튜브 URL 유효성 검사
        if not str(request.youtube_url).startswith(('https://www.youtube.com/', 'https://youtu.be/')):
            raise HTTPException(
                status_code=400,
                detail="유효한 YouTube URL을 입력해주세요."
            )
        
        # 재료 추출 처리
        recipe = agent.process_youtube_video(str(request.youtube_url))
        
        return IngredientExtractionResponse(
            success=True,
            recipe=recipe
        )
        
    except ValidationError as e:
        raise HTTPException(
            status_code=400,
            detail=f"입력 데이터 검증 오류: {str(e)}"
        )
    except Exception as e:
        error_message = str(e) if e else "알 수 없는 오류가 발생했습니다."
        return IngredientExtractionResponse(
            success=False,
            recipe=None,
            error=error_message
        )


@app.get("/video-info")
async def get_video_info(youtube_url: str):
    """
    YouTube 영상의 기본 정보를 가져옵니다.
    """
    try:
        from utils.youtube_metadata import YouTubeMetadataExtractor
        
        # 비디오 정보와 메타데이터 함께 가져오기
        video_info = YouTubeMetadataExtractor.get_video_info_with_metadata(youtube_url)
        
        if "error" in video_info:
            raise HTTPException(
                status_code=400,
                detail=video_info["error"]
            )
        
        return video_info
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"비디오 정보를 가져오는 중 오류 발생: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )