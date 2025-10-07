import CategoriesChain from "@/components/categories/CategoriesChain"
import UserCart from "@/components/product/cart/UserCart"
import LocalCart from "@/components/product/cart/LocalCart"
import OutOfStock from "@/components/product/OutOfStock"
import ProductImagesPreview from "@/components/product/ProductImagesPreview"
import ProductInfo from "@/components/product/ProductInfo"
import AddToWishlist from "@/components/ui/AddToWishlist"
import { isAuthenticated } from "@/server/db/auth"
import { getProduct } from "@/server/db/product"

interface Props {
    params: Promise<{ id: string }>
}

const productPage = async ({ params }: Props) => {

    const { id } = await params

    const { product, categoryHierarchy } = await getProduct(id)

    const session = await isAuthenticated()

    return (
        <main>
            <div className="container">
                <CategoriesChain categoryHierarchy={categoryHierarchy} />
                <div className="flex flex-col lg:flex-row gap-5 mt-5">
                    <ProductImagesPreview images={product.images} title={product.title} />
                    <div className="flex-1 space-y-6">
                        <ProductInfo product={product} />
                        <div className="bg-muted p-2 w-fit h-fit rounded-full ml-auto">
                            <AddToWishlist productId={product.id} />
                        </div>
                        {product.stock > 0 ? 
                            session ? (
                                <UserCart product={product} userId={session.userId} />
                            ) : (
                                <LocalCart product={product} />
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