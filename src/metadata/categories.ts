import { getTopLevelCategories } from "@/server/db/categories";
import { Metadata } from "next";

const topLevelCategories = await getTopLevelCategories()
const topLevelCategoriesNames = topLevelCategories.map(category => category.name).join(", ")

export const categoriesMetadata: Metadata = {
    title: 'Shop by Category',
    description: `Explore all categories and subcategories at Carnaval. Browse ${topLevelCategoriesNames}, and more. Find what you love!`,
    keywords: ['categories', 'subcategories', 'shop by category', 'product categories', 'online shopping'].concat(topLevelCategoriesNames.split(", ")),
    openGraph: {
        title: 'Shop by Category | Carnaval',
        description: `Explore all categories and subcategories at Carnaval. Browse ${topLevelCategoriesNames}, and more. Find what you love!`
    }
}