import { Category } from "@/generated/prisma"
import { CategoryHierarchy } from "@/types/categories"
import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"
import { getMenuCategorySelector } from "../query-selectors/category"
import { Language } from "@/generated/prisma"
import getTranslation from "@/utils/translation"

export const getTopLevelCategories = reactCache(async (lang: Language) => nextCache(
    async () => {
        const topCategories = await db.category.findMany({
            where: {
                AND: [
                    { parentCategoryId: null },
                    { subcategories: { some: {} } }
                ]
            },
            select: getMenuCategorySelector(lang),
            orderBy: { createdAt: "asc" }
        })

        return topCategories.map(cat => {

            // get the provided lang or the fallback "en"
            const translation = cat.translation.find(trans => trans.lang === lang) || cat.translation.find(trans => trans.lang === "en")!

            return {
                slug: cat.slug,
                thumbnail: cat.thumbnail,
                name: translation.name,
                subcategories: cat.subcategories.map(subcat => {

                    // get the provided lang or the fallback "en"
                    const translation = subcat.translation.find(trans => trans.lang === lang) || subcat.translation.find(trans => trans.lang === "en")!

                    return {
                        slug: subcat.slug,
                        thumbnail: subcat.thumbnail,
                        name: translation.name,
                        nameAsSubcategory: translation.nameAsSubcategory
                    }
                })
            }
        })

    },
    [`top-categories-${lang}`],
    { 
        revalidate: 60 * 60,
        tags: ["top-categories"]
    } 
)())

export const getCategoryHierarchy = reactCache(async (slug: Category["slug"], lang: Language) => nextCache(
    async () => {

        const translation = await getTranslation(lang)

        const categoryHierarchy: CategoryHierarchy = []

        let category = await db.category.findUnique({
            where: { slug },
            select: {
                slug: true,
                parentCategoryId: true,
                translation: {
                    where: {
                        OR: [
                            { lang },
                            { lang: "en" }
                        ]
                    }
                }
            }
        })

        if (!category) return []

        const categoryTranslation = category.translation.find(trans => trans.lang === lang) || category.translation.find(trans => trans.lang === "en")!

        categoryHierarchy.push({
            name: categoryTranslation.name,
            nameAsSubcategory: categoryTranslation.nameAsSubcategory,
            link: `/categories/${category.slug}`,
        })
        
        let currentCategoryId = category.parentCategoryId

        while (currentCategoryId) {
            const category = await db.category.findUnique({
                where: { id: currentCategoryId },
                select: {
                    slug: true,
                    parentCategoryId: true,
                    translation: {
                        where: {
                            OR: [
                                { lang },
                                { lang: "en" }
                            ]
                        }
                    }
                }
            })

            if (!category) break

            const categoryTranslation = category.translation.find(trans => trans.lang === lang) || category.translation.find(trans => trans.lang === "en")!

            categoryHierarchy.push({
                name: categoryTranslation.name,
                nameAsSubcategory: categoryTranslation.nameAsSubcategory,
                link: `/categories/${category.slug}`,
            })

            currentCategoryId = category.parentCategoryId
        }

        categoryHierarchy.push({
            name: translation.products.categories.categoriesText,
            nameAsSubcategory: translation.products.categories.categoriesText,
            link: "/categories",
        })

        return categoryHierarchy.reverse()
    },
    [`${slug}-hierarchy-${lang}`],
    { 
        revalidate: 60 * 60,
        tags: [`${slug}-hierarchy`]
    } 
)())