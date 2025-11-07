import { CardProduct } from "@/types/products"
import ProductCard from "./ProductCard"
import { PiShootingStarLight } from "react-icons/pi"

interface Props {
    products: CardProduct[]
    total: number
    page: number
    limit: number
    pageSize: number
}

const ProductsList = ({ products, total, page, limit, pageSize }: Props) => {

    const firstProductIndex = (page - 1) * limit
    const lastProductIndex = firstProductIndex + pageSize

    return (
        <section>
            <p className="my-3 flex items-center gap-2 text-muted-foreground">
                <PiShootingStarLight size={20} /> Showing {firstProductIndex + 1}-{lastProductIndex} of {total} products
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </section>
    )
}

export default ProductsList