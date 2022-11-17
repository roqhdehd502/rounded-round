/** @type {import('next').NextConfig} */


const debug = process.env.NODE_ENV !== "production";
const repository = "https://roqhdehd502.github.io/rounded-round";

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    assetPrefix: !debug ? `/${repository}/` : "",
    images: {
        domains: [
            'localhost:3000',
            'roqhdehd502.github.io/rounded-round',
            'firebasestorage.googleapis.com',
            'img.hiphople.com',
            'upload.wikimedia.org',
            'image.bugsm.co.kr',
        ]
    },
}

module.exports = nextConfig
