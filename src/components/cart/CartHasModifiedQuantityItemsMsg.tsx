import { CiWarning } from "react-icons/ci"

const CartHasModifiedQuantityItemsMsg = () => {
    return (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-warning/10 text-warning rounded-md mb-2">
            <CiWarning size={20} />
            <strong>We've updated your cart</strong>
            <p>Some item quantities were adjusted due to low stock levels.</p>
        </div>
    )
}

export default CartHasModifiedQuantityItemsMsg