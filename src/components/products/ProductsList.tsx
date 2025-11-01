import { CardProduct } from "@/types/products"
import ProductCard from "./ProductCard"
import { PiShootingStarLight } from "react-icons/pi"

interface Props {
    products: CardProduct[]
    total: number
}

const ProductsList = ({ products, total }: Props) => {

    if (!products || products.length === 0) {
        <p className="text-center font-semibold text-muted-foreground">No products found.</p>
    }

    return (
        <section className="flex-1">
            <p className="my-3 flex items-center gap-2 text-muted-foreground">
                <PiShootingStarLight size={20} /> Showing {total} products
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </section>
    )
}

export default ProductsList