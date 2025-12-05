import BrandProductsHeading from "@/components/brands/BrandProductsHeading"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { Button } from "@/components/ui/Button"
import { PRODUCTS_FILTERS, PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { getProductsByBrand } from "@/server/db/products"
import { getBrandProductsMaxPrice, getBrandProductsMinPrice, getBrandProductsMinRating } from "@/server/utils/products-statistics"
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

const BrandProductsPage = async ({ params, searchParams }: Props) => {

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


    const data = await getProductsByBrand(slug, sort, filters, paginationPage)

    if (!data) return notFound()

    const {
        brandName,
        products,
        total,
        page,
        pageSize,
        limit

    } = data


    return (
        <main>
            <div className="container">
                <BrandProductsHeading name={brandName} slug={slug} />
                <div className="mt-3">
                    <div className="flex justify-between items-center flex-wrap mb-3 gap-3">
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
                    <ProductsList
                        slug={slug}
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

    const productsMinRating = await getBrandProductsMinRating(slug)

    if (minRating && Number(minRating) >= productsMinRating) {
        filters.minRating = Number(minRating)
    } else {
        filters.minRating = productsMinRating
    }

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    filters.minPrice = minPrice && !isNaN(Number(minPrice)) && Number(minPrice) > 0 ? Number(minPrice) : await getBrandProductsMinPrice(slug, filters)
    filters.maxPrice = maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0 ? Number(maxPrice) : await getBrandProductsMaxPrice(slug, filters)

    return (
        <ProductsFilters
            initialFilters={filters}
            productsMinRating={productsMinRating}
        />
    )
}

export default BrandProductsPage