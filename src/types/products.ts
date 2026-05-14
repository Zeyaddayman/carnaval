import { getProductsSortOptions } from "@/constants/products"
import { BrandTranslation, Prisma, ProductTranslation } from "@/generated/prisma"
import { cardProductSelector, productDetailsSelector } from "@/server/query-selectors/product"
import { Prettify } from "."

export type ProductDetails = Prettify<Omit<Prisma.ProductGetPayload<{
    select: ReturnType<typeof productDetailsSelector>
}>, "translation" | "brand" | "categories"> & {
    title: ProductTranslation["title"],
    description: ProductTranslation["description"],
    brand: { name: BrandTranslation["name"] } | null
}>

export type CardProduct = Prettify<Omit<Prisma.ProductGetPayload<{
    select: ReturnType<typeof cardProductSelector>
}>, "translation" | "brand"> & {
    title: ProductTranslation["title"],
    brand: { name: BrandTranslation["name"] } | null
}>

export type CartItemProduct = CardProduct
export type WishlistItemProduct = CardProduct

export type ProductsSortOption = ReturnType<typeof getProductsSortOptions>[number]
export type ProductsSortOptionValue = ProductsSortOption["value"]

export interface ProductsFiltersOptions {
    minPrice: number
    maxPrice: number
    minRating: number
    onlyOnSale: boolean
}