import BrandProductsHeading from "@/components/brands/BrandProductsHeading"
import Pagination from "@/components/products/Pagination"
import ProductsFilters from "@/components/products/ProductsFilters"
import ProductsList from "@/components/products/ProductsList"
import ProductsSort from "@/components/products/ProductsSort"
import { PRODUCTS_FILTERS, PRODUCTS_MAX_RATING } from "@/constants/products"
import { getProductsByBrand } from "@/server/db/products"
import { getBrandsProductsMaxPrice, getBrandsProductsMinPrice, getBrandsProductsMinRating } from "@/server/db/products-statistics"
import { ProductsFiltersOptions, ProductsSortOptionValue } from "@/types/products"

interface SearchParams extends Partial<ProductsFiltersOptions> {
    page?: string
    sort?: ProductsSortOptionValue
}

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}

const BrandProductsPage = async ({ params, searchParams }: Props) => {

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

    const productsMinRating = await getBrandsProductsMinRating(slug)

    if (minRating && Number(minRating) >= productsMinRating) {
        filters.minRating = Number(minRating)
    } else {
        filters.minRating = productsMinRating
    }

    if (String(onlyOnSale) === "true") filters.onlyOnSale = true

    filters.minPrice = minPrice ? Number(minPrice) : await getBrandsProductsMinPrice(slug, filters)
    filters.maxPrice = maxPrice ? Number(maxPrice) : await getBrandsProductsMaxPrice(slug, filters)

    const {
        products,
        total,
        page,
        pageSize,
        limit

    } = await getProductsByBrand(slug, sort, filters, Number(pageinationPage))

    return (
        <main>
            <div className="container">
                <BrandProductsHeading slug={slug} />
                <div>
                    <div className="flex justify-between items-center flex-wrap mb-3 gap-3">
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
        </main>
    )
}

export default BrandProductsPage