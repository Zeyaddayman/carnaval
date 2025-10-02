"use client"

import { useState } from 'react';;
import { ProductWithRelations } from '@/types/products';
import { CartItem } from '@/types/cart';
import { BsCartPlusFill } from 'react-icons/bs';
import { Button } from '@/components/ui/Button';

interface Props {
    product: ProductWithRelations
    limit: number
    addItemToCart: (cartItem: CartItem) => void
}

const AddToCart = ({ product, limit, addItemToCart }: Props) => {

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

    const addToCart = () => {
        addItemToCart({
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            brand: product.brand?.name,
            price: product.price,
            discountPercentage: product.discountPercentage,
            qty: quantity
        })
    }

    return (
        <div className='flex gap-3 flex-wrap'>
            <div className='flex-1 flex gap-2 min-h-10'>
                <p className='text-muted-foreground self-center'>Quantity</p>
                <button
                    className="bg-input px-5 cursor-pointer rounded-md"
                    onClick={handleMinus}
                    disabled={quantity <= 1}
                >
                    -
                </button>
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
            </div>
            <Button
                className="flex-1"
                size={"lg"}
                onClick={addToCart}
            >
                <BsCartPlusFill size={20} /> Add to Cart
            </Button>
        </div>
    )
};

export default AddToCart;