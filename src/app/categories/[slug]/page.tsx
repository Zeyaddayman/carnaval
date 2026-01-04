import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"
import Subcategories from "@/components/categories/Subcategories"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import ProductsListSkeleton from "@/components/skeletons/ProductsListSkeleton"
import { Button } from "@/components/ui/Button"
import { PRODUCTS_FILTERS, PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { generateCategoryProductsMetadata } from "@/metadata/products"
import { getCategoryHierarchy } from "@/server/db/categories"
import { getProductsByCategory } from "@/server/db/products"
import { getCategoryProductsMaxPrice, getCategoryProductsMinPrice, getCategoryProductsMinRating } from "@/server/utils/products-statistics"
import { ProductsSortOptionValue } from "@/types/products"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"

interface SearchParams {
    [key: string]: string | undefined
}

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

export async function generateMetadata({ params }: Props) {

    const { slug } = await params

    const data = await getProductsByCategory(slug, "alphabetical", PRODUCTS_FILTERS, 1)

    return generateCategoryProductsMetadata(data?.categoryName || slug)
}

const CategoryProductsPage = async ({ params, searchParams }: Props) => {

    const [
        { slug },
        resolvedSearchParams

    ] = await Promise.all([params, searchParams])

    const {
        page: pageParam = "1",
        sort: sortParam,
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale

    } = resolvedSearchParams

    const sort: ProductsSortOptionValue = PRODUCTS_SORT_OPTIONS.find(option => option.value === sortParam)?.value || "alphabetical"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = { ...PRODUCTS_FILTERS }

    if (minRating) filters.minRating = Math.max(1, Number(minRating))

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    if (minPrice && !isNaN(Number(minPrice))) filters.minPrice = Math.max(0, Number(minPrice))

    if (maxPrice && !isNaN(Number(maxPrice))) filters.maxPrice = Math.max(0, Number(maxPrice))


    const [data, categoryHierarchy] = await Promise.all([
        getProductsByCategory(slug, sort, filters, paginationPage),
        getCategoryHierarchy(slug)
    ])

    if (!data) return notFound()

    const {
        categoryName,
        subcategories,
        products,
        pagination

    } = data


    return (
        <main>
            <div className="container">
                <CategoryProductsHeading categoryName={categoryName} categoryHierarchy={categoryHierarchy} />
                <div className="flex flex-col lg:flex-row mt-3 gap-3">
                    <Subcategories categories={subcategories} />
                    <div className="flex-1">
                        <div className="flex justify-between flex-col sm:flex-row sm:items-center flex-wrap mb-3 gap-3">
                            <Suspense
                                fallback={
                                    <Button
                                        variant={"primary"}
                                        size={"lg"}
                                        disabled={true}
                                    >
                                        <HiOutlineAdjustmentsHorizontal size={20} /> Filters
                                    </Button>
                                }
                                key={JSON.stringify(resolvedSearchParams)}
                            >
                                <Filters slug={slug} searchParams={resolvedSearchParams} />
                            </Suspense>
                            <ProductsSort sort={sort} />
                        </div>
                        <Suspense
                            fallback={<ProductsListSkeleton />}
                            key={JSON.stringify(resolvedSearchParams)}
                        >
                            <ProductsList
                                products={products}
                                total={pagination.total}
                                page={pagination.page}
                                limit={pagination.limit}
                                pageSize={pagination.pageSize}
                                clearFiltersLink={`/categories/${slug}`}
                            />
                        </Suspense>
                        <Pagination
                            total={pagination.total}
                            page={pagination.page}
                            limit={pagination.limit}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

const Filters = async ({ slug, searchParams }: { slug: string, searchParams: SearchParams }) => {

    const {
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale
    
    } = searchParams

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
        <ProductsFilters
            initialFilters={filters}
            productsMinRating={productsMinRating}
        />
    )
}

export default CategoryProductsPage