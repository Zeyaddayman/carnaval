import { Metadata } from "next"

export const generateCategoryProductsMetadata = (categoryName: string): Metadata => {
    return {
        title: `${categoryName} Products`,
        description: `Explore our wide range of ${categoryName} products at Carnaval. Find the best deals and latest trends in ${categoryName}.`,
        openGraph: {
            title: `${categoryName} Products | Carnaval`,
            description: `Explore our wide range of ${categoryName} products at Carnaval.`
        }
    }
}

export const generateBrandProductsMetadata = (brandName: string): Metadata => {
    return {
        title: `${brandName} Products`,
        description: `Discover top-quality products from ${brandName} at Carnaval. Shop the latest collections and exclusive deals on ${brandName} items.`,
        openGraph: {
            title: `${brandName} Products | Carnaval`,
            description: `Discover top-quality products from ${brandName} at Carnaval.`
        }
    }
}