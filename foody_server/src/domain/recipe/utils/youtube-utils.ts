/**
 * YouTube URL에서 video_id를 추출하는 유틸리티 함수
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // YouTube URL 패턴들
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * 두 YouTube URL이 같은 영상인지 비교
 */
export function isSameYouTubeVideo(url1: string, url2: string): boolean {
  const videoId1 = extractYouTubeVideoId(url1);
  const videoId2 = extractYouTubeVideoId(url2);
  
  return videoId1 !== null && videoId2 !== null && videoId1 === videoId2;
}