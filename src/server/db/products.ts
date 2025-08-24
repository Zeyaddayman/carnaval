import { Category } from "@/generated/prisma"
import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

export const getProductsByCategory = reactCache(async (slug: Category["slug"]) => nextCache(
    async () => {
        console.log(`Fetching products for category with slug: ${slug}`)

        const category = await db.category.findUnique({
            where: { slug },
            select: {
                products: {
                    where: { stock: { gt: 0 } },
                    orderBy: { title: "asc" },
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
            }
        })

        if (!category) {
            throw new Error(`Category with slug "${slug}" not found`)
        }

        return category.products
    },
    [`${slug}-products`],
    {
        revalidate: 60 * 60,    // revalidate every 60 minutes
        tags: [`${slug}-products`]
    }
)())