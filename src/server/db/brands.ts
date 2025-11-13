import { Category } from "@/generated/prisma"
import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

export const getBrands = reactCache(nextCache(
    async () => {
        console.log("Fetching brands from the database...")
        return await db.brand.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                thumbnail: true,
                _count: {
                    select: {
                        products: {
                            where: {
                                stock: { gt: 0 }
                            }
                        }
                    }
                }
            },
            where: {
                products: {
                    some: {}
                }
            },
            orderBy: {
                products: {
                    _count: "desc"
                }
            }
        })
    },
    ["all-brands"],
    { 
        revalidate: 60 * 60,     // revalidate every 60 minutes
        tags: ["all-brands"]
    }
))

export const getBrand = reactCache(async (slug: Category["slug"]) => nextCache(
    async () => {
        const brand = await db.brand.findUnique({
            where: { slug }
        })

        if (!brand) {
            throw new Error(`Brand with slug "${slug}" not found`)
        }

        return brand
    },
    [`${slug}-brand`],
    {
        revalidate: 60 * 60,     // revalidate every 60 minutes
        tags: [`${slug}-brand`]
    }
)())