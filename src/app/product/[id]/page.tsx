import CategoriesChain from "@/components/categories/CategoriesChain"
import ProductLocalCart from "@/components/product/cart/LocalCart"
import ProductUserCart from "@/components/product/cart/UserCart"
import OutOfStock from "@/components/product/OutOfStock"
import ProductImagesPreview from "@/components/product/ProductImagesPreview"
import ProductInfo from "@/components/product/ProductInfo"
import ToggleWishlistItem from "@/components/ui/ToggleWishlistItem"
import { isAuthenticated } from "@/server/db/auth"
import { getProduct } from "@/server/db/product"

interface Props {
    params: Promise<{ id: string }>
}

const productPage = async ({ params }: Props) => {

    const { id } = await params

    const { product, categoryHierarchy } = await getProduct(id)

    const session = await isAuthenticated()

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    return (
        <main>
            <div className="container">
                <CategoriesChain categoryHierarchy={categoryHierarchy} />
                <div className="flex flex-col lg:flex-row gap-5 mt-5">
                    <ProductImagesPreview images={product.images} />
                    <div className="flex-1 space-y-6">
                        <ProductInfo product={product} />
                        <div className="bg-muted p-2 w-fit h-fit rounded-full ml-auto">
                            <ToggleWishlistItem session={session} product={product} />
                        </div>
                        {product.stock > 0 ? 
                            session ? (
                                <ProductUserCart
                                    userId={session.userId}
                                    product={product}
                                    initialLimit={limit}
                                />
                            ) : (
                                <ProductLocalCart product={product} initialLimit={limit} />
                            )
                            : <OutOfStock />
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default productPage