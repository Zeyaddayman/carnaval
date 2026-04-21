import { CardProduct } from "@/types/products"
import ProductCard from "./ProductCard"
import { PiShootingStarLight } from "react-icons/pi"
import NoProductsFound from "./NoProductsFound"
import { Translation } from "@/types/translation"
import { inject } from "@/utils/translation"
import { Language } from "@/types/i18n"

interface Props {
    products: CardProduct[]
    total: number
    page: number
    limit: number
    pageSize: number
    clearFiltersLink: string
    lang: Language
    translation: Translation["products"]
}

const ProductsList = ({ products, total, page, limit, pageSize, clearFiltersLink, lang, translation }: Props) => {

    const firstProductIndex = (page - 1) * limit
    const lastProductIndex = firstProductIndex + pageSize

    if (!products || products.length === 0) return <NoProductsFound lang={lang} clearFiltersLink={clearFiltersLink} translation={translation.noProductsFound} />

    return (
        <section>
            <p className="my-3 flex items-center gap-2 text-muted-foreground">
                <PiShootingStarLight size={20} /> {inject(translation.showingProducts, { first: firstProductIndex + 1, last: lastProductIndex, total })}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5">
                {products.map(product => <ProductCard key={product.id} product={product} lang={lang} />)}
            </div>
        </section>
    )
}

export default ProductsList