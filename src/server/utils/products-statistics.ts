import { PRODUCTS_FILTERS, PRODUCTS_MAX_RATING, PRODUCTS_MIN_RATING } from "@/constants/products"
import { Brand, Category, Prisma } from "@/generated/prisma"
import { formatRating } from "@/utils/formatters"
import { db } from "@/lib/prisma"
import { ProductsFiltersOptions } from "@/types/products"

// Category
export const getCategoryProductsMinPrice = async (slug: Category["slug"], filters: ProductsFiltersOptions): Promise<number> => {

    const whereOptions: Prisma.ProductWhereInput = {
        categories: { some: { slug } },
        stock: { gt: 0 },
        rating: {
            gte: filters.minRating,
            lte: PRODUCTS_MAX_RATING
        }
    }

    if (filters.onlyOnSale) {
        whereOptions.discountPercentage = { not: null, gt: 0 }
    }

    const result = await db.product.aggregate({
        where: whereOptions,
        _min: {
            finalPrice: true
        }
    })

    return result._min.finalPrice ?? PRODUCTS_FILTERS.minPrice
}

export const getCategoryProductsMaxPrice = async (slug: Category["slug"], filters: ProductsFiltersOptions): Promise<number> => {

    const whereOptions: Prisma.ProductWhereInput = {
        categories: { some: { slug } },
        stock: { gt: 0 },
        rating: {
            gte: filters.minRating,
            lte: PRODUCTS_MAX_RATING
        }
    }

    if (filters.onlyOnSale) {
        whereOptions.discountPercentage = { not: null, gt: 0 }
    }

    const result = await db.product.aggregate({
        where: whereOptions,
        _max: {
            finalPrice: true
        }
    })

    return result._max.finalPrice ?? PRODUCTS_FILTERS.maxPrice
}

export const getCategoryProductsMinRating = async (slug: Category["slug"]): Promise<number> => {
    const result = await db.product.aggregate({
        where: { 
            categories: { some: { slug } },
            stock: { gt: 0 }
        },
        _min: {
            rating: true
        }
    })

    return formatRating(result._min.rating ?? PRODUCTS_MIN_RATING)
}

// Brands
export const getBrandProductsMinPrice = async (slug: Brand["slug"], filters: ProductsFiltersOptions): Promise<number> => {

    const whereOptions: Prisma.ProductWhereInput = {
        brand: { slug },
        stock: { gt: 0 },
        rating: {
            gte: filters.minRating,
            lte: PRODUCTS_MAX_RATING
        }
    }

    if (filters.onlyOnSale) {
        whereOptions.discountPercentage = { not: null, gt: 0 }
    }

    const result = await db.product.aggregate({
        where: whereOptions,
        _min: {
            finalPrice: true
        }
    })

    return result._min.finalPrice ?? PRODUCTS_FILTERS.minPrice
}

export const getBrandProductsMaxPrice = async (slug: Brand["slug"], filters: ProductsFiltersOptions): Promise<number> => {

    const whereOptions: Prisma.ProductWhereInput = {
        brand: { slug },
        stock: { gt: 0 },
        rating: {
            gte: filters.minRating,
            lte: PRODUCTS_MAX_RATING
        }
    }

    if (filters.onlyOnSale) {
        whereOptions.discountPercentage = { not: null, gt: 0 }
    }

    const result = await db.product.aggregate({
        where: whereOptions,
        _max: {
            finalPrice: true
        }
    })

    return result._max.finalPrice ?? PRODUCTS_FILTERS.maxPrice
}

export const getBrandProductsMinRating = async (slug: Brand["slug"]): Promise<number> => {
    const result = await db.product.aggregate({
        where: {  
            brand: { slug },
            stock: { gt: 0 }
        },
        _min: {
            rating: true
        }
    })

    return formatRating(result._min.rating ?? PRODUCTS_MIN_RATING)
}