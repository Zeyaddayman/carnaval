import { Button } from "@/components/ui/Button"
import { useState } from "react"
import { BiTrash } from "react-icons/bi"

interface Props {
    productId: string
    limit: number
    initialQuantity: number
    updateItemQty: (id: string, quantity: number) => void
    removeItemFromCart: (id: string) => void
}

const UpdateCartItem = ({ productId, limit, initialQuantity, updateItemQty, removeItemFromCart }: Props) => {

    const [quantity, setQuantity] = useState(initialQuantity)

    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const handlePlus = () => {
        if (quantity < limit) {
            setQuantity(prev => prev + 1)
        }
    }

    const handleUpdateItemQty = () => {
        updateItemQty(productId, quantity)
    }

    const handleRemoveItemFromCart = () => {
        removeItemFromCart(productId)
    }

    return (
        <div className="flex gap-2 h-10 rounded-md">
            <p className='text-muted-foreground self-center'>Quantity</p>
            {quantity > 1 ? (
                <button
                    className="bg-input px-5 cursor-pointer rounded-md"
                    onClick={handleMinus}
                    disabled={quantity <= 1}
                >
                    -
                </button>
            ): (
                <button
                    className="bg-destructive text-destructive-foreground px-5 cursor-pointer rounded-md"
                    onClick={handleRemoveItemFromCart}
                    disabled={quantity > 1}
                >
                    <BiTrash />
                </button>
            )}
            <p
                className='bg-input element-center w-full min-w-30 rounded-md'
            >
                {quantity}
            </p>
            <button
                className="bg-input px-5 cursor-pointer rounded-md"
                onClick={handlePlus}
                disabled={quantity >= limit}
            >
                +
            </button>
            <Button
                variant={"default"}
                size={"lg"}
                onClick={handleUpdateItemQty}
            >
                Save
            </Button>
        </div>
    )
}

export default UpdateCartItem