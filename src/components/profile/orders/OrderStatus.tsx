import { Order } from "@/generated/prisma"
import { Translation } from "@/types/translation"

const OrderStatus = ({
    status,
    translation
}: {
    status: Order["status"],
    translation: Translation["orderStatus"]
}) => {

    const getStatusDisplay = () => {
        switch (status) {
            case "CANCELLED": return { style: "bg-destructive text-destructive-foreground", text: translation.cancelled }
            case "PENDING": return { style: "bg-warning text-warning-foreground", text: translation.pending }
            case "COMPLETED": return { style: "bg-success text-success-foreground", text: translation.completed }
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