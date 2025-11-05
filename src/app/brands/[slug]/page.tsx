import BrandProductsHeading from "@/components/brands/BrandProductsHeading"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import FiltersAndSortSkeleton from "@/components/skeletons/FiltersAndSortSkeleton"
import ProductsDataSkeleton from "@/components/skeletons/ProductsDataSkeleton"
import { PRODUCTS_FILTERS, PRODUCTS_MAX_RATING } from "@/constants/products"
import { getProductsByBrand } from "@/server/db/products"
import { getBrandsProductsMaxPrice, getBrandsProductsMinPrice, getBrandsProductsMinRating } from "@/server/db/products-statistics"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"
import { Suspense } from "react"

interface SearchParams extends Partial<ProductsFiltersOptions> {
    page?: string
    sort?: ProductsSortOptionValue
}

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

const BrandProductsPage = async ({ params, searchParams }: Props) => {

    const { slug } = await params

    return (
        <main>
            <div className="container">
                <BrandProductsHeading slug={slug} />
                <div className="mt-3">
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
        </main>
    )
}

const Data = async ({ slug, searchParams }: { slug: string, searchParams: Promise<SearchParams> }) => {

    const {
        sort = "alphabetical",
        page: paginationPage = "1",
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale
    
    } = await searchParams

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

    } = await getProductsByBrand(slug, sort, filters, Number(paginationPage))

    return (
        <>
        <ProductsList
            products={products}
            total={total}
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
        sort = "alphabetical",
        page: paginationPage = "1",
        minPrice,
        maxPrice,
        minRating,
        onlyOnSale
    
    } = await searchParams

    const filters = { ...PRODUCTS_FILTERS }

    const productsMinRating = await getBrandsProductsMinRating(slug)

    if (minRating && Number(minRating) >= productsMinRating) {
        filters.minRating = Number(minRating)
    } else {
        filters.minRating = productsMinRating
    }

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    filters.minPrice = minPrice && !isNaN(Number(minPrice)) && Number(minPrice) > 0 ? Number(minPrice) : await getBrandsProductsMinPrice(slug, filters)
    filters.maxPrice = maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0 ? Number(maxPrice) : await getBrandsProductsMaxPrice(slug, filters)

    return (
        <div className="flex justify-between items-center flex-wrap mb-3 gap-3">
            <ProductsFilters
                initialFilters={filters}
                rating={{ min: productsMinRating, max: PRODUCTS_MAX_RATING }}
            />
            <ProductsSort sort={sort} />
        </div>
    )
}

export default BrandProductsPage