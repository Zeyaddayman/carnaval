import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import QuantitySelector from "../ui/QuantitySelector"

interface Props {
    initialQuantity: number
    limit: number
    updateQuantity: (quantity: number) => void
}

const CartItemQuantityCounter = ({ initialQuantity, limit, updateQuantity }: Props) => {

    const [quantity, setQuantity] = useState<number>(initialQuantity)

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

    const handleUpdateQuantity = () => {
        updateQuantity(quantity)
    }

    return (
        <div className='flex gap-2'>
            <Button
                variant={"basic"}
                className="!w-10"
                disabled={quantity <= 1}
                onClick={handleMinus}
            >
                -
            </Button>
            <QuantitySelector
                limit={limit}
                quantity={quantity}
                setQuantity={setQuantity}
            />
            <Button
                variant={"basic"}
                className="!w-10"
                disabled={quantity >= limit}
                onClick={handlePlus}
            >
                +
            </Button>
            {quantity !== initialQuantity ? (
                <Button
                    variant={"secondary"}
                    onClick={handleUpdateQuantity}
                >
                    Update
                </Button>
            ): (
                // Placeholder to prevent layout shift
                <div className="min-w-20 h-9"></div>
            )}
        </div>
    )
}

export default CartItemQuantityCounter