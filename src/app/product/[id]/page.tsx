import CategoriesChain from "@/components/categories/CategoriesChain"
import GoBack from "@/components/product/GoBack"
import ProductImagesPreview from "@/components/product/ProductImagesPreview"
import ProductInfo from "@/components/product/ProductInfo"
import WishlistAndCart from "@/components/product/WishlistAndCart"
import { db } from "@/lib/prisma"
import { getProduct } from "@/server/db/product"
import { notFound } from "next/navigation"
import { getProductLimit } from "@/utils/product"
import { generateProductMetadata } from "@/metadata/product"

interface Props {
    params: Promise<{ id: string }>
}

export const revalidate = 3600

const productPage = async ({ params }: Props) => {

    const { id } = await params

    const data = await getProduct(id)

    if (!data) return notFound()

    const { product, categoryHierarchy } = data

    const limit = getProductLimit(product.stock, product.limit)

    return (
        <main>
            <div className="container">
                <CategoriesChain categoryHierarchy={categoryHierarchy} />
                <div className="w-fit mt-2">
                    <GoBack />
                </div>
                <div className="flex flex-col lg:flex-row gap-5 mt-5">
                    <ProductImagesPreview images={product.images} />
                    <div className="flex-1 space-y-6">
                        <ProductInfo product={product} />
                        <WishlistAndCart product={product} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export const generateMetadata = async ({ params }: Props) => {

    const { id } = await params

    const data = await getProduct(id)

    if (!data) return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist or has been removed.'
    }

    const { product } = data

    return generateProductMetadata(product)
}

export async function generateStaticParams() {
    const allProducts = await db.product.findMany({
        select: { id: true }
    })

    return allProducts.map(({ id }) => ({ id }))
}

export default productPage