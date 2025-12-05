"use client"

import { Button } from "@/components/ui/Button"
import { setAddressAsDefaultAction } from "@/server/actions/address"
import { useState } from "react"
import toast from "react-hot-toast"

interface Props {
    addressId: string
}

const SetAsDefaultButton = ({ addressId }: Props) => {

    const [isSettingDefault, setIsSettingDefault] = useState(false)

    const setDefault = () => {
        setIsSettingDefault(true)

        setAddressAsDefaultAction(addressId)
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
            .finally(() => setIsSettingDefault(false))
    }

    return (
        <Button
            variant={"primary"}
            onClick={setDefault}
            disabled={isSettingDefault}
            className="min-w-[125px]"
        >
            {isSettingDefault ? "Setting..." : "Set as Default"}
        </Button>
    )
}

export default SetAsDefaultButton