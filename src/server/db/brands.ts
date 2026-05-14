import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"
import { brandWithProductsCountSelector } from "../query-selectors/brand"
import { Language } from "@/generated/prisma"

export const getBrands = reactCache((lang: Language) => nextCache(
    async () => {
        const brands = await db.brand.findMany({
            where: {
                products: { some: {} }
            },
            select: brandWithProductsCountSelector(lang),
            orderBy: {
                products: { _count: "desc" }
            }
        })

        return brands.map(brand => {

            // get the provided lang or the fallback "en"
            const translation = brand.translation.find(trans => trans.lang === lang) || brand.translation.find(trans => trans.lang === "en")!

            return {
                id: brand.id,
                slug: brand.slug,
                thumbnail: brand.thumbnail,
                _count: brand._count,
                name: translation.name
            }
        })
    },
    [`all-brands-${lang}`],
    { 
        revalidate: 60 * 60,
        tags: ["all-brands"]
    }
)())