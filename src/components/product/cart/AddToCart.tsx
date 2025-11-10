"use client"

import { useState } from 'react';;
import { BsCartPlusFill } from 'react-icons/bs';
import { Button } from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';

interface Props {
    limit: number
    addItem: (quantity: number) => void
}

const AddToCart = ({ limit, addItem }: Props) => {

    const [quantity, setQuantity] = useState<number>(1)

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

    const handleAddItem = () => {
        addItem(quantity)
    }

    return (
        <div className='flex flex-wrap gap-2 items-center'>
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
            <Button
                className="flex-1"
                onClick={handleAddItem}
            >
                <BsCartPlusFill size={20} /> Add to Cart
            </Button>
        </div>
    )
};

export default AddToCart;