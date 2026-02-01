import { PRODUCTS_FILTERS } from "@/constants/products"

export const getValidatedFilters = (searchParams: Record<string, string | undefined>) => {

    const {
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale

    } = searchParams

    const filters = { ...PRODUCTS_FILTERS }
    
    if (minRating) filters.minRating = Math.max(1, Number(minRating))

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    if (minPrice && !isNaN(Number(minPrice))) filters.minPrice = Math.max(0, Number(minPrice))

    if (maxPrice && !isNaN(Number(maxPrice))) filters.maxPrice = Math.max(0, Number(maxPrice))

    return filters
}