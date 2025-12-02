import { Order } from "@/generated/prisma"

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
        <div className={`py-1.5 px-3 w-fit h-fit font-semibold text-sm rounded-full ${style}`}>
            {text}
        </div>
    )
}

export default OrderStatus