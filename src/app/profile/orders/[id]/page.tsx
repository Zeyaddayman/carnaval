import OrderStatus from "@/components/profile/orders/OrderStatus"
import Heading from "@/components/ui/Heading"
import { getOrderDetails } from "@/server/db/orders"
import Image from "next/image"

interface Props {
    params: Promise<{ id: string }>
}

const OrderDetailsPage = async ({ params }: Props) => {

    const { id } = await params

    const order = await getOrderDetails(id)

    return (
        <>
        <Heading
            title="Order Details"
        />
        <div className="grid md:grid-cols-2 gap-5">
            <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">
                    Order Summary
                </h5>
                <div className="flex gap-2 justify-between items-center flex-wrap pb-3 border-b border-border">
                    <div>
                        <p className="text-muted-foreground text-sm font-semibold">ORDER ID</p>
                        <p>#{order.count}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm font-semibold">ORDER DATE</p>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <OrderStatus status={order.status} />
                </div>
                <div className="space-y-2 py-3">
                    <p className="flex justify-between items-center flex-wrap gap-2">items <span>{order.itemsCount}</span></p>
                    <p className="flex justify-between items-center flex-wrap gap-2">Subtotal <span>${order.subtotal}</span></p>
                    <p className="flex justify-between items-center flex-wrap gap-2">shipping 
                        <span className={`${order.shippingFee <= 0 ? "text-success" : ""}`}>{order.shippingFee <= 0 ? "Free" : `$${order.shippingFee}`}</span>
                    </p>
                </div>
                <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3">Total <span>${order.totalPrice}</span></p>
            </section>
            <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">
                    Shipping Address
                </h5>
                <div className="flex flex-col gap-1 text-muted-foreground">
                    <p>Name: {order.userName}</p>
                    <p>Phone: {order.userPhone}</p>
                    <p>{order.country}</p>
                    <p>{order.governorate}</p>
                    <p>{order.city}</p>
                    <p>{order.streetAddress}</p>
                </div>
            </section>
            <section className="px-3 py-6 md:col-span-2 flex flex-col bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">
                    Items in Order
                </h5>
                <div className="overflow-x-auto">
                    {order.products.map(item => (
                        <div
                            key={item.product.id}
                            className="flex justify-between items-center py-1 gap-2 not-last:border-b not-last:border-border"
                        >
                            <Image
                                src={item.product.thumbnail}
                                alt={item.product.title}
                                width={100}
                                height={100}
                            />
                            <div className="flex-1 min-w-20">
                                <h5 className="sm:font-semibold mb-2">{item.product.title}</h5>
                                <p className="text-muted-foreground">{item.quantity} x ${item.price}</p>
                            </div>
                            <p className="sm:text-xl text-foreground">${item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
        </>
    )
}

export default OrderDetailsPage