import Cart from "@/components/product/cart"
import OutOfStock from "@/components/product/OutOfStock"
import ProductImagesPreview from "@/components/product/ProductImagesPreview"
import ProductInfo from "@/components/product/ProductInfo"
import { getProduct } from "@/server/db/product"

interface Props {
    params: Promise<{ id: string }>
}

const productPage = async ({ params }: Props) => {

    const { id } = await params

    const product = await getProduct(id)

    return (
        <main>
            <div className="container">
                <div className="flex flex-col lg:flex-row gap-5">
                    <ProductImagesPreview images={product.images} title={product.title} />
                    <div className="flex-1 space-y-10">
                        <ProductInfo product={product} />
                        {product.stock > 0 ? (
                            <Cart product={product} />
                        ): (
                            <OutOfStock />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default productPage