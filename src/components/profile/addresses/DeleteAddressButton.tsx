"use client"

import { Button } from "@/components/ui/Button"
import { deleteAddressAction } from "@/server/actions/profile"
import toast from "react-hot-toast"

interface Props {
    addressId: string
}

const DeleteAddressButton = ({ addressId }: Props) => {

    const deleteAddress = () => {
        deleteAddressAction(addressId)
            .then(({ message, status }) => {
                if (message && status === 200) {
                    toast.success(message)
                } else {
                    toast.error(message)
                }
            })
            .catch(() => {
                toast.error("An unexpected error occurred")
            })
    }

    return (
        <Button
            variant={"destructiveOutline"}
            onClick={deleteAddress}
        >
            Delete
        </Button>
    )
}

export default DeleteAddressButton