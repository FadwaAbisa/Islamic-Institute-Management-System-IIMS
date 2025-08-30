/** @type {import('next').NextConfig} */
const nextConfig = {
    // تحسين الأداء
    swcMinify: true,

    // تحسين التجميع
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['exceljs', '@prisma/client'],
    },

    // تحسين الصور مع إعدادات محسنة
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // إعدادات محسنة للصور
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        // إعدادات Error handling
        unoptimized: false,
    },

    // تحسين webpack
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.optimization.splitChunks.chunks = 'all';
        }
        
        // إضافة معالجة أفضل للأخطاء
        config.module.rules.push({
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'static/images/[hash][ext][query]'
            }
        });
        
        return config;
    },

    // تحسين أداء الصفحات
    poweredByHeader: false,
    
    // إعدادات إضافية للإنتاج
    compress: true,
    
    // معالجة أفضل للأخطاء
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
}

module.exports = nextConfig
