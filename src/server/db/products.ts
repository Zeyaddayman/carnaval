import { Category, Prisma } from "@/generated/prisma"
import { db } from "@/lib/prisma"
import { ProductsSortOptionValue } from "@/types/products"

export const getProductsByCategory = async (slug: Category["slug"], sortBy?: ProductsSortOptionValue) => {

    console.log(`Fetching products for category with slug: ${slug}`)

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
                where: { stock: { gt: 0 } },
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