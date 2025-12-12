"use client"

import { Button } from "@/components/ui/Button"
import { setAddressAsDefaultAction } from "@/server/actions/address"
import { useTransition } from "react"
import toast from "react-hot-toast"

interface Props {
    addressId: string
}

const SetAsDefaultButton = ({ addressId }: Props) => {

    const [isSettingAsDefault, startSettingAsDefault] = useTransition()

    const setAsDefault = () => {
        startSettingAsDefault(async () => {
            try {
                const { status, message } = await setAddressAsDefaultAction(addressId)

                if (status === 200) toast.success(message)

                else toast.error(message)
            }
            catch {
                toast.error("Failed to set as default")
            }
        })
    }

    return (
        <Button
            variant={"primary"}
            onClick={setAsDefault}
            disabled={isSettingAsDefault}
            className="min-w-[125px]"
        >
            {isSettingAsDefault ? "Setting..." : "Set as Default"}
        </Button>
    )
}

export default SetAsDefaultButton