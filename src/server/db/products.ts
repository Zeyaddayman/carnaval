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

    const [category, products, count] = await Promise.all([

        db.category.findUnique({
            where: { slug },
            select: { 
                name: true, 
                subcategories: { select: subcategorySelector }
            }
        }),

        await db.product.findMany({
            where: {
                ...whereOptions,
                categories: { some: { slug } }
            },
            select: cardProductSelector,
            orderBy: orderByOptions,
            take: PROUDCTS_PAGE_LIMIT,
            skip
        }),

        db.product.count({
            where: { ...whereOptions, categories: { some: { slug } } }
        })
    ])

    if (!category) return null

    return {
        categoryName: category.name,
        products,
        subcategories: category.subcategories,
        pagination: {
            total: count,
            page,
            pageSize: products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})

export const getProductsByBrand = reactCache(async (slug: Brand["slug"], sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number) => {

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const [brand, products, count] = await Promise.all([

        db.brand.findUnique({
            where: { slug },
            select: {  name: true }
        }),

        await db.product.findMany({
            where: {
                ...whereOptions,
                brand: { slug }
            },
            select: cardProductSelector,
            orderBy: orderByOptions,
            take: PROUDCTS_PAGE_LIMIT,
            skip
        }),

        db.product.count({
            where: { ...whereOptions, brand: { slug } }
        })
    ])

    if (!brand) return null

    return {
        brandName: brand.name,
        products,
        pagination: {
            total: count,
            page,
            pageSize: products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})

export const getSearchProducts = reactCache(async (query: string, categorySlug: string, sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number) => {

    const searchTearm = query.trim()

    if (!searchTearm) return null

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const categoryFilter = categorySlug && categorySlug !== "all" ? { some: { slug: categorySlug } } : undefined

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const [products, count, category] = await Promise.all([

        await db.product.findMany({
            where: {
                OR: [
                    { title: { contains: searchTearm, mode: "insensitive" } },
                    { description: { contains: searchTearm, mode: "insensitive" } }
                ],
                ...whereOptions,
                categories: categoryFilter
            },
            select: cardProductSelector,
            orderBy: orderByOptions,
            take: PROUDCTS_PAGE_LIMIT,
            skip
        }),

        db.product.count({
            where: {
                OR: [
                    { title: { contains: searchTearm, mode: "insensitive" } },
                    { description: { contains: searchTearm, mode: "insensitive" } }
                ],
                ...whereOptions,
                categories: categoryFilter
            }
        }),

        categoryFilter ? db.category.findUnique({ where: { slug: categorySlug } }) : null
    ])

    return {
        searchTearm,
        products,
        categoryName: category?.name,
        categorySlug: category?.slug,
        pagination: {
            total: count,
            page,
            pageSize: products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})