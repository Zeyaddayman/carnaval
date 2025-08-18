import { getCategoryHierarchy } from "@/server/db/categories"
import CategoriesChain from "./CategoriesChain"

interface Props {
    slug: string
}

const CategoryProductsHeading = async ({ slug }: Props) => {

    const { categoryHierarchy, category  } = await getCategoryHierarchy(slug)

    const CategoryName = category.name

    return (
        <div className="border-2 border-border px-3 py-5 space-y-3 rounded-lg">
            <CategoriesChain categoryHierarchy={categoryHierarchy} />
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-foreground text-2xl md:text-3xl font-bold">{CategoryName}</h2>
            </div>
        </div>
    )
}

export default CategoryProductsHeading