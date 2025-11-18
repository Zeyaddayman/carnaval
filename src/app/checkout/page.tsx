import CheckoutItemCard from "@/components/checkout/CheckoutItemCard"
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary"
import Heading from "@/components/ui/Heading"
import { isAuthenticated } from "@/server/db/auth"
import { getCheckoutItems } from "@/server/db/checkout"
import Link from "next/link"
import { redirect } from "next/navigation"

const CheckoutPage = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect('/auth/login?redirect=/checkout')
    }

    const items = await getCheckoutItems()

    return (
        <main>
            <div className="container">
                <Heading
                    title="Checkout"
                />
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-4/10 space-y-5">
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
                        <CheckoutOrderSummary items={items} />
                    </div>
                    <div className="flex-6/10 rounded-md border border-border bg-card p-3 shadow-sm">
                        <h4 className="font-semibold text-xl py-3 border-b border-border">Address</h4>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CheckoutPage