import pytest
from unittest.mock import Mock, patch
from src.utils.youtube_transcript import YouTubeTranscriptExtractor


class TestYouTubeTranscriptExtractor:
    def test_extract_video_id_standard_url(self):
        """표준 YouTube URL에서 비디오 ID 추출 테스트"""
        url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        result = YouTubeTranscriptExtractor.extract_video_id(url)
        assert result == "dQw4w9WgXcQ"
    
    def test_extract_video_id_short_url(self):
        """짧은 YouTube URL에서 비디오 ID 추출 테스트"""
        url = "https://youtu.be/dQw4w9WgXcQ"
        result = YouTubeTranscriptExtractor.extract_video_id(url)
        assert result == "dQw4w9WgXcQ"
    
    def test_extract_video_id_embed_url(self):
        """임베드 YouTube URL에서 비디오 ID 추출 테스트"""
        url = "https://www.youtube.com/embed/dQw4w9WgXcQ"
        result = YouTubeTranscriptExtractor.extract_video_id(url)
        assert result == "dQw4w9WgXcQ"
    
    def test_extract_video_id_invalid_url(self):
        """잘못된 URL에서 비디오 ID 추출 테스트"""
        url = "https://example.com/video"
        result = YouTubeTranscriptExtractor.extract_video_id(url)
        assert result is None
    
    @patch('src.utils.youtube_transcript.YouTubeTranscriptApi')
    def test_get_transcript_success(self, mock_api):
        """자막 추출 성공 테스트"""
        # Mock transcript data
        mock_transcript = [
            {'text': '안녕하세요', 'start': 0.0, 'duration': 2.0},
            {'text': '오늘은 김치찌개를', 'start': 2.0, 'duration': 2.0},
            {'text': '만들어보겠습니다', 'start': 4.0, 'duration': 2.0}
        ]
        
        mock_api.get_transcript.return_value = mock_transcript
        
        url = "https://www.youtube.com/watch?v=test123"
        result = YouTubeTranscriptExtractor.get_transcript(url)
        
        expected_text = "안녕하세요 오늘은 김치찌개를 만들어보겠습니다"
        assert result == expected_text
    
    @patch('src.utils.youtube_transcript.YouTubeTranscriptApi')
    def test_get_transcript_fallback_to_english(self, mock_api):
        """한국어 자막 없을 때 영어 자막으로 대체 테스트"""
        # Mock Korean transcript failure, English transcript success
        mock_english_transcript = [
            {'text': 'Hello', 'start': 0.0, 'duration': 2.0},
            {'text': 'Today we will make', 'start': 2.0, 'duration': 2.0},
            {'text': 'kimchi stew', 'start': 4.0, 'duration': 2.0}
        ]
        
        mock_api.get_transcript.side_effect = [
            Exception("Korean transcript not available"),
            mock_english_transcript
        ]
        
        url = "https://www.youtube.com/watch?v=test123"
        result = YouTubeTranscriptExtractor.get_transcript(url)
        
        expected_text = "Hello Today we will make kimchi stew"
        assert result == expected_text
    
    @patch('src.utils.youtube_transcript.YouTubeTranscriptApi')
    def test_get_transcript_failure(self, mock_api):
        """자막 추출 실패 테스트"""
        mock_api.get_transcript.side_effect = Exception("No transcript available")
        
        url = "https://www.youtube.com/watch?v=test123"
        
        with pytest.raises(Exception) as exc_info:
            YouTubeTranscriptExtractor.get_transcript(url)
        
        assert "자막을 가져올 수 없습니다" in str(exc_info.value)
    
    def test_get_transcript_invalid_url(self):
        """잘못된 URL로 자막 추출 시도 테스트"""
        url = "https://example.com/video"
        
        with pytest.raises(ValueError) as exc_info:
            YouTubeTranscriptExtractor.get_transcript(url)
        
        assert "유효하지 않은 YouTube URL입니다" in str(exc_info.value)
    
    @patch('src.utils.youtube_transcript.YouTubeTranscriptApi')
    def test_get_available_languages(self, mock_api):
        """사용 가능한 언어 목록 가져오기 테스트"""
        # Mock transcript list
        mock_transcript_ko = Mock()
        mock_transcript_ko.language_code = "ko"
        
        mock_transcript_en = Mock()
        mock_transcript_en.language_code = "en"
        
        mock_api.list_transcripts.return_value = [mock_transcript_ko, mock_transcript_en]
        
        url = "https://www.youtube.com/watch?v=test123"
        result = YouTubeTranscriptExtractor.get_available_languages(url)
        
        assert result == ["ko", "en"]


if __name__ == "__main__":
    pytest.main([__file__])