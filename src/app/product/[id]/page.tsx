import CategoriesChain from "@/components/categories/CategoriesChain"
import GoBack from "@/components/product/GoBack"
import ProductImagesPreview from "@/components/product/ProductImagesPreview"
import ProductInfo from "@/components/product/ProductInfo"
import WishlistAndCart from "@/components/product/WishlistAndCart"
import { db } from "@/lib/prisma"
import { getProduct } from "@/server/db/product"
import { notFound } from "next/navigation"

interface Props {
    params: Promise<{ id: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
    const allProducts = await db.product.findMany({
        select: { id: true }
    })

    return allProducts.map(({ id }) => ({ id }))
}

const productPage = async ({ params }: Props) => {

    const { id } = await params

    const data = await getProduct(id)

    if (!data) return notFound()

    const { product, categoryHierarchy } = data

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    return (
        <main>
            <div className="container">
                <CategoriesChain categoryHierarchy={categoryHierarchy} />
                <div className="w-fit mt-3">
                    <GoBack />
                </div>
                <div className="flex flex-col lg:flex-row gap-5 mt-5">
                    <ProductImagesPreview images={product.images} />
                    <div className="flex-1 space-y-6">
                        <ProductInfo product={product} />
                        <WishlistAndCart product={product} initialLimit={limit} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default productPage