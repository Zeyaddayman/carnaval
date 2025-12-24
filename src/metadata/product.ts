import { ProductDetails } from "@/types/products";
import { formatPrice } from "@/utils/formatters";

export const generateProductMetadata = (product: ProductDetails) => {

    const brandName = product.brand && product.brand.name

    const keywords = [product.title].concat(product.categories.map(category => category.name))

    if (brandName) keywords.push(brandName)

    let description = product.description.length > 150
        ? product.description.slice(0, 147) + '...'
        : product.description

    description += ` Price: ${formatPrice(product.finalPrice)}`

    return {
        title: `${product.title}`,
        description,
        keywords,
        openGraph: {
            title: `${product.title} | Carnaval`,
            description: product.description,
            images: product.images.map(url => ({
                url,
                alt: product.title
            }))
        }
    }
}