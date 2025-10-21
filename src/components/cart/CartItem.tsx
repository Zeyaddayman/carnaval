import Image from "next/image"
import RatingStars from "../ui/RatingStars"
import Link from "next/link"
import { Button } from "../ui/Button"
import { FiHeart, FiTrash2 } from "react-icons/fi"
import { formatRating } from "@/lib/formatters"
import { CartItemWithProduct } from "@/types/cart"

interface Props {
    item: CartItemWithProduct
}

const CartItem = ({ item }: Props) => {
    return (
        <div key={item.product.id} className="bg-card p-2 flex flex-col md:flex-row gap-3 border border-border rounded-md">
            <Image
                src={item.product.thumbnail}
                alt={item.product.title}
                className="self-center"
                width={150}
                height={150}
            />
            <div className="flex-1">
                <div className="flex gap-2 justify-between">
                    <div>
                        <h5 className="font-semibold">{item.product.title}</h5>
                        {item.product.brand && <p className="text-muted-foreground">by: {item.product.brand.name}</p>}
                        <div className="flex gap-2 items-center my-2">
                            <RatingStars rating={item.product.rating} />
                            <span className="text-foreground">{formatRating(item.product.rating)}</span>
                        </div>
                        <Link
                            className="underline text-sm"
                            href={`/product/${item.product.id}`}
                        >
                            View product
                        </Link>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-2xl font-semibold text-foreground mb-2">$550</p>
                        <p>2 x ${item.product.price}</p>
                        {(item.product.discountPercentage && item.product.discountPercentage > 0) && (
                            <div className="flex gap-2 items-center">
                                <p className="text-muted-foreground line-through text-sm">${item.product.price}</p>
                                <p className="bg-success/10 text-success text-sm p-1 rounded-full">-{item.product.discountPercentage}%</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-between min-h-10 my-5">
                    <div className='flex gap-2'>
                        <Button
                            variant={"basic"}
                        >
                            -
                        </Button>
                        <p
                            className='bg-input border border-border element-center w-full min-w-20 rounded-md'
                        >
                            2
                        </p>
                        <Button
                            variant={"basic"}
                        >
                            +
                        </Button>
                        <Button
                            variant={"secondary"}
                        >
                            Update
                        </Button>
                    </div>
                    <Button
                        variant={"destructiveOutline"}
                    >
                        <FiTrash2 /> Remove
                    </Button>
                </div>
                <Button
                    variant={"outline"}
                >
                    Move to Wishlist <FiHeart />
                </Button>
            </div>
        </div>
    )
}

export default CartItem