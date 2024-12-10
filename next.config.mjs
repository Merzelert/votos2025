/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.encancha.cl',
                port: '',
                pathname: '/resizer/**',
            },
            {
                protocol: 'https',
                hostname: 'cloudfront-us-east-1.images.arcpublishing.com',
                port: '',
                pathname: '/metroworldnews/**',
            },
            // Agrega aquí otros dominios según necesites
        ],
    },
}

export default nextConfig 