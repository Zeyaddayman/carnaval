import { ProductsFiltersOptions } from "@/types/products"

export const PRODUCTS_SORT_OPTIONS = [
    { value: "alphabetical", label: "Alphabetical" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "top-rated", label: "Top Rated" },
    { value: "top-discount", label: "Top Discount" }
] as const

export const PRODUCTS_FILTERS: ProductsFiltersOptions = {
    minPrice: 0,
    maxPrice: 999999,
    minRating: 1,
    maxRating: 5,
    onlyOnSale: false
}