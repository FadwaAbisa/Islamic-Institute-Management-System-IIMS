/** @type {import('next').NextConfig} */
const nextConfig = {
    // تحديد أن الصفحات في src/app
    distDir: '.next',
    // إعدادات إضافية
    reactStrictMode: true,
    swcMinify: true,
    
    // تكوين الصور
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dummyimage.com',
                port: '',
                pathname: '/**',
            },
        ],
        // السماح بالصور المحلية
        domains: ['localhost'],
    },
}

module.exports = nextConfig
