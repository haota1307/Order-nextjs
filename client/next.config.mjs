import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin()
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
