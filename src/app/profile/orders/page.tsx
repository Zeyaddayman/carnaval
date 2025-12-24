import NoOrdersYet from "@/components/profile/orders/NoOrdersYet"
import OrdersFilter from "@/components/profile/orders/OrdersFilter"
import OrdersTable from "@/components/profile/orders/OrdersTable"
import Heading from "@/components/ui/Heading"
import { ordersMetadata } from "@/metadata/orders"
import { getUserOrders } from "@/server/db/orders"

interface Props {
    searchParams: Promise<{[key: string]: string | undefined}>
}

export const metadata = ordersMetadata

const ProfileOrdersPage = async ({ searchParams }: Props) => {

    const filter = (await searchParams).filter || "all"

    return (
        <>
        <Heading
            title="Order History"
        />
        <Orders filter={filter} />
        </>
    )
}

const orderStatusOptions = ["pending", "completed", "cancelled"]

const Orders = async ({ filter }: { filter: string }) => {

    const orders = await getUserOrders(filter)

    if ((!orders || orders.length === 0) && !orderStatusOptions.includes(filter)) return <NoOrdersYet />

    return (
        <>
        <div className="flex justify-end mb-5">
            <OrdersFilter filter={filter} />
        </div>
        <OrdersTable orders={orders} />
        </>
    )
}

export default ProfileOrdersPage