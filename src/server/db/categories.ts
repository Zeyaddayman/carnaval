import { Category } from "@/generated/prisma"
import { CategoryHierarchy } from "@/types/categories"
import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

export const getTopLevelCategories = reactCache(nextCache(
    async () => {
        return await db.category.findMany({
            where: {
                AND: [
                    { parentId: null },
                    { children: { some: {} } }
                ]
            },
            orderBy: {
                createdAt: "asc"
            },
            include: {
                children: true
            }
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
                subCategoryName: true,
                parentId: true
            }
        })

        if (!category) {
            throw new Error(`Category with slug "${slug}" not found`)
        }

        categoryHierarchy.push({
            name: category.name,
            subCategoryName: category.subCategoryName,
            link: `/categories/${category.slug}`,
        })
        
        let currentCategoryId = category.parentId

        while (currentCategoryId) {
            const category = await db.category.findUnique({
                where: { id: currentCategoryId },
                select: {
                    name: true,
                    slug: true,
                    subCategoryName: true,
                    parentId: true
                }
            })

            if (!category) break

            categoryHierarchy.push({
                name: category.name,
                subCategoryName: category.subCategoryName,
                link: `/categories/${category.slug}`,
            })

            currentCategoryId = category.parentId
        }

        categoryHierarchy.push({
            name: "Categories",
            subCategoryName: "Categories",
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