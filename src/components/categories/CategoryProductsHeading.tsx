import { Language } from "@/types/i18n"
import CategoriesChain from "./CategoriesChain"
import { CategoryHierarchy } from "@/types/categories"

interface Props {
    categoryName: string
    categoryHierarchy: CategoryHierarchy
    lang: Language
}

const CategoryProductsHeading = ({ categoryName, categoryHierarchy, lang }: Props) => {

    return (
        <section className="border-2 border-border px-3 py-5 space-y-2 rounded-lg">
            <CategoriesChain categoryHierarchy={categoryHierarchy} lang={lang} />
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-foreground text-2xl md:text-3xl font-bold">{categoryName}</h2>
            </div>
        </section>
    )
}

export default CategoryProductsHeading