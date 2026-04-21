import { getBrands } from "@/server/db/brands";
import { Language } from "@/types/i18n";
import getTranslation, { inject } from "@/utils/translation";
import { Metadata } from "next";

export const getBrandsMetadata = async (lang: Language): Promise<Metadata> => {

    const [{ metadata }, brands] = await Promise.all([getTranslation(lang), getBrands()])
    const topBrandsNames = brands.slice(0, 20).map(brand => brand.name).join(", ")

    return {
        ...metadata.brands,
        description: inject(metadata.brands.description, { topBrandsNames }),
        openGraph: {
            ...metadata.brands.openGraph,
            description: inject(metadata.brands.openGraph.description, { topBrandsNames })
        }
    }
}