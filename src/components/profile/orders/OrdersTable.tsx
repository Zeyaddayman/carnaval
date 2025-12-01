import { Order } from "@/generated/prisma"
import { getUserOrders } from "@/server/db/orders"
import Link from "next/link"
import { FaEye } from "react-icons/fa"

const OrdersTable = async ({ filter }: { filter: string }) => {

    const orders = await getUserOrders(filter)

    return (
        <div className="relative overflow-x-auto bg-card border border-border rounded-md">
            <table className="w-full text-center">
                <thead className="bg-white text-muted-foreground">
                    <tr>
                        <th scope="col" className="py-3 px-4 font-medium">ID</th>
                        <th scope="col" className="py-3 px-4 font-medium">Date</th>
                        <th scope="col" className="py-3 px-4 font-medium">Items</th>
                        <th scope="col" className="py-3 px-4 font-medium">Status</th>
                        <th scope="col" className="py-3 px-4 font-medium">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="even:bg-white odd:bg-transparent">
                            <td className="py-2 px-4">#{order.count}</td>
                            <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4">{order.itemsCount}</td>
                            <td className="py-2 px-4"><OrderStatus status={order.status} /></td>
                            <td className="py-2 px-4">
                                <Link
                                    href={`/profile/orders/${order.id}`}
                                    className="flex gap-2 items-center py-1.5 px-3 w-fit h-fit mx-auto font-semibold text-sm rounded-full bg-secondary text-secondary-foreground"
                                >
                                    <FaEye /> View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const OrderStatus = ({ status }: { status: Order["status"] }) => {

    const getStatusDisplay = () => {
        switch (status) {
            case "CANCELLED": return { style: "bg-destructive text-destructive-foreground", text: "Cancelled" }
            case "PENDING": return { style: "bg-warning text-warning-foreground", text: "Pending" }
            case "COMPLETED": return { style: "bg-success text-success-foreground", text: "Completed" }
        }
    }

    const { text, style } = getStatusDisplay()

    return (
        <div className={`py-1.5 px-3 w-fit h-fit mx-auto font-semibold text-sm rounded-full ${style}`}>
            {text}
        </div>
    )

}

export default OrdersTable