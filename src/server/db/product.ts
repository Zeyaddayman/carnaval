import { db } from "@/utils/prisma";
import { Product } from "@/generated/prisma";
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"
import { CategoryHierarchy } from "@/types/categories";
import { productDetailsSelector } from "../query-selectors/product";

export const getProduct = reactCache(async (id: Product["id"]) => nextCache(
    async () => {
        const product = await db.product.findUnique({ 
            where: { id },
            select: productDetailsSelector
        })

        if (!product) return null

        const categoryHierarchy: CategoryHierarchy = product.categories.map(category => ({
            name: category.name,
            nameAsSubcategory: category.nameAsSubcategory,
            link: `/categories/${category.slug}`,
        }))

        categoryHierarchy.push({
            name: "Categories",
            nameAsSubcategory: "Categories",
            link: "/categories",
        })

        categoryHierarchy.reverse()

        return { categoryHierarchy, product }
    },
    [`product-${id}`],
    {
        revalidate: 3600,
        tags: ["products", `product-${id}`]
    }
)())