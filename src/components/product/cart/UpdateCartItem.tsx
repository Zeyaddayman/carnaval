import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { FiTrash2 } from "react-icons/fi"

interface Props {
    limit: number
    initialQuantity: number
    updateItem: (quantity: number) => void
    removeItem: () => void
}

const UpdateCartItem = ({ limit, initialQuantity, updateItem, removeItem }: Props) => {

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

    const handleUpdateItem = () => {
        updateItem(quantity)
    }

    const handleRemoveItem = () => {
        removeItem()
    }

    return (
        <div className="flex gap-2 h-10 rounded-md">
            <p className='text-muted-foreground self-center'>Quantity</p>
            {quantity > 1 ? (
                <Button
                    variant={"basic"}
                    onClick={handleMinus}
                    disabled={quantity <= 1}
                >
                    -
                </Button>
            ): (
                <Button
                    variant={"destructiveOutline"}
                    onClick={handleRemoveItem}
                    disabled={quantity > 1}
                >
                    <FiTrash2 />
                </Button>
            )}
            <p
                className='bg-input element-center w-full min-w-30 rounded-md'
            >
                {quantity}
            </p>
            <Button
                variant={"basic"}
                onClick={handlePlus}
                disabled={quantity >= limit}
            >
                +
            </Button>
            <Button
                variant={"primary"}
                size={"lg"}
                onClick={handleUpdateItem}
            >
                Save
            </Button>
        </div>
    )
}

export default UpdateCartItem