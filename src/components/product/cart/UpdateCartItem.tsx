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
        <div className="flex flex-wrap gap-2 rounded-md">
            <p className='text-muted-foreground self-center'>Quantity</p>
            <Button
                variant={"basic"}
                size={"lg"}
                onClick={handleMinus}
                disabled={quantity <= 1}
            >
                -
            </Button>
            <p
                className='bg-input element-center h-10 flex-1 min-w-30 rounded-md'
            >
                {quantity}
            </p>
            <Button
                variant={"basic"}
                size={"lg"}
                onClick={handlePlus}
                disabled={quantity >= limit}
            >
                +
            </Button>
            <div className="flex gap-2">
                <Button
                    variant={"secondary"}
                    size={"lg"}
                    onClick={handleUpdateItem}
                >
                    Update
                </Button>
                <Button
                    variant={"destructiveOutline"}
                    size={"lg"}
                    onClick={handleRemoveItem}
                >
                    <FiTrash2 />
                </Button>
            </div>
        </div>
    )
}

export default UpdateCartItem