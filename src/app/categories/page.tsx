import ProductsCategories from "@/components/categories/ProductsCategories"
import { categoriesMetadata } from "@/metadata/categories"

export const metadata = categoriesMetadata

const CategoriesPage = () => {
    return (
        <main>
            <div className="container">
                <ProductsCategories />
            </div>
        </main>
    )
}

export default CategoriesPage