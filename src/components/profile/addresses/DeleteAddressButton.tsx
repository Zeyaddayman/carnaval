"use client"

import { Button } from "@/components/ui/Button"
import { deleteAddressAction } from "@/server/actions/profile"
import { useState } from "react"
import toast from "react-hot-toast"

interface Props {
    addressId: string
}

const DeleteAddressButton = ({ addressId }: Props) => {

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteAddress = () => {
        setIsDeleting(true)

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
            .finally(() => setIsDeleting(false))
    }

    return (
        <Button
            variant={"destructiveOutline"}
            onClick={deleteAddress}
            disabled={isDeleting}
            className="max-w-[77px]"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </Button>
    )
}

export default DeleteAddressButton