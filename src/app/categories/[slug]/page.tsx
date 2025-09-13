import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { PRODUCTS_MAX_RATING, PRODUCTS_FILTERS } from "@/constants/products"
import { getProductsMinPrice, getProductsByCategory, getProductsMaxPrice, getProductsMinRating } from "@/server/db/products"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"

interface SearchParams extends Partial<ProductsFiltersOptions> {
    page?: string
    sort?: ProductsSortOptionValue
}

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

const CategoryProductsPage = async ({ params, searchParams }: Props) => {

    const filters = {...PRODUCTS_FILTERS}

    const { slug } = await params

    const {
        sort = "alphabetical",
        page: pageinationPage = "1",
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale
    
    } = await searchParams

    const productsMinRating = await getProductsMinRating(slug)

    if (minRating && Number(minRating) >= productsMinRating) {
        filters.minRating = Number(minRating)
    } else {
        filters.minRating = productsMinRating
    }

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    filters.minPrice = minPrice ? Number(minPrice) : await getProductsMinPrice(slug, filters)
    filters.maxPrice = maxPrice ? Number(maxPrice) : await getProductsMaxPrice(slug, filters)

    const {
        products,
        total,
        page,
        pageSize,
        limit

    } = await getProductsByCategory(slug, sort, filters, Number(pageinationPage))

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading slug={slug} />
                <div className="flex flex-col lg:flex-row mt-3 gap-3">
                    <Subcategories slug={slug} />
                    <div className="flex-1">
                        <div className="flex justify-between items-center flex-wrap my-3 gap-3">
                            <ProductsFilters
                                initialFilters={filters}
                                rating={{ min: productsMinRating, max: PRODUCTS_MAX_RATING }}
                            />
                            <ProductsSort sort={sort} />
                        </div>
                        <ProductsList
                            products={products}
                            total={total}
                        />
                        <Pagination
                            total={total}
                            page={page}
                            limit={limit}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryProductsPage