import { PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { Prisma } from "@/generated/prisma"
import { cardProductSelector, productDetailsSelector } from "@/server/query-selectors/product"

export type ProductDetails = Prisma.ProductGetPayload<{
    select: typeof productDetailsSelector
}>

export type CardProduct = Prisma.ProductGetPayload<{
    select: typeof cardProductSelector
}>

export type ProductsSortOptionValue = typeof PRODUCTS_SORT_OPTIONS[number]["value"]
export type ProductsSortOption = typeof PRODUCTS_SORT_OPTIONS[number]

export interface ProductsFiltersOptions {
    minPrice: number,
    maxPrice: number,
    minRating: number,
    onlyOnSale: boolean
}