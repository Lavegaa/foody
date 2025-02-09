/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      // 추가로 필요한 이미지 도메인이 있다면 여기에 추가
    ],
  },
}

module.exports = nextConfig 