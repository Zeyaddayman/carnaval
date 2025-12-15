import Loading from "@/app/loading"
import NoOrdersYet from "@/components/profile/orders/NoOrdersYet"
import OrdersFilter from "@/components/profile/orders/OrdersFilter"
import OrdersTable from "@/components/profile/orders/OrdersTable"
import OrdersTableSkeleton from "@/components/skeletons/OrdersTableSkeleton"
import Heading from "@/components/ui/Heading"
import { getUserOrders } from "@/server/db/orders"
import { Suspense } from "react"

interface Props {
    searchParams: Promise<{[key: string]: string | undefined}>
}

const orderStatusOptions = ["pending", "completed", "cancelled"]

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