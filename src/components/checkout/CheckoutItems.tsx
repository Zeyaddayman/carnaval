import Link from "next/link"
import CheckoutItemCard from "./CheckoutItemCard"
import { CheckoutItem } from "@/types/checkout"

interface Props {
    items: CheckoutItem[]
}

const CheckoutItems = ({ items }: Props) => {
    return (
        <div className="rounded-md border border-border bg-card p-3 shadow-sm">
            <h4 className="font-semibold text-xl flex gap-2 justify-between items-center py-3 border-b border-border">
                Your Cart
                <Link
                    href={"/cart"}
                    className="text-primary underline text-sm"
                >
                    Edit cart
                </Link>
            </h4>
            <div className="space-y-2 my-3">
                {items.map(item => (
                    <CheckoutItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}

export default CheckoutItems