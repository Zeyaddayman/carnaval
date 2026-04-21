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
import { Language } from "@/types/i18n"
import { getShipping, getTotal } from "@/utils"
import { getCartItemsCount, getCartSubtotal } from "@/utils/cart"
import { formatPrice } from "@/utils/formatters"
import getTranslation from "@/utils/translation"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = checkoutMetadata

const CheckoutPage = async ({ params }: PageProps<"/[lang]/checkout">) => {

    const [
        items,
        addresses,
        profile,
        { lang }

    ] = await Promise.all([
        getCheckoutItems(),
        getUserAddresses(),
        getProfile(),
        params
    ])

    if (!items || items.length === 0) redirect('/cart')

    const translation = await getTranslation(lang as Language)

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
                    title={translation.checkout.title}
                />
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-4/10 space-y-5">
                        <CheckoutOrderSummary
                            itemsCount={itemsCount}
                            shipping={shipping}
                            formattedSubtotal={formattedSubtotal}
                            formattedShipping={formattedShipping}
                            formattedTotal={formattedTotal}
                            translation={translation.checkout.summary}
                        />
                        <CheckoutItems
                            items={items}
                            lang={lang as Language}
                            translation={translation.checkout.cart}
                        />
                    </div>
                    <div className="flex-6/10 lg:self-start rounded-md border border-border bg-card p-3 shadow-sm">
                        <h4 className="font-semibold text-xl flex gap-2 justify-between items-center flex-wrap py-3 border-b border-border">
                            {translation.checkout.addressAndPayment.title}
                            <Link
                                href={`/${lang}/profile/addresses`}
                                className="text-primary underline text-sm"
                            >
                                {translation.checkout.addressAndPayment.manageAddresses}
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
                                lang={lang as Language}
                                translation={translation}
                            />
                        ): (
                            <div className="my-3">
                                <CheckoutAddAddressButton
                                    userName={profile.name}
                                    userPhone={profile.phone}
                                    isFirstAddress={true}
                                    translation={translation.profile.addresses}
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