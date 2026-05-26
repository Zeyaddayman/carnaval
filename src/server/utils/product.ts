import { Language, Prisma } from "@/generated/prisma"
import { productDetailsSelector } from "../query-selectors/product"
import { CategoryHierarchy } from "@/types/categories"

export async function fetchProductLimit(productId: string) {

    try {
        const res = await fetch(`/api/product/${productId}/limit`)

        if (res.status === 200) {

            const data = await res.json()

            return data.productLimit as number | null
        }
        else {
            return null
        }
    }
    catch {
        return null
    }
}

type DBProductCategory = Prisma.ProductGetPayload<{
    select: ReturnType<typeof productDetailsSelector>
}>["categories"][number]

export const getProductCategoryHierarchy = (categories: DBProductCategory[], lang: Language) => {

    let directCategory: DBProductCategory | null = null

    directCategory = categories.find(cat => cat.subcategories.length === 0) || null

    if (!directCategory) {
        categories.forEach(cat => {
            const subcategoriesOutside = cat.subcategories.every(subCat => {
                !categories.find(cat => cat.slug === subCat.slug)
            })

            if (subcategoriesOutside) directCategory = cat
        })
    }

    if (!directCategory) return []

    const orderedCategories: DBProductCategory[] = []

    orderedCategories.push(directCategory)

    let currentCategory = directCategory.parentCategory

    while(currentCategory) {
        const category = categories.find(cat => cat.slug === currentCategory!.slug)

        if (!category) break

        orderedCategories.push(category)

        currentCategory = category.parentCategory
    }

    const categoryHierarchy = orderedCategories.map<CategoryHierarchy[number]>(cat => {
        const translation = cat.translation.find(trans => trans.lang === lang) || cat.translation.find(trans => trans.lang === "en")!

        return {
            name: translation.name,
            nameAsSubcategory: translation.nameAsSubcategory,
            link: `/categories/${cat.slug}`
        }
    })

    return categoryHierarchy
}