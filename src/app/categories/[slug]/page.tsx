import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { getProductsByCategory } from "@/server/db/products"
import { ProductsSortOption } from "@/types/products"

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort: ProductsSortOption }>
}

const CategoryProductsPage = async ({ params, searchParams }: Props) => {
    
    const { slug } = await params
    const { sort } = await searchParams

    const products = await getProductsByCategory(slug, sort || "alphabetical")

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading slug={slug} />
                <div className="flex flex-col lg:flex-row mt-3 gap-3">
                    <Subcategories slug={slug} />
                    <div>
                        <div>
                            <ProductsSort />
                            {/* <ProductsFilter */}
                        </div>
                        <ProductsList products={products} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryProductsPage