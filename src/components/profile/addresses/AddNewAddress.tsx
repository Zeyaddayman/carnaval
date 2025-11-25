import { Button } from "@/components/ui/Button"
import { FaPlus } from "react-icons/fa"

const AddNewAddress = () => {
    return (
        <Button
            variant={"primary"}
            size={"lg"}
            className="mt-10"
        >
            <FaPlus /> Add New Address
        </Button>
    )
}

export default AddNewAddress