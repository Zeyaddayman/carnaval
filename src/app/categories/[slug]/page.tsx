import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"

interface Props {
    params: Promise<Record<string, string>>
}

const CategoryProductsPage = async ({ params }: Props) => {

    const { slug } = await params

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading slug={slug} />
                <div className="flex flex-col md:flex-row mt-3 gap-3">
                    <Subcategories slug={slug} />
                    <div className="flex-1">
                        products list
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryProductsPage