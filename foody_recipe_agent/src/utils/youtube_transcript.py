from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi
import re
import time
import random


class YouTubeTranscriptExtractor:
    @staticmethod
    def extract_video_id(youtube_url: str) -> Optional[str]:
        """
        YouTube URL에서 비디오 ID를 추출합니다.
        """
        patterns = [
            r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})",
            r"(?:https?://)?(?:www\.)?youtu\.be/([a-zA-Z0-9_-]{11})",
            r"(?:https?://)?(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, youtube_url)
            if match:
                return match.group(1)
        
        return None
    
    @staticmethod
    def get_transcript(youtube_url: str, language: str = "ko", max_retries: int = 1) -> Optional[str]:
        """
        YouTube 비디오의 자막을 추출합니다. (재시도 로직 포함)
        """
        video_id = YouTubeTranscriptExtractor.extract_video_id(youtube_url)
        if not video_id:
            raise ValueError("유효하지 않은 YouTube URL입니다.")
        
        for attempt in range(max_retries):
            try:
                # 재시도 시 간단한 지연만
                if attempt > 0:
                    print(f"🔄 재시도 중... ({attempt + 1}/{max_retries})")
                    time.sleep(2)  # 간단한 2초 지연
                
                # 사용 가능한 자막 언어 먼저 확인
                transcript_list_obj = YouTubeTranscriptApi.list_transcripts(video_id)
                available_languages = [t.language_code for t in transcript_list_obj]
                
                # 언어 우선순위: 요청된 언어 -> 한국어 -> 영어 -> 첫 번째 언어
                target_language = None
                
                if language in available_languages:
                    target_language = language
                elif "ko" in available_languages:
                    target_language = "ko"
                elif "en" in available_languages:
                    target_language = "en"
                elif available_languages:
                    target_language = available_languages[0]
                else:
                    raise Exception("사용 가능한 자막이 없습니다.")
                
                # 자막 가져오기
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=[target_language])
                
                # 자막 텍스트 결합
                transcript_text = " ".join([entry['text'] for entry in transcript_list])
                return transcript_text
                
            except Exception as e:
                error_str = str(e)
                
                # YouTube IP 차단 감지 - 즉시 중단
                if "blocking requests from your IP" in error_str:
                    raise Exception("YouTube에서 현재 IP를 차단했습니다. 다른 네트워크(핫스팟 등)를 사용해주세요. 시간 대기로는 해결되지 않습니다.")
                
                # 자막 없음
                elif "No transcripts were found" in error_str:
                    raise Exception("이 영상에는 자막이 없습니다. 자막이 있는 다른 영상을 시도해주세요.")
                
                # 기타 오류 - 마지막 시도가 아니면 재시도
                elif attempt < max_retries - 1:
                    print(f"❌ 시도 {attempt + 1} 실패: {error_str[:100]}...")
                    continue
                else:
                    raise Exception(f"자막을 가져올 수 없습니다: {error_str}")
        
        raise Exception(f"{max_retries}번 시도 후에도 자막을 가져올 수 없습니다.")
    
    @staticmethod
    def get_available_languages(youtube_url: str) -> list:
        """
        사용 가능한 자막 언어 목록을 가져옵니다.
        """
        video_id = YouTubeTranscriptExtractor.extract_video_id(youtube_url)
        if not video_id:
            raise ValueError("유효하지 않은 YouTube URL입니다.")
        
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            languages = []
            for transcript in transcript_list:
                languages.append(transcript.language_code)
            return languages
        except Exception as e:
            raise Exception(f"자막 언어 목록을 가져올 수 없습니다: {str(e)}")