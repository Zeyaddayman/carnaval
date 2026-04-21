"use client"

import { Button } from "@/components/ui/Button"
import { setAddressAsDefaultAction } from "@/server/actions/address"
import { Translation } from "@/types/translation"
import { useTransition } from "react"
import toast from "react-hot-toast"

interface Props {
    addressId: string
    translation: Translation["profile"]["addresses"]["addressCard"]
}

const SetAsDefaultButton = ({ addressId, translation }: Props) => {

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
            className="min-w-31.25"
        >
            {isSettingAsDefault ? translation.setting : translation.setAsDefault}
        </Button>
    )
}

export default SetAsDefaultButton