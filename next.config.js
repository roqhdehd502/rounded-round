/** @type {import('next').NextConfig} */


const debug = process.env.NODE_ENV !== "production";
const repository = "https://roqhdehd502.github.io/rounded-round";

const nextConfig = {
    images: {
        unoptimized: true,
        domains: [
            'localhost',
            'roqhdehd502.github.io/rounded-round',
            'firebasestorage.googleapis.com',
            'img.hiphople.com',
            'upload.wikimedia.org',
            'image.bugsm.co.kr',
        ]
    },
    reactStrictMode: false,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    assetPrefix: !debug ? `/${repository}/` : "",
}

module.exports = nextConfig
