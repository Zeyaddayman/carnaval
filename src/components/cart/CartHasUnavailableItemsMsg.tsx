import { Translation } from "@/types/translation"
import { CiWarning } from "react-icons/ci"

interface Props {
    translation: Translation["cart"]["warnings"]["unAvailableItems"]
}

const CartHasUnavailableItemsMsg = ({ translation }: Props) => {
    return (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-warning/10 text-warning rounded-md mb-2">
            <CiWarning size={20} />
            <strong>{translation.title}</strong>
            <p>{translation.description}</p>
        </div>
    )
}

export default CartHasUnavailableItemsMsg