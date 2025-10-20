"use client"

import { useState } from 'react';;
import { BsCartPlusFill } from 'react-icons/bs';
import { Button } from '@/components/ui/Button';

interface Props {
    limit: number
    addItemToCart: (quantity: number) => void
}

const AddToCart = ({ limit, addItemToCart }: Props) => {

    const [quantity, setQuantity] = useState(1)

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
        <div className='flex gap-3 flex-wrap'>
            <div className='flex-1 flex gap-2 min-h-10'>
                <p className='text-muted-foreground self-center'>Quantity</p>
                <Button
                    variant={"basic"}
                    onClick={handleMinus}
                    disabled={quantity <= 1}
                >
                    -
                </Button>
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
            </div>
            <Button
                className="flex-1"
                size={"lg"}
                onClick={() => addItemToCart(quantity)}
            >
                <BsCartPlusFill size={20} /> Add to Cart
            </Button>
        </div>
    )
};

export default AddToCart;