import { formatPrice } from "@/lib/formatters"
import { CheckoutItem } from "@/types/checkout"
import Image from "next/image"

interface Props {
    item: CheckoutItem
}

const CheckoutItemCard = ({ item }: Props) => {

    const hasDiscount = item.product.discountPercentage && item.product.discountPercentage > 0
    
    const productPrice = formatPrice(Number(item.product.price))

    const finalPrice = hasDiscount
        ? formatPrice(Number(item.product.price) - (Number(item.product.price) * item.product.discountPercentage! / 100))
        : productPrice

    const totalPrice = formatPrice(finalPrice * item.quantity)

    return (
        <div className="bg-white border border-border p-2 flex justify-between items-center gap-2 rounded-lg overflow-x-auto">
            <Image
                src={item.product.thumbnail}
                alt={item.product.title}
                width={100}
                height={100}
            />
            <div className="flex-1">
                <h5 className="sm:font-semibold mb-2">{item.product.title}</h5>
                <p className="text-muted-foreground">{item.quantity} x ${finalPrice}</p>
            </div>
            <p className="sm:text-xl text-foreground">${totalPrice}</p>
        </div>
    )
}

export default CheckoutItemCard