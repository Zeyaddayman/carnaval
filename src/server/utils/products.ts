import { PRODUCTS_MAX_RATING } from "@/constants/products";
import { Prisma } from "@/generated/prisma";
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products";

export function buildProductsFilters(filters: ProductsFiltersOptions) {

    let whereOptions: Prisma.ProductWhereInput = { 
        stock: { gt: 0 },
        finalPrice: {
            gte: filters.minPrice,
            lte: filters.maxPrice
        },
        rating: {
            gte: filters.minRating,
            lte: PRODUCTS_MAX_RATING
        }
    }

    if (filters.onlyOnSale) {
        whereOptions.discountPercentage = { not: null, gt: 0 }
    }

    return whereOptions
}

export function buildProductsSort(sortBy: ProductsSortOptionValue) {

    let orderByOptions: Prisma.ProductOrderByWithRelationInput = {}

    switch (sortBy) {
        case "alphabetical":
            orderByOptions = { title: "asc" }
            break
        case "price-asc":
            orderByOptions = { finalPrice: "asc" }
            break
        case "price-desc":
            orderByOptions = { finalPrice: "desc" }
            break
        case "top-rated":
            orderByOptions = { rating: "desc" }
            break
        case "top-discount":
            orderByOptions = { discountPercentage: { sort: "desc", nulls: "last" } }
            break
        default:
            orderByOptions = { title: "asc" }
    }

    return orderByOptions
}