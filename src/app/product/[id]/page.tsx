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
                <div className="flex flex-col lg:flex-row gap-5 ">
                    <ProductImagesPreview images={product.images} title={product.title} />
                    <ProductInfo product={product} />
                </div>
            </div>
        </main>
    )
}

export default productPage