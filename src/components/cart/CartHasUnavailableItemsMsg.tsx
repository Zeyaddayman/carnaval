import { CiWarning } from "react-icons/ci"

const CartHasUnavailableItemsMsg = () => {
    return (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-warning/10 text-warning rounded-md mb-2">
            <CiWarning size={20} />
            <strong>Unavailable items</strong>
            <p>Some items are out of stock and must be resolved before checkout.</p>
        </div>
    )
}

export default CartHasUnavailableItemsMsg