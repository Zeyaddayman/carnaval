import { Category } from "@/generated/prisma"
import { CategoryHierarchy } from "@/types/categories"
import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

export const getTopLevelCategories = reactCache(nextCache(
    async () => {
        console.log("Fetching categories from the database...")
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
        revalidate: 60 * 60,    // revalidate every 60 minutes
        tags: ["top-categories"]
    } 
))

export const getCategoryHierarchy = reactCache(async (slug: Category["slug"]) => nextCache(
    async () => {
        console.log(`Fetching category hierarchy for slug: ${slug}`)

        const categories: CategoryHierarchy = []

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

        categories.push({
            name: category.name,
            subCategoryName: category.subCategoryName,
            link: `/categories/${category.slug}`,
        })
        
        let currentCategoryId = category.parentId

        // get the parent categories
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

            categories.push({
                name: category.name,
                subCategoryName: category.subCategoryName,
                link: `/categories/${category.slug}`,
            })

            currentCategoryId = category.parentId
        }

        categories.push({
            name: "Categories",
            subCategoryName: "Categories",
            link: "/categories",
        })

        return { categoryHierarchy: categories.reverse(), category }
    },
    [`${slug}-hierarchy`],
    {
        revalidate: 60 * 60,    // revalidate every 60 minutes
        tags: [`${slug}-hierarchy`]
    }
)())

export const getSubcategories = reactCache(async (slug: Category["slug"]) => nextCache(
    async () => {
        console.log(`Fetching subcategories for slug: ${slug}`)

        const category = await db.category.findUnique({
            where: { slug },
            select: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        _count: {
                            select: {
                                products: {
                                    where: {
                                        stock: { gt: 0 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!category) {
            throw new Error(`Category with slug "${slug}" not found`)
        }

        return category.children
    },
    [`${slug}-subcategories`],
    {
        revalidate: 60 * 60,    // revalidate every 60 minutes
        tags: [`${slug}-subcategories`]
    }
)())