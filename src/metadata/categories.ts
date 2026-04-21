import { getTopLevelCategories } from "@/server/db/categories";
import { Language } from "@/types/i18n";
import getTranslation, { inject } from "@/utils/translation";
import { Metadata } from "next";

export const getCategoriesMetadata = async (lang: Language): Promise<Metadata> => {

    const [{ metadata }, topLevelCategories] = await Promise.all([getTranslation(lang), getTopLevelCategories()])
    
    const topLevelCategoriesNames = topLevelCategories.map(category => category.name).join(", ")

    return {
        ...metadata.categories,
        description: inject(metadata.categories.description, { topLevelCategoriesNames }),
        keywords: metadata.categories.keywords.concat(topLevelCategoriesNames.split(", ")),
        openGraph: {
            ...metadata.categories.openGraph,
            description: inject(metadata.categories.description, { topLevelCategoriesNames })
        }
    }
}