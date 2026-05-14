import BrandProductsHeading from "@/components/brands/BrandProductsHeading"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { Button } from "@/components/ui/Button"
import { getProductsSortOptions, PRODUCTS_FILTERS } from "@/constants/products"
import { getBrandProductsMetadata } from "@/metadata/products"
import { getProductsByBrand } from "@/server/db/products"
import { getBrandProductsMaxPrice, getBrandProductsMinPrice, getBrandProductsMinRating } from "@/server/utils/products-statistics"
import { Language } from "@/generated/prisma"
import { ProductsSortOptionValue } from "@/types/products"
import { Translation } from "@/types/translation"
import { getValidatedFilters } from "@/utils/filters"
import getTranslation from "@/utils/translation"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"

interface SearchParams {
    [key: string]: string | undefined
}

const BrandProductsPage = async ({ params, searchParams }: PageProps<"/[lang]/brands/[slug]">) => {

    const [
        resolvedParams,
        resolvedSearchParams

    ] = await Promise.all([params, searchParams])

    const { slug, lang } = resolvedParams as { slug: string, lang: Language }

    const {
        page: pageParam = "1",
        sort: sortParam

    } = resolvedSearchParams

    const translation = await getTranslation(lang)

    const productsSortOptions = getProductsSortOptions(translation.products.sortOptions)

    const sort: ProductsSortOptionValue = productsSortOptions.find(option => option.value === sortParam)?.value || "recommended"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = getValidatedFilters(resolvedSearchParams as SearchParams)


    const data = await getProductsByBrand(slug, sort, filters, paginationPage, lang)

    if (!data) return notFound()

    const {
        brandName,
        products,
        pagination

    } = data


    return (
        <main>
            <div className="container">
                <BrandProductsHeading
                    name={brandName}
                    slug={slug}
                    lang={lang}
                    brandsText={translation.products.brands.brandsText}
                />
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
                                    <HiOutlineAdjustmentsHorizontal size={20} /> {translation.products.filters.buttonText}
                                </Button>
                            }
                            key={JSON.stringify(resolvedSearchParams)}
                        >
                            <Filters
                                slug={slug}
                                searchParams={resolvedSearchParams as SearchParams}
                                lang={lang}
                                translation={translation.products.filters}
                            />
                        </Suspense>
                        <ProductsSort
                            sort={sort}
                            translation={translation.products.sortOptions}
                        />
                    </div>
                    <ProductsList
                        products={products}
                        total={pagination.total}
                        page={pagination.page}
                        limit={pagination.limit}
                        pageSize={pagination.pageSize}
                        clearFiltersLink={`brands/${slug}`}
                        lang={lang}
                        translation={translation}
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

const Filters = async ({
    slug,
    searchParams,
    lang,
    translation
}: {
    slug: string,
    searchParams: SearchParams,
    lang: Language,
    translation: Translation["products"]["filters"]
}) => {

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
            lang={lang}
            translation={translation}
        />
    )
}

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/brands/[slug]">) {

    const [
        resolvedParams,
        resolvedSearchParams

    ] = await Promise.all([params, searchParams])

    const { slug, lang } = resolvedParams as { slug: string, lang: Language } 

    const {
        page: pageParam = "1",
        sort: sortParam

    } = resolvedSearchParams

    const translation = await getTranslation(lang)

    const productsSortOptions = getProductsSortOptions(translation.products.sortOptions)

    const sort: ProductsSortOptionValue = productsSortOptions.find(option => option.value === sortParam)?.value || "recommended"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = getValidatedFilters(resolvedSearchParams as SearchParams)

    const data = await getProductsByBrand(slug, sort, filters, paginationPage, lang)

    if (!data) return {
        title: translation.metadata.notFound.title,
        description: translation.metadata.notFound.description
    }

    return getBrandProductsMetadata(translation.metadata, data.brandName)
}

export default BrandProductsPage