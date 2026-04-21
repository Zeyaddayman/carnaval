import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { Button } from "@/components/ui/Button"
import { getProductsSortOptions, PRODUCTS_FILTERS } from "@/constants/products"
import { generateSearchProductsMetadata } from "@/metadata/products"
import { getSearchProducts } from "@/server/db/products"
import { getSearchProductsMaxPrice, getSearchProductsMinPrice, getSearchProductsMinRating } from "@/server/utils/products-statistics"
import { Language } from "@/types/i18n"
import { ProductsSortOptionValue } from "@/types/products"
import { Translation } from "@/types/translation"
import { getValidatedFilters } from "@/utils/filters"
import getTranslation from "@/utils/translation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"

interface SearchParams {
    [key: string]: string | undefined
}

const SearchPage = async ({ params, searchParams }: PageProps<"/[lang]/search">) => {

    const [{ lang }, resolvedSearchParams] = await Promise.all([params, searchParams]) as [ { lang: string }, SearchParams ]

    const {
        query = "",
        category = "",
        page: pageParam = "1",
        sort: sortParam

    } = resolvedSearchParams

    const translation = await getTranslation(lang as Language)

    const productsSortOptions = getProductsSortOptions(translation.products.sortOptions)

    const sort: ProductsSortOptionValue = productsSortOptions.find(option => option.value === sortParam)?.value || "alphabetical"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = getValidatedFilters(resolvedSearchParams as SearchParams)

    const data = await getSearchProducts(query, category, sort, filters, paginationPage)

    if (!data) return notFound()

    const {
        searchTerm,
        categoryName,
        categorySlug,
        products,
        pagination

    } = data

    return (
        <main>
            <div className="container">
                <section className="border-2 border-border px-3 py-5 space-y-3 rounded-lg">
                    {translation.products.search.resultsFor}&ensp;
                    <span className="text-primary font-semibold">"{searchTerm}"&ensp;</span>
                    {(categoryName && categorySlug) ? (
                        <>
                        {translation.products.search.in}&ensp;
                        <Link
                            href={`/${lang}/categories/${categorySlug}`}
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
                                    <HiOutlineAdjustmentsHorizontal size={20} /> {translation.products.filters.buttonText}
                                </Button>
                            }
                            key={JSON.stringify(resolvedSearchParams)}
                        >
                            <Filters
                                searchParams={resolvedSearchParams}
                                lang={lang as Language}
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
                        clearFiltersLink={`categories/${categorySlug ? categorySlug : ""}`}
                        lang={lang as Language}
                        translation={translation.products}
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
    searchParams,
    lang,
    translation
}: {
    searchParams: SearchParams,
    lang: Language,
    translation: Translation["products"]["filters"]
}) => {

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
            lang={lang}
            translation={translation}
        />
    )
}

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/search">) {

    const [{ lang }, resolvedSearchParams] = await Promise.all([params, searchParams]) as [{ lang: string }, SearchParams]

    const {
        query = "",
        category = "",
        page: pageParam = "1",
        sort: sortParam

    } = resolvedSearchParams

    const translation = await getTranslation(lang as Language)

    const productsSortOptions = getProductsSortOptions(translation.products.sortOptions)

    const sort: ProductsSortOptionValue = productsSortOptions.find(option => option.value === sortParam)?.value || "alphabetical"

    const paginationPage = !isNaN(Number(pageParam)) ? Number(pageParam) : 1

    const filters = getValidatedFilters(resolvedSearchParams)

    const data = await getSearchProducts(query, category, sort, filters, paginationPage)

    if (!data) return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
    }

    return generateSearchProductsMetadata(data.searchTerm, data.categoryName)
}

export default SearchPage