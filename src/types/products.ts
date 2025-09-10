import { PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { Prisma } from "@/generated/prisma"

export type CardProduct = Prisma.ProductGetPayload<{
    select: {
        id: true,
        title: true,
        thumbnail: true,
        price: true,
        discountPercentage: true,
        rating: true,
        brand: {
            select: {
                name: true
            }
        }
    }
}>

export type ProductsSortOptionValue = typeof PRODUCTS_SORT_OPTIONS[number]["value"]
export type ProductsSortOption = typeof PRODUCTS_SORT_OPTIONS[number]

export interface ProductsFiltersOptions {
    minPrice: number,
    maxPrice: number,
    minRating: number,
    onlyOnSale: boolean
}