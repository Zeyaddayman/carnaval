import { ProductsFiltersOptions } from "@/types/products"

export const PRODUCTS_SORT_OPTIONS = [
    { value: "alphabetical", label: "Alphabetical" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "top-rated", label: "Top Rated" },
    { value: "top-discount", label: "Top Discount" }
] as const

export const DEFAULT_SORT_OPTION = PRODUCTS_SORT_OPTIONS[0]

export const PRODUCTS_MIN_RATING = 1
export const PRODUCTS_MAX_RATING = 5

export const PRODUCTS_FILTERS: ProductsFiltersOptions = {
    minPrice: 0,
    maxPrice: 999999,
    minRating: PRODUCTS_MIN_RATING,
    onlyOnSale: false
}

export const PROUDCTS_PAGE_LIMIT = 6