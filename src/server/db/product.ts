import { db } from "@/lib/prisma";
import { Product } from "@/generated/prisma";
import { CategoryHierarchy } from "@/types/categories";

export const getProduct = async (id: Product["id"]) => {
    const product = await db.product.findUnique({ 
        where: { id } ,
        include: {
            categories: true,
            brand: true
        }
    })

    if (!product) {
        throw new Error(`Product with id "${id}" not found`)
    }

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