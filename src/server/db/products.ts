import { PROUDCTS_PAGE_LIMIT } from "@/constants/products"
import { Brand, Category } from "@/generated/prisma"
import { db } from "@/lib/prisma"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"
import { subcategorySelector } from "../query-selectors/category"
import { cardProductSelector } from "../query-selectors/product"
import { buildProductsFilters, buildProductsSort } from "../utils/products"
import { cache as reactCache } from "react"

export const getProductsByCategory = reactCache(async (slug: Category["slug"], sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number) => {

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const category = await db.category.findUnique({
        where: { slug },
        select: {
            name: true,
            subcategories: { select: subcategorySelector },
            products: {
                where: whereOptions,
                select: cardProductSelector,
                orderBy: orderByOptions,
                take: PROUDCTS_PAGE_LIMIT,
                skip
            },
            _count: {
                select: {
                    products: {
                        where: whereOptions
                    }
                }
            }
        },
    })

    if (!category) return null

    return {
        categoryName: category.name,
        products: category.products,
        subcategories: category.subcategories,
        pagination: {
            total: category._count.products,
            page,
            pageSize: category.products.length,
            limit: PROUDCTS_PAGE_LIMIT,
        }
    }
})

export const getProductsByBrand = reactCache(async (slug: Brand["slug"], sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number) => {

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const brand = await db.brand.findUnique({
        where: { slug },
        select: {
            name: true,
            products: {
                where: whereOptions,
                select: cardProductSelector,
                orderBy: orderByOptions,
                take: PROUDCTS_PAGE_LIMIT,
                skip
            },
            _count: {
                select: {
                    products: {
                        where: whereOptions
                    }
                }
            }
        },
    })

    if (!brand) return null

    return {
        brandName: brand.name,
        products: brand.products,
        pagination: {
            total: brand._count.products,
            page,
            pageSize: brand.products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})