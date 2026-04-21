"use client"

import { Button } from "@/components/ui/Button"
import { deleteAddressAction } from "@/server/actions/address"
import { Translation } from "@/types/translation"
import { useTransition } from "react"
import toast from "react-hot-toast"

interface Props {
    addressId: string
    translation: Translation["profile"]["addresses"]["addressCard"]
}

const DeleteAddressButton = ({ addressId, translation }: Props) => {

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
            className="max-w-20"
        >
            {isDeleting ? translation.deleting : translation.delete}
        </Button>
    )
}

export default DeleteAddressButton