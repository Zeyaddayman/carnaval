import OrdersFilter from "@/components/profile/orders/OrdersFilter"
import OrdersTable from "@/components/profile/orders/OrdersTable"
import Heading from "@/components/ui/Heading"

interface Props {
    searchParams: Promise<{[key: string]: string | undefined}>
}

const ProfileOrdersPage = async ({ searchParams }: Props) => {

    const filter = (await searchParams).filter || "all"

    return (
        <>
        <Heading
            title="Order History"
        />
        <div className="flex justify-end mb-5">
            <OrdersFilter filter={filter} />
        </div>
        <OrdersTable filter={filter} />
        </>
    )
}

export default ProfileOrdersPage