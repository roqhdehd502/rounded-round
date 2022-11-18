/** @type {import('next').NextConfig} */


const debug = process.env.NODE_ENV !== "production";
const productionURL = "https://roqhdehd502.github.io/rounded-round";

const nextConfig = {
    // basePath: '/rounded-round',
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
    poweredByHeader: process.env.NODE_ENV === "development",
    reactStrictMode: false,
    swcMinify: true,
    eslint: { ignoreDuringBuilds: true },
    assetPrefix: !debug ? `${productionURL}` : ``,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = nextConfig
