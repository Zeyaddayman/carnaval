import { Translation } from "@/types/translation"
import { inject } from "@/utils/translation"
import { Metadata } from "next"

export const getCategoryProductsMetadata = (translation: Translation["metadata"], categoryName: string): Metadata => {
    return {
        title: inject(translation.categoryProducts.title, { categoryName }),
        description: inject(translation.categoryProducts.description, { categoryName }),
        openGraph: {
            title: inject(translation.categoryProducts.openGraph.title, { categoryName }),
            description: inject(translation.categoryProducts.openGraph.description, { categoryName })
        }
    }
}

export const getBrandProductsMetadata = (translation: Translation["metadata"], brandName: string): Metadata => {
    return {
        title: inject(translation.brandProducts.title, { brandName }),
        description: inject(translation.brandProducts.description, { brandName }),
        openGraph: {
            title: inject(translation.brandProducts.openGraph.title, { brandName }),
            description: inject(translation.brandProducts.openGraph.description, { brandName })
        }
    }
}

export const getSearchProductsMetadata = (translation: Translation["metadata"], searchTerm: string, categoryName?: string): Metadata => {
    return {
        title: inject(translation.searchProducts.title, { searchTerm }),
        description: categoryName ? inject(translation.searchProducts.descriptionWithCat, { searchTerm, categoryName }) : inject(translation.searchProducts.description, { searchTerm }),
        openGraph: {
            title: inject(translation.searchProducts.openGraph.title, { searchTerm }),
            description: categoryName ? inject(translation.searchProducts.openGraph.descriptionWithCat, { searchTerm, categoryName }) : inject(translation.searchProducts.openGraph.description, { searchTerm })
        }
    }
}