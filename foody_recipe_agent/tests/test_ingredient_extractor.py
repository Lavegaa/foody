import pytest
from unittest.mock import Mock, patch
from src.agents.ingredient_extractor import IngredientExtractorAgent
from src.models.recipe import Recipe, Ingredient


class TestIngredientExtractorAgent:
    def setup_method(self):
        """각 테스트 메서드 실행 전에 호출"""
        self.agent = IngredientExtractorAgent()
    
    def test_extract_ingredients_from_transcript(self):
        """자막에서 재료 추출 테스트"""
        # Mock transcript
        mock_transcript = """
        오늘은 간단한 김치찌개를 만들어보겠습니다.
        재료는 김치 200g, 돼지고기 100g, 양파 1개, 대파 1대, 
        마늘 3쪽, 고춧가루 1큰술, 참기름 1큰술이 필요합니다.
        """
        
        # Mock LLM response
        mock_response = Mock()
        mock_response.content = '{"ingredients": ["김치", "돼지고기", "양파", "대파", "마늘", "고춧가루", "참기름"]}'
        
        with patch.object(self.agent.llm, 'invoke', return_value=mock_response):
            result = self.agent.extract_ingredients_from_transcript(mock_transcript)
            
            expected_ingredients = ["김치", "돼지고기", "양파", "대파", "마늘", "고춧가루", "참기름"]
            assert result == expected_ingredients
    
    def test_normalize_ingredients(self):
        """재료 정규화 테스트"""
        # Mock ingredients
        mock_ingredients = ["영파", "적양파", "돼지고기", "고춧가루"]
        
        # Mock LLM response
        mock_response = Mock()
        mock_response.content = '{"normalized_ingredients": ["양파", "양파", "돼지고기", "고춧가루"]}'
        
        with patch.object(self.agent.llm, 'invoke', return_value=mock_response):
            result = self.agent.normalize_ingredients(mock_ingredients)
            
            expected_normalized = ["양파", "양파", "돼지고기", "고춧가루"]
            assert result == expected_normalized
    
    def test_second_pass_normalization(self):
        """2차 정규화 테스트"""
        # Mock ingredients
        mock_ingredients = ["양파", "양파", "돼지고기", "고춧가루"]
        
        # Mock LLM response
        mock_response = Mock()
        mock_response.content = '{"normalized_ingredients": ["양파", "돼지고기", "고춧가루"]}'
        
        with patch.object(self.agent.llm, 'invoke', return_value=mock_response):
            result = self.agent.second_pass_normalization(mock_ingredients)
            
            expected_final = ["양파", "돼지고기", "고춧가루"]
            assert result == expected_final
    
    @patch('src.agents.ingredient_extractor.YouTubeTranscriptExtractor')
    def test_process_youtube_video_success(self, mock_extractor):
        """YouTube 영상 처리 성공 테스트"""
        # Mock transcript extraction
        mock_transcript = "김치찌개 재료: 김치, 돼지고기, 양파"
        mock_extractor.get_transcript.return_value = mock_transcript
        
        # Mock LLM responses
        mock_response1 = Mock()
        mock_response1.content = '{"ingredients": ["김치", "돼지고기", "양파"]}'
        
        mock_response2 = Mock()
        mock_response2.content = '{"normalized_ingredients": ["김치", "돼지고기", "양파"]}'
        
        mock_response3 = Mock()
        mock_response3.content = '{"normalized_ingredients": ["김치", "돼지고기", "양파"]}'
        
        with patch.object(self.agent.llm, 'invoke', side_effect=[mock_response1, mock_response2, mock_response3]):
            result = self.agent.process_youtube_video("https://www.youtube.com/watch?v=test123")
            
            assert isinstance(result, Recipe)
            assert result.processing_status == "completed"
            assert len(result.ingredients) == 3
            assert result.ingredients[0].name == "김치"
            assert result.transcript == mock_transcript
    
    @patch('src.agents.ingredient_extractor.YouTubeTranscriptExtractor')
    def test_process_youtube_video_failure(self, mock_extractor):
        """YouTube 영상 처리 실패 테스트"""
        # Mock transcript extraction failure
        mock_extractor.get_transcript.side_effect = Exception("자막을 가져올 수 없습니다")
        
        with pytest.raises(Exception) as exc_info:
            self.agent.process_youtube_video("https://www.youtube.com/watch?v=test123")
        
        assert "자막을 가져올 수 없습니다" in str(exc_info.value)


if __name__ == "__main__":
    pytest.main([__file__])