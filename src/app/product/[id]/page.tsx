import AddToCart from "@/components/product/AddToCart"
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

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    return (
        <main>
            <div className="container">
                <div className="flex flex-col lg:flex-row gap-5">
                    <ProductImagesPreview images={product.images} title={product.title} />
                    <div className="flex-1 space-y-10">
                        <ProductInfo product={product} />
                        {product.stock > 0 ? (
                            <AddToCart limit={limit} />
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