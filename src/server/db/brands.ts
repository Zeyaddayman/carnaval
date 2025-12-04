import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

export const getBrands = reactCache(nextCache(
    async () => {
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
        revalidate: 60 * 60,
        tags: ["all-brands"]
    }
))