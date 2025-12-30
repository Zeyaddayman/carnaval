import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: [
                '/',
                '/product/',
                '/categories/',
                '/brands/'
            ],
            disallow: [
                '/auth/',
                '/checkout',
                '/cart',
                '/wishlist',
                '/profile',
                '/api/'
            ]
        }
    }
}