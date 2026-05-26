import { db } from "@/lib/prisma";
import { Product } from "@/generated/prisma";
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"
import { CategoryHierarchy } from "@/types/categories";
import { productDetailsSelector } from "../query-selectors/product";
import { Language } from "@/generated/prisma";
import getTranslation from "@/utils/translation";
import { ProductDetails } from "@/types/products";
import { getProductCategoryHierarchy } from "../utils/product";

export const getProduct = reactCache(async (id: Product["id"], lang: Language) => nextCache(
    async (): Promise<{ product: ProductDetails, categoryHierarchy: CategoryHierarchy  } | null> => {

        const translation = await getTranslation(lang)

        const product = await db.product.findUnique({ 
            where: { id },
            select: productDetailsSelector(lang)
        })

        if (!product) return null

        const brandTranslation = product.brand?.translation.find(trans => trans.lang === lang) || product.brand?.translation.find(trans => trans.lang === "en") || null
        const productTranslation = product.translation.find(trans => trans.lang === lang) || product.translation.find(trans => trans.lang === "en")!

        const finalProduct = {
            id: product.id,
            title: productTranslation.title,
            description: productTranslation.description,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            finalPrice: product.finalPrice,
            rating: product.rating,
            stock: product.stock,
            limit: product.limit,
            images: product.images,
            brand: brandTranslation ? { name: brandTranslation.name } : null
        }

        const categoryHierarchy = getProductCategoryHierarchy(product.categories, lang)

        categoryHierarchy.push({
            name: translation.products.categories.categoriesText,
            nameAsSubcategory: translation.products.categories.categoriesText,
            link: "/categories",
        })

        categoryHierarchy.reverse()

        return { categoryHierarchy, product: finalProduct}
    },
    [`product-${id}-${lang}`],
    {
        revalidate: 3600,
        tags: ["products", `product-${id}`]
    }
)())