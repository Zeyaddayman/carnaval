import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { Button } from "@/components/ui/Button"
import { PRODUCTS_FILTERS, PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { generateSearchProductsMetadata } from "@/metadata/products"
import { getSearchProducts } from "@/server/db/products"
import { getSearchProductsMaxPrice, getSearchProductsMinPrice, getSearchProductsMinRating } from "@/server/utils/products-statistics"
import { ProductsSortOptionValue } from "@/types/products"
import { getValidatedFilters } from "@/utils/filters"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"

interface SearchParams {
    [key: string]: string | undefined
}

interface Props {
    searchParams: Promise<SearchParams>
}

const SearchPage = async ({ searchParams }: Props) => {

    const resolvedSearchParams = await searchParams

    const {
        query = "",
        category = "",
        page: pageParam = "1",
        sort: sortParam

    } = resolvedSearchParams

    const sort: ProductsSortOptionValue = PRODUCTS_SORT_OPTIONS.find(option => option.value === sortParam)?.value || "alphabetical"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = getValidatedFilters(resolvedSearchParams)

    const data = await getSearchProducts(query, category, sort, filters, paginationPage)

    if (!data) return notFound()

    const {
        searchTearm,
        categoryName,
        categorySlug,
        products,
        pagination

    } = data

    return (
        <main>
            <div className="container">
                <section className="border-2 border-border px-3 py-5 space-y-3 rounded-lg">
                    Results for&ensp;
                    <span className="text-primary font-semibold">"{searchTearm}"&ensp;</span>
                    {(categoryName && categorySlug) ? (
                        <>
                        in&ensp;
                        <Link
                            href={`categories/${categorySlug}`}
                            className={"text-primary hover:text-primary/90 font-semibold"}
                        >
                            {categoryName}
                        </Link>
                        </>
                    ) : null}
                </section>
                <div className="mt-3">
                    <div className="flex justify-between flex-col sm:flex-row sm:items-center flex-wrap mb-3 gap-3">
                        <Suspense
                            fallback={
                                <Button
                                    variant={"primary"}
                                    size={"lg"}
                                    disabled={true}
                                    className="w-fit"
                                >
                                    <HiOutlineAdjustmentsHorizontal size={20} /> Filters
                                </Button>
                            }
                            key={JSON.stringify(resolvedSearchParams)}
                        >
                            <Filters searchParams={resolvedSearchParams} />
                        </Suspense>
                        <ProductsSort sort={sort} />
                    </div>
                    <ProductsList
                        products={products}
                        total={pagination.total}
                        page={pagination.page}
                        limit={pagination.limit}
                        pageSize={pagination.pageSize}
                        clearFiltersLink={`/categories/${categorySlug ? categorySlug : ""}`}
                    />
                    <Pagination
                        total={pagination.total}
                        page={pagination.page}
                        limit={pagination.limit}
                    />
                </div>
            </div>
        </main>
    )
}

const Filters = async ({ searchParams }: { searchParams: SearchParams }) => {

    const {
        query = "",
        category = "",
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale

    } = searchParams

    const filters = { ...PRODUCTS_FILTERS }

    const productsMinRating = await getSearchProductsMinRating(query, category)

    if (minRating && Number(minRating) >= productsMinRating) {
        filters.minRating = Number(minRating)
    } else {
        filters.minRating = productsMinRating
    }

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    filters.minPrice = minPrice && !isNaN(Number(minPrice)) && Number(minPrice) > 0 ? Number(minPrice) : await getSearchProductsMinPrice(query, category, filters)
    filters.maxPrice = maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0 ? Number(maxPrice) : await getSearchProductsMaxPrice(query, category, filters)

    return (
        <ProductsFilters
            initialFilters={filters}
            productsMinRating={productsMinRating}
        />
    )
}

export async function generateMetadata({ searchParams }: Props) {

    const resolvedSearchParams = await searchParams

    const {
        query = "",
        category = "",
        page: pageParam = "1",
        sort: sortParam

    } = resolvedSearchParams

    const sort: ProductsSortOptionValue = PRODUCTS_SORT_OPTIONS.find(option => option.value === sortParam)?.value || "alphabetical"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = getValidatedFilters(resolvedSearchParams)

    const data = await getSearchProducts(query, category, sort, filters, paginationPage)

    if (!data) return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
    }

    return generateSearchProductsMetadata(data.searchTearm, data.categoryName)
}

export default SearchPage