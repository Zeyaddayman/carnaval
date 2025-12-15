import Link from "next/link"
import { FaEye } from "react-icons/fa"
import OrderStatus from "./OrderStatus"
import { formatDate } from "@/utils/formatters"
import { TableOrder } from "@/types/order"

const OrdersTable = ({ orders }: { orders: TableOrder[] }) => {
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
                            <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                            <td className="py-2 px-4">{order.itemsCount}</td>
                            <td className="py-2 px-4">
                                <div className="flex justify-center items-center">
                                    <OrderStatus status={order.status} />
                                </div>
                            </td>
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

export default OrdersTable