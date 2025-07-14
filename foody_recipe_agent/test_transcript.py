#!/usr/bin/env python3
"""
YouTube transcript 기능 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from utils.youtube_transcript import YouTubeTranscriptExtractor

def test_video_id_extraction():
    """비디오 ID 추출 테스트"""
    print("🔍 비디오 ID 추출 테스트")
    print("-" * 40)
    
    test_urls = [
        "https://www.youtube.com/watch?v=orWUD7jAYig",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://youtu.be/dQw4w9WgXcQ",
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=invalid_url"
    ]
    
    for url in test_urls:
        try:
            video_id = YouTubeTranscriptExtractor.extract_video_id(url)
            print(f"✅ {url} -> {video_id}")
        except Exception as e:
            print(f"❌ {url} -> 오류: {e}")
    
    print()

def test_available_languages():
    """사용 가능한 언어 확인"""
    print("🌍 사용 가능한 언어 확인")
    print("-" * 40)
    
    # 한국 요리 영상 예시 (실제로 존재하는 영상)
    test_urls = [
        "https://www.youtube.com/watch?v=orWUD7jAYig",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # 일반 영상
        "https://youtu.be/kOHB85vDuow",  # 한국 요리 영상 예시
    ]
    
    for url in test_urls:
        try:
            print(f"📺 URL: {url}")
            languages = YouTubeTranscriptExtractor.get_available_languages(url)
            print(f"✅ 사용 가능한 언어: {languages}")
        except Exception as e:
            print(f"❌ 오류: {e}")
        print()

def test_transcript_extraction():
    """자막 추출 테스트"""
    print("📝 자막 추출 테스트")
    print("-" * 40)
    
    # 테스트할 YouTube URL (실제 존재하는 한국 요리 영상)
    test_urls = [
        'https://www.youtube.com/watch?v=orWUD7jAYig',
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # 영어 자막
        "https://youtu.be/kOHB85vDuow",  # 한국 요리 영상
    ]
    
    for url in test_urls:
        try:
            print(f"📺 URL: {url}")
            
            # 한국어 자막 시도
            try:
                transcript = YouTubeTranscriptExtractor.get_transcript(url, language="ko")
                print(f"✅ 한국어 자막 길이: {len(transcript)} 문자")
                print(f"📄 자막 미리보기: {transcript[:200]}...")
            except Exception as e:
                print(f"⚠️ 한국어 자막 실패: {e}")
                
                # 영어 자막 시도
                try:
                    transcript = YouTubeTranscriptExtractor.get_transcript(url, language="en")
                    print(f"✅ 영어 자막 길이: {len(transcript)} 문자")
                    print(f"📄 자막 미리보기: {transcript[:200]}...")
                except Exception as e:
                    print(f"❌ 영어 자막도 실패: {e}")
                    
        except Exception as e:
            print(f"❌ 전체 오류: {e}")
        print()

def main():
    """메인 테스트 함수"""
    print("🧪 YouTube Transcript 기능 테스트")
    print("=" * 50)
    
    # 1. 비디오 ID 추출 테스트
    test_video_id_extraction()
    
    # 2. 사용 가능한 언어 확인
    test_available_languages()
    
    # 3. 자막 추출 테스트
    test_transcript_extraction()
    
    print("🏁 테스트 완료!")

if __name__ == "__main__":
    main()