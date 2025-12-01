import OrdersTable from "@/components/profile/orders/OrdersTable"
import Heading from "@/components/ui/Heading"

const ProfileOrdersPage = () => {
    return (
        <>
        <Heading
            title="Order History"
        />
        <OrdersTable />
        </>
    )
}

export default ProfileOrdersPage