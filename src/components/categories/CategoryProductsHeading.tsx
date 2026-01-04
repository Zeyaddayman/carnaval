import CategoriesChain from "./CategoriesChain"
import { CategoryHierarchy } from "@/types/categories"

interface Props {
    categoryName: string
    categoryHierarchy: CategoryHierarchy
}

const CategoryProductsHeading = ({ categoryName, categoryHierarchy }: Props) => {

    return (
        <section className="border-2 border-border px-3 py-5 space-y-2 rounded-lg">
            <CategoriesChain categoryHierarchy={categoryHierarchy} />
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-foreground text-2xl md:text-3xl font-bold">{categoryName}</h2>
            </div>
        </section>
    )
}

export default CategoryProductsHeading