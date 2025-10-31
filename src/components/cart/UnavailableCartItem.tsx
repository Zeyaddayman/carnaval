import { CartItemWithProduct } from "@/types/cart"
import Image from "next/image"
import CartItemInfo from "./CartItemInfo"
import { Button } from "../ui/Button"
import { FiHeart, FiTrash2 } from "react-icons/fi"
import OutOfStock from "../product/OutOfStock"

interface Props {
    item: CartItemWithProduct
    removeItem: (productId: string) => void
    moveItemToWishlist: (product: CartItemWithProduct["product"]) => void
}

const UnavailableCartItem = ({ item, removeItem, moveItemToWishlist }: Props) => {

    const handleRemoveItem = () => {
        removeItem(item.productId)
    }

    const handleMoveToWishlist = () => {
        moveItemToWishlist(item.product)
    }

    return (
        <div className="bg-card opacity-70 p-2 flex flex-col md:flex-row gap-3 border border-border rounded-md">
            <Image
                src={item.product.thumbnail}
                alt={item.product.title}
                className="self-center"
                width={150}
                height={150}
            />
            <div className="flex-1">
                <CartItemInfo product={item.product} quantity={item.quantity} />
                <div className="bg-destructive/70 mt-3 text-destructive-foreground text-sm text-center font-semibold p-2 rounded-full">
                    Out of stock
                </div>
                <div className="flex gap-2 flex-wrap justify-between items-center mt-5">
                    <Button
                        variant={"destructiveOutline"}
                        onClick={handleRemoveItem}
                    >
                        <FiTrash2 /> Remove
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={handleMoveToWishlist}
                    >
                        Move to Wishlist <FiHeart />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UnavailableCartItem