import OrderStatus from "@/components/profile/orders/OrderStatus"
import Heading from "@/components/ui/Heading"
import { orderMetadata } from "@/metadata/orders"
import { getOrderDetails } from "@/server/db/orders"
import { Language } from "@/types/i18n"
import { formatDate, formatPrice } from "@/utils/formatters"
import getTranslation from "@/utils/translation"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata = orderMetadata

const OrderDetailsPage = async ({ params }: PageProps<"/[lang]/profile/orders/[id]">) => {

    const { id, lang } = await params

    const order = await getOrderDetails(id)

    if (!order) return notFound()

    const translation = await getTranslation(lang as Language)

    const formattedSubtotal = formatPrice(order.subtotal)
    const formattedShippingFee = formatPrice(order.shippingFee)
    const formattedTotalPrice = formatPrice(order.totalPrice)

    return (
        <>
        <Heading
            title={translation.profile.orderDetails.title}
        />
        <div className="grid md:grid-cols-2 gap-5">
            <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">
                    {translation.profile.orderDetails.summary.title}
                </h5>
                <div className="flex gap-2 justify-between items-center flex-wrap pb-3 border-b border-border">
                    <div>
                        <p className="text-muted-foreground text-sm font-semibold">{translation.profile.orderDetails.summary.id}</p>
                        <p>#{order.count}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-semibold">{translation.profile.orderDetails.summary.date}</p>
                        <p>{formatDate(order.createdAt)}</p>
                    </div>
                    <OrderStatus
                        status={order.status}
                        translation={translation.profile.orderDetails.summary.orderStatus}
                    />
                </div>
                <div className="space-y-2 py-3">
                    <p className="flex justify-between items-center flex-wrap gap-2">
                        {translation.profile.orderDetails.summary.items} <span>{order.itemsCount}</span>
                    </p>
                    <p className="flex justify-between items-center flex-wrap gap-2">
                        {translation.profile.orderDetails.summary.subtotal} <span>{formattedSubtotal}</span>
                    </p>
                    <p className="flex justify-between items-center flex-wrap gap-2">{translation.profile.orderDetails.summary.shipping} 
                        <span className={`${order.shippingFee <= 0 ? "text-success" : ""}`}>{order.shippingFee <= 0 ? translation.profile.orderDetails.summary.freeText : `${formattedShippingFee}`}</span>
                    </p>
                </div>
                <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3">
                    {translation.profile.orderDetails.summary.total} <span>{formattedTotalPrice}</span></p>
            </section>
            <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">
                    {translation.profile.orderDetails.address.title}
                </h5>
                <div className="flex flex-col gap-1 text-muted-foreground">
                    <p>{translation.profile.orderDetails.address.name}: {order.userName}</p>
                    <p>{translation.profile.orderDetails.address.phone}: {order.userPhone}</p>
                    <p>{order.country}</p>
                    <p>{order.governorate}</p>
                    <p>{order.city}</p>
                    <p>{order.streetAddress}</p>
                </div>
            </section>
            <section className="px-3 py-6 md:col-span-2 flex flex-col bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">
                    {translation.profile.orderDetails.items.title}
                </h5>
                <div className="overflow-x-auto">
                    {order.products.map(item => (
                        <div
                            key={item.product.id}
                            className="flex justify-between items-center py-1 gap-2 not-last:border-b not-last:border-border"
                        >
                            <Link
                                href={`/${lang}/product/${item.product.id}`}
                            >
                                <Image
                                    src={item.product.thumbnail}
                                    alt={`View ${item.product.title}`}
                                    width={100}
                                    height={100}
                                />
                            </Link>
                            <div className="flex-1 min-w-20">
                                <h5 className="sm:font-semibold mb-2">{item.product.title}</h5>
                                <p className="text-muted-foreground">{item.quantity} &times; {formatPrice(item.price)}</p>
                            </div>
                            <p className="sm:text-xl text-foreground">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
        </>
    )
}

export default OrderDetailsPage