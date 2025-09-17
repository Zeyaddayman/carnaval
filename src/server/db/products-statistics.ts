import { PRODUCTS_FILTERS, PRODUCTS_MAX_RATING, PRODUCTS_MIN_RATING } from "@/constants/products"
import { Brand, Category, Prisma } from "@/generated/prisma"
import { formatRating } from "@/lib/formatters"
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
            price: true
        }
    })

    return Number(result._min.price ?? PRODUCTS_FILTERS.minPrice)
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
            price: true
        }
    })

    return Number(result._max.price ?? PRODUCTS_FILTERS.maxPrice)
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

    const formattedRating = formatRating(result._min.rating ?? PRODUCTS_MIN_RATING)

    return Number(formattedRating)
}

// Brands
export const getBrandsProductsMinPrice = async (slug: Brand["slug"], filters: ProductsFiltersOptions): Promise<number> => {

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
            price: true
        }
    })

    return Number(result._min.price ?? PRODUCTS_FILTERS.minPrice)
}

export const getBrandsProductsMaxPrice = async (slug: Brand["slug"], filters: ProductsFiltersOptions): Promise<number> => {

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
            price: true
        }
    })

    return Number(result._max.price ?? PRODUCTS_FILTERS.maxPrice)
}

export const getBrandsProductsMinRating = async (slug: Brand["slug"]): Promise<number> => {
    const result = await db.product.aggregate({
        where: {  
            brand: { slug },
            stock: { gt: 0 }
        },
        _min: {
            rating: true
        }
    })

    const formattedRating = formatRating(result._min.rating ?? PRODUCTS_MIN_RATING)

    return Number(formattedRating)
}