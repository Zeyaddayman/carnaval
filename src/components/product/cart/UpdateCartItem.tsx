import { Button } from "@/components/ui/Button"
import QuantitySelector from "@/components/ui/QuantitySelector"
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
        <div className="flex flex-wrap gap-2 items-center">
            <p className='text-muted-foreground'>Quantity</p>
            <Button
                variant={"basic"}
                className="!w-10"
                onClick={handleMinus}
                disabled={quantity <= 1}
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
                onClick={handlePlus}
                disabled={quantity >= limit}
            >
                +
            </Button>
            <div className="flex-1 flex gap-2">
                <Button
                    variant={"secondary"}
                    className="flex-1"
                    onClick={handleUpdateItem}
                >
                    Update
                </Button>
                <Button
                    variant={"destructiveOutline"}
                    className="flex-1"
                    onClick={handleRemoveItem}
                >
                    <FiTrash2 />
                </Button>
            </div>
        </div>
    )
}

export default UpdateCartItem