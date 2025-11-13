import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"
import NoProductsFound from "@/components/products/NoProductsFound"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import FiltersAndSortSkeleton from "@/components/skeletons/FiltersAndSortSkeleton"
import ProductsDataSkeleton from "@/components/skeletons/ProductsDataSkeleton"
import { PRODUCTS_FILTERS, PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { getCategoryHierarchy, getSubcategories } from "@/server/db/categories"
import { getProductsByCategory } from "@/server/db/products"
import { getCategoryProductsMaxPrice, getCategoryProductsMinPrice, getCategoryProductsMinRating } from "@/server/db/products-statistics"
import { ProductsSortOptionValue } from "@/types/products"
import { Suspense } from "react"

interface SearchParams {
    [key: string]: string | undefined
}

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

const CategoryProductsPage = async ({ params, searchParams }: Props) => {

    const { slug } = await params

    const [
        categoryHierarchy,
        { categoryName, subcategories }

    ] = await Promise.all([getCategoryHierarchy(slug), getSubcategories(slug)])

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading categoryName={categoryName} categoryHierarchy={categoryHierarchy} />
                <div className="flex flex-col lg:flex-row mt-3 gap-3">
                    <Subcategories categories={subcategories} />
                    <div className="flex-1">
                        <Suspense
                            fallback={<FiltersAndSortSkeleton />}
                            key={Math.random()}
                        >
                            <FiltersAndSort slug={slug} searchParams={searchParams} />
                        </Suspense>
                        <Suspense
                            fallback={<ProductsDataSkeleton />}
                            key={Math.random()}
                        >
                            <Data slug={slug} searchParams={searchParams} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    )
}

const Data = async ({ slug, searchParams }: { slug: string, searchParams: Promise<SearchParams> }) => {

    const {
        sort: sortParam,
        page: pageParam = "1",
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale
    
    } = await searchParams

    const sort: ProductsSortOptionValue = PRODUCTS_SORT_OPTIONS.find(option => option.value === sortParam)?.value || "alphabetical"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = { ...PRODUCTS_FILTERS }

    if (minRating) filters.minRating = Math.max(1, Number(minRating))

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    if (minPrice && !isNaN(Number(minPrice))) filters.minPrice = Math.max(0, Number(minPrice))

    if (maxPrice && !isNaN(Number(maxPrice))) filters.maxPrice = Math.max(0, Number(maxPrice))

    const {
        products,
        total,
        page,
        pageSize,
        limit

    } = await getProductsByCategory(slug, sort, filters, paginationPage)

    if (!products || products.length === 0) return <NoProductsFound clearFiltersLink={`/categories/${slug}`} />

    return (
        <>
        <ProductsList
            products={products}
            total={total}
            page={page}
            limit={limit}
            pageSize={pageSize}
        />
        <Pagination
            total={total}
            page={page}
            limit={limit}
        />
        </>
    )
}

const FiltersAndSort = async ({ slug, searchParams }: { slug: string, searchParams: Promise<SearchParams> }) => {

    const {
        sort: sortParam,
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale
    
    } = await searchParams

    const sort: ProductsSortOptionValue = PRODUCTS_SORT_OPTIONS.find(option => option.value === sortParam)?.value || "alphabetical"

    const filters = { ...PRODUCTS_FILTERS }

    const productsMinRating = await getCategoryProductsMinRating(slug)

    if (minRating && Number(minRating) >= productsMinRating) {
        filters.minRating = Number(minRating)
    } else {
        filters.minRating = productsMinRating
    }

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    filters.minPrice = minPrice && !isNaN(Number(minPrice)) && Number(minPrice) > 0 ? Number(minPrice) : await getCategoryProductsMinPrice(slug, filters)
    filters.maxPrice = maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0 ? Number(maxPrice) : await getCategoryProductsMaxPrice(slug, filters)

    return (
        <div className="flex justify-between items-center flex-wrap mb-3 gap-3">
            <ProductsFilters
                initialFilters={filters}
                productsMinRating={productsMinRating}
            />
            <ProductsSort sort={sort} />
        </div>
    )
}

export default CategoryProductsPage