import CheckoutAddAddressButton from "@/components/checkout/CheckoutAddAddressButton"
import CheckoutForm from "@/components/checkout/CheckoutForm"
import CheckoutItems from "@/components/checkout/CheckoutItems"
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary"
import Heading from "@/components/ui/Heading"
import { checkoutMetadata } from "@/metadata/checkout"
import { getUserAddresses } from "@/server/db/address"
import { getCheckoutItems } from "@/server/db/checkout"
import { getProfile } from "@/server/db/profile"
import { isAuthenticated } from "@/server/utils/auth"
import { createPaymentIntent } from "@/server/utils/checkout"
import { getShipping, getTotal } from "@/utils"
import { getCartItemsCount, getCartSubtotal } from "@/utils/cart"
import { formatPrice } from "@/utils/formatters"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = checkoutMetadata

const CheckoutPage = async () => {

    const [
        items,
        addresses,
        profile

    ] = await Promise.all([
        getCheckoutItems(),
        getUserAddresses(),
        getProfile()
    ])

    if (!items || items.length === 0) redirect('/cart')

    const defaultAddress = addresses.find(address => address.isDefault) || addresses[0]

    const itemsCount = getCartItemsCount(items)
    const subtotal = getCartSubtotal(items)
    const shipping = getShipping(subtotal)
    const total = getTotal(subtotal, shipping)

    const formattedSubtotal = formatPrice(subtotal)
    const formattedShipping = formatPrice(shipping)
    const formattedTotal = formatPrice(total)

    const session = await isAuthenticated()

    const { client_secret, paymentIntentId } = await createPaymentIntent(total, session!.userId)

    return (
        <main>
            <div className="container">
                <Heading
                    title="Checkout"
                />
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-4/10 space-y-5">
                        <CheckoutOrderSummary
                            itemsCount={itemsCount}
                            shipping={shipping}
                            formattedSubtotal={formattedSubtotal}
                            formattedShipping={formattedShipping}
                            formattedTotal={formattedTotal}
                        />
                        <CheckoutItems
                            items={items}
                        />
                    </div>
                    <div className="flex-6/10 lg:self-start rounded-md border border-border bg-card p-3 shadow-sm">
                        <h4 className="font-semibold text-xl flex gap-2 justify-between items-center flex-wrap py-3 border-b border-border">
                            Address & Payment
                            <Link
                                href={"/profile/addresses"}
                                className="text-primary underline text-sm"
                            >
                                Manage addresses
                            </Link>
                        </h4>
                        {addresses.length > 0 ? (
                            <CheckoutForm
                                clientSecret={client_secret!}
                                paymentIntentId={paymentIntentId}
                                addresses={addresses}
                                defaultAddress={defaultAddress}
                                formattedTotal={formattedTotal}
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