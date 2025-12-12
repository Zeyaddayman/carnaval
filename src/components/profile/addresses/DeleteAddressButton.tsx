"use client"

import { Button } from "@/components/ui/Button"
import { deleteAddressAction } from "@/server/actions/address"
import { useTransition } from "react"
import toast from "react-hot-toast"

interface Props {
    addressId: string
}

const DeleteAddressButton = ({ addressId }: Props) => {

    const [isDeleting, startDeleting] = useTransition()

    const deleteAddress = () => {
        startDeleting(async () => {
            try {
                const { status, message } = await deleteAddressAction(addressId)

                if (status === 200) toast.success(message)

                else toast.error(message)
            }
            catch {
                toast.error("Failed to delete the address")
            }
        })
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