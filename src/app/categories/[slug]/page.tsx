import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"
import ProductsList from "@/components/products/ProductsList"
import { getProductsByCategory } from "@/server/db/products"

interface Props {
    params: Promise<{ slug: string }>
}

const CategoryProductsPage = async ({ params }: Props) => {
    
    const { slug } = await params

    const products = await getProductsByCategory(slug)

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading slug={slug} />
                <div className="flex flex-col lg:flex-row mt-3 gap-3">
                    <Subcategories slug={slug} />
                    <ProductsList products={products} />
                </div>
            </div>
        </main>
    )
}

export default CategoryProductsPage