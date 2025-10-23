import { useEffect, useState } from "react"
import { Button } from "../ui/Button"

interface Props {
    initialQuantity: number
    limit: number
    updateQuantity: (quantity: number) => void
}

const CartItemQuantityCounter = ({ initialQuantity, limit, updateQuantity }: Props) => {

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
        <div className='flex gap-2'>
            <Button
                variant={"basic"}
                disabled={quantity <= 1}
                onClick={handleMinus}
            >
                -
            </Button>
            <p
                className='bg-input border border-border element-center w-full min-w-20 rounded-md'
            >
                {quantity}
            </p>
            <Button
                variant={"basic"}
                disabled={quantity >= limit}
                onClick={handlePlus}
            >
                +
            </Button>
            {quantity !== initialQuantity ? (
                <Button
                    variant={"secondary"}
                    onClick={() => updateQuantity(quantity)}
                >
                    Update
                </Button>
            ): (
                // placeholder to prevent layout shift
                <div className="min-w-20 h-9"></div>
            )}
        </div>
    )
}

export default CartItemQuantityCounter