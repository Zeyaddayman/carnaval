import { PROUDCTS_PAGE_LIMIT } from "@/constants/products"
import { Brand, Category } from "@/generated/prisma"
import { db } from "@/lib/prisma"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"
import { subcategorySelector } from "../query-selectors/category"
import { cardProductSelector } from "../query-selectors/product"
import { buildProductsFilters, buildProductsSort } from "../utils/products"
import { cache as reactCache } from "react"
import { Language } from "@/generated/prisma"

export const getProductsByCategory = reactCache(async (slug: Category["slug"], sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number, lang: Language) => {

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const [category, products, count] = await Promise.all([

        db.category.findUnique({
            where: { slug },
            select: { 
                translation: {
                    where: {
                        OR: [
                            { lang },
                            { lang: "en" }
                        ]
                    },
                    select: { name: true, lang: true }
                },
                subcategories: { select: subcategorySelector(lang) }
            }
        }),

        await db.product.findMany({
            where: {
                ...whereOptions,
                categories: { some: { slug } }
            },
            select: cardProductSelector(lang),
            orderBy: orderByOptions,
            take: PROUDCTS_PAGE_LIMIT,
            skip
        }),

        db.product.count({
            where: { ...whereOptions, categories: { some: { slug } } }
        })
    ])

    if (!category) return null

    const categoryTranslation = category.translation.find(trans => trans.lang === lang) || category.translation.find(trans => trans.lang === "en")!

    const finalProducts = products.map(product => {

        const brandTranslation = product.brand?.translation.find(trans => trans.lang === lang) || product.brand?.translation.find(trans => trans.lang === "en")
        const productTranslation = product.translation.find(trans => trans.lang === lang) || product.translation.find(trans => trans.lang === "en")!

        return {
            id: product.id,
            thumbnail: product.thumbnail,
            title: productTranslation.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            finalPrice: product.finalPrice,
            rating: product.rating,
            stock: product.stock,
            limit: product.limit,
            brand: brandTranslation ? { name: brandTranslation.name } : null
        }
    })

    const subcategories = category.subcategories.map(subcat => {

        const translation = subcat.translation.find(trans => trans.lang === lang) || subcat.translation.find(trans => trans.lang === "en")!

        return {
            slug: subcat.slug,
            name: translation.name,
            _count: subcat._count
        }
    })

    return {
        categoryName: categoryTranslation.name,
        products: finalProducts,
        subcategories,
        pagination: {
            total: count,
            page,
            pageSize: products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})

export const getProductsByBrand = reactCache(async (slug: Brand["slug"], sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number, lang: Language) => {

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const [brand, products, count] = await Promise.all([

        db.brand.findUnique({
            where: { slug },
            select: {
                translation: {
                    where: {
                        OR: [ { lang }, { lang: "en" } ]
                    },
                    select: { name: true, lang: true }
                }
            }
        }),

        await db.product.findMany({
            where: {
                ...whereOptions,
                brand: { slug }
            },
            select: cardProductSelector(lang),
            orderBy: orderByOptions,
            take: PROUDCTS_PAGE_LIMIT,
            skip
        }),

        db.product.count({
            where: { ...whereOptions, brand: { slug } }
        })
    ])

    if (!brand) return null

    const brandTranslation = brand.translation.find(trans => trans.lang === lang) || brand.translation.find(trans => trans.lang === "en")!

    const finalProducts = products.map(product => {

        const brandTranslation = product.brand?.translation.find(trans => trans.lang === lang) || product.brand?.translation.find(trans => trans.lang === "en")
        const productTranslation = product.translation.find(trans => trans.lang === lang) || product.translation.find(trans => trans.lang === "en")!

        return {
            id: product.id,
            thumbnail: product.thumbnail,
            title: productTranslation.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            finalPrice: product.finalPrice,
            rating: product.rating,
            stock: product.stock,
            limit: product.limit,
            brand: brandTranslation ? { name: brandTranslation.name } : null
        }
    })

    return {
        brandName: brandTranslation.name,
        products: finalProducts,
        pagination: {
            total: count,
            page,
            pageSize: products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})

export const getSearchProducts = reactCache(async (query: string, categorySlug: string, sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions, page: number, lang: Language) => {

    const searchTerm = query.trim()

    if (!searchTerm) return null

    const whereOptions = buildProductsFilters(filters)

    const orderByOptions = buildProductsSort(sortBy)

    const categoryFilter = categorySlug && categorySlug !== "all" ? { some: { slug: categorySlug } } : undefined

    const skip = (page - 1) * PROUDCTS_PAGE_LIMIT

    const [productsTranslation, count, category] = await Promise.all([

        db.productTranslation.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: "insensitive" } },
                    { description: { contains: searchTerm, mode: "insensitive" } }
                ],
            },
            select: { productId: true },
        }),

        db.productTranslation.count({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: "insensitive" } },
                    { description: { contains: searchTerm, mode: "insensitive" } }
                ],
            }
        }),

        categoryFilter ?
            db.category.findUnique({
                where: { slug: categorySlug },
                select: {
                    translation: {
                        where: {
                            OR: [ { lang }, { lang: "en" } ]
                        },
                        select: { name: true, lang: true }
                    },
                    slug: true
                }
            })
            : null
    ])

    const productsIds = productsTranslation.map(({ productId }) => productId)

    const products = await db.product.findMany({
        where: {
            id: { in: productsIds },
            ...whereOptions,
            categories: categoryFilter
        },
        select: cardProductSelector(lang),
        orderBy: orderByOptions,
        take: PROUDCTS_PAGE_LIMIT,
        skip
    })

    const finalProducts = products.map(product => {

        const brandTranslation = product.brand?.translation.find(trans => trans.lang === lang) || product.brand?.translation.find(trans => trans.lang === "en")
        const productTranslation = product.translation.find(trans => trans.lang === lang) || product.translation.find(trans => trans.lang === "en")!

        return {
            id: product.id,
            thumbnail: product.thumbnail,
            title: productTranslation.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            finalPrice: product.finalPrice,
            rating: product.rating,
            stock: product.stock,
            limit: product.limit,
            brand: brandTranslation ? { name: brandTranslation.name } : null
        }
    })

    const categoryTranslation = category?.translation.find(trans => trans.lang === lang) || category?.translation.find(trans => trans.lang === "en") || null

    return {
        searchTerm,
        products: finalProducts,
        categoryName: categoryTranslation?.name,
        categorySlug: category?.slug,
        pagination: {
            total: count,
            page,
            pageSize: products.length,
            limit: PROUDCTS_PAGE_LIMIT
        }
    }
})