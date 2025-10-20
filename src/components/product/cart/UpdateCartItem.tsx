import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { BiTrash } from "react-icons/bi"

interface Props {
    limit: number
    initialQuantity: number
    addItemToCart: (quantity: number) => void
    removeItemFromCart: () => void
}

const UpdateCartItem = ({ limit, initialQuantity, addItemToCart, removeItemFromCart }: Props) => {

    const [quantity, setQuantity] = useState(initialQuantity)

    useEffect(() => {
        setQuantity(initialQuantity)
    }, [initialQuantity])

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
                    onClick={removeItemFromCart}
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
                variant={"primary"}
                size={"lg"}
                onClick={() => addItemToCart(quantity)}
            >
                Save
            </Button>
        </div>
    )
}

export default UpdateCartItem