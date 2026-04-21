import { Translation } from "@/types/translation"

interface Props {
    itemsCount: number
    shipping: number
    formattedShipping: string
    formattedSubtotal: string
    formattedTotal: string
    translation: Translation["checkout"]["summary"]
}

const CheckoutOrderSummary = ({ itemsCount, formattedSubtotal, shipping, formattedShipping, formattedTotal, translation }: Props) => {
    return (
        <div className="rounded-md border border-border bg-card p-3 shadow-sm">
            <h4 className="font-semibold text-xl py-3">{translation.title}</h4>
            <div className="space-y-2 py-3 border-y border-border">
                <p className="flex justify-between items-center flex-wrap gap-2">{translation.items} <span>{itemsCount}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">{translation.subtotal} <span>{formattedSubtotal}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">{translation.shipping} 
                    <span className={`${shipping <= 0 ? "text-success" : ""}`}>{shipping <= 0 ? translation.freeText : `${formattedShipping}`}</span>
                </p>
            </div>
            <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3">{translation.total} <span>{formattedTotal}</span></p>
        </div>
    )
}

export default CheckoutOrderSummary