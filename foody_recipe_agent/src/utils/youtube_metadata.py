import requests
from typing import Optional
from models.recipe import VideoMetadata
from .youtube_transcript import YouTubeTranscriptExtractor


class YouTubeMetadataExtractor:
    @staticmethod
    def get_video_metadata(youtube_url: str) -> Optional[VideoMetadata]:
        """
        YouTube oEmbed API를 사용하여 영상 메타데이터를 가져옵니다.
        """
        try:
            # 비디오 ID 추출
            video_id = YouTubeTranscriptExtractor.extract_video_id(youtube_url)
            if not video_id:
                raise ValueError("유효하지 않은 YouTube URL입니다.")
            
            # oEmbed API 호출
            oembed_url = f"https://www.youtube.com/oembed?url={youtube_url}&format=json"
            
            response = requests.get(oembed_url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # VideoMetadata 객체 생성
            metadata = VideoMetadata(
                title=data.get("title"),
                author_name=data.get("author_name"),
                author_url=data.get("author_url"),
                thumbnail_url=data.get("thumbnail_url"),
                thumbnail_width=data.get("thumbnail_width"),
                thumbnail_height=data.get("thumbnail_height"),
                provider_name=data.get("provider_name", "YouTube"),
                provider_url=data.get("provider_url", "https://www.youtube.com/"),
                video_id=video_id
            )
            
            return metadata
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"YouTube 메타데이터를 가져올 수 없습니다: {str(e)}")
        except Exception as e:
            raise Exception(f"메타데이터 처리 중 오류 발생: {str(e)}")
    
    @staticmethod
    def get_video_info_with_metadata(youtube_url: str) -> dict:
        """
        비디오 정보와 메타데이터를 함께 가져옵니다.
        """
        try:
            # 데모 모드 확인
            if "demo" in youtube_url.lower():
                demo_metadata = YouTubeMetadataExtractor.create_demo_metadata(youtube_url)
                return {
                    "video_id": demo_metadata.video_id,
                    "available_languages": ["ko", "en"],
                    "transcript_available": True,
                    "metadata": demo_metadata.dict()
                }
            
            # 기본 정보
            video_id = YouTubeTranscriptExtractor.extract_video_id(youtube_url)
            if not video_id:
                raise ValueError("유효하지 않은 YouTube URL입니다.")
            
            # 자막 언어 정보
            try:
                languages = YouTubeTranscriptExtractor.get_available_languages(youtube_url)
                transcript_available = len(languages) > 0
            except Exception:
                languages = []
                transcript_available = False
            
            # 메타데이터
            try:
                metadata = YouTubeMetadataExtractor.get_video_metadata(youtube_url)
                metadata_dict = metadata.dict() if metadata else None
            except Exception as e:
                metadata_dict = {"error": str(e)}
            
            return {
                "video_id": video_id,
                "available_languages": languages,
                "transcript_available": transcript_available,
                "metadata": metadata_dict
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    @staticmethod
    def create_demo_metadata(youtube_url: str) -> VideoMetadata:
        """
        데모용 메타데이터 생성
        """
        return VideoMetadata(
            title="김치찌개 만들기 - 초간단 레시피",
            author_name="쿠킹클래스",
            author_url="https://www.youtube.com/channel/demo123",
            thumbnail_url="https://i.ytimg.com/vi/demo123/maxresdefault.jpg",
            thumbnail_width=1280,
            thumbnail_height=720,
            provider_name="YouTube",
            provider_url="https://www.youtube.com/",
            video_id="demo123"
        )