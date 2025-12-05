import { db } from "@/lib/prisma";
import { Product } from "@/generated/prisma";
import { CategoryHierarchy } from "@/types/categories";
import { productDetailsSelector } from "../query-selectors/product";

export const getProduct = async (id: Product["id"]) => {
    const product = await db.product.findUnique({ 
        where: { id },
        select: productDetailsSelector
    })

    if (!product) return null

    const categoryHierarchy: CategoryHierarchy = product.categories.map(category => ({
        name: category.name,
        subCategoryName: category.subCategoryName,
        link: `/categories/${category.slug}`,
    }))

    categoryHierarchy.push({
        name: "Categories",
        subCategoryName: "Categories",
        link: "/categories",
    })

    categoryHierarchy.reverse()

    return { categoryHierarchy, product }
}