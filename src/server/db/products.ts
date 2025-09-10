import { PRODUCTS_FILTERS, PRODUCTS_MAX_RATING, PRODUCTS_MIN_RATING } from "@/constants/products"
import { Category, Prisma } from "@/generated/prisma"
import { db } from "@/lib/prisma"
import { formatRating } from "@/lib/utils"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"

export const getProductsByCategory = async (slug: Category["slug"], sortBy: ProductsSortOptionValue, filters: ProductsFiltersOptions) => {

    console.log(`Fetching products for category with slug: ${slug}`)

    let whereOptions: Prisma.ProductWhereInput = { 
        stock: { gt: 0 },
        price: {
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

    let orderByOptions: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] | undefined

    switch (sortBy) {
        case "alphabetical":
            orderByOptions = { title: "asc" }
            break
        case "price-asc":
            orderByOptions = { price: "asc" }
            break
        case "price-desc":
            orderByOptions = { price: "desc" }
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

    const category = await db.category.findUnique({
        where: { slug },
        select: {
            products: {
                where: whereOptions,
                orderBy: orderByOptions,
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
            }
        },
    })

    if (!category) {
        throw new Error(`Category with slug "${slug}" not found`)
    }

    return category.products
}

export const getProductsMinPrice = async (slug: Category["slug"]): Promise<number> => {
    const result = await db.product.aggregate({
        where: {
            categories: { some: { slug } },
            stock: { gt: 0 }
        },
        _min: {
            price: true
        }
    })

    return Number(result._min.price || PRODUCTS_FILTERS.minPrice)
}

export const getProductsMaxPrice = async (slug: Category["slug"]): Promise<number> => {
    const result = await db.product.aggregate({
        where: {
            categories: { some: { slug } },
            stock: { gt: 0 }
        },
        _max: {
            price: true
        }
    })

    return Number(result._max.price || PRODUCTS_FILTERS.maxPrice)
}

export const getProductsMinRating = async (slug: Category["slug"]): Promise<number> => {
    const result = await db.product.aggregate({
        where: { 
            categories: { some: { slug } },
            stock: { gt: 0 }
        },
        _min: {
            rating: true
        }
    })

    const formattedRating = formatRating(result._min.rating || PRODUCTS_MIN_RATING)

    return Number(formattedRating)
}