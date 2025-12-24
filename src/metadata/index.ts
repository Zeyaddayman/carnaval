import { Metadata } from "next";

export const mainMetadata: Metadata = {
    title: {
        default: 'Carnaval | Your Ultimate Shopping Destination',
        template: '%s | Carnaval'
    },
    description: 'Discover many products across multiple categories at Carnaval - Your one-stop e-commerce destination for all you need!',
    category: 'E-commerce',
    keywords: ['ecommerce', 'shop', 'buy', 'online store', 'products', 'shopping', 'deals', 'discounts', 'fashion', 'electronics', 'home goods', 'carnaval'],
    openGraph: {
        title: 'Carnaval | Your Ultimate Shopping Destination',
        description: 'Discover many products across multiple categories at Carnaval - Your one-stop e-commerce destination for all you need!',
        siteName: 'Carnaval',
        locale: 'en_US',
        type: 'website'
    }
}