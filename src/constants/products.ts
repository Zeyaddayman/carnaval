import { ProductsFiltersOptions } from "@/types/products"
import { Translation } from "@/types/translation"

export const getProductsSortOptions = (translation: Translation["products"]["sortOptions"]) => {
    return [
        { value: "alphabetical", label: translation.alphabetical },
        { value: "price-asc", label: translation.priceAsc },
        { value: "price-desc", label: translation.priceDesc },
        { value: "top-rated", label: translation.topRated },
        { value: "top-discount", label: translation.topDiscount }
    ] as const
}

export const PRODUCTS_MIN_RATING = 1
export const PRODUCTS_MAX_RATING = 5

export const PRODUCTS_FILTERS: ProductsFiltersOptions = {
    minPrice: 0,
    maxPrice: 999999,
    minRating: PRODUCTS_MIN_RATING,
    onlyOnSale: false
}

export const PROUDCTS_PAGE_LIMIT = 6