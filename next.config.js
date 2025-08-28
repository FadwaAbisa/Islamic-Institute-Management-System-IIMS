/** @type {import('next').NextConfig} */
const nextConfig = {
    // تحسين الأداء
    swcMinify: true,

    // تحسين التجميع
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['exceljs', '@prisma/client'],
    },

    // تحسين الصور
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // تحسين webpack
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.optimization.splitChunks.chunks = 'all';
        }
        return config;
    },
}

module.exports = nextConfig
