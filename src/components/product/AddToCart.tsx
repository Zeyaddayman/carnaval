"use client"

import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface Props {
    limit: number
}

const AddToCart = ({ limit }: Props) => {
    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCart = async () => {
        console.log(quantity)
    };

    return (
        <div className='flex gap-3 flex-wrap items-stretch'>
            <div className='flex gap-2'>
                <button
                    className="bg-input px-3 cursor-pointer rounded-md"
                    onClick={handleMinus}
                    disabled={quantity <= 1}
                >
                    -
                </button>
                <p
                    className='bg-input element-center w-40 rounded-md'
                >
                    {quantity}
                </p>
                <button
                    className="bg-input px-3 cursor-pointer rounded-md"
                    onClick={handlePlus}
                    disabled={quantity >= limit}
                >
                    +
                </button>
            </div>
            <Button
                className="flex-1"
                size={"lg"}
                onClick={handleAddToCart}
            >
                <FiShoppingCart size={20} /> Add to Cart
            </Button>
        </div>
    )
};

export default AddToCart;