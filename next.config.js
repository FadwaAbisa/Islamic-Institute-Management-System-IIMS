/** @type {import('next').NextConfig} */
const nextConfig = {
    // تحديد أن الصفحات في src/app
    distDir: '.next',
    // إعدادات إضافية
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = nextConfig
