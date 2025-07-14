#!/usr/bin/env python3
"""
YouTube 메타데이터 기능 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from utils.youtube_metadata import YouTubeMetadataExtractor


def test_oembed_api():
    """YouTube oEmbed API 테스트"""
    print("🔍 YouTube oEmbed API 테스트")
    print("-" * 40)
    
    test_urls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # 일반 영상
        "https://www.youtube.com/watch?v=demo123",      # 데모 URL
    ]
    
    for url in test_urls:
        try:
            print(f"📺 URL: {url}")
            
            if "demo" in url.lower():
                print("🎭 데모 모드 감지")
                metadata = YouTubeMetadataExtractor.create_demo_metadata(url)
            else:
                metadata = YouTubeMetadataExtractor.get_video_metadata(url)
            
            if metadata:
                print(f"✅ 제목: {metadata.title}")
                print(f"✅ 채널: {metadata.author_name}")
                print(f"✅ 채널 URL: {metadata.author_url}")
                print(f"✅ 썸네일: {metadata.thumbnail_url}")
                print(f"✅ 비디오 ID: {metadata.video_id}")
            else:
                print("❌ 메타데이터를 가져올 수 없습니다")
                
        except Exception as e:
            print(f"❌ 오류: {e}")
        
        print()


def test_video_info_with_metadata():
    """비디오 정보와 메타데이터 통합 테스트"""
    print("📊 비디오 정보 + 메타데이터 통합 테스트")
    print("-" * 40)
    
    test_urls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=demo123",
    ]
    
    for url in test_urls:
        try:
            print(f"📺 URL: {url}")
            
            video_info = YouTubeMetadataExtractor.get_video_info_with_metadata(url)
            
            if "error" in video_info:
                print(f"❌ 오류: {video_info['error']}")
            else:
                print(f"✅ 비디오 ID: {video_info.get('video_id')}")
                print(f"✅ 자막 사용 가능: {video_info.get('transcript_available')}")
                print(f"✅ 사용 가능한 언어: {video_info.get('available_languages')}")
                
                metadata = video_info.get('metadata')
                if metadata and not metadata.get('error'):
                    print(f"✅ 메타데이터 제목: {metadata.get('title')}")
                    print(f"✅ 메타데이터 채널: {metadata.get('author_name')}")
                else:
                    print(f"⚠️ 메타데이터 오류: {metadata.get('error') if metadata else 'None'}")
                    
        except Exception as e:
            print(f"❌ 예외 발생: {e}")
        
        print()


def main():
    """메인 테스트 함수"""
    print("🧪 YouTube 메타데이터 기능 테스트")
    print("=" * 50)
    
    # 1. oEmbed API 테스트
    test_oembed_api()
    
    # 2. 통합 정보 테스트
    test_video_info_with_metadata()
    
    print("🏁 테스트 완료!")


if __name__ == "__main__":
    main()