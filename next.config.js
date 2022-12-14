/** @type {import('next').NextConfig} */


const debug = process.env.NODE_ENV !== "production";
const productionURL = "https://roqhdehd502.github.io/rounded-round";

const nextConfig = {
    basePath: !debug ? `/rounded-round` : ``,
    // async rewrites() {
    //   return [
    //     {
    //       source: "/:path*",
    //       destination: `${process.env.NEXT_PUBLIC_IAMPORT_REQUEST_BASE_URL}/:path*`
    //     },
    //     {
    //       source: "/:path*",
    //       destination: `https://code.jquery.com/:path*`
    //     },
    //     {
    //       source: "/:path*",
    //       destination: `https://cdn.iamport.kr/:path*`
    //     },
    //   ];
    // },
    images: {
        unoptimized: true,
        domains: [
            'firebasestorage.googleapis.com',
            'img.hiphople.com',
            'upload.wikimedia.org',
            'image.bugsm.co.kr',
            'primefaces.org',
        ],
        formats: ['image/avif', 'image/webp'],
    },
    reactStrictMode: false,
    swcMinify: true,
    eslint: { ignoreDuringBuilds: true },
    assetPrefix: !debug ? `${productionURL}` : ``,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = nextConfig
