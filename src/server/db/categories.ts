import { Category } from "@/generated/prisma"
import { CategoryHierarchy } from "@/types/categories"
import { db } from "@/utils/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"
import { menuCategorySelector } from "../query-selectors/category"

export const getTopLevelCategories = reactCache(nextCache(
    async () => {
        return await db.category.findMany({
            where: {
                AND: [
                    { parentCategoryId: null },
                    { subcategories: { some: {} } }
                ]
            },
            select: menuCategorySelector,
            orderBy: { createdAt: "asc" }
        })
    },
    ["top-categories"],
    { 
        revalidate: 60 * 60,
        tags: ["top-categories"]
    } 
))

export const getCategoryHierarchy = reactCache(async (slug: Category["slug"]) => nextCache(
    async () => {
        const categoryHierarchy: CategoryHierarchy = []

        const category = await db.category.findUnique({
            where: { slug },
            select: {
                name: true,
                slug: true,
                nameAsSubcategory: true,
                parentCategoryId: true
            }
        })

        if (!category) return []

        categoryHierarchy.push({
            name: category.name,
            nameAsSubcategory: category.nameAsSubcategory,
            link: `/categories/${category.slug}`,
        })
        
        let currentCategoryId = category.parentCategoryId

        while (currentCategoryId) {
            const category = await db.category.findUnique({
                where: { id: currentCategoryId },
                select: {
                    name: true,
                    slug: true,
                    nameAsSubcategory: true,
                    parentCategoryId: true
                }
            })

            if (!category) break

            categoryHierarchy.push({
                name: category.name,
                nameAsSubcategory: category.nameAsSubcategory,
                link: `/categories/${category.slug}`,
            })

            currentCategoryId = category.parentCategoryId
        }

        categoryHierarchy.push({
            name: "Categories",
            nameAsSubcategory: "Categories",
            link: "/categories",
        })

        return categoryHierarchy.reverse()
    },
    [`${slug}-hierarchy`],
    { 
        revalidate: 60 * 60,
        tags: [`${slug}-hierarchy`]
    } 
)())