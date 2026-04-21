import { ProductDetails } from "@/types/products";
import { Translation } from "@/types/translation";
import { formatPrice } from "@/utils/formatters";
import { inject } from "@/utils/translation";
import { Metadata } from "next";

export const getProductMetadata = (translation: Translation["metadata"], product: ProductDetails): Metadata => {

    const brandName = product.brand && product.brand.name

    const keywords = [product.title].concat(product.categories.map(category => category.name))

    if (brandName) keywords.push(brandName)

    let description = product.description.length > 150
        ? product.description.slice(0, 147) + '...'
        : product.description

    description += ` ${inject(translation.product.price, { price: formatPrice(product.finalPrice) })}`

    return {
        title: product.title,
        description,
        keywords,
        openGraph: {
            title: inject(translation.product.openGraph.title, { productTitle: product.title }),
            description,
            images: product.images.map(url => ({
                url,
                alt: product.title
            }))
        }
    }
}