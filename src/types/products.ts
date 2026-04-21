import { getProductsSortOptions } from "@/constants/products"
import { Prisma } from "@/generated/prisma"
import { cardProductSelector, productDetailsSelector } from "@/server/query-selectors/product"

export type ProductDetails = Prisma.ProductGetPayload<{
    select: typeof productDetailsSelector
}>

export type CardProduct = Prisma.ProductGetPayload<{
    select: typeof cardProductSelector
}>

export type ProductsSortOption = ReturnType<typeof getProductsSortOptions>[number]
export type ProductsSortOptionValue = ProductsSortOption["value"]

export interface ProductsFiltersOptions {
    minPrice: number
    maxPrice: number
    minRating: number
    onlyOnSale: boolean
}