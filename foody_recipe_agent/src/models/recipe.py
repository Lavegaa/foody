from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from enum import Enum


class CuisineType(str, Enum):
    KOREAN = "한식"
    CHINESE = "중식"
    JAPANESE = "일식"
    WESTERN = "양식"
    ITALIAN = "이탈리안"
    THAI = "태국식"
    VIETNAMESE = "베트남식"
    INDIAN = "인도식"
    MEXICAN = "멕시코식"
    FUSION = "퓨전"
    BAKING = "베이킹"
    DESSERT = "디저트"
    OTHER = "기타"


class Ingredient(BaseModel):
    name: str
    original_name: Optional[str] = None
    normalized_name: Optional[str] = None
    confidence: float = 1.0


class CuisineInfo(BaseModel):
    cuisine_type: CuisineType = CuisineType.OTHER
    confidence: float = 1.0
    reasoning: Optional[str] = None


class VideoMetadata(BaseModel):
    title: Optional[str] = None
    author_name: Optional[str] = None
    author_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    thumbnail_width: Optional[int] = None
    thumbnail_height: Optional[int] = None
    provider_name: str = "YouTube"
    provider_url: str = "https://www.youtube.com/"
    video_id: Optional[str] = None


class Recipe(BaseModel):
    youtube_url: HttpUrl
    title: Optional[str] = None
    metadata: Optional[VideoMetadata] = None
    ingredients: List[Ingredient] = []
    cuisine_info: Optional[CuisineInfo] = None
    transcript: Optional[str] = None
    processing_status: str = "pending"  # pending, processing, completed, failed
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class IngredientExtractionRequest(BaseModel):
    youtube_url: HttpUrl


class IngredientExtractionResponse(BaseModel):
    success: bool
    recipe: Optional[Recipe] = None
    error: Optional[str] = None