import CheckoutAddAddressButton from "@/components/checkout/CheckoutAddAddressButton"
import CheckoutAddress from "@/components/checkout/CheckoutAddress"
import CheckoutItemCard from "@/components/checkout/CheckoutItemCard"
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary"
import Heading from "@/components/ui/Heading"
import { SHIPPING_COST, SHIPPING_THRESHOLD } from "@/constants/cart"
import { formatPrice } from "@/lib/formatters"
import { isAuthenticated } from "@/server/db/auth"
import { getCheckoutItems } from "@/server/db/checkout"
import { getProfile, getUserAddresses } from "@/server/db/profile"
import Link from "next/link"
import { redirect } from "next/navigation"

const CheckoutPage = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect('/auth/login?redirect=/checkout')
    }

    const items = await getCheckoutItems()

    const addresses = await getUserAddresses()

    const profile = await getProfile()

    const defaultAddress = addresses.find(address => address.default) || addresses[0]

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = formatPrice(items.reduce((acc, item) => {

        const hasDiscount = item.product.discountPercentage && item.product.discountPercentage > 0
    
        const finalPrice = hasDiscount
            ? (item.product.price - item.product.price * item.product.discountPercentage! / 100)
            : item.product.price

        return acc + item.quantity * finalPrice

    }, 0))

    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = formatPrice(subtotal + shipping)

    return (
        <main>
            <div className="container">
                <Heading
                    title="Checkout"
                />
                <div className="flex flex-col items-start lg:flex-row gap-5">
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
                        <CheckoutOrderSummary
                            itemsCount={itemsCount}
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                        />
                    </div>
                    <div className="flex-6/10 sticky top-5 rounded-md border border-border bg-card p-3 shadow-sm">
                        <h4 className="font-semibold text-xl flex gap-2 justify-between items-center py-3 border-b border-border">
                            Shipping Address
                            <Link
                                href={"/profile/addresses"}
                                className="text-primary underline text-sm"
                            >
                                Manage addresses
                            </Link>
                        </h4>
                        {addresses.length > 0 ? (
                            <CheckoutAddress
                                addresses={addresses}
                                defaultAddress={defaultAddress}
                                total={total}
                                userName={profile.name}
                                userPhone={profile.phone}
                            />
                        ): (
                            <div className="my-3">
                                <CheckoutAddAddressButton
                                    userName={profile.name}
                                    userPhone={profile.phone}
                                    isFirstAddress={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CheckoutPage