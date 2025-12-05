import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"
import { brandWithProductsCountSelector } from "../query-selectors/brand"

export const getBrands = reactCache(nextCache(
    async () => {
        return await db.brand.findMany({
            where: {
                products: { some: {} }
            },
            select: brandWithProductsCountSelector,
            orderBy: {
                products: { _count: "desc" }
            }
        })
    },
    ["all-brands"],
    { 
        revalidate: 60 * 60,
        tags: ["all-brands"]
    }
))