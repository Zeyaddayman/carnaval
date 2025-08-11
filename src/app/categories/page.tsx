import ProductsCategories from "@/components/categories"
import SectionHeading from "@/components/ui/SectionHeading"

const CategoriesPage = () => {
    return (
        <main>
            <section>
                <SectionHeading
                    title="All Products Categories"
                    subTitle="Browse our extensive collection of products by category."
                />
                <ProductsCategories />
            </section>
        </main>
    )
}

export default CategoriesPage