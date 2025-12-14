import { CheckoutItem } from "@/types/checkout"
import { formatPrice } from "@/utils/formatters"
import Image from "next/image"

interface Props {
    item: CheckoutItem
}

const CheckoutItemCard = ({ item }: Props) => {

    const formattedFinalPrice = formatPrice(item.product.finalPrice)
    const formattedTotalPrice = formatPrice(item.product.finalPrice * item.quantity)

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
                <p className="text-muted-foreground">{item.quantity} x {formattedFinalPrice}</p>
            </div>
            <p className="sm:text-xl text-foreground">{formattedTotalPrice}</p>
        </div>
    )
}

export default CheckoutItemCard