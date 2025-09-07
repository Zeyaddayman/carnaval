import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { PRODUCTS_FILTERS } from "@/constants/products"
import { getProductsMinPrice, getProductsByCategory, getProductsMaxPrice } from "@/server/db/products"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"

interface SearchParams extends Partial<ProductsFiltersOptions> {
    sort?: ProductsSortOptionValue
}

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

const CategoryProductsPage = async ({ params, searchParams }: Props) => {

    const productsFilters = PRODUCTS_FILTERS

    const { slug } = await params
    const { sort, minPrice, maxPrice, minRating, onlyOnSale } = await searchParams

    productsFilters.minPrice = Number(minPrice) || await getProductsMinPrice(slug)
    productsFilters.maxPrice = Number(maxPrice) || await getProductsMaxPrice(slug)

    productsFilters.onlyOnSale = Boolean(onlyOnSale || PRODUCTS_FILTERS.onlyOnSale)

    const products = await getProductsByCategory(slug, sort || "alphabetical", productsFilters)

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading slug={slug} />
                <div className="flex flex-col lg:flex-row mt-3 gap-3">
                    <Subcategories slug={slug} />
                    <div className="flex-1">
                        <div className="flex justify-between items-center flex-wrap my-3 gap-3">
                            <ProductsFilters initialFilters={productsFilters} />
                            <ProductsSort sort={sort || "alphabetical"} />
                        </div>
                        <ProductsList products={products} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryProductsPage